(ns ylserver.controller.system
  (:require [ylserver.models.db :as db]
            [noir.response :as resp]
            [ring.util.response :refer [response]]
            [noir.session :as session]
            [clojure.data.json :as json]))

;;session处理
(defn set-user! [user {session :session}]
  ;  (:body
  (->  {:success true :user (json/write-str user)}
    response
    (assoc :session (assoc session :user user))))
(defn session [req]
  (resp/json (:user(:session req))))


;;用户列表
(defn getusers [page rows keyword dvcode]
  (let [p (if (nil? page) page (Integer/parseInt page))
        r (if (nil? rows) rows (Integer/parseInt rows))
        results (db/getusers keyword dvcode)
        c (count results)]
    (if (nil? p)
      (resp/json results)
      (if (<= (* p r) c)
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) (* p r))}))
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) c)}))))))
;;新增用户
(defn adduser [roleid dvcode username useraccount pwd usercardnum usertelnum useraddress req]
  (resp/json (db/adduser {:roleid roleid :dvcode dvcode :username username :useraccount useraccount :pwd pwd :usercardnum usercardnum
                          :usertelnum usertelnum :useraddress useraddress} (:userid (:user (:session req))))))
;;修改用户
(defn updateuser [roleid dvcode username useraccount pwd usercardnum usertelnum useraddress userid req]
  (resp/json (db/updateuser {:roleid roleid :dvcode dvcode :username username :useraccount useraccount :pwd pwd :usercardnum usercardnum
                          :usertelnum usertelnum :useraddress useraddress :userid userid} (:userid (:user (:session req))))))
;;用户登录
(defn loginuser [loginname pwd req]
  (let [user (first (db/loginuser loginname pwd))]
    (if (> (count user) 0 )
      (do
        (prn "PC登录")
        (db/addlog (:userid user) "用户登录系统")
        (set-user! (conj user {:success true}) req)
        )
      (->  {:success false} response))))



;查询角色信息
(defn getroles [keyword page rows]
  (if (nil? page)
    (resp/json (db/getroles nil))
    (let [p (Integer/parseInt page)
          r (Integer/parseInt rows)
          c (count (db/getroles keyword))
          results (db/getroles keyword)]
      ;;分页
      (if (<= (* p r) c)
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) (* p r))}))
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) c)}))))))

;;角色信息枚举
(defn roles []
  (resp/json (db/getroles nil)))
;;新增角色信息
(defn addrole [rolename req]
  (let [nums  (:counts (db/getroles rolename))]
    (if nums (resp/json {:success false :msg "角色名已存在"})
      (resp/json (db/addrole {:rolename rolename} (:userid (:user (:session req))))))))
;;修改角色信息
(defn updaterole [rolename roleid req]
  (let [nums  (:counts (db/getroles rolename))]
    (if nums (resp/json {:success false :msg "角色名已存在"})
      (resp/json (db/updaterole {:rolename rolename :roleid roleid} (:userid (:user (:session req))))))))
;;删除角色信息
(defn delrole [roleid req]
  (resp/json (db/deleterole roleid (:userid (:user (:session req))))))
;;树转换
(defn dvtreeformat [item]
  (let [childnums (count (db/getdivisions nil (:dvcode item)))
        state (if (> childnums 0) "closed" "open")
        formatitem (assoc item "state" state "text" (:dvname item))]
    formatitem))
;;功能树转换
(defn functreeformat [item funcids]
  (let [childnums (count (db/getfuncsbypid (:funcid item)))
        state (if (> childnums 0) "closed" "open")
        formatitem (assoc item "state" state "textold" (:text item) "checked" (some #(= (:funcid item) %) funcids))]
    (if (> childnums 0) (conj  formatitem {:text (str (:text formatitem) "(" childnums ")")}) formatitem)))
;;查询功能树
(defn gettreefunc [node roleid req]
  (let [ results (db/getfuncsbypid node)
         roleid   (if (nil? roleid)(:roleid (:user (:session req))) roleid)
         ;         (getroleid roleid)
         funcids (into [](map #(:funcid %) (db/getfuncsbyid roleid)))
         resultsformat (map #(functreeformat % funcids) results)]
    (resp/json resultsformat)))
;;新增功能信息
(defn addfunc [funcname label funcid sortnum req]
  (if (> (count (db/getfuncsbytype funcname)) 0)
    (resp/json {:success false :msg "功能名已存在"})
    (resp/json (db/addfunc {:funcname funcname :label label :funcparentid funcid :sortnum sortnum } (:userid (:user (:session req)))))))
;;修改功能信息
(defn updatefunc [funcname label funcid pid sortnum req]
  ;  (let [existfunc (db/getfuncsbytype funcname )]
  ;    (if(and (> (count existfunc) 0) (not= (:id (first existfunc)) (read-string funcid)))
  ;      (resp/json {:success false :msg "功能名已存在"})
  (resp/json (db/updatefunc {:funcname funcname :label label :funcparentid pid
                             :sortnum sortnum :funcid funcid} (:userid (:user (:session req))))))
;;删除功能信息
(defn delfunc [funcid req]
  (resp/json  (db/deletefunc funcid (:userid (:user (:session req))))))



;;修改功能配置
(defn makerolefunc [deleteid funcid roleid req]
  (let[ delids (read-string deleteid)
        funcids (read-string funcid)
        ;        roleid (getroleid roleid)
        ]
    (dorun (map #(db/deleterolefunc % roleid (:userid (:user (:session req)))) delids))
    (dorun (map #(when (= (count (db/isrolehasfunc roleid %)) 0 ) (db/addrolefunc % roleid (:userid (:user (:session req))))) funcids))
    (resp/json {:success true})))

;;查询操作日志
(defn getlogs [keyword bgtime edtime page rows]
  (let [ p (Integer/parseInt page)
         r (Integer/parseInt rows)
         bgtime (if (or (nil? bgtime) (= "" (clojure.string/trim bgtime))) "1970-01-01 00:00:00" bgtime)
         edtime (if (or (nil? edtime) (= "" (clojure.string/trim edtime))) "3000-01-01 00:00:00" edtime)
         c (count (db/getlogs keyword bgtime edtime))
         results (db/getlogs keyword bgtime edtime )
         ]
    ;;分页
    ;    (resp/json results)))
    (if (<= (* p r) c)
      (:body (resp/json {:total c :rows (subvec results (* (dec p) r) (* p r))}))
      (:body (resp/json {:total c :rows (subvec results (* (dec p) r) c)})))))


;;新增服务类型
(defn addtype [tname tid depth dvcode req]
  (let [num (+ (count (db/gettypes tid nil dvcode)) 1)
        wtid (if (< num 10) (str tid "0" num) (str tid num))]
;    (resp/json (db/gettypes tid depth dvcode)) ) )
    (resp/json (db/addtype tname tid wtid (+ 1 (Integer/parseInt depth)) dvcode (:userid (:user (:session req)))))))

;;修改服务类型
(defn updatetype [tname tid req]
;  (let [num (+ (count (db/gettypes parentid depth dvcode)) 1)
;        tid (if (< num 10) (str parentid "0" num) (str parentid num))]
    (resp/json (db/updatetype tname tid (:userid (:user (:session req))))))

;;查看是否为父节点
(defn isparent [type]
  (let [count (count (db/gettypes (:tid type) (+ 1 (:depth type)) nil))
        state (if (> count 0) "closed" "open")
        formatitem (assoc type "state" state "text" (:tname type))]
    formatitem))
;    (if (> count 0)
;      (conj type {:isparent true})
;      (conj type {:isparent false}))))
;;查询服务类型
(defn gettypes [parentid depth dvcode]
  (resp/json (map #(isparent %)(db/gettypes parentid depth dvcode))))
;;查看服务类型
(defn gettype [id]
  (resp/json (first (db/gettype id))))

;;分级地区树
(defn getdivisions [dvrank dvhigh]
  (let [dv (db/getdivisions dvrank dvhigh)]
    (resp/json (map #(dvtreeformat %) dv))))
;;获取区划信息
(defn getdivision [dvcode]
  (resp/json (db/getdivision dvcode)))
;;用户地区树
(defn getdivisionsbyuser [req dvcode]
  (let [dvhigh (if (== 1 (:roleid (:user (:session req)))) "000000"  (:dvcode (:user (:session req))))
        dv (if (nil? dvcode)(db/getdivisions nil dvhigh) (db/getdivisions nil dvcode))]
    (resp/json (map #(dvtreeformat %) dv))))
;;新增区划信息
(defn adddivision [dvcode dvrank dvflag dvname totalname dvhigh dvocode req]
  (if (> (count (db/getdivisions (- (Integer/parseInt dvrank) 1) dvocode)) 0)
    (resp/json {:success false :msg "功能名已存在"})
    (resp/json (db/adddivision {:dvcode dvcode :dvrank dvrank :dvflag dvflag :dvname dvname :totalname totalname :dvhigh dvocode}
                 (:userid (:user (:session req)))))))
;;修改区划信息
(defn updatedivision [dvflag dvname totalname dvocode req]
  ;  (let [existfunc (db/getfuncsbytype funcname )]
  ;    (if(and (> (count existfunc) 0) (not= (:id (first existfunc)) (read-string funcid)))
  ;      (resp/json {:success false :msg "功能名已存在"})
  (resp/json (db/updatedivision {:dvflag dvflag :dvname dvname :totalname totalname}
               dvocode (:userid (:user (:session req))))))
;;;删除区划信息
;(defn deldivision [dvcode req]
;  (resp/json  (db/deletedivision dvcode (:userid (:user (:session req))))))

;;查看枚举类型
(defn figuretype []
  (resp/json (db/figuretype)))
;;查询枚举信息
(defn getfigures [cident]
  (resp/json (db/getfigures cident)))
;;查看枚举信息
(defn getfigure [cident cvalue]
  (resp/json (first (db/getfigure cident cvalue))))
;;新增枚举类型
(defn addfiguretype [cident req]
  (resp/json (db/addfiguretype cident (:userid (:user (:session req))))))
;;新增枚举信息
(defn addfigure [cident cname cvalue csort state req]
  (resp/json (db/addfigure cname cvalue cident csort state (:userid (:user (:session req))))))
;;修改枚举信息
(defn updatefigure [cident cname cvalue csort state cid req]
  (resp/json (db/updatefigure cname cvalue cident csort state cid (:userid (:user (:session req))))))
;;删除枚举信息
(defn delfigure [cid req]
  (resp/json (db/delfigure cid (:userid (:user (:session req))))))
;;工单统计
(defn countwork [req]
  (let [dvcode (:dvcode (:user (:session req)))]
    (resp/json db/countwork)))
;;客户统计
(defn countold [req]
  (let [dvcode (:dvcode (:user (:session req)))]
    (resp/json db/countold)))
;;服务商统计
(defn countorg [req]
  (let [dvcode (:dvcode (:user (:session req)))]
    (resp/json db/countorg)))

