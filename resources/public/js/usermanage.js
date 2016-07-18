/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 15-10-20
 * Time: 上午11:04
 * To change this template use File | Settings | File Templates.
 */
var dv;
$(document).ready(function(){
    $('#userpaneltb .finduser').click(function(){
        $('#usermanagerpanel').datagrid('load',{keyword:$('#userpaneltb .keyword').val(),
            group:$('#userpaneltb .group').combobox('getValue')});

    });
    $("#tt").tree({
        url:"/divisionsbyuser",
        text: 'text',
        id: 'dvcode',
        onBeforeLoad:function (row, params) {
            console.log(row);
            if (row) {
                params.dvcode = row.dvcode;
            }
        },
        onDblClick:function(node){
            console.log(node)
            dv = node.dvcode;
            $('#usermanagerpanel').datagrid("reload");
        }
    })
    $('#role').combobox({
        valueField: 'roleid',
        textField: 'rolename',
        url:'roles',
        method:'get'
    })
    $('#usermanagerpanel').datagrid({
        singleSelect: true,
        collapsible: true,
        rownumbers: true,
        method:'post',
        url:'/users',
        remoteSort: false,
        fit:true,
        toolbar:'#userpaneltb',
        pagination:true,
        pageList:[10,14,20,30],
        pageSize:14,
        rowStyler:function(index,row){
            if (index%2==1){
                return {class:'r1'};
            }
        },
        onBeforeLoad: function (params) {
            var options = $('#usermanagerpanel').datagrid('options');
            if (options.pageNumber > 0)
                params.page = options.pageNumber;
            else
                params.page = 1;
            params.dvcode = dv;
        }
//        onClickRow:function(index, rowData){
//            $('#userinfoform').form('load',rowData);
//            $('#userformbtns span').show();
//            $('#usermanagerlayout').layout('expand','east');
//        }
    });
//    $('#userformbtns .del').click(function(){
//        $.messager.confirm('确定要删除用户么?', '你正在试图删除用户?', function(r){
//            if (r){
//                $("#userinfoform").form('submit', {
//                    url:'/deluser',
//                    onSubmit: function(){
//                    },
//                    success:function(){
//                        $.messager.alert('操作成功','删除用户成功!');
//                        $('#usermanagerpanel').datagrid('reload');
//                        //添加日志
//                        var content =  "admin删除了一条用户信息"
//                        $.ajax({
//                            url:encodeURI('system/addlog?logcontent='+content),
//                            type:'get'
//                        })
//                    }
//                });
//            }
//        });
//    });
//    $('#userformbtns .save').click(function(){
//        $.messager.confirm('确定要修改用户么?', '你正在试图修改用户?', function(r){
//                if (r){
//                    $("#userinfoform").form('submit', {
//                        url:'/updateuser',
//                        onSubmit: function(){
//                        },
//                        success:function(){
//                            $.messager.alert('操作成功','修改用户成功!');
//                            $('#usermanagerpanel').datagrid('reload');
//                            //添加日志
//                            var content =  "admin修改了一条用户信息"
//                            $.ajax({
//                                url:encodeURI('system/addlog?logcontent='+content),
//                                type:'get'
//                            })
//                        }
//                    });
//                }
//            }
//        );
//    });
//    $('#userpaneltb .newuser').click(function(){
//        $('#newuserwin input').val('');//清空输入框数据
//        $('#newuserwin .easyui-combotree').combotree('setValue','');
//        $('#newuserwin').dialog('open');
//    });
    $('#userpaneltb .newuser').click(function(){
        $('#newuserwin input').val('');//清空输入框数据
        $('input[name=dvcode]').val(dv);
//        $("#group").combobox('setValue','');
//        $("#job").combobox('setValue','');
        $("#role").combobox('setValue','');

        $('#saveuserbtn').linkbutton('disable');//保存按钮禁用
        $('#updateuserbtn').linkbutton('disable');//保存按钮禁用
        $('#newuserwin').dialog({title:"新增用户"})
        $('#newuserwin').dialog('open');//对话窗打开
    });
    //用户弹窗输入框里数据变动事件
    $('#newuserwin input').on('change',function(){
        var form=$('#newuserwin form');
        //判断调查点表单数据是否验证成功
        if(form.form('validate')){
            console.log($('#newuserwin [name=userid]').val())
            if($('#newuserwin [name=userid]').val())
                $('#saveuserbtn').linkbutton('disable');//保存按钮禁用
            else
                $('#saveuserbtn').linkbutton('enable'); //保存按钮启用
        }
        else{
            $('#saveuserbtn').linkbutton('disable');//保存按钮禁用
        }
    });



})
//删除用户信息
function delP(id){
    var data = JSON.parse($("#t"+id).text());
    console.log(data.userid);
    $.messager.confirm('确定要删除用户信息么?', '你正在试图删除用户信息?', function(r){
        if (r){
            $.ajax({
                url:'/deluser?userid='+id,
                type:'get',
                success:function(){
                    $.messager.alert('操作成功','删除用户信息成功!');
                    $('#userpanel').datagrid('reload');
                }
            });
        }
    });
}
//填充用户表单数据
function updateP(id){
    $('#newuserwin input').val('');//清空输入框数据
    $("#role").combobox('setValue','');
    var data = JSON.parse($("#t"+id).text());
    $('#newuserwin form').form('load',data);
    //$("#dvcode").combotree('setValue',data.dvname);
    $('#newuserwin').dialog({title:"变更用户信息"})
    $('#updateuserbtn').linkbutton('enable');//变更按钮启用
    $('#newuserwin').dialog('open');
}
