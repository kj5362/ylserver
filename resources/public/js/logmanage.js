/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 15-11-18
 * Time: 下午5:01
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    $('#logpaneltb .findlog').click(function(){
            $('#logmanagerpanel').datagrid('load',
                {
                    keyword:$('#logpaneltb .keyword').val(),
                    bgtime :$('#logpaneltb .bgtime').datebox('getValue'),
                    edtime :$('#logpaneltb .edtime').datebox('getValue')
                });
        }
    );
    $('#logmanagerpanel').datagrid({
        singleSelect: true,
        collapsible: true,
        rownumbers: true,
//        method:'post',
        url:'/logs',
        remoteSort: false,
        fit:true,
        toolbar:'#logpaneltb',
        pagination:true,
        pageList:[10,14,20,30],
        pageSize:14,
        rowStyler:function(index,row){
            if (index%2==1){
                return {class:'r1'};
            }
        },
        onBeforeLoad: function (params) {
            var options = $('#logmanagerpanel').datagrid('options');
            if (options.pageNumber > 0)
                params.page = options.pageNumber;
            else
                params.page = 1;
        },
        onClickRow:function(index, rowData){
        }
    });
})
//时间格式转换
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
