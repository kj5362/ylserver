/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 14-12-9
 * Time: 下午4:50
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    var jq = top.jQuery;
    $('#funcmanagerpanel').treegrid({
        rownumbers: true,
        method: 'post',
        url: '/getfunctree?roleid=',
        treeField: 'text',
        idField: 'funcid',
        onBeforeLoad: function (row, params) {
            console.log(row);
            if (!row)params.node = -1;
            else params.node = row.funcid;
//                params.node = null;
//            else ;
//            params.roleid = "";
        },
        onLoadSuccess: function (row, data) {
        },
        onClickRow: function (rowData) {
//            console.log(rowData)
            rowData.funcname = rowData.textold;
            rowData.label = rowData.value;
            rowData.pid = rowData.funcparentid;
//            console.log(rowData);
            $('#funcinfoform').form('load', rowData);
            $('#funcformbtns span').show();
            $('#funcmanagerlayout').layout('expand', 'east');
        }
    });
    $('#funcformbtns .del').click(function () {
        $.messager.confirm('确定要删除功能么?', '你正在试图删除功能?', function (r) {
            if (r) {
                $("#funcinfoform").form('submit', {
                    url:'/delfunc',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','删除功能成功!');
                        $('#funcmanagerpanel').treegrid('reload');
                    }
                });
            }
        });
    });
    $('#funcformbtns .save').click(function () {
        $.messager.confirm('确定要修改功能配置么?', '你正在试图修改功能配置?', function (r) {
            if (r) {
                $("#funcinfoform").form('submit', {
                    url:'/updatefunc',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','修改功能成功!');
                        $('#funcmanagerpanel').treegrid('reload');
                    }
                });
            }
        });
    });
    $('#funcformbtns .new').click(function () {
        $.messager.confirm('确定要新增功能配置么?', '你正在试图新增功能配置?', function (r) {
            if (r) {
                $("#funcinfoform").form('submit', {
                    url:'/addfunc',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','新增功能成功!');
                        $('#funcmanagerpanel').treegrid('reload');
                    }
                });
            }
        });
    });
})