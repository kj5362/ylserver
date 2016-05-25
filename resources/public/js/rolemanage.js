/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 14-12-9
 * Time: 下午5:00
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    var jq = top.jQuery;
    $('#rolepaneltb .findrole').click(function(){
        $('#rolemanagerpanel').datagrid('load',{keyword:$('#rolepaneltb .keyword').val()});
    });
    $('#rolefuncgrid').tree({
        method: 'post',
        animate:true,
        checkbox:true,
        url: '/getfunctree',
        treeField: 'text',
        idField: 'id',
        onBeforeLoad: function (row, params) {
            if (!row)params.node = -1;
            else params.node = row.funcid;
            try{
                params.roleid=$('#rolemanagerpanel').datagrid('getSelected').roleid;
            }catch (err){
            }
        },
        onLoadSuccess: function (row, data) {
        },
        onClickRow: function (rowData) {
        }
    });
    $('#rolemanagerpanel').datagrid({
        singleSelect: true,
        collapsible: true,
        rownumbers: true,
        method:'post',
        url:'/roles',
        remoteSort: false,
        fit:true,
        toolbar:'#rolepaneltb',
        pagination:true,
        pageList:[10,14,20,30],
        pageSize:14,
        rowStyler:function(index,row){
            if (index%2==1){
                return {class:'r1'};
            }
        },
        onBeforeLoad: function (params) {
            var options = $('#rolemanagerpanel').datagrid('options');
            if (options.pageNumber > 0)
                params.page = options.pageNumber;
            else
                params.page = 1;
        },
        onClickRow:function(index, rowData){
            rowData.roleid=rowData.roleid;
            $('#roleinfoform').form('load',rowData);
            $('#rolefuncgrid').tree('reload');
            $('#roleformbtns span').show();
            $('#rolemanagerlayout').layout('expand','east');
        }
    });
    $('#roleformbtns .del').click(function(){
        $.messager.confirm('确定要删除角色配置么?', '你正在试图删除角色配置?', function(r){
            if (r){
                $("#roleinfoform").form('submit', {
                    url:'/delrole',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','删除角色成功!');
                        $('#rolemanagerpanel').datagrid('reload');
                    }
                });
            }
        });
    });
    $('#roleformbtns .save').click(function(){
        var dataPara = getData();
        console.log(dataPara);
        $.messager.confirm('确定要修改角色配置么?', '你正在试图修改角色配置?', function(r){
                if (r){
                    $.ajax({
                        url: '/makerolefunc?roleid='+dataPara[1].value+'&deleteid='+dataPara.deleteid+'&funcid='+dataPara.funcid,
                        type: 'get',
                        dataType: "json",
                        success:function(){
                            $.messager.alert('操作成功','配置角色成功!');
                            $('#rolemanagerpanel').datagrid('reload');
                        }
                    });
                }
            }
        );

    });
    $('#rolepaneltb .newrole').click(function(){
        $('#newrolewin input').val('');
        $('#newrolewin').dialog('open');
    });
    $('#newrolewin input').on('change',function(){
        var form=$('#newrolewin form');
        if(form.form('validate')){
            $('#savenewrolebtn').linkbutton('enable');
        }
        else{
            $('#savenewrolebtn').linkbutton('disable');
        }
    });
})

function getData(){
    var params=$('#roleinfoform').serializeArray();
    var selectItems=$('#rolefuncgrid').tree('getChecked',['checked','indeterminate']);
    var unselectItems=$('#rolefuncgrid').tree('getChecked','unchecked');
    var funcid_arr=[];
    var delete_arr=[];
    $.each(selectItems,function(index,item){
        funcid_arr.push(item.funcid);
    });
    $.each(unselectItems,function(index,item){
        delete_arr.push(item.funcid);
    });
    params.deleteid=$.toJSON(delete_arr);
    params.funcid=$.toJSON(funcid_arr);
//    console.log(params);
    return params;
}


