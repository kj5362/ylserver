(ns ylserver.controller.server
  (:import (java.sql Date)
           (java.sql Timestamp ))
  (:require [ylserver.models.schema :as schema]
            [ylserver.models.db :as db]
            [noir.io :as io]
            [noir.response :as resp]
            [noir.session :as session]))

;;新增服务机构信息
(defn addorg [orgtype orgperson orgservice dvcode orgname orgtelnum orgaddress orgtype lon lat orgcreatetime orgid req]
  (if (nil? orgid)
    (resp/json (db/addorg {:orgtype orgtype :orgperson orgperson :orgservice orgservice :dvcode dvcode :orgname orgname
                           :orgtelnum orgtelnum :orgaddress orgaddress :lon lon :lat lat :orgcreatetime orgcreatetime
                           :userid (:userid (:user (:session req)))}
                 (:userid (:user (:session req)))))
    (resp/json (db/updateorg {:orgtype orgtype :orgperson orgperson :orgservice orgservice :dvcode dvcode :orgname orgname
                              :orgtelnum orgtelnum :orgaddress orgaddress :lon lon :lat lat :orgcreatetime orgcreatetime
                              :orgid orgid} (:userid (:user (:session req)))))
    )
  )
;;修改服务商信息
(defn updateorg [orgtype orgperson orgservice dvcode orgname orgtelnum orgaddress orgtype lon lat
                 orgcreatetime orgid req]
  (resp/json (db/updateorg {:orgtype orgtype :orgperson orgperson :orgservice orgservice :dvcode dvcode :orgname orgname
                            :orgtelnum orgtelnum :orgaddress orgaddress :lon lon :lat lat :orgcreatetime orgcreatetime
                            :orgid orgid} (:userid (:user (:session req))))))
;;废除服务商信息
(defn delorg [orgid req]
  (resp/json (db/delorg orgid (:userid (:user (:session req))))))


;;查询服务商信息
(defn getorgs [page rows keyword]
  (let [p (if (nil? page) page (Integer/parseInt page))
        r (if (nil? rows) rows (Integer/parseInt rows))
        results (db/getorgs keyword )
        c (count results)]
    (if (nil? p)
      (resp/json results)
      (if (<= (* p r) c)
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) (* p r))}))
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) c)}))))))
;;查看服务商信息
(defn getorg [orgid]
  (resp/json (db/getorg orgid)))




;;新增服务项信息
(defn additem [orgid tid price icontent req]
  (resp/json (db/additem {:orgid orgid :tid tid :price price :icontent icontent} (:userid (:user (:session req))))))
;;修改服务项信息
(defn updateitem [tid price icontent iid req]
  (resp/json (db/updateitem {:tid tid :price price :icontent icontent :iid iid} (:userid (:user (:session req))))))
;;废除服务项信息
(defn delitem [iid req]
  (resp/json (db/delitem iid (:userid (:user (:session req))))))
;;查询服务机构服务项信息
(defn itembyorg [orgid]
  (resp/json (db/itemsbyorg orgid)))
;;查询服务类别服务项信息
(defn itembytype [tid]
  (resp/json (db/itemsbytype tid)))

;;新增工单信息
(defn addwork [wid oldname oldtelnum oldtype waddress ordertime wtime oldid urgent addsh adds addx addjd
               wlon wlat wcontent req]
  (let [
;         wid (str "GD" (System/currentTimeMillis) (rand-int 9) (rand-int 9) (rand-int 9) (rand-int 9))
        time (Timestamp. (System/currentTimeMillis))
;        wpdtime (if (= status "1") (Timestamp. (System/currentTimeMillis)) "")
        ]
    (resp/json (db/addwork {:waddress waddress :ordertime (Timestamp/valueOf ordertime) :oldid oldid :userid (:userid (:user (:session req)))
                            :wid wid :acceptime time :accepname (:username (:user (:session req))) :wlon wlon :wlat wlat
                            :urgent urgent :oldname oldname :oldtelnum oldtelnum :oldtype oldtype :wcontent wcontent
                            :wtime (Timestamp/valueOf wtime) :addsh addsh :adds adds :addx addx :addjd addjd :status 0}
                 (:userid (:user (:session req)))))))
;    (resp/json (db/addstatus)))
;派发工单信息
(defn pwork [wptid wtid orgid iid wid orgname req]
  (resp/json (db/pwork wptid wtid orgid iid wid orgname (:userid (:user (:session req))))))

;;根据服务机构查询工单信息
(defn worksbyorg [orgid]
  (resp/json (db/worksbyorg orgid)))
;;;根据服务者查询工单信息
;(defn worksbyperson [pid]
;  (resp/json (db/worksbyperson pid)))
;;根据老年人查询工单信息
(defn worksbyold [oldid]
  (resp/json (db/worksbyold oldid)))

;;;服务类型处理
;(defn typeop [tid]
;   (map #(:tid %)(db/gettypes tid)))
;;查询工单信息
(defn getworks [status tid oldname wid oldtelnum begintime endtime orgname page rows]
  (let [p (if (nil? page) page (Integer/parseInt page))
        r (if (nil? rows) rows (Integer/parseInt rows))
        bgtime (if (or (nil? begintime) (= "" begintime)) (Timestamp/valueOf "1900-01-01 00:00:00") (Timestamp/valueOf begintime))
        etime (if (or (nil? endtime) (= "" endtime)) (Timestamp/valueOf "3000-12-31 00:00:00") (Timestamp/valueOf endtime))
        results (db/getworks status tid oldname wid oldtelnum bgtime etime orgname)
        c (count results)]
    (if (nil? p)
      (resp/json results)
      (if (<= (* p r) c)
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) (* p r))}))
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) c)}))))))
;;查看工单信息
(defn getwork [wid]
  (resp/json (db/getwork wid)))
;;新增回访记录
(defn vwork [asstime price visitcontent evalute wid oldid req]
  (let [time (Timestamp. (System/currentTimeMillis))]
    (resp/json (db/vwork (Timestamp/valueOf asstime) (Integer/parseInt price) visitcontent evalute wid oldid time
                   (:userid (:user (:session req)))))))
;;还原派单
(defn restorep [wid req]
  (resp/json (db/restorep wid (:userid (:user (:session req))))))
;;;还原回访
;(defn restorev [wid req]
;  (resp/json (db/restorev wid (:userid (:user (:session req))))))
;;废除工单
(defn delwork [wid req]
  (resp/json (db/delwork wid (:userid (:user (:session req))))))

;;上传文件
(defn uploadfile [file filepath]
  (let [uploadpath (str schema/datapath filepath)
        filename  (:filename file)
        type (.toLowerCase (.trim (.substring filename (.lastIndexOf filename "."))))
        storename (str (System/currentTimeMillis)  type)]
    (io/upload-file uploadpath  (conj file {:filename storename}))
    {:filename filename :storename storename}))
(defn upload [file id req]
  (let [path "/files"
        files (uploadfile file path)]
    (prn "img" files)
    ;    (resp/json {:success true :file imgname})))
    (resp/json (db/addfile {:filename (:filename  files) :storename (:storename  files) :filepath path :orgid id}
                       (:userid (:user (:session req)))))))
;;查看文件
(defn getfiles [orgid]
  (resp/json (db/getfiles orgid)))
;;删除文件
(defn delfile [fileid req]
  (resp/json (db/delfile fileid (:userid (:user (:session req))))))

;;查看枚举类型
(defn figuretype []
  (resp/json (db/figuretype)))






