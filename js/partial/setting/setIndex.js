define(function(){
    return setIndex
});
var setIndex = {
    Render:function () {
        $('#spMmenu a').on('click',function () {
            $('#spMmenu a').removeClass('on');
            $(this).addClass('on');
            $('#settingMain').loadPage($(this).attr('attr-href'));
        });
        $('#spMmenu a').eq(0).click();
    }
};