(ns ylserver.controller.old
  (:import (java.sql Date)
           (java.sql Timestamp ))
  (:require [ylserver.models.db :as db]
            [noir.response :as resp]
            [noir.session :as session]
            [clojure.data.json :as json]))

;;;新增老年人信息
;(defn addold [old req]
;;  (let [loginnum (str (subs (:oldcardnum old) 0 4) (subs (:oldcardnum old) 14 18))]        ;;生成客户号
;    (resp/json  (db/addold old req)))
;;查询老年人基本信息
(defn getolds [page rows keyword]
  (let [p (if (nil? page) page (Integer/parseInt page))
        r (if (nil? rows) rows (Integer/parseInt rows))
        results (db/getolds keyword)
        c (count results)]
    (if (nil? p)
      (resp/json results)
      (if (<= (* p r) c)
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) (* p r))}))
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) c)}))))))
;;根据电话查看老年人基本信息
(defn getoldbytel [tel]
  (let [results (db/getoldbytel tel)]
    (if (> 5 (count results))
      (resp/json results)
      (resp/json (subvec (db/getoldbytel tel) 0 5)))))
;;查看紧急联系人
(defn getcontacts [oldid]
  (resp/json (db/getcontacts oldid)))
;;查看余额记录
(defn getmoneys [keyword page rows]
  (let [p (if (nil? page) page (Integer/parseInt page))
        r (if (nil? rows) rows (Integer/parseInt rows))
        results (db/getmoneys keyword)
        c (count results)]
    (if (nil? p)
      (resp/json results)
      (if (<= (* p r) c)
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) (* p r))}))
        (:body (resp/json {:total c :rows (subvec results (* (dec p) r) c)}))))))
;;发放补贴
(defn pushmoney []
  (resp/json (do
               (db/pushmoney)
               (map #(db/addmoney nil (:oldid %) (:subsidymoney %) "02") (db/getolds nil))
               (str "true"))))

;;查看枚举信息
(defn getcombos [type]
  (resp/json (db/getcombos type)))
(defn getcombo [type value]
  (resp/json (first (db/getcombo type value))))

