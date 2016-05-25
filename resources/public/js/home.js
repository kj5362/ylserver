/**
 * Created with IntelliJ IDEA.
 * User: asus
 * Date: 16-4-19
 * Time: 下午3:30
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    $(".tree").each(function(i){
        $(this).click(function(){
            $(".tree .minetree").removeClass('cl');
            $('.leafs').html('');
            $(this).find('.minetree').addClass('cl');
//            var text = "<div class='mineleaf'>任务管理</div>";
//            $(text).appendTo($(this).find('.leafs')) ;
        })
    })
    $.ajax({
        url:'/getfunctree?node=2',
        cache:false,
        success: function(data){
//            console.log(1)
            var text = "<table style='width: 200px;' cellspacing='20px' border='0' cellspadding='0'>";
            $.each(data,function(i,n){
//                if(n.checked){
                     text += "<tr><td class='tree'><div class='minetree' value='"+ n.funcid+"'>"+n.textold+
                        "</div><div class='leafs'></div></td></tr>"
//                }
            });
            $(text).appendTo($('#menu'));
            $('.tree .minetree').each(function(i){
                $(this).click(function(){
                    var node = $(this);
                    $.ajax({
                        url:'/getfunctree?node='+node.attr("value"),
                        success:function(data){
                            $(".tree .minetree").removeClass('cl');
                            $('.leafs').html('');
                            node.addClass('cl');
                            $.each(data,function(i,n){
                                console.log(i);
//                                if(n.checked){
                                    if(i==0){
                                        var str = "<div class='mineleaf' style='padding-top: 20px;' value='"+ n.value+"'>"+n.textold+"<hr></div>";
                                    }else{
                                        var str = "<div class='mineleaf' value='"+ n.value+"'>"+n.textold+"<hr></div>";
                                    }
                                    $(str).bind('click',function(){
                                        $('.mineleaf').removeClass('lcl');
                                        $(this).addClass('lcl');
                                        $('iframe').attr('src', '/page?page='+n.value)
//                                          alert(n.value)
                                    }).appendTo(node.parent().find('.leafs')) ;
//                                }
                            })

                        }
                    })
                })
            })
            $(".tree").eq(0).click();
        }
    })
})
//退出
function logout(){
    $.ajax({
        url:'/logout',
        success:function(data){
            location.reload();
        }
    });
}
