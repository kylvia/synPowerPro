define(function(){
    return psIndex
});
var psIndex = {
    resize:function(){
        $('#mainContainer').height($('body').height() -$('#mainNavmsg').height()-$('#mainNavbar').height()-5);
    },
    Render:function () {
        var _this = this;
        // _this.resize();
        // $(window).resize(function() {
        //     _this.resize();
        // });


        console.log(Echarts);
        if(!Echarts){
            require(["js/plugins/echarts/echarts.min.js"],function (echarts) {
                Echarts = echarts;
                loadTemp()
            })
        }else
        loadTemp();

        function loadTemp(){
            var items = $('.aside-main');
            if(items.length){
                var loadPageContainer = items.find('.cus-item');
                loadPageContainer.each(function (index,item) {
                    var toPage = $(item).attr('attr-href');
                    !!toPage && $(item).find('.section').loadPage(toPage);
                })
            }
            var cItems = $('.c-main');
            if(cItems.length){
                var loadPageContainer = cItems.find('.cus-item');
                loadPageContainer.each(function (index,item) {
                    var toPage = $(item).attr('attr-href');
                    !!toPage && $(item).loadPage(toPage);
                })
            }

        }
    }
};