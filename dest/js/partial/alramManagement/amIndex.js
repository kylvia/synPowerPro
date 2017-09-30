define(function(){
    return amIdex
});
var amIdex = {
    interval:'',
    tableIds:[],
    repeat:true,
    maxIdcache:0,
    queryStatus:false,
    switch:true, //开启刷新
    Render:function () {

        var _this = this;
        _this.getTableData();
        if(_this.interval) clearTimeout(_this.interval);

        //点击checkbox名字选中
        $('.checkboxContainer span').on('click',function () {
            $(this).siblings("label").click();
        });

        //查询
        $('#queryBtn').on('click',function(){
            //$("#am-table").bootstrapTable('refresh', {url:'/interface/alarmQuery'});
			
            _this.interTableData();
        });

        //开关
        $('#switchBtn').on('click',function(){
            var btnTxt = $(this).text();
            if('启用' === btnTxt){
                $(this).text('停用');
                _this.switch = true;
                _this.refreshTable()
            }else {
                $(this).text('启用');
                clearTimeout(_this.interval);
                _this.switch = false
            }
        });

        $('.pagination .page-number').on('click',function () {
            clearTimeout(_this.interval);
            _this.switch = false
        });

        //清除
        $('#clearBtn').on('click',function(){
            // _this.getTableData();

            if(!_this.tableIds.length){
                App.alert('请勾选至少一条数据！');
                return;
            }

            $.ajax({
                url:'interface/alarmClean',
                type:'post',
                dataType:'JSON',
                data:{alarm_ids:_this.tableIds.join(',')},
                success:function (result) {
                    if(result.success){
                        _this.tableIds = [];
                        App.alert(result.msg,function () {
                            $("#am-table").bootstrapTable('refresh', {url:'/interface/alarmQuery'});
                        });
                    }else {
                        App.alert(result.msg);
                    }
                },
                error:function (e) {
                    console.log(e)
                }
            });
        });

        //确认
        $('#conformBtn').on('click',function(){
            // _this.getTableData();

            if(!_this.tableIds.length){
                App.alert('请勾选至少一条数据！');
                return;
            }
            $.ajax({
                url:'interface/alarmConfirm',
                type:'post',
                dataType:'JSON',
                data:{alarm_ids:_this.tableIds.join(',')},
                success:function (result) {
                    if(result.success){
                        _this.tableIds = [];
                        App.alert(result.msg,function () {
                            $("#am-table").bootstrapTable('refresh', {url:'/interface/alarmQuery'});
                        });
                    }else {
                        App.alert(result.msg);
                    }
                },
                error:function (e) {
                    console.log(e)
                }
            });
        });

    //    告警状态
        _this.selectFunc()
    },
    refreshTable:function(){
        var _this = this;
        _this.interval = setTimeout(function(){
            if(main.clearInterCharge(_this.interval,'alarmManagement'))return;
            $("#am-table").bootstrapTable('refresh', {url:'/interface/alarmQuery'});
        },5000);
    },
    selectFunc:function () {
        require(['./main/enumeration'],function (Enumeration) {
            var pcsTmp = Enumeration.AlarmStatus;
            var sppendDce = Mustache.render('{{#enum}} <option value={{value}}>{{name}}</option> {{/enum}}',pcsTmp);
            $('#alarm-status').html(sppendDce);

        })
    },
    interTableData : function () {
        $('#am-table').bootstrapTable('refreshOptions',{pageNumber:1});
    },
    getQueryData:function () {
        //获取checkBox数据
        function getCheckData(className){
            var str = '';
            $("."+className).find("input:checked").each(function(){
                str+=$(this).val()+",";
            });
            !!str && (str.slice(-1) === ',') && (str = str.substring(0,str.length-1));
            return str;
        }
        //获取name对应数据
        function getData(){
            var data = {};
            $("#queryForm").find('[name]').each(function(){
                var dom = $(this);
                data[dom.attr('name')] = dom.val();
            });

            return data
        }

        var querys = getData();
        querys.alarm_level = getCheckData('aiLevel'); //告警级别
        querys.alram_type = getCheckData('aiType'); //告警类型

        return querys
    },
    getTableData:function () {
        var _this = this;
        var result='';
        if(main.clearInterCharge(_this.interval,'alarmManagement'))return;
        $('#am-table').bootstrapTable({
            method:'POST',
            dataType:'json',
            // cache: false,
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            url:'/interface/alarmQuery',
            // url:'/test/amTable',
            striped:true,
            sortName: 'change_time',
            height: 619,
            width:$(window).width(),
            pagination:true,
            sortOrder:'desc',
            // search:true,
            minimumCountColumns:2,
            queryParams:function(params){
                params.offset = params.offset / params.limit+1;
                return JSON.stringify(Object.assign(params,_this.getQueryData()));
            },

            onCheckAll:function (rows) {
                $.each(rows,function (index,item) {
                    _this.tableIds.push(item.alarm_id)
                })
            },
            onUncheckAll:function (rows) {
                $.each(rows,function (index,item) {
                    _this.tableIds.remove(item.alarm_id);
                })
            },
            onCheck:function(row){
                _this.tableIds.indexOf(row.alarm_id) ===-1 && _this.tableIds.push(row.alarm_id);
                // console.log( _this.tableIds);
            },
            onUncheck:function(row){
                _this.tableIds.remove(row.alarm_id);
            },
            onClickRow:function(row, $element){
                if($element[0].className === 'selected'){
                    $('#am-table').bootstrapTable('uncheck',$element[0].sectionRowIndex)
                }else {
                    $('#am-table').bootstrapTable('check',$element[0].sectionRowIndex)
                }

            },
            onLoadSuccess:function(data){
                $('#am-table').bootstrapTable('checkBy',{field:"alarm_id", values:_this.tableIds});
                $(".fixed-table-body").mCustomScrollbar({
                    theme:"3d"
                });
                clearTimeout(_this.interval);
                if(_this.repeat && !result.success){
                    _this.repeat = false;
                    App.alert(result.msg,function (e) {
                        _this.repeat = true;
                    });
                }
                //实时刷新
                if(_this.switch){_this.refreshTable()}
            },
            rowStyle:function (row,index) {
                var colors = ['#ff4949','#ffcc99','#9999ff'];
                var alarms = ['高','中','低'];
                var ind = alarms.indexOf(row.alarm_level);
                return {
                    css: {'color':colors[ind]}
                }
            },
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            responseHandler:function(res){
                //远程数据加载之前,处理程序响应数据格式,对象包含的参数: 我们可以对返回的数据格式进行处理
                //在ajax后我们可以在这里进行一些事件的处理
                result = res;
                return res.data;
            },
            columns: [
                {
                    field: 'alarm_id',
                    visible:false,
                    valign : 'middle'
                },
                {
                    field: '',
                    checkbox:true,
                    valign : 'middle',
                    width:"3%"
                },

                {
                    field : 'alarm_name',
                    title : '告警名称',
                    align : 'center',
                    valign : 'middle',
                    width:"12%"
                }, {
                    field : 'device_name',
                    title : '设备名称',
                    align : 'center',
                    valign : 'middle',
                    width:"12%"
                }, {
                    field : 'device_type',
                    title : '设备类型',
                    align : 'center',
                    valign : 'middle',
                    width:"10%"
                }, {
                    field : 'alarm_level',
                    title : '告警级别',
                    align : 'center',
                    valign : 'middle',
                    width:"10%"
                }, {
                    field : 'alarm_type',
                    title : '类型',
                    align : 'center',
                    valign : 'middle',
                    width:"10%"
                }, {
                    field : 'status_name',
                    title : '状态',
                    align : 'center',
                    valign : 'middle',
                    width:"10%"
                }, {
                    field : 'change_time',
                    title : '发生时间',
                    align : 'center',
                    sortable: true,
                    valign : 'middle',
                    width:"10%"
                }, {
                    field : 'status',
                    title : '告警状态',
                    align : 'center',
                    valign : 'middle',
                    width:"10%"
                }]
        });
    }
};