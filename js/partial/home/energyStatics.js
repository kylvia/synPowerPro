define(function(){
    return energyStatics
});
var energyStatics = {
    interval:'',
    Render:function () {
        var _this = this;
        // this.getgetChargeTimesData();
        this.getDailyPowerStatisticsData();
        if(_this.interval) clearInterval(_this.interval);
        _this.interval = setInterval(_this.getDailyPowerStatisticsData ,30000);
    },
    //充放电次数
    getgetChargeTimesData:function () {
        var _this = this;
        if(main.clearInterCharge(_this.interval,'ps-interval'))return;
        $.ajax({
            url:'/interface/getChargeTimes',
            type:'post',
            dataType:'JSON',
            data:JSON.stringify({token:Cookies.getCook('token')}),
            success:function (result) {
                if(result.success){
                    $('#dailyChargeTimes').text(result.data.dailyChargeTimes);
                    $('#totalChargeTimes').text(result.data.totalChargeTimes);
                }else {
                    App.alert(result.msg);
                }
            },
            error:function (e) {
                console.log(e)
            }
        })
    },
    //echarts数据
    getDailyPowerStatisticsData:function () {
        var _this = this;
        if(main.clearInterCharge(_this.interval,'ps-interval'))return;
        $.ajax({
            url:'/interface/getRevenueBar',
            type:'post',
            dataType:'JSON',
            success:function (result) {
                if(result.success){
                    esKpi(result.data);

                }else {
                    App.alert(result.msg);
                }
            },
            error:function (e) {
                console.log(e)
            }
        });

        function esKpi(datas) {
            var getId = document.getElementById('esCcurPower');
            if(!getId)return;
            var esKpiChart = Echarts.init(getId);

            var xData = datas.date;
            var yData = datas.revenue;
            var cutColor = ['#009999'];
            var option = {
                tooltip:{
                    trigger:'axis',
                    axisPointer:{
                        lineStyle: {
                            color: '#006699'
                        }
                    },
                    formatter:'<div style="color: #a5e2f9">{b}日<br>收益: <span style="font-size: 1.3em">{c}</span>'+datas.unit+'</div>'
                },
                color:['#009999','#00ae2e'],
                legend: {
                    show: true,
                    top: '4%',
                    right: '3',
                    textStyle:{
                        color:'#a5e2f9'
                    },
                    selectedMode:false,
                    data:[{
                        name:'收益（元）'
                    },{
                        name:'均值（元）',
                        icon:'line'
                    }]
                },
                /* dataZoom: [{
                     dataZoomIndex: 1,
                     type: 'inside',
                     startValue: 10,
                     endValue: 80
                 }, {
                     show: true,
                     dataZoomIndex: 1,
                     type: 'slider',
                     y: '90%',
                     startValue: 10,
                     endValue: 80
                 }],*/
                xAxis: {
                    name:'日',
                    type: 'category',
                    splitLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        interval: 0,
                        textStyle:{
                            color:'#a5e2f9'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#133d70'
                        }
                    },
                    nameTextStyle:{
                        color:'#a5e2f9'
                    },
                    data: xData
                },
                grid: {
                    top:'25%',
                    bottom:'10%',
                    left: '12%'

                },
                yAxis: [{
                    name:datas.unit,
                    type: 'value',
                    splitLine:{
                        show:false
                    },
                    axisTick:{
                        show:true
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#a5e2f9'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#133d70'
                        }
                    },
                    nameTextStyle:{
                        color:'#a5e2f9'
                    }
                }],
                series: [
                    {
                        name:'收益（元）',
                        type:'bar',
                        barWidth: '40%',
                        barBorderRadius: 4,
                        itemStyle: {
                            normal: {

                                barBorderRadius: 4
                            }
                        },
                        data: yData,
                        markLine : {
                            label:{
                                normal:{
                                    show:true,
                                    position:'end',
                                    formatter:'{c}'
                                }
                            },
                            lineStyle:{
                                normal:{
                                    type: 'solid',
                                    color:'#00ae2e'
                                }
                            },
                            symbol:'none',
                            data : [
                                {type:'average'}
                            ]
                        }
                    },
                    {
                        name:'均值（元）',
                        type:'line',
                    }
                ]
            };
            // option.legend.data = ['收益','平均值'];
            // 使用刚指定的配置项和数据显示图表。
            esKpiChart.setOption(option);
        }
    },
};