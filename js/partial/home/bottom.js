define(function(){
    return bottom
});
var bottom = {
    interval:'',
    repeat:true,
    Render:function () {
        var _this = this;
        $('.cus-bottom li > div').css('margin-top',($('.content-3.cus-item').height()-50)/2 + 'px');
        $(window).resize(function() {
            $('.cus-bottom li > div').css('margin-top',($('.content-3.cus-item').height()-50)/2 + 'px')
        });
        _this.getData();
        if(_this.interval) clearInterval(_this.interval);
        _this.interval = setInterval(function () {
            _this.repeat && _this.getData()
        },30000);
    },
    getData:function () {
        var _this = this;
        if(main.clearInterCharge(_this.interval,'ps-interval'))return;
        $.ajax({
            url:'/interface/getStatistics',
            type:'post',
            dataType:'JSON',
            data:JSON.stringify({token:Cookies.getCook('token')}),
            success:function (result) {
                if(result.success){
                    var getBS = result.data;
                    $.each(getBS,function (item,value) {
                        $('#bs_'+item+"_value").length && $('#bs_'+item+"_value").text(value.value);
                        $('#bs_'+item+"_unit").length && $('#bs_'+item+"_unit").text(value.unit);
                    })
                }else {
                    console.log('error');
                    var isDialog = _this.repeat;
                    _this.repeat = false;
                    isDialog && App.alert(result.msg,function (e) {
                        _this.repeat = true;
                    });
                }
            },
            error:function (e) {
                console.log('e',e)
            }
        })
    },
};