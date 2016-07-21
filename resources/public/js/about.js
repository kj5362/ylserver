/**
 * Created by asus on 2016/7/14.
 */
$(document).ready(function(){
    //工单统计
    $.ajax({
        url:"/countwork",
        success:function(info){
            $("#works ul").html('<li style="font-size: 16px;">今日：'+info.d+'条</li><li style="font-size: 16px;">本月：'+
                info.m+'条</li><li style="font-size: 16px;">当年：'+info.y+'条</li>');
            $("#works .sy_bottom").html('总量：'+info.c+'条');
        }
    })
    //客户统计
    $.ajax({
        url:"/countold",
        success:function(info){
            $("#olds ul").html('<li style="font-size: 16px;">今日：'+info.d+'条</li><li style="font-size: 16px;">本月：'+
                info.m+'条</li><li style="font-size: 16px;">当年：'+info.y+'条</li>');
            $("#olds .sy_bottom").html('总量：'+info.c+'条');
        }
    })
    //服务商统计
    $.ajax({
        url:"/countorg",
        success:function(info){
            $("#orgs ul").html('<li style="font-size: 16px;">今日：'+info.d+'条</li><li style="font-size: 16px;">本月：'+
                info.m+'条</li><li style="font-size: 16px;">当年：'+info.y+'条</li>');
            $("#orgs .sy_bottom").html('总量：'+info.c+'条');
        }
    })
})