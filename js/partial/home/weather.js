define(function(){
    return weather
});
var weather = {
    interval:'',
    Render:function () {
        var _this = this;
        //获取经纬度
        _this.getLocation();
        if(_this.interval) clearInterval(_this.interval);
        _this.interval = setInterval(this.getLocation(),1800000);
    },
    getLocation:function () {
        var _this = this;
        if(main.clearInterCharge(_this.interval,'ps-interval'))return;
        $.ajax({
            url:'/interface/getPlantInfo',
            type:'post',
            dataType:'json',
            data:JSON.stringify({token:Cookies.getCook('token')}),
            success:function (result) {
                if(result.success){
                    //获取天气
                    _this.getWeather(result.data.loaction.reverse().join(','));
                }else {
                    App.alert(result.msg);
                }
            },
            error:function (e) {
                console.log(e)
            }
        })
    },
    getWeather:function (location) {
        $.ajax({
            url:'http://api.map.baidu.com/telematics/v3/weather',
            dataType:"jsonp",
            // jsonp:'function_name_index',
            // jsonpCallback:'function_name',
            data:{
                location:location,
                output:'json',
                ak:'t5uryEXGfrHPNNGbgam7eEl2'
            },
            success:function (result) {
                if(result.status === 'success'){
                    //基础数据
                    var weatherData = result.results[0].weather_data;
                    var day0Data = weatherData[0];
                    var dateData0 = day0Data.date.split(/\s+/);
                    $('#we_dateFormatter0').html(dateData0[0] + '&nbsp;' +result.date + dateData0[2]);
                    $('#we_dateYear2').html(Date.getYMD(2,result.date));
                    $('#we_dateYear1').html(Date.getYMD(1,result.date));
                }

                for(var i = 0;i<weatherData.length-1;i++){
                    var weatherDataItem = weatherData[i];
                    var dayData = weatherDataItem.date.split(/\s+/);
                    $.each(weatherDataItem,function (item,value) {
                        if($('#we_'+item+i).length < 1) return true;
                        $('#we_'+item+i).text(value);
                        $('we_dateWeek'+i).text(dayData[0]);
                        //天气图片
                        if($('#we_'+item+i).get(0).nodeName === 'IMG'){
                            var imgUrl = value.split('/');
                            $('#we_'+item+i).attr('src',"/images/3d_60/"+imgUrl[imgUrl.length-1])
                        }
                    })
                }


            },
            error:function (e) {
                console.log(e)
            }
        })
    }
}