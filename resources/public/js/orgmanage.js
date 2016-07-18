/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 16-4-25
 * Time: 下午3:04
 * To change this template use File | Settings | File Templates.
 */
var orgid;
$(document).ready(function(){
    var jq = top.jQuery;
//    $("input[name=userid]").val($("#userid").text());
    $('#orgpaneltb .find').click(function(){
        $('#orgmanagerpanel').datagrid('load',
            {keyword:$('#orgpaneltb .keyword').val(),name:$('#orgpaneltb .name').val(),service:$('#orgpaneltb .service').val()});
    });
    $("#orgtype").combobox({
        url:'/figures?cident=机构类型'
    }) ;
    if($("#type").text()){
        var data = JSON.parse($("#type").text());
        data.orgtype = getfigurename("机构类型",data.orgtype);
//        console.log(data)
        $('.form1').form('load',data);
        var addsh = getdvname(data.dvcode.substring(0,4)+'00');
        $('#addsh').combobox('setValue',data.dvcode.substring(0,4)+'00');
        $('#addsh').combobox('setText',addsh);
        var adds = getdvname(data.dvcode.substring(0,6));
        $('#adds').combobox('setValue',data.dvcode.substring(0,6));
        $('#adds').combobox('setText',adds);
        var addx = getdvname(data.dvcode.substring(0,9));
        $('#addx').combobox('setValue',data.dvcode.substring(0,9));
        $('#addx').combobox('setText',addx);
        var addjd = getdvname(data.dvcode);
        $('#addjd').combobox('setValue',data.dvcode);
        $('#addjd').combobox('setText',addjd);
//        $.ajax({
//            url:'/divisions?dvrank=2&dvhigh=330000',
//            success:function(info){
//                $('#addsh').combobox('loadData',info).combobox('select',data.dvcode.substring(0,4)+'00');
//                $.ajax({
//                    url:'/divisions?dvrank=3&dvhigh='+data.dvcode.substring(0,4)+'00',
//                    success:function(info){
//                        $('#adds').combobox('loadData',info).combobox('select',data.dvcode.substring(0,6));
//                        $.ajax({
//                            url:'/divisions?dvrank=4&dvhigh='+data.dvcode.substring(0,6),
//                            success:function(info){
//                                $('#addx').combobox('loadData',info).combobox('select',data.dvcode.substring(0,9));
//                                $.ajax({
//                                    url:'/divisions?dvrank=5&dvhigh='+data.dvcode.substring(0,9),
//                                    success:function(info){
//                                        $('#addjd').combobox('loadData',info).combobox('select',data.dvcode);
//                                    }
//                                })
//                            }
//                        })
//                    }
//                })
//            }
//
//        })
        data.orgtype = getfigurename("机构类型",data.orgtype);

//        $("input[name=orgid]").val(data.orgid);
        orgid=data.orgid;
        getFile();
        getItem();
        $("input").attr('readonly','true');
    }
    $('#orgmanagerpanel').datagrid({
        singleSelect: true,
        collapsible: true,
        rownumbers: true,
        method:'post',
        url:'/orgs',
        remoteSort: false,
        fit:true,
        toolbar:'#orgpaneltb',
        pagination:true,
        pageList:[10,14,20,30],
        pageSize:14,
        rowStyler:function(index,row){
            if (index%2==1){
                return {class:'r1'};
            }
        },
        onBeforeLoad: function (params) {
            var options = $('#orgmanagerpanel').datagrid('options');
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
        window.location.href = "/page?page=addorg";
    });
    $(".submitbtn").click(function(){
        $('.form1').form('submit', {
            url:'/addorg',
            onSubmit: function(){
            },
            success:function(data){
//                var info = eval('('+($(data).find('pre').text())+')');
                console.log(data.length)
                if(data== "\"true\""){
                    console.log(data)
                    $.messager.alert('保存','保存成功!');
                    window.location.href='/page?page=org';
                }else{
                    $.messager.alert('保存','保存失败!');
                }
//                window.location.href='/page?page=org';
            }
        });
    })
    $('.easyui-filebox').filebox({
            buttonText: '选择文件',
            buttonAlign: 'left'
        })
    $(".upload").click(function(){
        $("#uploadwin input").val('');
        $("#uploadwin input[name=orgid]").val(data.orgid);
        $('#uploadwin').dialog('open');
//        var str = " <div class='zj'><div class='lf'><input class='textbox' name='file' style='width: 450px;'></div>" +
//            "<div class='rg' style='width: 10px;'>&nbsp;</div><div class='ic rg'><img src='../img/ic/ic_delete.png'><br>删除</div>" +
//            "<div class='ic rg'><img src='../img/ic/ic_detailed.png'><br>" +"预览</div></div><br>"
//        $("#zjs").append($(str));
//        $('.easyui-filebox').filebox({
//            buttonText: '选择文件',
//            buttonAlign: 'left'
//        })
//        $.parser.parse('#zjs');
    })
    $(".additem").click(function(){
        $("#itemwin input").val('');
        $("#itemwin input[name=orgid]").val(data.orgid);
        $('#updateitembtn').linkbutton('disable');
        $('#additembtn').linkbutton('enable');
        $('#itemwin').dialog('open');
    })
    //服务商弹窗输入框里数据变动事件
    $('#itemwin input').on('change',function(){
        var form=$('#itemwin form');
        //判断调查点表单数据是否验证成功
        if(form.form('validate')){
            console.log($('#itemwin [name=iid]').val())
            if($('#itemwin [name=iid]').val())
                $('#saveitembtn').linkbutton('disable');//保存按钮禁用
            else
                $('#saveitembtn').linkbutton('enable'); //保存按钮启用
        }
        else{
            $('#saveitembtn').linkbutton('disable');//保存按钮禁用
            $('#updateitembtn').linkbutton('disable');//修改按钮禁用
        }
    });


})
//废除服务商信息
function delO(id){
    var data = JSON.parse($("#t"+id).text());
    $.messager.confirm('确定要删除服务商信息么?', '你正在试图删除服务商信息?', function(r){
        if (r){
            $.ajax({
                url:'/delorg?orgid='+id,
                type:'get',
                success:function(data){
                    if(data== "\"true\""){
                        $.messager.alert('操作成功','删除服务商信息成功!');
                        $('#orgmanagerpanel').datagrid('reload');
                    }else{
                        $.messager.alert('保存','保存失败!');
                    }
                }
            });
        }
    });
}
//查看服务商信息
function updateO(id){
    window.location.href = '/page?page=orginfo&type='+$("#t"+id).text();
}
//查看文件
function getFile(){
    $.ajax({
        url:'/files?orgid='+orgid,
        success:function(info){
            $("#zjs").html('');
            for(var i=0;i<info.length;i++){
                var str = " <div class='zj'><div class='lf'><div>"+info[i].filename+"</div></div>" +
                    "<div class='rg' style='width: 10px;'>&nbsp;</div><div class='ic rg' onclick='delF("+info[i].fileid+")'>" +
                    "<img src='../img/ic/ic_delete.png'><br>删除</div><div class='ic rg' onclick=seeF('"+info[i].storename+"')>" +
                    "<img src='../img/ic/ic_detailed.png'><br>" +"预览</div></div><br>"
                $("#zjs").append($(str));
            }
        }
    })
}
//预览文件
function seeF(id){
//    console.log(111)
    window.open("/files/"+id)
}
//删除文件
function delF(id){
    $.messager.confirm('确定要删除文件信息么?', '你正在试图删除文件信息?', function(r){
        if (r){
            $.ajax({
                url:'/delfile?fileid='+id,
                type:'get',
                success:function(data){
                    if(data== "\"true\""){
                        $.messager.alert('操作成功','删除文件信息成功!');
                        getFile();
                    }else{
                        $.messager.alert('保存','保存失败!');
                    }
                }
            });
        }
    });
}
//查看服务项
function getItem(){
    $.ajax({
        url:'/orgitems?orgid='+orgid,
        success:function(info){
            $("#items").html('');
            for(var i=0;i<info.length;i++){
                var str = " <div class='item'><div class='lf'><table><tr><td>服务类型：</td><td><div style='width: 150px;'>"+
                    info[i].tname+"</div></td><td>服务价格：</td><td><div style='width: 150px;'>"+info[i].price+"</div></td>" +
                    "</tr><tr><td>服务内容：</td><td colspan='3'><div style='width: 385px;'>"+info[i].icontent+"</div></td>" +
                    "</tr></table></div><div class='rg' style='width: 10px;'><p style='display: none' id='i"+info[i].iid+"'>"+
                    JSON.stringify(info[i])+"</p></div><div class='ic rg' onclick='delI("+info[i].iid+")'>" +
                    "<img src='../img/ic/ic_delete.png'><br>删除</div><div class='ic rg' onclick='updateI("+info[i].iid+")'>" +
                    "<img src='../img/ic/ic_detailed.png'><br>变更</div></div><br>"
                $("#items").append($(str));
                $.parser.parse('#items');
            }
        }
    })
}
//修改服务项
function updateI(id){
    $('#itemwin input').val('');//清空输入框数据
    var data = JSON.parse($("#i"+id).text());


    $('#itemwin form').form('load',data);
    $('#wtid').combobox('setValue',data.parentid);
    $('#tid').combobox('setValue',data.tid);
    $('#wtid').combobox('setText',gettypename(data.parentid));
    $('#tid').combobox('setText',data.tname);
//    $('#newuserwin').dialog({title:"变更用户信息"})
    $('#updateitembtn').linkbutton('enable');//变更按钮启用
//    $('#updateuserbtn').linkbutton('enable');//变更按钮启用
    $('#itemwin').dialog('open');
}
//删除服务项
function delI(id){
    $.messager.confirm('确定要删除服务项信息么?', '你正在试图删除服务项信息?', function(r){
        if (r){
            $.ajax({
                url:'/delitem?iid='+id,
                type:'get',
                success:function(data){
                    if(data== "\"true\""){
                        $.messager.alert('操作成功','删除服务项信息成功!');
                        getItem();
                    }else{
                        $.messager.alert('保存','保存失败!');
                    }
                }
            });
        }
    });
}

