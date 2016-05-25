/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 16-4-27
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    $("#addsh").combobox({
        url:'/divisions?dvrank=2&dvhigh=330000',
        method:'get',
        valueField: 'dvcode',
        textField: 'dvname',
        onSelect:function(record){
            console.log(record)
            $('#adds').combobox({
                url:'/divisions?dvrank=3&dvhigh='+record.dvcode,
                method:'get',
                valueField: 'dvcode',
                textField: 'dvname',
                onSelect:function(record2){
                    $('#addx').combobox({
                        url:'/divisions?dvrank=4&dvhigh='+record2.dvcode,
                        method:'get',
                        valueField: 'dvcode',
                        textField: 'dvname',
                        onSelect:function(record3){
                            $('#addjd').combobox({
                                url:'/divisions?dvrank=5&dvhigh='+record3.dvcode,
                                method:'get',
                                valueField: 'dvcode',
                                textField: 'dvname',
                                onSelect:function(record4){
//                                    $("input[name=orgaddress]").val(record4.totalname);
                                }
                            })
                        }
                    })
                }
            })
        }
    })
    var jq = top.jQuery;
    $('#divisionmanagerpanel').treegrid({
        rownumbers: true,
        method: 'post',
        url: '/divisions',
        treeField: 'text',
        idField: 'dvcode',
        onBeforeLoad: function (row, params) {
            console.log(row);
            if (!row){
                params.dvhigh = "000000";
                params.dvrank = 1;
            }
            else{
                params.dvhigh = row.dvcode;
                params.dvrank = (row.dvrank+1);
            }
//                params.node = null;
//            else ;
//            params.roleid = "";
        },
        onLoadSuccess: function (row, data) {
        },
        onClickRow: function (rowData) {
//            console.log(rowData)
//            rowData.dvcode = rowData.dvcode;
//            rowData.label = rowData.value;
//            rowData.pid = rowData.funcparentid;
//            console.log(rowData);
            $('#divisioninfoform').form('load', rowData);
            $('#divisionformbtns span').show();
            $('#divisionmanagerlayout').layout('expand', 'east');
        }
    });
    $('#dvcode').combotree({
        url:'divisions?dvhigh=000000',
        method: 'get',
        valueField:'dvcode',
        textField:'text',
        onBeforeExpand: function (node) {
            console.log(node)
            $('#dvcode').combotree("tree").tree("options").url
                ="divisions?dvhigh=" + node.dvcode;
        },
        onHidePanel: function () {
            $('#dvcode').combotree('setText',
                $('#dvcode').combotree('tree').tree('getSelected').text);
            $('#dvcode').combotree('setValue',
                $('#dvcode').combotree('tree').tree('getSelected').dvcode);
        },
        onClick:function(node){
            $('#dvcode').combotree('setValue',node.dvcode);
            $('#dvcode').combotree('setText',node.text);
            console.log($('input[name=dvcode]').val());
        }
    })
    $('#divisionformbtns .save').click(function () {
        $.messager.confirm('确定要修改区划配置么?', '你正在试图修改区划配置?', function (r) {
            if (r) {
                $("#divisioninfoform").form('submit', {
                    url:'/updatedivision',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','修改区划成功!');
                        $('#divisionmanagerpanel').treegrid('reload');
                    }
                });
            }
        });
    });
    $('#divisionformbtns .new').click(function () {
        $.messager.confirm('确定要新增区划配置么?', '你正在试图新增区划配置?', function (r) {
            if (r) {
                $("#divisioninfoform").form('submit', {
                    url:'/adddivision',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','新增区划成功!');
                        $('#divisionmanagerpanel').treegrid('reload');
                    }
                });
            }
        });
    });
})
//根据dvcode获取地名
function getdvname(code){
    var name = "";
    $.ajax({
        url:'division?dvcode='+code,
        async:false,
        success:function(data){
            name = data.dvname;
        }
    })
    return name;
}
