define(function(){
    return plantRunning
});
var plantRunning = {
    Render:function () {
        var _this = this;
        _this.datePicker();
        // require([''])
        _this.tableFunc();

        //导出
        $('#conformBtn').on('click',function () {
            param=$('#queryForm').getForm();
            param.vDoing = $('#prChooseFormatter .slider-on').text();
            // $.post("/interface/runningReportExport",JSON.stringify(param),function (res) {})

            $.post("/interface/isLogin",function (result) {
                if(result.success){
                    window.location.href="/interface/runningReportExport?vDoing="+param.vDoing+"&timeStart="+param.timeStart+"&timeEnd="+param.timeEnd;
                }else {
                    App.alert(result.msg);
                }
            })
        });

        //查询
        $('#queryBtn').on('click',function(){
            $("#rm-table").bootstrapTable('refresh', {url:'/interface/runningReport'});
        })
    },
    //日历控件
    datePicker:function () {
        $('.slider-item').on('click',function () {
            $('.slider-item').removeClass('slider-on');
            $(this).addClass('slider-on');
            var formatterVal;
            $('#prd4311,#prd4312').val('');
            $(this).text() === '日' ? formatterVal = 'yyyy-MM-dd': formatterVal = 'yyyy-MM';
            $('#prd4311').unbind().on('click',function () {
                WdatePicker({maxDate:'#F{$dp.$D(\'prd4312\');}',readOnly:true,dateFmt:formatterVal})
            });
            $('#prd4312').unbind().on('click',function () {
                WdatePicker({minDate:'#F{$dp.$D(\'prd4311\');}',readOnly:true,dateFmt:formatterVal})
            });
            $('#queryBtn').click();
        });
        $('.slider-item').eq(1).click();
    },
    //表格数据
    tableFunc:function () {
        $('#rm-table').bootstrapTable({
            method:'POST',
            dataType:'json',
            cache: false,
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            url:'/interface/runningReport',
            responseHandler:function(res){
                //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                //在ajax后我们可以在这里进行一些事件的处理
                return res.data;
            },
            queryParams:function(params){
                params.offset = params.offset/params.limit + 1;
                /*var query = {
                    pageInfo : params,
                    param : $('#queryForm').getForm()
                };
                query.param.vDoing = $('#prChooseFormatter .slider-on').text();
                console.log(query);
                return query*/
                param=$('#queryForm').getForm();
                param.vDoing = $('#prChooseFormatter .slider-on').text();
                return JSON.stringify(Object.assign(params,param));
            },
            sortName: 'time',
            striped:true,
            height: 616,
            // maxHeight: 619,
            width:$(window).width(),
            pagination:true,
            sortOrder:'desc',
            minimumCountColumns:2,
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showExport: true,  //是否显示导出按钮
            buttonsAlign:"right",  //按钮位置
            exportTypes:['excel'],  //导出文件类型
            Icons:'glyphicon-export',
            onLoadSuccess: function (data) {
                var ind = this.pageSize/5;
                for(var i = 0; i < ind; i++){
                    $('#rm-table').bootstrapTable('mergeCells', {index: i*5, field: 'time', rowspan: 5});
                }
                $(".fixed-table-body").mCustomScrollbar({
                    theme:"3d"
                });

            },
            rowStyle:function (row,index) {
                if(row.timePeriod === '当日总计'){
                    return {
                        css: {'background-color': 'rgba(1, 30, 66, 0.5)'}
                    }
                }else {
                    return {
                        css: {'background-color': 'background-color: rgba(1, 30, 66, 0.1);'}
                    }
                }

            },
            columns: [
                {
                    field: 'id',
                    visible:false
                }, {
                    field: 'time',
                    title : '时间',
                    sortable: true,
                    align : 'center',
                    valign : 'middle'
                },
                {
                    field : 'timePeriod',
                    title : '时段',
                    align : 'center',
                    valign : 'middle'
                }, {
                    field : 'price',
                    title : '电价(元/kWh)',
                    align : 'center',
                    valign : 'middle'
                }, {
                    field : 'inputCapacity',
                    title : '充电量(kWh)',
                    align : 'center',
                    valign : 'middle'
                }, {
                    field : 'outputCapacity',
                    title : '放电量(kWh)',
                    align : 'center',
                    valign : 'middle'
                }, {
                    field : 'icPrice',
                    title : '充电电费(元)',
                    align : 'center',
                    valign : 'middle'
                }, {
                    field : 'ocPrice',
                    title : '放电电费(元)',
                    align : 'center',
                    valign : 'middle'
                }, {
                    field : 'esBenefits',
                    title : '储能收益',
                    align : 'center',
                    valign : 'middle'
                }, {
                    field : 'efficiency',
                    title : '充放电效率',
                    align : 'center',
                    valign : 'middle'
                }]
        });
    }
};