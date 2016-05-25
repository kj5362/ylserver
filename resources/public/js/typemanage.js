/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 16-5-3
 * Time: 下午3:06
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
//地区树配置
//    $("#addsh").combobox({
//        url:'/divisions?dvrank=2&dvhigh=330000',
//        method:'get',
//        valueField: 'dvcode',
//        textField: 'dvname',
//        onSelect:function(record){
//            $("#dvcode").val(record.dvcode);
//            $('#adds').combobox({
//                url:'/divisions?dvrank=3&dvhigh='+record.dvcode,
//                method:'get',
//                valueField: 'dvcode',
//                textField: 'dvname',
//                onSelect:function(record2){
//                    $("#dvcode").val(record.dvcode);
//                    $('#addx').combobox({
//                        url:'/divisions?dvrank=4&dvhigh='+record2.dvcode,
//                        method:'get',
//                        valueField: 'dvcode',
//                        textField: 'dvname',
//                        onSelect:function(record3){
//                            $("#dvcode").val(record.dvcode);
//                            $('#addjd').combobox({
//                                url:'/divisions?dvrank=5&dvhigh='+record3.dvcode,
//                                method:'get',
//                                valueField: 'dvcode',
//                                textField: 'dvname',
//                                onSelect:function(record4){
//                                    $("#dvcode").val(record.dvcode);
//                                }
//                            })
//                        }
//                    })
//                }
//            })
//        }
//    })
    $("#wtid").combobox({
        url:"/types?parentid=T&depth=1",
        method:'get',
        valueField: 'tid',
        textField: 'text',
        onSelect:function(record){
            $("#tid").combobox({
                url:"/types?parentid="+record.tid+"&depth=2",
                method:'get',
                valueField: 'tid',
                textField: 'text',
                onSelect:function(record2){
                    console.log(record2)
                    if($("#pworkwin").length>0){
                        $.ajax({
                            url:'/typeitems?tid='+record2.tid,
                            success:function(data){
                                $(".tfindbox").html('');
                                for(var i=0;i<data.length;i++){
                                    var str = "<div class='findtext' onclick='loadI("+data[i].iid+")'><div class='lf'>"+data[i].orgname+
                                        "</div><div class='rg'>"+data[i].icontent+"</div><p id='i"+data[i].iid+"' style='display: none'>"+
                                        JSON.stringify(data[i])+"</p></div>";
//                    $(str)
                                    $(".tfindbox").append($(str))
                                }
                                $(".tfindbox").show();
                            }
                        })
                    }else{
                        console.log(111)
                    }
                }
            })
        }
    })
    $('#typepaneltb .find').click(function(){
        $('#typemanagerpanel').treegrid('load',{dvcode:$('#typepaneltb #dvcode').val()});
    });
//    $('#typepaneltb .add').click(function(){
//        if($('#typepaneltb #dvcode').val()){
//            $.ajax({
//
//            })
//        }else{
//            alert("没有设置区划");
//        }

//    });
//获取用户地区
    $.ajax({
        url:'/session',
        success:function(data){
            console.log(data)
        }
    })
    $('#typemanagerpanel').treegrid({
        rownumbers: true,
        method: 'post',
        toolbar:'#typepaneltb',
        url: '/types',
        treeField: 'text',
        idField: 'tid',
        onBeforeLoad: function (row, params) {
            console.log(row);
            if (!row){
//                params.parentid = "";
                params.depth = 0;
            }
            else{
                params.parentid = row.tid;
                params.depth = (row.depth+1);
            }
//            if($("#"))
//                params.node = null;
//            else ;
//            params.roleid = "";
        },
        onLoadSuccess: function (row, data) {
        },
        onClickRow: function (rowData) {
            $('#typeinfoform').form('load', rowData);
            $('#typeformbtns span').show();
            $('#typemanagerlayout').layout('expand', 'east');
        }
    });


    $('#typeformbtns .save').click(function () {
        $.messager.confirm('确定要修改服务配置么?', '你正在试图修改服务配置?', function (r) {
            if (r) {
                $("#typeinfoform").form('submit', {
                    url:'/updatetype',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','修改服务成功!');
                        $('#typemanagerpanel').treegrid('reload');
                    }
                });
            }
        });
    });
    $('#typeformbtns .new').click(function () {
        $.messager.confirm('确定要新增服务配置么?', '你正在试图新增服务配置?', function (r) {
            if (r) {
                $("#typeinfoform").form('submit', {
                    url:'/addtype',
                    onSubmit: function(){
                    },
                    success:function(){
                        $.messager.alert('操作成功','新增服务成功!');
                        $('#typemanagerpanel').treegrid('reload');
                    }
                });
            }
        });
    });
})
function loadI(id){
    console.log($("#i"+id).text());
    var info = eval("("+$("#i"+id).text()+")");
    console.log(info)
    $('#pworkwin form').form('load',info);
    $(".tfindbox").hide();
}
function gettypename(id){
    var name = "";
    $.ajax({
        url:'type?id='+id,
        async:false,
        success:function(data){
            name = data.tname;
        }
    })
    return name;
}