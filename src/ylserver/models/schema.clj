(ns ylserver.models.schema)

;(def db-mysql {:subprotocol "mysql"
;               ;;:subname "//127.0.0.1:9306?characterEncoding=utf8&maxAllowedPacket=512000"
;               :subname "//127.0.0.1:3306/hvitpublic"
;               :user "root"
;               :password "hvit"
;               })
(def datapath (str (System/getProperty "user.dir") "/resources/public/"))
(def db-oracle1  {:classname "oracle.jdbc.OracleDriver"
                 :subprotocol "oracle"
                 :subname "thin:@192.168.2.142:1521:orcl"
                 :user "ylserver"
                 :password "ylserver"
                 :naming {:keys clojure.string/lower-case :fields clojure.string/upper-case}})
(def db-oracle  {:classname "oracle.jdbc.OracleDriver"
                 :subprotocol "oracle"
                 :subname "thin:@121.40.143.127:1521:orcl"
                 :user "callcenter"
                 :password "123456"
                 :naming {:keys clojure.string/lower-case :fields clojure.string/upper-case}})
