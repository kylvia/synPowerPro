define(function(){
    return pcs
});
var pcs = {
    interval:'',
    cusWinContent:'',
    // cusWinRightContent:'',
    Render:function () {
        var _this = this;
        _this.isFirst = true;
        this.resize();
        _this.getListTable();
        if(_this.interval) clearInterval(_this.interval);
        _this.interval = setInterval(_this.getListTable,5000);

    },
    resize:function () {
        $('.cwc-col-arp').width('auto');
        if($('.cwc-col-ap').width() !== 0){
            $('.cwc-col-arp').width($('.cwc-col-ap').width() > $('.cwc-col-rp').width() ? $('.cwc-col-ap').width() + 10: $('.cwc-col-rp').width() + 10)
        }

    },
    //PCS列表页
    getListTable:function(){
        var _this = this;
        if(main.clearInterCharge(_this.interval,'cus-pcs-container'))return;
        function setStatueFunc(obj) {
            if(obj.name === obj.setName){
                $('#pcs0'+obj.index+' '+obj.className).removeClass('on');
                if(Number(obj.value)){
                    $('#pcs0'+obj.index+' '+obj.className).addClass('on');
                }
            }
        }
        $.ajax({
            url:'/interface/getCurrentPCS',
            type:'post',
            dataType:'JSON',
            success:function (result) {
                if(result.success){
                    var listData = result.data;
                    if(!listData.length){
                        $('.cus-pcs-container-loading').text("暂无数据......");
                        return
                    }else {
                        $('.cus-pcs-container-loading').text("正在加载......");
                    }
                    renderTemplate(listData.length);
                    $('.cus-pcs-container-loading').hide();
                    $('.cus-pcs-container').show();
                    $.each(listData,function (index,item) {
                        index +=1;
                        $.each(item,function (name,value) {
                            var $dom = $('#pcs'+index+'_'+name);
                            if($dom){
                                $dom.text(value);
                            }
                            //停机/开机/故障
                            if(name === 'sysstate1_0'){
                                var statusArr = ['.psis-stop','.psis-start','.psis-break'];
                                $('#pcs0'+index+' .psis-ssb').removeClass('on');
                                if(!value) return;
                                $('#pcs0'+index+' '+statusArr[Number(value)]).addClass('on');
                            }
                            //充放电状态
                            if(name === 'sysstate1_6'){
                                var statusArr = ['.pcs-charge','.pcs-discharge'];
                                $('#pcs0'+index+' .pcs-concharge').removeClass('on');
                                if(!value) return;
                                $('#pcs0'+index+' '+statusArr[Number(value)]).addClass('on');
                            }
                            //通讯
                            setStatueFunc({
                                name:name,
                                value:value,
                                index:index,
                                className:'.psis-connect',
                                setName:'connected'
                            });
                            //防雷器状态
                            setStatueFunc({
                                name:name,
                                value:value,
                                index:index,
                                className:'.pcs-las',
                                setName:'sysstate1_11'
                            });
                            //钥匙开关
                            setStatueFunc({
                                name:name,
                                value:value,
                                index:index,
                                className:'.pcs-keySwitch',
                                setName:'sysstate1_10'
                            });
                            //急停开关
                            setStatueFunc({
                                name:name,
                                value:value,
                                index:index,
                                className:'.pcs-ess',
                                setName:'sysstate1_9'
                            });
                            //接触器状态
                            setStatueFunc({
                                name:name,
                                value:value,
                                index:index,
                                className:'.pcs-cs',
                                setName:'sysstate1_8'
                            });
                            //交流断路器
                            setStatueFunc({
                                name:name,
                                value:value,
                                index:index,
                                className:'.pcs-acbr',
                                setName:'sysstate1_7'
                            });
                            //通讯
                            if(name === 'connected'){
                                $('#pcs0'+index+' .psis-connect').removeClass('on');
                                if(Number(value)){
                                    $('#pcs0'+index+' .psis-connect').addClass('on');
                                }
                            }
                            //设备id
                            if(name === 'device_id'){
                                $('#pcs0'+index+' .deviceUnId').val(value);
                            }
                        });
                    });
                }else {
                    App.alert(result.msg);
                }
            },
            error:function (e) {
                console.log(e)
            }
        });


        //页面模板
        function renderTemplate(len){
            var temp = '';
            _this.isFirst = false;
            for(var i=1; i< len+1; i++){
                temp += '<div class="cus-pcs-box" id="pcs0'+i+'">\n' +
                    '        <h2 class="pcs-tit" id="pcs'+i+'_device_name">PCS 01</h2>\n' +
                    '        <div class="pcs-section clearfix">\n' +
                    '            <div class="psc-section-item psi-one">\n' +
                    '                <img src="/images/plantstatus/PSC-da.png" alt="">\n' +
                    '                <div class="psi-status">\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p><b class="psis-icon psis-ssb psis-stop"></b></p>\n' +
                    '                        <p>停机</p>\n' +
                    '                    </div>\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p><b class="psis-icon psis-ssb psis-start" ></b></p>\n' +
                    '                        <p>开机</p>\n' +
                    '                    </div>\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p><b class="psis-icon psis-ssb psis-break"></b></p>\n' +
                    '                        <p >故障</p>\n' +
                    '                    </div>\n' +
                    '                    <div class="psi-status-item">\n' +
                    '                        <p><b class="psis-icon psis-connect on" ></b></p>\n' +
                    '                        <p>通讯</p>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '            <div class="psc-section-item psi-two">\n' +
                    '                <div class="pcs-center-status">\n' +
                    '                    <p class="pcsc-row"><span class="pcsc-column-tit">防雷器状态</span><b class="pcsc-column-icon pcs-las"></b></p>\n' +
                    '                    <p class="pcsc-row"><span class="pcsc-column-tit">钥匙开关</span><b class="pcsc-column-icon pcs-keySwitch"></b></p>\n' +
                    '                    <p class="pcsc-row"><span class="pcsc-column-tit">急停开关</span><b  class="pcsc-column-icon pcs-ess"></b></p>\n' +
                    '                    <p class="pcsc-row"><span class="pcsc-column-tit">接触器状态</span><b class="pcsc-column-icon pcs-cs"></b></p>\n' +
                    '                    <p class="pcsc-row"><span class="pcsc-column-tit">交流断路器</span><b class="pcsc-column-icon pcs-acbr"></b></p>\n' +
                    '                    <p class="pcsc-row"><span class="pcsc-column-tit">充电状态</span><b class="pcsc-column-icon pcs-charge pcs-concharge"></b></p>\n' +
                    '                    <p class="pcsc-row"><span class="pcsc-column-tit">放电状态</span><b class="pcsc-column-icon pcs-discharge pcs-concharge"></b></p>\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '            <div class="psc-section-item psi-thr">\n' +
                    '                <div class="pcs-details">\n' +
                    '                    <div><label>A相电压：</label><span class="pcsd-val" id="pcs'+i+'_uina_rms">0.00</span></div>\n' +
                    '                    <div><label>电网频率：</label><span class="pcsd-val" id="pcs'+i+'_frequency">0.00</span></div>\n' +
                    '                    <div><label>A相IGBT温度：</label><span class="pcsd-val" id="pcs'+i+'_igbt_tempa0_ever">0.00</span></div>\n' +
                    '                    <div><label>B相电压：</label><span class="pcsd-val" id="pcs'+i+'_uinb_rms">0.00</span></div>\n' +
                    '                    <div><label>有功功率：</label><span class="pcsd-val" id="pcs'+i+'_activepower">0.00</span></div>\n' +
                    '                    <div><label>B相IGBT温度：</label><span class="pcsd-val" id="pcs'+i+'_igbt_tempb0_ever">0.00</span></div>\n' +
                    '\n' +
                    '                    <div><label>C相电压：</label><span class="pcsd-val" id="pcs'+i+'_uinc_rms">0.00</span></div>\n' +
                    '                    <div><label>无功功率：</label><span class="pcsd-val" id="pcs'+i+'_reactivepower">0.00</span></div>\n' +
                    '                    <div><label>C相IGBT温度：</label><span class="pcsd-val" id="pcs'+i+'_igbt_tempc0_ever">0.00</span></div>\n' +
                    '\n' +
                    '                    <div><label>A相电流：</label><span class="pcsd-val" id="pcs'+i+'_iina_rms">0.00</span></div>\n' +
                    '                    <div><label>直流电压：</label><span class="pcsd-val" id="pcs'+i+'_ubtra_ever">0.00</span></div>\n' +
                    '                    <div></div>\n' +
                    '                    <div><label>B相电流：</label><span class="pcsd-val" id="pcs'+i+'_iinb_rms">0.00</span></div>\n' +
                    '                    <div><label>直流电流：</label><span class="pcsd-val" id="pcs'+i+'_ibtra_ever">0.00</span></div>\n' +
                    '                    <div></div>\n' +
                    '                    <div><label>C相电流：</label><span class="pcsd-val" id="pcs'+i+'_iinc_rms">0.00</span></div>\n' +
                    '                    <div><label>直流功率：</label><span class="pcsd-val" id="pcs'+i+'_pbtra">0.00</span></div>\n' +
                    '                    <div></div>\n' +
                    '                </div>\n' +
                    '                <div class="pcs-setting">\n' +
                    '                    <input type="hidden" class="deviceUnId" value="111">\n' +
                    '                    <div class="pcs-right">控制权限：<span id="pcs'+i+'_sysstate1_4">EMS正在控制</span></div>\n' +
                    '                    <div class="pcs-running">运行模式：<span id="pcs'+i+'_sysstate1_13">电池维护模式</span></div>\n' +
                    '                    <div class="pcs-remotecontrol"><a class="cus-img-btn" onclick="pcs.getRight(this)">遥控及设定</a></div>\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </div>'
            }
            $('#cus-pcs-container').html(temp);
        }
    },
    pcsRcSetting:function (deviceId) {
        var _this = this;
        !_this.cusWinContent?_this.cusWinContent = $('#cus-win-content').detach():_this.cusWinContent;
        var winContent = '\n' +
            '<!--控制权限配置 end-->\n' +
            '<div class="cus-win-pcscontent" id="cus-win-content">\n' +
            '    <input type="hidden" class="getDeviceUnId">\n' +
            '    <div class="cus-win-highLight">\n' +
            '        <div class="cwh-setrange cwh-setting">\n' +
            '            <label>设置范围:</label>\n' +
            '            <div class="checkboxContainer"><input class="inputCheck" id="aiAl" type="checkbox"><label class="inputCheckBox" for="aiAl"></label><span>只对当前设备生效</span></div>\n' +
            '            <div class="checkboxContainer">（默认对所有设备生效）</div>\n' +
            '        </div>\n' +
            '        <div class="cwh-dcc cwh-setting">\n' +
            '            <label>直流能量调控器控制权限</label>\n' +
            '            <select name="" id="pcs-dCEnergy" onchange="pcs.setAvpExcute(this.value)">\n' +
            '                <option value=""></option>\n' +
            '            </select>\n' +
            '            <a class="cus-img-btn ceh-excut" onclick="pcs.dceExcute()">执行</a>\n' +
            '        </div>\n' +
            '        <div class="cwh-runmodel cwh-setting">\n' +
            '            <label>运行模式设置</label>\n' +
            '            <select name="" id="pcs-runningModel">\n' +
            '                <option value=""></option>\n' +
            '            </select>\n' +
            '            <a onclick="pcs.rnExcute()" class="cus-img-btn ceh-excut">执行</a>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <div class="cus-win-condition">\n' +
            '        <div class="cus-win-mark"></div>\n' +
            '        <div class="cwc-content">\n' +
            '            <h2> 充放电策略使能（EMS控制模式下生效）</h2>\n' +
            '            <!--<div class="cwc-one">\n' +
            '                <div class="cwc-col cwc-col-one cwc-col-ap cwc-col-arp">\n' +
            '                    当前有功<span id="curAp" class="cwc-val">0</span><span class="cwc-unit curAvpUnit">kVar</span>\n' +
            '                </div>\n' +
            '                <div class="cwc-col cwc-col-two">\n' +
            '                    <label for="">设定值：<input class="pcs-input-clear" id="pcs-apVal" type="text"></label></label>kW\n' +
            '                </div>\n' +
            '                <a class="cus-img-btn ceh-excut" onclick="pcs.apExcute()">执行</a>\n' +
            '            </div>\n' +
            '            <div class="cwc-sec">\n' +
            '                <div class="cwc-col cwc-col-one cwc-col-rp cwc-col-arp">\n' +
            '                    当前无功<span id="curRp" class="cwc-val">0</span><span class="cwc-unit curAvpUnit">kVar</span>\n' +
            '                </div>\n' +
            '                <div class="cwc-col cwc-col-two">\n' +
            '                    <label for="">设定值：<input class="pcs-input-clear" id="pcs-rpVal" type="text"></label></label>kW\n' +
            '                </div>\n' +
            '                <a class="cus-img-btn ceh-excut" onclick="pcs.rpExcute()">执行</a>\n' +
            '            </div>-->\n' +
            '            <div>\n' +
            '                <div class="cwc-enable cwc-select">\n' +
            '                    <label>充放电策略使能</label>\n' +
            '                    <select name="" id="pcs-enable">\n' +
            '                        <option value=""></option>\n' +
            '                    </select>\n' +
            '                    <a class="cus-img-btn ceh-excut" onclick="pcs.enableExcute()">执行</a>\n' +
            '                </div>\n' +
            '                <div class="cwc-enable-content">\n' +
            '                    <form id="setTimeLine">\n' +
            '                    <table id="pcs-timetable" class="pcs-timetable">\n' +
            '                        <thead>\n' +
            '                        <tr><td>时间段名称</td><td>起始时间</td><td>结束时间</td><td>充放电电流(A)</td></tr>\n' +
            '                        </thead>\n' +
            '                        <tbody>\n' +
            '                        <tr>\n' +
            '                            <td>时间段1</td>\n' +
            '                            <td>\n' +
            '                                <input type="text" name="start_time1" class="Wdate" id="pcsdtime1" onclick="WdatePicker({dateFmt:\'H:mm\',readOnly:true})"/>\n' +
            '                            </td>\n' +
            '                            <td>\n' +
            '                                <input type="text" class="Wdate" name="stop_time1" id="pcsdtime11" onclick="WdatePicker({dateFmt:\'H:mm\',readOnly:true})"/>\n' +
            '                            </td>\n' +
            '                            <td><input type="text" name="power_set1" class="cus-table-input" id="chargeA1"></td>\n' +
            '                        </tr>\n' +
            '                        <tr>\n' +
            '                            <td>时间段2</td>\n' +
            '                            <td>\n' +
            '                                <input type="text" class="Wdate" name="start_time2" id="pcsdtime2" onclick="WdatePicker({dateFmt:\'H:mm\',readOnly:true})"/>\n' +
            '                            </td>\n' +
            '                            <td>\n' +
            '                                <input type="text" class="Wdate" name="stop_time2" id="pcsdtime21" onclick="WdatePicker({dateFmt:\'H:mm\',readOnly:true})"/>\n' +
            '                            </td>\n' +
            '                            <td><input type="text" name="power_set2" class="cus-table-input" id="chargeA2"></td>\n' +
            '                        </tr>\n' +
            '                        <tr>\n' +
            '                            <td>时间段3</td>\n' +
            '                            <td>\n' +
            '                                <input type="text" class="Wdate" name="start_time3" id="pcsdtime3" onclick="WdatePicker({dateFmt:\'H:mm\',readOnly:true})"/>\n' +
            '                            </td>\n' +
            '                            <td>\n' +
            '                                <input type="text" class="Wdate" name="stop_time3" id="pcsdtime31" onclick="WdatePicker({dateFmt:\'H:mm\',readOnly:true})"/>\n' +
            '                            </td>\n' +
            '                            <td><input type="text" name="power_set3" class="cus-table-input" id="chargeA3"></td>\n' +
            '                        </tr>\n' +
            '                        <tr>\n' +
            '                            <td>时间段4</td>\n' +
            '                            <td>\n' +
            '                                <input type="text" class="Wdate" name="start_time4" id="pcsdtime4" onclick="WdatePicker({dateFmt:\'H:mm\',readOnly:true})"/>\n' +
            '                            </td>\n' +
            '                            <td>\n' +
            '                                <input type="text" class="Wdate" name="stop_time4" id="pcsdtime41" onclick="WdatePicker({dateFmt:\'H:mm\',readOnly:true})"/>\n' +
            '                            </td>\n' +
            '                            <td><input type="text" name="power_set4" class="cus-table-input" id="chargeA4"></td>\n' +
            '                        </tr>\n' +
            '                        </tbody>\n' +
            '                    </table>\n' +
            '                    </form>\n' +
            '                    <div class="cwc-tit">设置说明：充电电流充电为负，放电为正</div>\n' +
            '                    <a class="cus-img-btn ceh-excut" onclick="pcs.timeLineExcute()">执行</a>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>';
            App.dialog({
            title: "遥控及设定",
            width: 650,
            height: 520,
            // backdrop: 'static',
            content: winContent,
            openEvent:_this.dialogFunc(deviceId),
            buttons: [{text:'开机',id:'startupExcute',type:'cus-img-btn cus-ib-start clickOpr'},
                {text:'关机',id:'shutdownExcute',type:'cus-img-btn cus-ib-shutdown clickOpr'},
                {text:'急停',id:'immExcute',type:'cus-img-btn cus-ib-imstop clickOpr'}]
        });

        //点击checkbox名字选中
        $('.checkboxContainer span').on('click',function () {
            console.log(111);
            $(this).siblings("label").click();
        });

        $('#aiAl').checked = false;

        $('.cus-win-mark').height('100%');
        $('.cwc-val').val(0);

        $('.getDeviceUnId').val(deviceId);

        $('#pcs-runningModel option').on('click',function () {
            pcs.rnExcute()
        });

        $('.clickOpr').on('click',function () {
            var val = $(this).text();
            var data = {
                "token": Cookies.getCook('token'),
                "device_id": $('.getDeviceUnId').val(),
                "setRange": $('#aiAl').is(':checked') ? 0 : 1 ,
                "action": ['关机','开机','急停'].indexOf(val)
            };
            _this.pcsAjax('/interface/startOrTurnOff',JSON.stringify(data));
        })
    },
    //权限校验
    getRight:function (dom) {
        var _this = this;
        var deviceId = $(dom).parents('.pcs-setting').find('.deviceUnId').val();
        /*!_this.cusWinRightContent?_this.cusWinRightContent = $('#rightControl').detach():_this.cusWinRightContent;
        if($('#rightControl').length){
            $('#rightControl').eq(0).remove();
        }*/

        var cusWinRightContent = '\n' +
            '<!--控制权限配置-->\n' +
            '<div id="rightControl" class="pcs-userValidate">\n' +
            '    <form id="validateUserForm">\n' +
            '        <input type="hidden" name="deviceUnId" class="getDeviceUnId">\n' +
            '        <div class="rc-user">\n' +
            '            <label for="rightUser">账户：</label>\n' +
            '            <input autocomplete="off" type="text" id="rightUser" name="rightUser">\n' +
            '        </div>\n' +
            '        <div class="rc-user">\n' +
            '            <label for="rightPwd">密码：</label>\n' +
            '            <input autocomplete="new-password" type="password" id="rightPwd" name="rightPwd">\n' +
            '        </div>\n' +
            '    </form>\n' +
            '</div>';
        var getRightWin = App.dialog({
            title: "控制权限校验",
            width: 400,
            height: 110,
            content: cusWinRightContent,
            buttons: [{text:'确认',id:'rightAccess',type:'cus-img-btn cus-ib-confirm'},
                {text:'取消',type:'cus-img-btn cus-ib-cancel',clickToClose :true}]
        });
        $('#rightUser').val('');
        $('#rightPwd').val('');
        $('#rightAccess').on('click',function () {
            _this.rightValidFunc(deviceId,getRightWin)
        })

    },
    rightValidFunc:function (deviceId,getRightWin) {
        var _this = this;
        if($('#rightControl').length>1){
            $('#rightControl').eq(0).remove();
        }
        $('.getDeviceUnId').val(deviceId);
        if(!$.trim($('#rightUser').val())){
            App.alert('请输入账户名');
            return;
        }
        if(!$.trim($('#rightPwd').val())){
            App.alert('请输入密码');
            return;
        }
        var queryData = $("#validateUserForm").getForm();
        queryData.rightPwd = hex_md5(queryData.rightPwd);
        queryData.rightsId = 2;
        $.ajax({
            url:'/interface/checkUserRights',
            type:'post',
            dataType:'JSON',
            data:queryData,
            success:function (result) {
                if(result.success){
                    $(".modal").modal("hide");
                    _this.pcsRcSetting(deviceId);
                }else {
                    App.alert(result.msg);
                }
            },
            error:function (e) {
                console.log(e)
            }
        })
    },
    //下拉设置
    dialogFunc:function (deviceId) {
        require(['./main/enumeration'],function (Enumeration) {
            var dceTmp = Enumeration.DCEnergy;
            var rmTmp = Enumeration.RunningModel;
            var enTmp = Enumeration.tXFTGEn;
            var sppendDce = Mustache.render('{{#enum}} <option value={{value}}>{{name}}</option> {{/enum}}',dceTmp);
            $('#pcs-dCEnergy').html(sppendDce);
            var runningModel = Mustache.render('{{#enum}} <option value={{value}}>{{name}}</option> {{/enum}}',rmTmp);
            $('#pcs-runningModel').html(runningModel);
            var enModel = Mustache.render('{{#enum}} <option value={{value}}>{{name}}</option> {{/enum}}',enTmp);
            $('#pcs-enable').html(enModel);


            $.ajax({
                url:'/interface/getCurrentSet',
                type:'post',
                dataType:'JSON',
                data:{device_id:$('.getDeviceUnId').val()},
                success:function (result) {
                    if(result.success){
                        var data = result.data;
                        $('#pcs-dCEnergy').length && $('#pcs-dCEnergy').val(data.controlAuthority);
                        //EMS控制
                        if(Number(data.controlAuthority) === 0){
                            $('.cus-win-mark').height(0);
                            /*var data = {
                                "token": Cookies.getCook('token'),
                                "device_id": $('.getDeviceUnId').val()
                            }
                            this.pcsAjax('interface/getSingleDevicePower',JSON.stringify(data),setAvpFunc);*/
                        }

                        $('#pcs-runningModel').length && $('#pcs-runningModel').val(data.runningMode);
                        $('#pcs-enable').length && $('#pcs-enable').val(data.xftg_en);

                        var tableVals = [];
                        data.value1 && tableVals.push(data.value1);
                        data.value2 && tableVals.push(data.value2);
                        data.value3 && tableVals.push(data.value3);
                        data.value4 && tableVals.push(data.value4);
                        var $findTr = $('#pcs-timetable tbody tr');
                        $.each(tableVals,function (index,item) {
                            for(var i in item){
                                $($findTr[index]).find("[name=" + i + "]").length && $($findTr[index]).find("[name=" + i + "]").val(item[i]);
                            }
                        })
                    }else {
                        App.alert(result.msg);
                    }
                },
                error:function (e) {
                    console.log(e)
                }
            });
        })


    },
    //运行模式设置
    rnExcute:function () {
            var data = {
                "token": Cookies.getCook('token'),
                "device_id": $('.getDeviceUnId').val(),
                "setRange": $('#aiAl').is(':checked') ? 0 : 1 ,
                "action": $('#pcs-runningModel').val()
            };
            this.pcsAjax('interface/setRunningMode',JSON.stringify(data));

    },

    //运行模式设置
    setAvpExcute:function (val) {

        var _this = this;
        $('.cus-win-mark').height('100%');
        $('.pcs-input-clear').val('');
        function setAvpFunc(data) {
            $('#curAp').text(data.activepower);
            $('#curRp').text(data.reactivepower);
            $('.curAvpUnit').text(data.unit);

            _this.resize();
        }
        //EMS控制
        if(Number(val) === 0){
            $('.cus-win-mark').height(0);
            var data = {
                "token": Cookies.getCook('token'),
                "setRange": $('#aiAl').is(':checked') ? 0 : 1 ,
                "device_id": $('.getDeviceUnId').val()
            }
            // this.pcsAjax('interface/getSingleDevicePower',JSON.stringify(data),setAvpFunc);
        }

    },
    //直流能量调控器控制权限
    dceExcute:function () {
        var data = {
            "token": Cookies.getCook('token'),
            "device_id": $('.getDeviceUnId').val(),
            "setRange": $('#aiAl').is(':checked') ? 0 : 1 ,
            "action": $('#pcs-dCEnergy').val()
        };
        this.pcsAjax('/interface/setControlAuthority',JSON.stringify(data));
    },
    //设置有功
    apExcute:function () {
        var reg = /\d/;
        if(!reg.test($('#pcs-apVal').val())){
            App.alert("请输入数字");
            $('#pcs-apVal').val('');
            return;
        }
        var data = {
            "token": Cookies.getCook('token'),
            "device_id": $('.getDeviceUnId').val(),
            "setRange": $('#aiAl').is(':checked') ? 0 : 1 ,
            "activepower": $('#pcs-apVal').val()
        };
        this.pcsAjax('/interface/setActivePower',JSON.stringify(data));
    },
    //设置无功
    rpExcute:function () {
        var data = {
            "device_id": $('.getDeviceUnId').val(),
            "setRange": $('#aiAl').is(':checked') ? 0 : 1 ,
            "reactivepower": $('#pcs-rpVal').val()
        };
        this.pcsAjax('/interface/setReactivePower',JSON.stringify(data));
    },
    //设置使能
    enableExcute:function () {
        var data = {
            "device_id": $('.getDeviceUnId').val(),
            "setRange": $('#aiAl').is(':checked') ? 0 : 1 ,
            "action": $('#pcs-enable').val()
        };
        this.pcsAjax('/interface/setXFTG_en',JSON.stringify(data));
    },
    //时间段设置
    timeLineExcute:function () {

        debugger;
        var reg = /^[-]?\d+(\.\d+)?$/;
        if(!reg.test($('.cus-table-input').val())){
            App.alert("【充放电电流】栏应输入数字");
            // $(this).val('');
            return;
        }

        var $tableTr = $('#pcs-timetable tbody tr');
        var data = {
            "setRange": $('#aiAl').is(':checked') ? 0 : 1 ,
            "device_id": $('.getDeviceUnId').val()
          /*  value1:$($tableTr[0]).getForm(),
            value2:$($tableTr[1]).getForm(),
            value3:$($tableTr[2]).getForm(),
            value4:$($tableTr[3]).getForm()*/
        };
        // console.log('[setTimeLine]',$('#setTimeLine').serializeArray());
        console.log($('#aiAl').is(':checked'));
        this.pcsAjax('/interface/setChargeTime',JSON.stringify(Object.assign(data,$($tableTr[0]).getForm(),$($tableTr[1]).getForm(),$($tableTr[2]).getForm(),$($tableTr[3]).getForm())));
    },
    bottomoprExcute:function (params) {
        if(!params)return;

        $.each(params,function (item,index) {
            $('#'+item.id).on('click',function () {
                var data = {
                    "token": Cookies.getCook('token'),
                    "device_id": $('.getDeviceUnId').val(),
                    "setRange": $('#aiAl').is(':checked') ? 0 : 1 ,
                    "action": item.action
                };
                this.pcsAjax('interface/startOrTurnOff',JSON.stringify(data));
            })
        })


    },
    shutdownExcute:function () {
        this.pcsAjax();
    },

    pcsAjax:function (url,param,callback) {
        $.ajax({
            url:url,
            type:'post',
            dataType:'JSON',
            data:param,
            success:function (result) {
                if(result.success){

                    if(callback){
                        // callback.call();
                        callback(result.data);
                    }else {
                    	var msg="";
                    	var msgOne="";
                    	var lenOne = 0;
                    	var dataLen = result.data.length;
                    	for(var i = 0;i < dataLen; i++) {
                            msgOne= '【'+result.data[i].device_name+'】于【'+result.data[i].time+'】，'+result.data[i].msg;
                            (msgOne.getBLen() > lenOne) && (lenOne = msgOne.getBLen());
                            console.log(lenOne);
                    		 msg+= msgOne+"<br>";
                    		}
                        App.dialog({
                            title: "控制权限校验",
                            width: lenOne * 8,
                            height: dataLen * 30,
                            content: msg,
                            buttons: [{text:'确认',id:'rightAccess',type:'cus-img-btn cus-ib-start',clickToClose :true}]
                        });
                    }
                }else {
                    App.alert(result.msg);
                }
            },
            error:function (e) {
                console.log(e)
            }
        });
    }

};