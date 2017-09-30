define(function(){
    return BMSHistory
});
var BMSHistory = {
    Render:function () {
        var _this = this;
        _this.tableFunc();
        _this.selectFunc();

        //导出
        $('#conformBtn').on('click',function () {
            param=$('#queryForm').getForm();
            param.vDoing = $('#prChooseFormatter .slider-on').text();
            $.post("/interface/isLogin",function (result) {
                if(result.success){
                    window.location.href="/interface/bmsExport?pcsName="+param.pcsName+"&timeStart="+param.timeStart+"&timeEnd="+param.timeEnd;
                }else {
                    App.alert(result.msg);
                }
            })

        });

        //查询
        $('#queryBtn').on('click',function(){
            $("#bms-table").bootstrapTable('refresh', {url:'/interface/bmsHisData'});
        })
    },
    selectFunc:function () {
        $.post("/interface/getDevList",{device_type:2},function (res) {
            console.log(res.data);
            var bmsTmp = res.data;
            var sppendDce = '<option value="">请选择</option>' + Mustache.render('{{#enumList}} <option value={{value}}>{{name}}</option> {{/enumList}}',bmsTmp);
            $('#bms-model').html(sppendDce);
        })
    },
    //表格数据
    tableFunc:function () {
        $('#bms-table').bootstrapTable({
            method:'POST',
            dataType:'json',
            cache: false,
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            url:'/interface/bmsHisData',
            responseHandler:function(res){
                //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                //在ajax后我们可以在这里进行一些事件的处理
                return res.data;
            },
            queryParams:function(params){
                params.offset = params.offset / params.limit+1;
                return JSON.stringify(Object.assign(params,$('#queryForm').getForm()));
            },
            onLoadSuccess:function(data){
                $(".fixed-table-body").mCustomScrollbar({
                    theme:"3d"
                });
            },
            striped:true,
            height: 619,
            width:$(window).width(),
            pagination:true,
            sortOrder:'desc',
            minimumCountColumns:2,
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            columns: [
                {
                    field: 'id',
                    visible:false
                }, {
                    field: 'bmsName',
                    title : 'BMS名称',
                    align : 'center',
                    valign : 'middle'
                }, {
                    field: 'time',
                    title : '时间',
                    align : 'center',
                    valign : 'middle',
                    width:"11%"
                },
                {
                    field : 'batteryVoltage',
                    title : '电池组系统电池电压(V)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'batteryBusVoltage',
                    title : '电池组系统母线电压(V)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'batteryBusCurrent',
                    title : '电池组系统母线电流(A)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'SOC',
                    title : '电池组系统SOC值',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'monomerMaxVoltage',
                    title : '单体最大电压(V)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'monomerMinVoltage',
                    title : '单体最小电压(V)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'monomeraverVoltage',
                    title : '单体平均电压(V)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'SOH',
                    title : '电池组系统SOH值',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'temp_cellmax',
                    title : '单体最高温度(℃)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'temp_cellmin',
                    title : '单体最低温度(℃)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'temp_cellaver',
                    title : '单体平均温度(℃)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'insulation_res',
                    title : '电池组系统绝缘值',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }]
        });
    }
};