/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 16-4-27
 * Time: 下午2:55
 * To change this template use File | Settings | File Templates.
 */
function timeFormatter2() {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();          //秒
    var clock = year + "-";
    if(month < 10)
        clock += "0";
    clock += month + "-";
    if(day < 10)
        clock += "0";
    clock += day + " ";
    if(hh < 10)
        clock += "0";
    clock += hh + ":";
    if (mm < 10)
        clock += '0';
    clock += mm+":";
    if (ss < 10)
        clock += "0";
    clock += ss;
    return(clock);
}
var dateformatter=function timeFormatter(v,r,i) {
    var now = new Date(v);
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();          //秒
    var clock = year + "-";
    if(month < 10)
        clock += "0";
    clock += month + "-";
    if(day < 10)
        clock += "0";
    clock += day + " ";
    if(hh < 10)
        clock += "0";
    clock += hh + ":";
    if (mm < 10)
        clock += '0';
    clock += mm+":";
    if (ss < 10)
        clock += "0";
    clock += ss;
    return(clock);
}
function getfigurename (ident,value){
    var name = "";
    $.ajax({
        url:encodeURI('figure?ident='+ident+'&value='+value),
        async:false,
        success:function(data){
            if(data)
                name = data.cname;
            else{
                name = "无";
            }
        }
    })
    return name;
}
function getcombo (ident){
    var name = "";
    $.ajax({
        url:encodeURI('combos?type='+ident),
        async:false,
        success:function(data){
            console.log(data)
            if(data)
                name = data;
            else{
                name = "无";
            }
        }
    })
    return name;
}
function getcomboname (ident,value){
    var name = "";
    $.ajax({
        url:encodeURI('combo?type='+ident+'&value='+value),
        async:false,
        success:function(data){
            console.log(data)
            if(data)
                name = data.text;
            else{
                name = "无";
            }
        }
    })
    return name;
}

