/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 16-5-11
 * Time: 下午3:44
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    $('#moneypaneltb .find').click(function(){
        $('#moneymanagerpanel').datagrid('load',
            {keyword:$('#moneypaneltb .keyword').val()});
    });
    $('#moneymanagerpanel').datagrid({
        singleSelect: true,
        collapsible: true,
        rownumbers: true,
        method:'post',
        url:'moneys',
        remoteSort: false,
        fit:true,
        toolbar:'#moneypaneltb',
        pagination:true,
        pageList:[10,14,20,30],
        pageSize:14,
        rowStyler:function(index,row){
            if (index%2==1){
                return {class:'r1'};
            }
        },
        onBeforeLoad: function (params) {
            var options = $('#moneymanagerpanel').datagrid('options');
            if (options.pageNumber > 0)
                params.page = options.pageNumber;
            else
                params.page = 1;
        }
//        onClickRow:function(index, rowData){
//            $('#userinfoform').form('load',rowData);
//            $('#userformbtns span').show();
//            $('#usermanagerlayout').layout('expand','east');
//        }
    });
})