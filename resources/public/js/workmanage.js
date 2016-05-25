/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 16-4-19
 * Time: 下午7:44
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    if($("#wid").text()){
        $("input[name=wid]").val($("#wid").text());
        $("input[name=accepname]").val($("#name").text());
        console.log(timeFormatter2())
        $("#time").datetimebox("setValue",timeFormatter2());
    }
    $("#oldtype").combobox({
        url:'/figures?cident=客户类型'
    }) ;
    $("#urgent").combobox({
        url:'/figures?cident=紧急程度'
    })
    if($("#type").text()){
        var data = JSON.parse($("#type").text());
        console.log(data)
        data.ordertime = timeFormatter2(data.ordertime);
        data.wtime = timeFormatter2(data.wtime);
        data.asstime = timeFormatter2(data.asstime);
        data.acceptime = timeFormatter2(data.acceptime);
        data.visittime = timeFormatter2(data.visittime);
        data.oldtype = getfigurename("客户类型",data.oldtype);
        data.urgent = getfigurename("紧急程度",data.urgent);
        $('form').form('load',data);
        var addsh = getdvname(data.addsh);
        $('#addsh').combobox('setValue',data.addsh);
        $('#addsh').combobox('setText',addsh);
        var adds = getdvname(data.adds);
        $('#adds').combobox('setValue',data.adds);
        $('#adds').combobox('setText',adds);
        var addx = getdvname(data.addx);
        $('#addx').combobox('setValue',data.addx);
        $('#addx').combobox('setText',addx);
        var addjd = getdvname(data.addjd);
        $('#addjd').combobox('setValue',data.addjd);
        $('#addjd').combobox('setText',addjd);
        var wptid = gettypename(data.wptid);
        $('#wtid').combobox('setValue',data.wptid);
        $('#wtid').combobox('setText',wptid);
        var wtid = gettypename(data.wtid);
        $('#tid').combobox('setValue',data.wtid);
        $('#tid').combobox('setText',wtid);
//        $.ajax({
//            url:'/divisions?dvrank=2&dvhigh=330000',
//            success:function(info){
//                $('#addsh').combobox('loadData',info).combobox('select',data.addsh);
//                $.ajax({
//                    url:'/divisions?dvrank=3&dvhigh='+data.addsh,
//                    success:function(info){
//                        $('#adds').combobox('loadData',info).combobox('select',data.adds);
//                        $.ajax({
//                            url:'/divisions?dvrank=4&dvhigh='+data.adds,
//                            success:function(info){
//                                $('#addx').combobox('loadData',info).combobox('select',data.addx);
//                                $.ajax({
//                                    url:'/divisions?dvrank=5&dvhigh='+data.addx,
//                                    success:function(info){
//                                        $('#addjd').combobox('loadData',info).combobox('select',data.addjd);
//                                    }
//                                })
//                            }
//                        })
//                    }
//                })
//            }
//
//        })
//        $.ajax({
//            url:"/types?parentid=T&depth=1",
//            success:function(info){
//                $("#wtid").combobox('loadData',info).combobox('select',data.wptid);
//                $.ajax({
//                    url:"/types?parentid="+data.wptid+"&depth=2",
//                    success:function(info){
//                        $('#tid').combobox('loadData',info).combobox('select',data.wtid);
//                    }
//                })
//            }
//        })
        $("tr").show();
        $(".addwork").text("工单信息");
        $("input").attr('readonly','true');
        $(".easyui-textbox").textbox('readonly','true');
        $(".easyui-combobox").combobox('readonly','true');
        $(".workbtns").hide();

    }
    $("#tel").keyup(function(){
        $.ajax({
            url:'/oldbytel?tel='+$("#tel").val(),
            success:function(data){
                $(".findbox").html('');
                for(var i=0;i<data.length;i++){
                    var str = "<div class='findtext' onclick='loadO("+data[i].oldid+")'><div class='lf'>"+data[i].oldtelnum+
                        "</div><div class='rg'>"+data[i].oldname+"</div><p id='o"+data[i].oldid+"' style='display: none'>"+
                        JSON.stringify(data[i])+"</p></div>";
//                    $(str)
                    $(".findbox").append($(str))
                }
                $(".findbox").show();
            }
        })
    })
    var jq = top.jQuery;
    $('#workpaneltb .find').click(function(){
        $('#workmanagerpanel').datagrid('load',
            {wid:$('#workpaneltb .wid').val(),oldname:$('#workpaneltb .name').val(),oldtel:$('#workpaneltb .tel').val(),
             tid:$('#workpaneltb .type').val()});

    });
    $(".workbtns .lf").click(function(){
        $('form').form('submit', {
            url:'/addwork',
            onSubmit: function(){
            },
            success:function(data){
                console.log(data.length)
                if(data== "\"true\""){
                    console.log(data)
                    $.messager.alert('保存','保存成功!');
                    window.location.href='/page?page=work&type=0';
                }else{
                    $.messager.alert('保存','保存失败!');
                }
            }
        });
    })
    $('#workmanagerpanel').datagrid({
        singleSelect: true,
        collapsible: true,
        rownumbers: true,
        method:'post',
        url:'/works',
        remoteSort: false,
        fit:true,
        toolbar:'#workpaneltb',
        pagination:true,
        pageList:[10,14,20,30],
        pageSize:14,
        rowStyler:function(index,row){
            if (index%2==1){
                return {class:'r1'};
            }
        },
        onBeforeLoad: function (params) {
            params.status = $("#status").text();
            var options = $('#workmanagerpanel').datagrid('options');
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
    $(".add").click(function(){
        var date = timeFormatter();
        var wid = "W"+date+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10);
        console.log(wid)
        window.location.href = "/page?page=addwork&id="+wid;
//        $.ajax({
//
//        })
    });



})
//工单作废
function delW(id){

    $.messager.confirm('确定废除工单信息么?', '你正在试图废除工单信息?', function(r){
        if (r){
            $.ajax({
                url:'/delwork?wid='+id,
                type:'get',
                success:function(data){
                    if(data == "true"){
                        $.messager.alert('操作成功','废除工单信息成功!');
                        $('#workmanagerpanel').datagrid('reload');
                    }else{
                        $.messager.alert('操作失败','废除失败!');
                        $('#workmanagerpanel').datagrid('reload');
                    }

                }
            });
        }
    });
}
//派单
function pwork(id){
    $('#pworkwin input').val('');//清空输入框数据
    $('#pworkwin input[name=wid]').val(id);
    $('#pworkwin').dialog('open');
}
//回访
function vwork(id){
    var data = JSON.parse($("#t"+id).text());
    console.log(data.wid);
    $('#vworkwin input').val('');//清空输入框数据
    $('#vworkwin input[name=wid]').val(id);
    $('#vworkwin input[name=oldid]').val(data.oldid);
    $('#vworkwin').dialog('open');
}
//查看工单详情
function detailW(id){
    window.location.href = '/page?page=addwork&type='+$("#t"+id).text();
}
//派单还原
function restoreP(id){
    $.ajax({
        url:'/restorep?wid='+id,
        success:function(data){
            console.log(data)
            if(data == "true"){
                $.messager.alert('操作成功','还原工单信息成功!');
                $('#workmanagerpanel').datagrid('reload');
            }else{
                $.messager.alert('操作失败','还原失败!');
                $('#workmanagerpanel').datagrid('reload');
            }
        }
    })
}
//回访还原
function restoreV(id){
    $.ajax({
        url:'/restorev?wid='+id,
        success:function(data){
            console.log(data)
            if(data == "true"){
                $.messager.alert('操作成功','还原工单信息成功!');
                $('#workmanagerpanel').datagrid('reload');
            }else{
                $.messager.alert('操作失败','还原失败!');
                $('#workmanagerpanel').datagrid('reload');
            }
        }
    })
}
//当前时间转换
function timeFormatter() {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日
    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();          //秒
    var clock = year;
    if(month < 10)
        clock += "0";
    clock += month;
    if(day < 10)
        clock += "0";
    clock += day;
    if(hh < 10)
        clock += "0";
    clock += hh;
    if (mm < 10)
        clock += '0';
    clock += mm;
    if (ss < 10)
        clock += "0";
    clock += ss;
    return(clock);
}
function loadO(id){
    console.log($("#o"+id).text());
    var info = eval("("+$("#o"+id).text()+")");
    console.log(info)
    $('form').form('load',info);
    $(".findbox").hide();
}
