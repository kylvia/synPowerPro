define(function(){
    return rmIndex
});
var rmIndex = {
    Render:function () {
        $('.cus-toPage').on('click',function () {
            $('.cus-toPage').removeClass('cus-tab-on');
            $(this).addClass('cus-tab-on');
            $('#rm-container').loadPage($(this).attr('attr-href'));
        })
        $('.cus-toPage').eq(0).click();
    }
}