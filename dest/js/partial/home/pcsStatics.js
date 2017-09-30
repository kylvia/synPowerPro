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
            url:'/interface/getChargedBar',
            type:'post',
            dataType:'JSON',
            data:JSON.stringify({token:Cookies.getCook('token')}),
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
        })

        function esKpi(datas) {

            var getId = document.getElementById('cPower');
            if(!getId)return;
            var esKpiChart = Echarts.init(getId);

            var xData = datas.date;
            var option = {
                tooltip:{
                    trigger:'axis',
                    axisPointer:{
                        lineStyle: {
                            color: '#006699'
                        }
                    },
                    formatter:function(item){
                        var str = '<div style="color: #a5e2f9">'+item[0].axisValue+'日</div>';
                        for(var i = 0 ,len= item.length; i<len ;i++){
                            str +=  '<div style="color: #a5e2f9">'+item[i].seriesName+': <span style="font-size: 1.3em">'+item[i].data+'</span>'+datas.unit+'</div>'
                        }
                        return str;
                    }

                },
                color:['#33CC66','#006699'],
                legend: {
                    top: '4%',
                    right: '20',
                    itemGap: 20,
                    textStyle:{
                        color:'#a5e2f9'
                    },
                    data:''
                },
                xAxis: {
                    name:'日',
                    type: 'category',
                    splitLine:{
                        show:false
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
                /*dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 30,
                        end: 80,
                        borderColor:'rgba(17,58,106, 1)',
                        backgroundColor:'rgba(5,30,64, .9)',
                        fillerColor:'rgba(5,30,64, 0.5)',
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
                ],*/
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
                    type:'bar',
                    barWidth: '26%',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 3
                        }
                    },
                    data: powers[i].value
                });
            }
            option.legend.data = legendData;
            // 使用刚指定的配置项和数据显示图表。
            esKpiChart.setOption(option);
        }
    }
}