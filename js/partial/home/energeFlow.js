define(function(){
    return energeFlow
});
var energeFlow = {
    interval:'',
    Render:function () {

        var _this = this;
        $('.cus-toPage').on('click',function () {
            $('#mainContainer').loadPage($(this).attr('attr-href'));
        })
        // this.getData()
        _this.getData();
        if(_this.interval) clearInterval(_this.interval);
        _this.interval = setInterval(_this.getData,5000)
    },

    getData:function () {
        var _this = this;
        if(main.clearInterCharge(_this.interval,'ps-interval'))return;
        $.ajax({
            url:'/interface/getCurrentPower',
            type:'post',
            timeout : 10000, //超时时间设置，单位毫秒
            dataType:'JSON',
            data:JSON.stringify({token:Cookies.getCook('token')}),
            success:function (result) {
                $('.cus-efmain-loading').hide();
                $('.cus-efmain').show();
                if(result.success){
                    if(!$('#egtUa').length)return
                    $('#egtUa').text(result.data.bus_voltage_a);
                    $('#egtUb').text(result.data.bus_voltage_b);
                    $('#egtUc').text(result.data.bus_voltage_c);
                    $('#egtF').text(result.data.bus_frequency);
                    //母线箭头流向
                    var bpower = result.data.bus_power;
                    var bpArrow;
                    bpower.substring(0,1) === '+' ? bpArrow = 'arrow-l' : bpArrow = 'arrow-r';
                    var classNameBp = $('.cus-ef-arrow6').attr('class').split(' ');
                    if(classNameBp.length >2){
                        classNameBp.pop();
                        $('.cus-ef-arrow6').removeClass().addClass(classNameBp.join(' '));
                        $('.cus-ef-arrow6').addClass(bpArrow);
                    }else {
                        $('.cus-ef-arrow6').addClass(bpArrow);
                    }
                    $('#egtP').text(bpower);

                    var deviceData = result.data.device_status;
                    for(var i = 0,len = deviceData.length;i<len;i++){
                        var item = deviceData[i];
                        //    功率
                        $('#pTobPower'+(i+1)).text(item.power);
                        $('#batteryVla'+(i+1)).text(item.battery_SOC);
                        //设备状态
                        switch (Number(item.inverter_status)){
                            case 0:deviceStatus = 'pscStatus-kj';break;
                            case 1:deviceStatus = 'pscStatus-gj';break;
                            case 2:deviceStatus = 'pscStatus-gz';break;
                        }
                        $('#pscStatus'+(i+1)).removeClass().addClass('pscStatus '+deviceStatus);
                        var bsImg ;
                        var classNameAr = $('.cus-ef-arrow'+i).attr('class').split(' ');
                        //断路器断连
                        if(!Number(item.breaker_status)){

                            //电池icon
                            var batteryIcon = ['batteryZero','batteryOne','batteryTwo','batteryThr','batteryFour'];
                            var batterySrc = '/images/plantstatus/'+batteryIcon[Number(item.batteryCell)]+'.png';
                            $('#battery'+(i+1)).attr('src',batterySrc);
                            //流向停止
                            if(classNameAr.length >2){
                                classNameAr.pop();
                                $('.cus-ef-arrow'+i).removeClass().addClass(classNameAr.join(' '));
                            }
                            // Number(item.breaker_status) ? bsImg = 'breakerClosure' : bsImg = 'breakerDisc';

                            $('#breaker'+(i+1)).attr('src','/images/plantstatus/breakerClosure.png');
                            continue;
                        }

                        $('#breaker'+(i+1)).attr('src','/images/plantstatus/breakerDisc.png');
                    //    电池
                        var csAr = Number(item.charge_status);
                        var batteryGifIcon;
                        csAr === 0 ? batteryGifIcon = 'charge.gif' : batteryGifIcon = 'discharge.gif';
                        var batterySrc = '/images/plantstatus/'+batteryGifIcon;
                        $('#battery'+(i+1)).attr('src',batterySrc);
                    //    电流方向
                        var fArrow;
                        var powerAr = item.power;
                        csAr === 1 ? fArrow = 'arrow-r' : fArrow = 'arrow-l';
                        var classNameAr = $('.cus-ef-arrow'+i).attr('class').split(' ');
                        if(classNameAr.length >2){
                            classNameAr.pop();
                            $('.cus-ef-arrow'+i).removeClass().addClass(classNameAr.join(' '));
                            $('.cus-ef-arrow'+i).addClass(fArrow);
                        }else {
                            $('.cus-ef-arrow'+i).addClass(fArrow);
                        }



                    }
                }else {
                    App.alert(result.msg);
                }
            },
            error:function (e) {
                console.log(e);
                alert(Msg.connectError);
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                if(status=='timeout'){//超时,status还有success,error等值的情况
                    ajaxTimeoutTest.abort();

                    $('.cus-efmain-loading').show();
                    $('.cus-efmain').hide();
                }
            }
        })
    },
    setArrow:function (deviceObj) {
        if(!deviceObj) return;
        $.each(deviceObj,function (name,arr) {
            $.each(arr,function (item,index) {
                $('#'+name+index).removeClass('');
                var className = $('#'+name+index).attr('class').split('');
                if(className.length>2){

                }
            })
        })
    }
}