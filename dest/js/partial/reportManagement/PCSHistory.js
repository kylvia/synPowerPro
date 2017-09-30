define(function(){
    return PCSHistory
});
var PCSHistory = {
    Render:function () {
        var _this = this;
        _this.tableFunc();
        _this.selectFunc();

        //查询
        $('#queryBtn').on('click',function(){
            $("#pcs-table").bootstrapTable('refresh', {url:'/interface/pcsHisData'});
        });

        //导出
        $('#conformBtn').on('click',function () {
            param=$('#queryForm').getForm();
            param.vDoing = $('#prChooseFormatter .slider-on').text();
            // $.post("/interface/runningReportExport",JSON.stringify(param),function (res) {})

            $.post("/interface/isLogin",function (result) {
                if(result.success){
                    window.location.href="/interface/pcsExport?pcsName="+param.pcsName+"&timeStart="+param.timeStart+"&timeEnd="+param.timeEnd;
                }else {
                    App.alert(result.msg);
                }
            })

        });
    },
    selectFunc:function () {
        /*require(['./main/enumeration'],function (Enumeration) {
            var pcsTmp = Enumeration.PCS;
            var sppendDce = Mustache.render('{{#enum}} <option value={{value}}>{{name}}</option> {{/enum}}',pcsTmp);
            $('#pcs-model').html(sppendDce);

        })*/

        $.post("/interface/getDevList",{device_type:1},function (res) {
            var bmsTmp = res.data;
            var sppendDce = '<option value="">请选择</option>' + Mustache.render('{{#enumList}} <option value={{value}}>{{name}}</option> {{/enumList}}',bmsTmp);
            $('#pcs-model').html(sppendDce);
        })
    },
    //表格数据
    tableFunc:function () {
        $('#pcs-table').bootstrapTable({
            method:'POST',
            dataType:'json',
            cache: false,
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            url:'/interface/pcsHisData',
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
            sortOrder:'desc',
            height: 619,
            width:$(window).width(),
            pagination:true,
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
                    field: 'pcsName',
                    title : 'PCS名称',
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
                    field : 'aCVoltage',
                    title : '交流电压A相有效值(V)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'bCCurrent',
                    title : '交流电压B相有效值(V)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'cCCurrent',
                    title : '交流电压C相有效值(V)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'aCCurrent',
                    title : '交流电流A相有效值(A)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'bCCurrent',
                    title : '交流电流B相有效值(A)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'cCCurrent',
                    title : '交流电流C相有效值(A)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'gridFrequency',
                    title : '电网频率(Hz)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'ap',
                    title : '有功功率(kW)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'rp',
                    title : '无功功率(kVar)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'aGBT',
                    title : 'A相GBT温度(℃)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'bGBT',
                    title : 'B相GBT温度(℃)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }, {
                    field : 'cGBT',
                    title : 'C相GBT温度(℃)',
                    align : 'center',
                    valign : 'middle',
                    width:"6.5%"
                }]
        });
    }
};