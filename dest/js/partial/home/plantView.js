define(function(){
    return plantView
});
var plantView = {
    interval:'',
    repeat:true,
    Render:function () {
        var _this = this;
        $('#plantCarousel').carousel();
        _this.getStatus();
        this.getApi();
        if(_this.interval) clearInterval(_this.interval);
        _this.interval = setInterval(function () {
            _this.repeat && _this.getStatus()
        },5000);
    },
    getApi:function () {
        var _this = this;
        $.ajax({
            url:'/interface/getPlantInfo',
            type:'post',
            dataType:'JSON',
            data:JSON.stringify({token:Cookies.getCook('token')}),
            success:function (result) {
                if(result.success){

                    //基础数据
                    var plantViewData = result.data;
                    $.each(plantViewData,function(item,index){
                        if($('#pv_'+item).length){
                            $('#pv_'+item).text(plantViewData[item]);
                        }
                    });
                    //图片
                    var imgUrl = plantViewData.plantPhoto;
                    // if(!imgUrl)return;
                    for(var i = 0 ; i<3 ; i++){
                        if($('#pv_img'+i).length){
                            !!imgUrl[i]  ? $('#pv_img'+i).attr('src',imgUrl[i]).one('error',function () {
                                console.log(111);
                                $(this).attr('src','/images/plantstatus/plant.png') }) : $('#pv_img'+i).attr('src','/images/plantstatus/plant.png')
                        }
                    }

                }else {
                    App.alert(result.msg);
                }

            },
            error:function (e) {
                console.log(e)
            }
        });
    },
    getStatus:function () {
        var _this = this;
        if(main.clearInterCharge(_this.interval,'ps-interval'))return;
        /*电站状态*/
        $.ajax({
            url:'/interface/getPlantStatus',
            type:'post',
            dataType:'JSON',
            data:JSON.stringify({token:Cookies.getCook('token')}),
            success:function (result) {
                if(result.success){
                    if($('#pv-plantStatus').length){
                        $('#pv-plantStatus').text(result.data.plantStatus);
                        var addClass = '';
                        var addColor = '';
                        switch (result.data.plantStatus){
                            case '断连':addClass = 'breaker';addColor='#FF323A';break;
                            case '异常':addClass = 'abnormal';addColor='#FAC72D';break;
                            case '正常':addClass = 'normal';addColor='#67FF61';break;
                        }
                        $('.pv-plantStatus').css('color',addColor);
                        $('#pv-plantStatus-icon').removeClass().addClass(addClass)
                    }

                }else {
                    console.log('error');
                    _this.repeat = false;
                    App.alert(result.msg,function (e) {
                        _this.repeat = true;
                    });
                }

            },
            error:function (e) {
                console.log(e)
            }
        })
    }
};