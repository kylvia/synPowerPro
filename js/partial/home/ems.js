define(function(){
    return bottom
});
var bottom = {
    interval:'',
    repeat:true,
    Render:function () {
        var _this = this;
        if(_this.interval) clearInterval(_this.interval);
        this.getChargedCurveData();
        // _this.interval = setInterval(this.getChargedCurveData,30000);
        _this.interval = setInterval(function () {
            _this.repeat && _this.getChargedCurveData()
        },30000);
    },
    //echarts数据
    getChargedCurveData:function () {
        var _this = this;
        if (main.clearInterCharge(_this.interval, 'emsContain')) return;
        $.ajax({
            url: '/interface/getCurrentEMS',
            type: 'post',
            dataType: 'JSON',
            data: JSON.stringify({token: Cookies.getCook('token')}),
            success: function (result) {
                if (result.success) {

                    esKpi(result.data.currentCurve);
                } else {
                    console.log('error');
                    var isDialog = _this.repeat;
                    _this.repeat = false;
                    isDialog && App.alert(result.msg,function (e) {
                        _this.repeat = true;
                    });
                }
            },
            error: function (e) {
                console.log(e)
            }
        });
        /*$.ajax({
            url: '/test/emsTable',
            type: 'post',
            dataType: 'JSON',
            data: JSON.stringify({token: Cookies.getCook('token')}),
            success: function (result) {
                if (result.success) {
                    tableFunc(result.rows);
                } else {
                    App.alert(result.msg);
                }
            },
            error: function (e) {
                console.log(e)
            }
        })*/

        function esKpi(datas) {
            var getId = document.getElementById('emscurve');
            if (!getId) return;
            var esKpiChart = Echarts.init(getId);

            var xData = datas.time;
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        lineStyle: {
                            color: '#006699'
                        }
                    },
                    formatter: function (item) {
                        var str = '<div style="color: #a5e2f9">' + item[0].axisValue + '</div>';
                        for (var i = 0, len = item.length; i < len; i++) {
                            str += '<div style="color: #a5e2f9">' + item[i].seriesName + ': <span style="font-size: 1.3em">' + item[i].data + '</span>' + datas.unit + '</div>'
                        }
                        return str;
                    }

                },
                color: ['#00ae2e'],
                grid: {
                    top: '10%',
                    bottom: '15%',
                    left: '5%',
                    right: '3%'
                },
                xAxis: {
                    // name:'日',
                    boundaryGap: false,
                    type: 'category',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#272761'],
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#a5e2f9',
                            fontSize:16
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#1c4c88'
                        }
                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                    nameTextStyle: {
                        color: '#a5e2f9'
                    },
                    data: xData
                },
                yAxis: [{
                    name: datas.name + '(' + datas.unit + ')',
                    type: 'value',
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: ['#272761'],
                            type: 'dashed'
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#a5e2f9',
                            fontSize:16
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#1c4c88'
                        }
                    },
                    nameTextStyle: {
                        color: '#a5e2f9',
                        fontSize:16
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
                series: [{
                    name: datas.name,
                    type: 'line',
                    step: 'start',
                    data:  datas.value,
                    showSymbol: true,
                    symbol:'emptyCircle',
                    // symbolSize: 1,
                    areaStyle: {
                        normal: {
                            // shadowColor: 'rgba(0, 0, 0, 0.1)',
                            // shadowBlur: 10
                            opacity: 0.2
                        }
                    }
                }]
            };


            // 使用刚指定的配置项和数据显示图表。
            esKpiChart.setOption(option);
        }

        tableFunc();
        //表格数据
        function tableFunc() {
            $('#emsTable').bootstrapTable({
                method:'POST',
                dataType:'json',
                cache: false,
                sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
                url:'/interface/getCurrentEMS',
                responseHandler:function(res){
                    //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                    //在ajax后我们可以在这里进行一些事件的处理
                    console.log(res.data);
                    return res.data;
                },
                striped:true,
                // height: $(window).height() - 400,
                width:$(window).width(),
                pagination:false,
                minimumCountColumns:2,
                pageNumber:1,                       //初始化加载第一页，默认第一页
                pageSize: 10,                       //每页的记录行数（*）
                pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
                uniqueId: "id",                     //每一行的唯一标识，一般为主键列
                columns: [{
                        field: 'name',
                        title : '时间段名称',
                        align : 'center',
                        valign : 'middle'
                    },
                    {
                        field : 'start_time',
                        title : '起始时间',
                        align : 'center',
                        valign : 'middle'
                    }, {
                        field : 'stop_time',
                        title : '结束时间',
                        align : 'center',
                        valign : 'middle'
                    }, {
                        field : 'power_set',
                        title : '充放电电流(A)',
                        align : 'center',
                        valign : 'middle',
                        cellStyle:function(value){

                            if(value < 0)
                            return {
                                css: {
                                    "color": '#f5d862'
                                }
                            };
                            else if(value > 0)
                                return {
                                    css: {
                                        "color": '#028c2d'
                                    }
                                };
                            else
                                return {
                                    css: {
                                        "color": '#e6e6e6'
                                    }
                                }
                        }
                    }]
            });
        }
    }
};