/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 16-5-11
 * Time: 下午4:07
 * To change this template use File | Settings | File Templates.
 */
var oldid;
$(document).ready(function(){
    $('#oldpaneltb .find').click(function(){
        $('#oldmanagerpanel').datagrid('load',
            {keyword:$('#oldpaneltb .keyword').val()});
    });

//    political = getcombo("政治面貌");
//    education = getcombo("文化程度");
//    marriage = getcombo
    if($("#type").text()){
        var data = JSON.parse($("#type").text());
        data.oldsex = getcomboname("性别",data.oldsex);
        data.nation = getcomboname("民族",data.nation)
        data.oldtime = timeFormatter2(data.ordertime);
        data.oldtype = getfigurename("客户类型",data.oldtype);
        data.political = getcomboname("政治面貌",data.political);
        data.education = getcomboname("文化程度",data.education);
        data.marriage = getcomboname("婚姻状况",data.marriage);
        data.disability = getcomboname("是否残疾",data.disability);
        data.living = getcomboname("居住状态",data.living);

        if(data.dvcode){
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
            data.dvcode = addjd;
        }

        $('.form1').form('load',data);
//        $("input[name=orgid]").val(data.orgid);
        oldid=data.oldid;
        getCon();
//        getItem();
    }
    $('#oldmanagerpanel').datagrid({
        singleSelect: true,
        collapsible: true,
        rownumbers: true,
        method:'post',
        url:'olds',
        remoteSort: false,
        fit:true,
        toolbar:'#oldpaneltb',
        pagination:true,
        pageList:[10,14,20,30],
        pageSize:14,
        rowStyler:function(index,row){
            if (index%2==1){
                return {class:'r1'};
            }
        },
        onBeforeLoad: function (params) {
            var options = $('#oldmanagerpanel').datagrid('options');
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
//查看老年人信息
function updateO(id){
    console.log(id);
    console.log($("#t"+id).text())
    window.location.href = '/page?page=oldinfo&type='+$("#t"+id).text();
}
//查看紧急联系人
function getCon(){
    $.ajax({
        url:'/contacts?oldid='+oldid,
        success:function(info){
            $("#lxs").html('');
            for(var i=0;i<info.length;i++){
                var str = " <div class='item' style='height: 30px;width: 430px'><div class='lf'><table><tr><td>姓名：</td><td><div style='width: 140px;'>"+
                    info[i].contactname+"</div></td><td>联系方式：</td><td><div style='width: 140px;'>"+info[i].contacttel+"</div></td>" +
                    "</tr></table></div></div><br>"
                $("#lxs").append($(str));
                $.parser.parse('#lxs');
            }
        }
    })
}
