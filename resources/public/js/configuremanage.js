/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 16-5-12
 * Time: 上午9:54
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    $('#configuremanagerpanel').treegrid({
        rownumbers: true,
        method: 'post',
        url: '/figures',
        treeField: 'text',
        idField: 'cvalue',
        onBeforeLoad: function (row, params) {
            console.log(row);
            if (!row){
                params.cident = "callcenter";
            }
            else{
                params.cident = row.text;
            }
        },
        onLoadSuccess: function (row, data) {
        },
        onClickRow: function (rowData) {
//            console.log(rowData)
//            rowData.dvcode = rowData.dvcode;
            rowData.cname = rowData.text;
//            rowData.pid = rowData.funcparentid;
//            console.log(rowData);
            $('#configureinfoform').form('load', rowData);
            $('#configureformbtns span').show();
            $('#configuremanagerlayout').layout('expand', 'east');
        }
    });
    $('#configureformbtns .save').click(function () {
        $.messager.confirm('确定要修改枚举信息么?', '你正在试图修改枚举信息?', function (r) {
            if (r) {
                $("#configureinfoform").form('submit', {
                    url:'/updatefigure',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','修改枚举信息成功!');
                        $('#configuremanagerpanel').treegrid('reload');
                    }
                });
            }
        });
    });
    $('#configureformbtns .new').click(function () {
        $.messager.confirm('确定要新增枚举信息么?', '你正在试图新增枚举信息?', function (r) {
            if (r) {
                $("#configureinfoform").form('submit', {
                    url:'/addfigure',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','新增枚举信息成功!');
                        $('#configuremanagerpanel').treegrid('reload');
                    }
                });
            }
        });
    });
    $('#configureformbtns .del').click(function () {
        $.messager.confirm('确定要删除枚举信息么?', '你正在试图删除枚举信息?', function (r) {
            if (r) {
                $("#configureinfoform").form('submit', {
                    url:'/delfigure',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','删除枚举信息成功!');
                        $('#configuremanagerpanel').treegrid('reload');
                    }
                });
            }
        });
    });
})
