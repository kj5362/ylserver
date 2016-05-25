(ns ylserver.routes.home
  (:require [ylserver.layout :as layout]
            [compojure.core :refer [defroutes GET POST ANY]]
            [ring.util.response :refer [response]]
            [noir.response :as resp]
            [ring.util.http-response :refer [ok]]
            [clojure.java.io :as io]
            [ylserver.controller.old :as old]
            [ylserver.controller.server :as server]
            [ylserver.controller.system :as system]))

(defn home-page [req]
  (if (= 0 (count (:user (:session req))))
    (layout/render "login.html")
    (let [user (:user (:session req))] (layout/render "home.html" {:username (:username user)}))) )

(defn remove-user! [{session :session}]
  (-> (resp/json "注销成功")
    response
    (assoc :session (dissoc session :user))))
;  (prn session)
;  (home-page session))

(defn about-page []
  (layout/render "about.html"))

(defroutes home-routes
  (GET "/" req (home-page req))
  ;;注销用户
  (ANY "/logout" req (remove-user! req))
  (GET "/about" [] (about-page))
  (GET "/page" [page type id :as req] (layout/render (str page ".html") {:type type :id id :username (:username (:user (:session req)))}))
  ;;获取用户信息
  (GET "/session" req (system/session req))
  ;;查询用户
  (ANY "/users" [page rows keyword] (system/getusers page rows keyword ))
  ;;用户登录
  (ANY "/login" [loginname pwd :as req] (system/loginuser loginname pwd req))
  ;;新增用户信息
  (ANY "/adduser" [roleid dvcode username useraccount pwd usercardnum usertelnum useraddress :as req]
    (system/adduser roleid dvcode username useraccount pwd usercardnum usertelnum useraddress req))
  ;;修改用户信息
  (ANY "/updateuser" [roleid dvcode username useraccount pwd usercardnum usertelnum useraddress userid :as req]
    (system/updateuser roleid dvcode username useraccount pwd usercardnum usertelnum useraddress userid req))

  ;;查询角色信息
  (ANY "/roles" [keyword page rows] (system/getroles keyword page rows))
  ;;新增角色信息
  (ANY "/addrole" [rolename :as req] (system/addrole rolename req))
  ;;修改角色信息
  (ANY "/updaterole" [rolename roleid :as req] (system/updaterole rolename roleid req))
  ;;删除角色信息
  (ANY "/delrole" [roleid :as req] (system/delrole roleid req))
  ;;查询功能树
  (ANY "/getfunctree" [node roleid :as req] (system/gettreefunc node roleid req))
  ;;新增功能
  (ANY "/addfunc" [funcname label funcid sortnum :as req] (system/addfunc funcname label funcid sortnum req))
  ;;修改功能
  (ANY "/updatefunc" [funcname label funcid pid sortnum :as req] (system/updatefunc funcname label funcid pid sortnum req))
  ;;删除功能
  (ANY "/delfunc" [funcid :as req] (system/delfunc funcid req))
  ;;修改功能配置
  (ANY "/makerolefunc" [deleteid funcid roleid :as req] (system/makerolefunc deleteid funcid roleid req))
  ;;查询操作日志
  (ANY "/logs" [keyword bgtime edtime page rows] (system/getlogs keyword bgtime edtime page rows))

  ;;查询老年人基本信息
  (ANY "/olds" [page rows keyword] (old/getolds page rows keyword))
  ;;查看老年人基本信息
  (ANY "/oldbytel" [tel] (old/getoldbytel tel))
  ;;查看紧急联系人信息
  (ANY "/contacts" [oldid] (old/getcontacts oldid))
  ;;查看余额记录
  (ANY "/moneys" [keyword page rows] (old/getmoneys keyword page rows))
  ;;发放补贴
  (ANY "/pushmoney" [] (old/pushmoney))

  ;;老年人枚举配置
  (ANY "/combos" [type] (old/getcombos type))
  (ANY "/combo" [type value] (old/getcombo type value))







  ;;新增服务商信息
  (ANY "/addorg" [orgtype orgperson orgservice dvcode orgname orgtelnum orgaddress orgtype lon lat
                  orgcreatetime orgid :as req]
    (server/addorg orgtype orgperson orgservice dvcode orgname orgtelnum orgaddress orgtype lon lat
      orgcreatetime orgid req))
;  (ANY "/passorg" [orgid status orgtype orgreason :as req] (server/passorg orgid status orgtype orgreason req))               ;;审核服务商信息
  ;;修改服务商信息
  (ANY "/updateorg" [orgtype orgperson orgservice dvcode orgname orgtelnum orgaddress orgtype lon lat
                     orgcreatetime orgid :as req]
    (server/updateorg orgtype orgperson orgservice dvcode orgname orgtelnum orgaddress orgtype lon lat
      orgcreatetime orgid req))
  ;;删除服务商信息
  (ANY "/delorg" [orgid :as req] (server/delorg orgid req))
  ;;查询服务商信息
  (ANY "/orgs" [page rows keyword] (server/getorgs page rows keyword))
  ;;新增服务项信息
  (ANY "/additem" [orgid tid price icontent :as req] (server/additem orgid tid price icontent req))
  ;;修改服务项信息
  (ANY "/updateitem" [tid price icontent iid :as req] (server/updateitem tid price icontent iid req))
  ;;废除服务项信息
  (ANY "/delitem" [iid :as req] (server/delitem iid req))
  ;;根据服务机构查询服务项信息
  (ANY "/orgitems" [orgid] (server/itembyorg orgid))
  ;;根据服务类别查询服务项信息
  (ANY "/typeitems" [tid] (server/itembytype tid))




  (ANY "/addwork" [wid oldname oldtelnum oldtype waddress ordertime wtime oldid urgent addsh adds addx addjd
                   wlon wlat wcontent :as req]                        ;;新增工单信息
    (server/addwork wid oldname oldtelnum oldtype waddress ordertime wtime oldid urgent addsh adds addx addjd
      wlon wlat wcontent req))
;  (ANY "/updatework" [wid status userid tb :as req] (server/updatework wid status userid tb req))          ;;修改工单状态信息
  ;;派单
  (ANY "/pwork" [wptid wtid orgid iid wid orgname :as req] (server/pwork wptid wtid orgid iid wid orgname req))
  ;;根据服务机构查询工单信息
  (ANY "/orgworks" [orgid] (server/worksbyorg orgid))
  ;;根据老年人查询工单信息
  (ANY "/oldworks" [oldid] (server/worksbyold oldid))
  ;;查询工单信息
  (ANY "/works" [status tid oldname wid oldtelnum begintime endtime orgname page rows]
    (server/getworks status tid oldname wid oldtelnum begintime endtime orgname page rows))
  ;;查看工单信息
  (ANY "/work" [wid] (server/getwork wid))
  ;;增加回访记录
  (ANY "/vwork" [asstime price visitcontent evaluate wid oldid :as req]
    (server/vwork asstime price visitcontent evaluate wid oldid req))
  ;;派单还原
  (ANY "/restorep" [wid :as req] (server/restorep wid req))
;  ;;回访还原
;  (ANY "/restorev" [wid :as req] (server/restorev wid req))
  ;;废除工单
  (ANY "/delwork" [wid :as req] (server/delwork wid req))

  ;;新增服务类型
  (ANY "/addtype" [tname tid depth dvcode :as req] (system/addtype tname tid depth dvcode req))
  ;;修改服务类型
  (ANY "/updatetype" [tname tid :as req] (system/updatetype tname tid req))
  ;;查询服务类型
  (ANY "/types" [parentid depth dvcode] (system/gettypes parentid depth dvcode))
  ;;查看服务类型
  (ANY "/type" [id] (system/gettype id))

  ;;查看区划树
  (ANY "/divisions" [dvrank dvhigh] (system/getdivisions dvrank dvhigh))

  (ANY "/division" [dvcode] (system/getdivision dvcode))
  ;;新增区划
  (ANY "/adddivision" [dvcode dvrank dvflag dvname totalname dvhigh dvocode :as req]
    (system/adddivision dvcode dvrank dvflag dvname totalname dvhigh dvocode req))
  ;;修改区划
  (ANY "/updatedivision" [dvflag dvname totalname dvocode :as req]
    (system/updatedivision dvflag dvname totalname dvocode req))
  ;;上传文件
  (ANY "/upload" [file orgid :as req] (server/upload file orgid req))
  ;;查看文件信息
  (ANY "/files" [orgid] (server/getfiles orgid))
  ;;删除文件信息
  (ANY "/delfile" [fileid req] (server/delfile fileid req) )

  ;;枚举类型
  (ANY "/figuretype" [] (system/figuretype))
  ;;查询枚举信息
  (ANY "/figures" [cident] (system/getfigures cident))
  ;;查看枚举信息
  (ANY "/figure" [ident value] (system/getfigure ident value))
  ;;新增枚举类型
  (ANY "/addfiguretype" [cident :as req] (system/addfiguretype cident req))
  ;;新增枚举信息
  (ANY "/addfigure" [text cname cvalue csort cstate :as req] (system/addfigure text cname cvalue csort cstate req))
  ;;修改枚举信息
  (ANY "/updatefigure" [cident cname cvalue csort cstate cid :as req] (system/updatefigure cident cname cvalue csort cstate cid req))
  ;;删除枚举信息
  (ANY "/delfigure" [cid :as req] (system/delfigure cid req))
  ;;查询操作日志
  (ANY "/logs" [keyword bgtime edtime page rows] (system/getlogs keyword bgtime edtime page rows))
  )

