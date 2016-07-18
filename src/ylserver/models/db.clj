(ns ylserver.models.db
  (:use korma.core
        [korma.db :only [defdb with-db transaction]])
  (:import (java.sql Date)
           (java.sql Timestamp ))
  (:require [ylserver.models.schema :as schema]
            ))

;;数据库
(defdb dboracle1 schema/db-oracle1)
(defdb dboracle schema/db-oracle)
;(defdb dboracle1 schema/db-oracle1)
(declare olds  works orgs items types users roles rolefunc funcs divisions figures contacts combos combodts)

;;老年人基本信息表
(defentity olds
  (pk :oldid)
  (table :oldinfo)
  (database dboracle))

;;工单信息表
(defentity works
  (pk :wid)
  (table :workinfo)
;  (has-many statuss {:fk :sid})
  (belongs-to olds {:fk :oldid})
  (belongs-to users {:fk :userid})
  (belongs-to divisions {:fk :adds})
  (belongs-to items {:fk :iid})

  (database dboracle))

;;服务机构信息表
(defentity orgs
  (pk :orgid)
  (table :orginfo)
  (database dboracle))

;;余额信息表
(defentity moneys
  (pk :mid)
  (table :moneyinfo)
  (belongs-to olds {:fk :oldid})
  (belongs-to works {:fk :wid})
  (database dboracle))
;;紧急联系人信息表
(defentity contacts
  (pk :ciid)
  (table :contactsinfo)
  (belongs-to olds {:fk :oldid})
  (database dboracle))

;;文件信息表
(defentity files
  (pk :fileid)
  (table :fileinfo)
  (belongs-to orgs {:fk :orgid})
  (database dboracle))
;;服务项目信息表
(defentity items
  (pk :iid)
  (table :iteminfo)
  (belongs-to orgs {:fk :orgid})
  (belongs-to types {:fk :tid})
  (database dboracle))
;;服务类型信息表
(defentity types
  (pk :tid)
  (table :typeinfo)
  (database dboracle))
;;;服务推送信息表
;(defentity msgs
;  (table :msginfo)
;  (database dboracle))
;;系统用户信息表
(defentity users
  (pk :userid)
  (belongs-to roles {:fk :roleid})
  (belongs-to divisions {:fk :dvcode})
  (table :userinfo)
  (database dboracle))
;;系统角色信息表
(defentity roles
  (pk :roleid)
;  (has-many rolefunc {:fk :roleid})
  (table :roleinfo)
  (database dboracle))
;;系统功能权限表
(defentity rolefunc
;  (pk :funcid)
;  (has-one funcs {:fk :id})
  (table :rolefunc)
  (belongs-to funcs {:fk :funcid})
  (database dboracle))
;;系统功能信息表
(defentity funcs
  (pk :funcid)
  (table :funcinfo)
  (database dboracle))
;;操作日志表
(defentity logs
  (pk :logid)
  (belongs-to users {:fk :userid})
  (table :loginfo)
  (database dboracle))
;;行政区划信息表
(defentity divisions
  (pk :dvcode)
  (table :division)
  (database dboracle))
;;枚举配置表
(defentity figures
  (pk :cid)
  (table :configure)
  (database dboracle))
(defentity combos
  (pk :aaa100)
  (table :xt_combo)
  (database dboracle))
(defentity combodts
  (table :xt_combodt)
  (belongs-to combos {:fk :aaa100})
  (database dboracle))



;;查询所有老年人信息
(defn getolds [keyword]
  (select olds
    (where {:oldname [like (str "%" (if (nil? keyword)"" keyword) "%")]})
    (order :oldid :desc)))
;;查看您老年人信息
(defn getoldbytel [tel]
  (select olds
    (where {:oldtelnum [like (str "%" (if (nil? tel)"" tel) "%")]})))
;;查看紧急联系人信息
(defn getcontacts [oldid]
  (select contacts
    (where {:oldid oldid})))
;;修改老年人余额
(defn updatemoney [oldid price]
;  (first)
  (exec-raw ["update oldinfo t set t.surplusmoney = t.surplusmoney + -215 where t.oldid=80" []]))

;;查看余额记录
(defn getmoneys [keyword]
  (select moneys
    (with olds
      (fields :oldname :surplusmoney)
      (where {:oldname [like (str "%" (if (nil? keyword)"" keyword) "%")]}))
    (order :mtime :desc)))
;;新增余额记录
(defn addmoney [wid oldid price mtype]
  (transaction
    (insert moneys
      (values {:wid wid :oldid oldid :money price :mtype mtype}))
    (insert logs
      (values {:logcontent "新增了一条余额信息"}))
    "true"))
;;发放补贴
(defn pushmoney []
    (exec-raw ["update oldinfo t set t.surplusmoney =t.surplusmoney + t.subsidymoney" []]))




;;新增服务商信息
(defn addorg [org userid]
  (transaction
    (insert orgs
      (values org))
;    (let [content (if (= (:orgtype org) 1) "注册了一条志愿者信息" "新增了一条商家信息")]
      (insert logs
        (values {:userid userid :logcontent "新增了一条商家信息"}))
    "true"))
;;修改服务商信息
(defn updateorg [org userid]
  (transaction
    (update orgs
      (set-fields org)
      (where {:orgid (:orgid org)}))
;    (let [content (if (= (:orgtype org) 1) "修改一条志愿者信息" "修改一条机构信息")]
      (insert logs
        (values {:userid userid :logcontent "新增了一条商家信息"}))
     "true"))
;;废除服务商信息
(defn delorg [orgid userid]
  (transaction
    (update orgs
      (set-fields {:isdel 1})
      (where {:orgid orgid}))
    (insert logs
      (values {:userid userid :logcontent "废除了一条服务商信息"}))
    "true"))
;;查询服务商信息
(defn getorgs [keyword]
  (select orgs
    (where {:orgname [like (str "%" (if (nil? keyword)"" keyword) "%")] :isdel 0})))
;;查看服务商信息
(defn getorg [orgid]
  (first
    (select orgs
      (where {:orgid orgid}))))

;;新增文件信息
(defn addfile [file userid]
  (transaction
    (insert files
      (values file))
    (insert logs
      (values {:userid userid :logcontent "新增了一条文件信息"}))
    "true"))
;;查看文件信息
(defn getfiles [orgid]
  (select files
    (where {:orgid orgid :isdel 0})))
;;删除文件信息
(defn delfile [fileid userid]
  (transaction
    (update files
      (set-fields {:isdel 1})
      (where {:fileid fileid}))
    (insert logs
      (values {:userid userid :logcontent "废除了一条文件信息"}))
    "true"))


;;新增服务项信息
(defn additem [item userid]
  (transaction
    (insert items
      (values item))
    (insert logs
      (values {:userid userid :logcontent "新增了一条服务项信息"}))
    "true"))
;;编辑服务项信息
(defn updateitem [item userid]
  (transaction
    (update items
      (set-fields item)
      (where {:iid (:iid item)}))
    (insert logs
      (values {:userid userid :logcontent "修改了一条服务项信息"}))
    "true"))
;;废除服务项信息
(defn delitem [iid userid]
  (transaction
    (update items
      (set-fields {:isdel 1})
      (where {:iid iid}))
    (insert logs
      (values {:userid userid :logcontent "废除了一条服务项信息"}))
    "true"))
;;根据服务机构查询服务项信息
(defn itemsbyorg [orgid]
  (select items
    (where {:orgid orgid :isdel 0})
    (with types
      (fields :tname :parentid))))
;;根据服务类别查询服务信息
(defn itemsbytype [tid]
  (select items
    (where {:tid [like (str "%" (if (nil? tid)"" tid) "%")] :isdel 0})
    (with orgs
      (fields :orgname))))

;;新增工单信息
(defn addwork [work userid]
;  (if (:success
  (transaction
    (insert works
      (values work))
    (insert logs
      (values {:userid userid :logcontent "新增了一条工单信息"}))
    "true"))
;派发工单
(defn pwork [wptid wtid orgid iid wid orgname id]
  (transaction
    (update works
      (set-fields {:wptid wptid :wtid wtid :orgid orgid :orgname orgname :iid iid :status 1})
      (where {:wid wid}))
    (insert logs
      (values {:userid id :logcontent "派发了一条工单信息"}))
    "true"))
;;查询工单信息
(defn getworks [status tid oldname wid oldtelnum begintime endtime orgname]
  (select works
    (with divisions
      (fields :dvname))
    (where (and {:status [like (str "%" (if (nil? status)"" status) "%")]  :wtime [>= begintime]
            :oldname [like (str "%" (if (nil? oldname)"" oldname) "%")] :oldtelnum [like (str "%" (if (nil? oldtelnum)"" oldtelnum) "%")]
            :wid [like (str "%" (if (nil? wid)"" wid) "%")]
            }
             {:wtime [<= endtime]}))
    (order :wtime :desc)))
;;查看工单信息
(defn getwork [wid]
  (first
    (select works
      (where {:wid wid})
      (with olds
        (fields :oldname))
      (with items
        (with orgs
          (fields :orgname))
        (with types
          (fields :tname))))))
;;新增回访记录
(defn vwork [asstime price visitcontent evaluate wid oldid visittime orgid userid]
  (let [money (- (:surplusmoney (first (select olds
                                         (where {:oldid oldid})))) price)]
;    (prn money)
    (transaction
      (update works
        (set-fields {:asstime asstime :price price :visitcontent visitcontent :evaluate evaluate :visittime visittime
                     :status 2})
        (where {:wid wid}))
      (update olds
        (set-fields {:surplusmoney money})
        (where {:oldid oldid}))
      (insert moneys
        (values {:wid wid :oldid oldid :money (- 0 price) :mtype "01"}))
      (insert logs
        (values {:logcontent "新增一条余额信息"}))
      (insert logs
        (values {:userid userid :logcontent "增加回访信息"}))
      (let [evaluate (:evaluate (first (select works
                                         (aggregate (avg :evaluate) :evaluate)
                                         (where {:orgid orgid}))))]
;        (prn evaluate)
        (update orgs
          (set-fields {:evaluate evaluate})
          (where {:orgid orgid})))
      "true")))

;;还原派单
(defn restorep [wid id]
  (transaction
    (update works
      (set-fields {:wptid nil :wtid nil :orgid nil :orgname nil :iid nil :status 0})
      (where {:wid wid}))
    (insert logs
      (values {:userid id :logcontent "还原派单信息"}))
    "true"))
;;还原回访
;(defn restorev [wid id]
;  (transaction
;    (update works
;      (set-fields {:asstime nil :price nil :visitcontent nil :evaluate nil :visittime nil :status 1})
;      (where {:wid wid}))
;    (update olds
;      (set-fields {:surplusmoney (- :surplusmoney (:money (first (select moneys
;                                      (where {:wid wid})))))}))
;    (delete moneys
;      (where {:wid wid}))
;    (insert logs
;      (values {:logcontent "删除一条余额信息"}))
;    (insert logs
;      (values {:userid id :logcontent "还原回访信息"}))
;    "true"))
;;废除工单
(defn delwork [wid id]
  (transaction
    (update works
      (set-fields {:status 4})
      (where {:wid wid}))
    (insert logs
      (values {:userid id :logcontent "废除一条工单信息"}))
    "true"))


;;根据服务机构查询工单信息
(defn worksbyorg [orgid]
  (select works
    (with olds
      (fields :oldname))
;    (with persons)
    (with items
      (where {:orgid orgid}))))
;;根据服务人员查询工单信息
;(defn worksbyperson [pid]
;  (select works
;    (with olds)
;    (with persons)
;    (where {:pid pid})))
;;根据老年人查询工单信息
(defn worksbyold [oldid]
  (select works
    (where {:oldid oldid})))
;;;查询工单状态信息
;(defn getstatuss [wid]
;  (select statuss
;    (where {:wid wid})))


;;新增用户信息
(defn adduser [user id]
  (transaction
    (insert users
      (values user))
    (insert logs
      (values {:userid id :logcontent "新增一条用户信息"}))
    "true"))
;;查询用户信息
(defn getusers [keyword dvcode]
  (select users
    (with roles
      (fields :rolename ))
    (with divisions
      (fields :dvname))
    (where {:username [like (str "%" (if (nil? keyword)"" keyword) "%")]
            :dvcode [like (str "%" (if (nil? dvcode)"" dvcode) "%")]})))
;;用户信息登录
(defn loginuser [name pwd]
  (select users
    (fields :userid :username :dvcode :roleid :useraccount)
    (where {:useraccount name :pwd pwd})))
;;修改用户信息
(defn updateuser [user id]
  (transaction
    (update users
      (set-fields user))
    (insert logs
      (values {:userid id :logcontent "修改一条用户信息"}))
    "true"))
;;删除用户信息
(defn deleteuser [userid id]
  (transaction
    (delete users
      (where {:userid userid}))
    (insert logs
      (values {:userid id :logcontent "删除一条用户信息"}))
    "true"))


;;查询所有服务类型信息
(defn gettypes [parentid depth dvcode]
  (if (nil? depth)
    (select types
      (where {:parentid parentid :isdel 0
              :dvcode [like (str "%" (if (nil? dvcode)"" dvcode) "%")]}))
    (select types
      (where {:parentid parentid :depth depth :isdel 0
              :dvcode [like (str "%" (if (nil? dvcode)"" dvcode) "%")]}))))
;;查看服务类型
(defn gettype [id]
  (select types
    (where {:tid id })))

;;新增服务类型信息
(defn addtype [tname parentid tid depth dvcode userid]
  (transaction
    (insert types
      (values {:tname tname :parentid parentid :tid tid :depth depth :dvcode dvcode}))
    (insert logs
      (values {:userid userid :logcontent "新增一条服务类型信息"}))
    "true"))
;;修改服务类型信息
(defn updatetype [tname tid userid]
  (transaction
    (insert types
      (values {:tname tname})
      (where {:tid tid}))
    (insert logs
      (values {:userid userid :logcontent "新增一条服务类型信息"}))
    "true"))



;;查询角色信息
(defn getroles [keyword]
  (select roles
    (where {:rolename [like (str "%" (if (nil? keyword)"" keyword) "%")]})))
;;新增角色信息
(defn addrole [role id]
  (transaction
    (insert roles
      (values role))
    (insert logs
      (values {:userid id :logcontent "新增一条角色信息" }))
    "true"))
;;删除角色信息
(defn deleterole [roleid id]
  (transaction
    (delete rolefunc
      (where {:roleid roleid}))
    (delete roles
      (where {:roleid roleid}))
    (insert logs
      (values {:userid id :logcontent "删除一条角色信息"}))
    "true"))
;;修改角色信息
(defn updaterole [role id]
  (transaction
    (update roles
      (set-fields role)
      (where {:roleid (:roleid role)}))
    (insert logs
      (values {:userid id :logcontent "修改一条角色信息"}))
    "true"))
;;;查询功能信息
;(defn getfuncs [pid]
;  (select funcs
;    (where {:funcparentid pid})))
;;根据父节点查询功能信息
(defn getfuncsbypid [pid]
  (select funcs
    (fields :funcid [:funcname :text] :funcparentid [:label :value] :sortnum)
    (where {:funcparentid pid})
    (order :sortnum)))
;;根据功能名查询功能信息
(defn getfuncsbytype [type]
  (select funcs
    (fields :funcid)
    (where {:funcname type})))
;;新增功能信息
(defn addfunc [func id]
  (transaction
    (insert funcs
      (values func))
    (insert logs
      (values {:userid id :logcontent "新增一条功能信息"}))
    "true"))
;;删除功能信息
(defn deletefunc [funcid id]
  (transaction
    (delete funcs
      (where {:funcid funcid}))
    (insert logs
      (values {:userid id :logcontent "删除一条功能信息"}))
    "true"))
;;修改功能信息
(defn updatefunc [func id]
  (transaction
    (update funcs
      (set-fields func)
      (where {:funcid (:funcid func)}))
    (insert logs
      (values {:userid id :logcontent "修改一条功能信息"}))
    "true"))
;;;查询权限配置
;(defn getrolefunc []
;  (select rolefunc))
;;查询功能权限信息
(defn getfuncsbyid [roleid]
  (select rolefunc
    (with funcs
      (fields :label :funcname ))
    (where {:roleid roleid})))
;;查看某条功能权限信息
(defn isrolehasfunc [roleid funcid]
  (select rolefunc
    (where {:roleid roleid :funcid funcid})))
;;新增权限配置
(defn addrolefunc[funcid roleid id]
  (transaction
    (insert rolefunc
      (values {:funcid funcid :roleid roleid}))
    (insert logs
      (values {:userid id :logcontent "新增一条权限配置信息"}))
    "true"))
;;删除权限配置
(defn deleterolefunc [funcid roleid id]
  (transaction
    (delete rolefunc
      (where {:funcid funcid :roleid roleid}))
    (insert logs
      (values {:userid id :logcontent "删除一条权限配置信息" }))
    "true"))
;;查询操作日志
(defn getlogs [keyword begintime endtime]
  (select logs
    (with users
      (fields :username))
    (where (and {:logcontent [like (str "%" (if (nil? keyword)"" keyword) "%")]}
             {:logtime [>= (Timestamp/valueOf begintime)]}
             {:logtime [<= (Timestamp/valueOf endtime)]}))
    (order :logtime :desc)))
;;新增操作日志
(defn addlog[id content]
  (transaction
    (insert logs
      (values {:userid id :logcontent content }))
    "true"))

;;分级查看地区树
(defn getdivisions [dvrank dvhigh]
  (if (nil? dvrank)
    (select divisions
      (where {:dvhigh dvhigh :isdel 0}))
    (select divisions
      (where {:dvrank dvrank :dvhigh dvhigh}))))
(defn getdivision [dvcode]
  (first
    (select divisions
      (where {:dvcode dvcode}))))
;;新增区划信息
(defn adddivision [dv id]
  (transaction
    (insert divisions
      (values dv))
    (insert logs
      (values {:userid id :logcontent "新增一条区划信息"}))
    "true"))
;;;删除区划信息
;(defn deletefunc [dvcode id]
;  (transaction
;    (delete divisons
;      (where {:funcid funcid}))
;    (insert logs
;      (values {:userid id :logcontent "删除一条功能信息"}))
;    "true"))
;;修改功能信息
(defn updatedivision [dv code id]
  (transaction
    (update divisions
      (set-fields dv)
      (where {:dvcode code}))
    (insert logs
      (values {:userid id :logcontent "修改一条区划信息"}))
    "true"))

;;查看枚举类型
(defn figuretype []
  (exec-raw ["select distinct t.cident from CONFIGURE t" []] :results))
;;查询枚举信息
(defn getfigures [cident]
  (select figures
    (fields [:cname :text] :cid :cvalue :csort :cstate [:cstate :state] :cident)
    (where {:cident cident :isdel 0})
    (order :csort)))
(defn getcombos [type]
  (select combodts
    (fields [:aaa103 :text] [:aaa102 :id])
    (with combos
      (where {:aaa101 type}))))
(defn getcombo [type value]
  (select combodts
    (fields [:aaa103 :text])
    (where {:aaa102 value})
    (with combos
      (where {:aaa101 type}))))
;;查看枚举信息
(defn getfigure [cident cvalue]
  (prn cident "," cvalue)
  (select figures
    (where {:cident cident :cvalue cvalue})
    (order :csort)))
;;新增枚举类型
(defn addfiguretype [cident id]
  (transaction
    (insert figures
      (values {:cident cident :csort 0}))
    (insert logs
      (values {:userid id :logcontent "新增枚举类型"}))
    "true"))
;;新增枚举信息
(defn addfigure [name value ident sort state id]
  (transaction
    (insert figures
      (values {:cident ident :cvalue value :cname name :csort sort :cstate state}))
    (insert logs
      (values {:userid id :logcontent "新增一条枚举信息"}))
    "true"))
;;编辑枚举信息
(defn updatefigure [name value ident sort state cid id]
  (transaction
    (update figures
      (set-fields {:cident ident :cvalue value :cname name :csort sort :cstate state})
      (where {:cid cid}))
    (insert logs
      (values {:userid id :logcontent "修改一条枚举信息"}))
    "true"))
;;删除枚举信息
(defn delfigure [cid id]
  (transaction
    (update figures
      (set-fields {:isdel 1})
      (where {:cid cid}))
    (insert logs
      (values {:userid id :logcontent "删除一条枚举信息"}))
    "true"))



;;同步老年人信息
(defn refresholds []
  (with-db dboracle1
    (exec-raw ["merge into oldinfo@linkcall b
                using oldinfo c on (b.oldid = c.oldid)
                when matched then
                  update set b.dvcode=c.dvcode,b.oldname=c.oldname,b.oldcardnum=c.oldcardnum,b.oldtelnum=c.oldtelnum,
                             b.hometown=c.hometown,b.oldaddress=c.oldaddress,b.lat=.c.lat,b.lon=c.lon,b.range=c.range,
                             b.oldtime=c.oldtime,b.oldsex=c.oldsex,b.oldbirthday=c.oldbirthday,b.education=c.education,
                             b.political=c.political,b.oldtype=c.oldtype,b.oldweight=c.oldweight,b.oldheight=c.oldheight,
                             b.marriage=c.marriage,b.disability=c.disability,b.living=c.living,b.oldremark=c.oldremark,
                             b.nation=c.nation,b.subsidymoney=c.subsidymoney
                when not matched then
                  insert values (c.oldid,c.dvcode,c.oldname,c.oldcardnum,c.oldtelnum,c.hometown,c.oldaddress,c.lat,c.lon,
                                 c.range,c.oldtime,c.oldsex,c.oldbirthday,c.education,c.political,c.oldtype,c.oldweight,
                                 c.oldheight,c.marriage,c.disability,c.living,c.oldremark,c.nation,c.subsidymoney,c.surplusmoney);"
               []] :results)))

;;首页统计
;;统计工单
(defn countwork [dvcode]
  (with-db dboracle
    (exec-raw ["select
       sum(case
             when trunc(sysdate) = trunc(t.wtime) then
              1
             else
              0
           end) as d,
       sum(case
             when t.wtime >= trunc(sysdate, 'MM') and
                  t.wtime < last_day(sysdate) then
              1
             else
              0
           end) as m,
       sum(case
             when t.wtime >= trunc(sysdate, 'YYYY') then
              1
             else
              0
           end) as y,
       count(*) as c
  from workinfo t
    " []] :results)))
;;统计客户
(defn countold [dvcode]
  (with-db dboracle
    (exec-raw ["select
       sum(case
             when trunc(sysdate) = trunc(t.oldtime) then
              1
             else
              0
           end) as d,
       sum(case
             when t.oldtime >= trunc(sysdate, 'MM') and
                  t.oldtime < last_day(sysdate) then
              1
             else
              0
           end) as m,
       sum(case
             when t.oldtime >= trunc(sysdate, 'YYYY') then
              1
             else
              0
           end) as y,
       count(*) as c
  from oldinfo t
    " []] :results)))
;;统计服务商
(defn countorg [dvcode]
  (with-db dboracle
    (exec-raw ["select
       sum(case
             when trunc(sysdate) = trunc(t.orgtime) then
              1
             else
              0
           end) as d,
       sum(case
             when t.orgtime >= trunc(sysdate, 'MM') and
                  t.orgtime < last_day(sysdate) then
              1
             else
              0
           end) as m,
       sum(case
             when t.orgtime >= trunc(sysdate, 'YYYY') then
              1
             else
              0
           end) as y,
       count(*) as c
  from orginfo t
    " []] :results)))


