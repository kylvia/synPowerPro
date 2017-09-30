/*充放电、电网、用电功率*/
define(function(){
    return energyStatics
});
var energyStatics = {
    interval:'',
    Render:function () {
        var _this = this;
        _this.getChargedCurveData();
        if(_this.interval) clearInterval(_this.interval);
        _this.interval = setInterval(_this.getChargedCurveData,30000);
    },
    //echarts数据
    getChargedCurveData:function () {
        var _this = this;
        if(main.clearInterCharge(_this.interval,'ps-interval'))return;
        $.ajax({
            url:'/interface/getPowerCurve',
            type:'post',
            dataType:'JSON',
            data:JSON.stringify({token:Cookies.getCook('token')}),
            success:function (result) {
                if(result.success){
                    esKpi(result.data);
                }else {
                    App.alert(result.msg);
                    console.log(result.msg);
                }
            },
            error:function (e) {
                console.log(e)
            }
        });

        function esKpi(datas) {

            var getId = document.getElementById('cPowerCurve');
            if(!getId)return;
            var esKpiChart = Echarts.init(getId);

            var xData = datas.time;
            var option = {
                tooltip:{
                    trigger:'axis',
                    axisPointer:{
                        lineStyle: {
                            color: '#006699'
                        }
                    },
                    formatter:function(item){
                        var str = '<div style="color: #a5e2f9">'+item[0].axisValue+'</div>';
                        for(var i = 0 ,len= item.length; i<len ;i++){
                            str +=  '<div style="color: #a5e2f9">'+item[i].seriesName+': <span style="font-size: 1.3em">'+item[i].data+'</span>'+datas.unit+'</div>'
                        }
                        return str;
                    }

                },
                color:['RGB(4,138,48)','RGB(3,100,201)','RGB(192,114,49)'],
                legend: {
                    right: '20',
                    itemGap: 40,
                    icon: 'line',
                    textStyle:{
                        color:'#a5e2f9',
                        fontsize:12
                    },
                    top:'5%',
                    left:'35%',
                    data:''
                },
                grid: {
                    top:'20%',
                    bottom:'20%',
                    left: '6.8%',
                    right: '6.8%'
                },
                xAxis: {
                    // name:'日',
                    boundaryGap: false,
                    type: 'category',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color: ['#272761'],
                            type: 'dashed'
                        }
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#a5e2f9'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#1c4c88'
                        }
                    },
                    axisTick:{
                        alignWithLabel:true
                    },
                    nameTextStyle:{
                        color:'#a5e2f9'
                    },
                    data: xData
                },
                yAxis: [{
                    name:'('+datas.unit+')',
                    type: 'value',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color: ['#272761'],
                            type: 'dashed'
                        }
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#a5e2f9'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#1c4c88'
                        }
                    },
                    nameTextStyle:{
                        color:'#a5e2f9'
                    }
                }],

                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: 100,
                        borderColor:'rgba(17,58,106, .6)',
                        backgroundColor:'rgba(5,30,64, .9)',
                        fillerColor:'rgba(5,30,64, 0.1)',
                        // dataBackground:'rgba(1,39,84, 0.35)',
                        handleStyle:{
                            color:'rgba(0,101,153, 0.35)',
                            borderColor:'rgba(0,101,153, 0.35)',
                        },
                        textStyle:{
                            color:'rgba(165, 226, 249)'
                        }
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0],
                        start: 1,
                        end: 35
                    }
                ],
                series: []
            };


            var legendData = [];
            var powers = datas.power;
            var yDatas = [];
            for(var i = 0 ,len = powers.length;i<len;i++){
                legendData.push(powers[i].name);
                yDatas[i] = powers[i].value;
                option.series.push({
                    name:powers[i].name,
                    type:'line',
                    data: powers[i].value,
                    showSymbol: false,
                    symbolSize: 1,
                    areaStyle: {
                        normal: {
                            // shadowColor: 'rgba(0, 0, 0, 0.1)',
                            // shadowBlur: 10
                            opacity:0.4
                        }
                    }
                });
            }
            option.legend.data = legendData;
            // 使用刚指定的配置项和数据显示图表。
            esKpiChart.setOption(option);
        }
    }
};