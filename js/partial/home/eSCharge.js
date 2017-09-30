/*BMS*/
define(function(){
    return eSCharge
});
var eSCharge = {
    interval:'',
    repeat:true,
    Render:function () {
        var _this = this;
        _this.setList();
        if(_this.interval) clearInterval(_this.interval);
        // _this.interval = setInterval(_this.setList,5000);
        _this.interval = setInterval(function () {
            _this.repeat && _this.setList()
        },5000);
    },

    setList:function () {
        var _this = this;
        if(main.clearInterCharge(_this.interval,'cus-esc-container'))return;
        function setStatueFunc(obj) {
            if(obj.name === obj.setName){
                $('#bms0'+obj.index+' '+obj.className).removeClass('on');
                if(Number(obj.value)){
                    $('#bms0'+obj.index+' '+obj.className).addClass('on');
                }
            }
        }
        $.ajax({
            url:'/interface/getCurrentBMS',
            type:'post',
            dataType:'JSON',
            success:function (result) {
                if(result.success){
                    var listData = result.data;

                    if(!listData.length){
                        $('.cus-esc-container-loading').text("暂无数据......");
                        return
                    }else {
                        $('.cus-esc-container-loading').text("正在加载......");
                    }
                    renderTemplate(listData.length);
                    $('.cus-esc-container-loading').hide();
                    $('.cus-esc-container').show();
                    $.each(listData,function (index,item) {
                        index +=1;
                        $.each(item,function (name,value) {
                            var $dom = $('#bms'+index+'_'+name);
                            //SOC
                            if(name === 'soc'){
                                if(value === '--'){
                                    $('#bms'+index+'_soc_per').css('height',0);
                                }else
                                    $('#bms'+index+'_soc_per').css('height',value);
                                $('#bms'+index+'_val_soc').text(value);
                            }
                            $dom.length && $dom.text(value);
                            //停机/开机/故障
                            if(name === 'bms_mode'){
                                $('#bms0'+index+' .psis-cdb').removeClass('on');
                                var statusArr = ['.psis-charge','.psis-discharge','.psis-break','.psis-standby'];

                                switch (Number(value)){
                                    case 50:$('#bms0'+index+' '+statusArr[2]).addClass('on');break;
                                    case 23:$('#bms0'+index+' '+statusArr[0]).addClass('on');break;
                                    case 13:$('#bms0'+index+' '+statusArr[1]).addClass('on');break;
                                    case 3:$('#bms0'+index+' '+statusArr[3]).addClass('on');break;
                                }
                            }
                            //生命信号
                            setStatueFunc({
                                name:name,
                                value:value,
                                index:index,
                                className:'.psis-signal',
                                setName:'bms_lifesignal'
                            });
                            //通讯
                            setStatueFunc({
                                name:name,
                                value:value,
                                index:index,
                                className:'.psis-comm',
                                setName:'connected'
                            });
                            //接触器
                            setStatueFunc({
                                name:name,
                                value:value,
                                index:index,
                                className:'.psis-contactor',
                                setName:'bms_relaystatus'
                            })
                        });
                    });
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
                console.log(e)
            }
        });
        function renderTemplate(len){
            var temp = '';
            for(var i=1; i< len+1; i++){
                temp += '<div class="cus-esc-box" id="bms0'+i+'">\n' +
                    '        <h2 class="ess-tit" id="bms'+i+'_device_name">BMS 0'+i+'</h2>\n' +
                    '        <input type="hidden" id="bms'+i+'_device_id" class="deviceBMSId" value="111">\n' +
                    '        <div class="ess-section clearfix">\n' +
                    '            <div class="psc-section-item psi-one">\n' +
                    '                <div class="bms-img">\n' +
                    '                    <div class="bms-img-status">\n' +
                    '                        <div class="mnf-img-val">\n' +
                    '                            <div class="mnf-img-per" id="bms'+i+'_soc_per"></div>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                    <div class="bms-img-txt">\n' +
                    '                        <p>SOC<span class="bms-value" id="bms'+i+'_soc">87%</span></p>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '                <div class="psi-status">\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p>生命信号 :<b class="psis-signal on"></b></p>\n' +
                    '                    </div>\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p>充电 :<b class="psis-icon psis-charge psis-cdb"></b></p>\n' +
                    '                    </div>\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p>放电 :<b class="psis-icon psis-discharge psis-cdb"></b></p>\n' +
                    '                    </div>\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p>通讯 :<b class="psis-icon psis-comm"></b></p>\n' +
                    '                    </div>\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p>接触器 :<b class="psis-icon psis-contactor"></b></p>\n' +
                    '                    </div>\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p>故障 :<b class="psis-icon psis-break psis-cdb on"></b></p>\n' +
                    '                    </div>\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p>待机 :<b class="psis-icon psis-standby psis-cdb"></b></p>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '            <div class="psc-section-item psi-two">\n' +
                    '                <div class="bms-details">\n' +
                    '                    <table>\n' +
                    '                        <tr>\n' +
                    '                            <td>单体最大电压(编号 <span id="bms'+i+'_num_cellvoltmax">052</span>)：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_volt_cellmax">3.247</span><!----></td>\n' +
                    '                            <td>SOH(电池健康度)：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_soh">1005</span><span class="bms-unit"></span></td>\n' +
                    '                        </tr>\n' +
                    '                        <tr>\n' +
                    '                            <td>单体最小电压(编号 <span id="bms'+i+'_num_cellvoltmin">052</span>)：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_volt_cellmin">3.232</span></td>\n' +
                    '                            <td>系统绝缘值：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_insulation_res">216</span></td>\n' +
                    '                        </tr>\n' +
                    '                        <tr>\n' +
                    '                            <td>单体平均电压：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_volt_cellavg">3.247</span></td>\n' +
                    '                            <td>系统当前充电电流上限：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_curr_chgLimit">12</span></td>\n' +
                    '                        </tr>\n' +
                    '                        <tr>\n' +
                    '                            <td>单体最高温度(编号 <span id="bms'+i+'_num_tempmax">052</span>)：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_temp_cellmax">36.4</span></td>\n' +
                    '                            <td>系统当前放电电流上限：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_curr_dchLimit">216</span></td>\n' +
                    '                        </tr>\n' +
                    '                        <tr>\n' +
                    '                            <td>单体最低温度(编号 <span id="bms'+i+'_num_tempmin">052</span>)：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_temp_cellmin">28.7</span></td>\n' +
                    '                            <td>系统当前充电功率上限：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_power_chgLimit">12</span></td>\n' +
                    '                        </tr>\n' +
                    '                        <tr>\n' +
                    '                            <td>单体平均温度：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_temp_cellmean">32.47</span></td>\n' +
                    '                            <td>系统当前放电功率上限：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_power_dchLimit">12</span></td>\n' +
                    '                        </tr>\n' +
                    '                        <tr>\n' +
                    '                            <td>母线电压：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_volt_bus">327</span></td>\n' +
                    '                            <td>系统最高允许充电电压：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_chg_packvoltmax_limit">12</span></td>\n' +
                    '                        </tr>\n' +
                    '                        <tr>\n' +
                    '                            <td>母线电流：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_curr_bus">23</span></td>\n' +
                    '                            <td>单体最高允许充电电压：</td>\n' +
                    '                            <td><span class="bms-value" id="bms'+i+'_chg_cellvoltmax_limit">12</span></td>\n' +
                    '                        </tr>\n' +
                    '                    </table>\n' +
                    '\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </div>'
            }
            $('#cus-esc-container').html(temp);
        }
    }
};