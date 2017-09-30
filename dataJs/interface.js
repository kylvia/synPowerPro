module.exports = {
    loginAuth:{
        success:true,
        error:'',
        msg:''
    },
    updatePassword:{
        success:true,
        data:'修改成功，请重新登录！',
        error:'',
        msg:''
    },
    exit:{
        success:true,
        error:'',
        msg:''
    },
    isLogin:{
        "success|1":[true,true],
        error:'true',
        msg:{
            errorType:'1001',
            message:'先学习！'
        }
    },
    getPlantInfo:{
        success:true,
        data:{
            "plantName": "成都高新区美年电站",
            "capacity": "1000kW",
            "gridConnectedDate": "2017-5-1",
            "runDays": "80天",
            "loaction": [30.629169,104.079373],
            "plantPhoto": "",
            "plantAddr": "电站地址"
        },
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误'
        }
    },
    getPlantStatus:{
        "success|1":[true,true],
        data:{
            "plantStatus|1": ["正常","异常","断连"],
        },
        error:'',
        msg:{
            errorType:'1002',
            message:'电站状态网络连接错误'
        }
    },
    getPlantPosition:{
        success:true,
        data:{
            "loaction": [104.079373,30.629169]
        },
        error:'',
        msg:''
    },
    getStatistics:{
        "success|1":[true,true],
        data:{
            "bat_capacity": {
                "unit": "kVA",
                "value": "243"
            },
            "bat_soc": {
                "unit": "%",
                "value": "80"
            },
            "bat_output": {
                "unit": "万kW",
                "value": "275.4"
            },
            "convert_efficiency": {
                "unit": "%",
                "value": "898"
            }
        },
        error:'',
        msg:{
            errorType:'1002',
            message:'网络连接错误'
        }
    },
    getPlantRevenue:{
        "success|1":[true,true],
        data:{
            "daily_revenue_unit": "元",
            "daily_revenue|1000-10000": 1,
            "total_revenue_unit":"万元",
            "total_revenue|10000-50000": 1,
        },
        error:'',
        msg:{
            errorType:'1002',
            message:'session过期，请重新登录！'
        }
    },
    //收益统计
    getRevenueBar:{
        success:true,
        data:{
            "unit":"元",
            "date":[3,4,5,6,7,8,9,10,11,12,13],
            "revenue":[1025,2015,713,2851,2964,861,2348,2861,1592,567,2135]
        },
        error:'',
        msg:''
    },
    getChargeTimes:{
        success:true,
        data:{
            "dailyChargeTimes": "10",
            "totalChargeTimes": "5345"
        },
        error:'',
        msg:{
            errorType:'1002',
            message:'session过期，请重新登录！'
        }
    },
    //充放电量柱状图
    getChargedBar:{
        success:true,
        data:{
            "date": [4,5,6,7,8,9,10,11,12,13,14],
"unit": "kWh",
    "power": [{
                "name": "充电量",
                "value": [2145,1758,1257,987,2345,845,1547,1023,845,567,1987]
},
        {
            "name": "放电量",
            "value": [1025,2015,713,2851,2964,1789,1302,1345,1592,530,1578]
        }
        ]
        },
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //实时功率曲线
    getPowerCurve:{
        success:true,
        data:{
            "time": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22],
"unit": "kW",
    "power": [{
                "name": "充放电功率",
                "value": [-145,158,22,356,235,145,247,23,486,256,-200,159,400,257,87,345,45,47,123,-45,-67,187]
},
        {
            "name": "电网功率",
            "value": [125,215,-13,251,264,189,102,345,192,30,478,25,-215,313,151,264,189,-132,345,92,30,-78]
        },
        {
            "name": "用电功率",
            "value": [458,0,200,100,304,258,1,-300,-247,20,456,325,300,478,54,-100,189,102,345,192,-30,-178]
        }
        ]
        },
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //ems曲线
    getCurrentEMS:{
        success:true,
        data:{
            currentCurve:{
                "time": ['0:00','0:15','0:30','0:45','1:00','1:15','1:30','1:45','2:00','2:15','2:30','2:45','3:00','3:15','3:30','3:45','4:00','4:15','4:30','4:45','5:00','5:15','5:30','5:45','6:00'],
                "unit": "A",
                "name": "电流",
                "value": [20,20,20,20,200000,-40000000,-40,-40,-40,-40,-40,-40,-40,80,80,80,80,-50,-50,-50,-50,-50,-50,-50,-50]

            },

            'rows|4': [{
                "name|+1": ["时间段1","时间段2","时间段3","时间段4"],
                "start_time|+1": ["0:00","4:00","12:00","16:00"],
                "stop_time|+1": ["4:00","12:00","16:00","0:00"],
                "power_set|+1": [20,0,80,-50]
            }]
        },
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    getCurrentEMS:{
        "data":{
            "rows":[
                {"name":"时间段1","power_set":"50","start_time":"14:44","stop_time":"14:44"},
                {"name":"时间段2","power_set":"75","start_time":"14:44","stop_time":"14:44"},
                {"name":"时间段3","power_set":"56","start_time":"14:44","stop_time":"14:44"},
                {"name":"时间段4","power_set":"23","start_time":"14:44","stop_time":"14:44"}],
            "enumList":null,
            "total":0,
            "currentCurve":{
                "name":"电能",
                "time":["00:00","00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55","01:00","01:05","01:10","01:15","01:20","01:25","01:30","01:35","01:40","01:45","01:50","01:55","02:00","02:05","02:10","02:15","02:20","02:25","02:30","02:35","02:40","02:45","02:50","02:55","03:00","03:05","03:10","03:15","03:20","03:25","03:30","03:35","03:40","03:45","03:50","03:55","04:00","04:05","04:10","04:15","04:20","04:25","04:30","04:35","04:40","04:45","04:50","04:55","05:00","05:05","05:10","05:15","05:20","05:25","05:30","05:35","05:40","05:45","05:50","05:55","06:00","06:05","06:10","06:15","06:20","06:25","06:30","06:35","06:40","06:45","06:50","06:55","07:00","07:05","07:10","07:15","07:20","07:25","07:30","07:35","07:40","07:45","07:50","07:55","08:00","08:05","08:10","08:15","08:20","08:25","08:30","08:35","08:40","08:45","08:50","08:55","09:00","09:05","09:10","09:15","09:20","09:25","09:30","09:35","09:40","09:45","09:50","09:55","10:00","10:05","10:10","10:15","10:20","10:25","10:30","10:35","10:40","10:45","10:50","10:55","11:00","11:05","11:10","11:15","11:20","11:25","11:30","11:35","11:40","11:45","11:50","11:55","12:00","12:05","12:10","12:15","12:20","12:25","12:30","12:35","12:40","12:45","12:50","12:55","13:00","13:05","13:10","13:15","13:20","13:25","13:30","13:35","13:40","13:45","13:50","13:55","14:00","14:05","14:10","14:15","14:20","14:25","14:30","14:35","14:40","14:45","14:50","14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35","15:40","15:45","15:50","15:55","16:00","16:05","16:10","16:15","16:20","16:25","16:30","16:35","16:40","16:45","16:50","16:55","17:00","17:05","17:10","17:15","17:20","17:25","17:30","17:35","17:40","17:45","17:50","17:55","18:00","18:05","18:10","18:15","18:20","18:25","18:30","18:35","18:40","18:45","18:50","18:55","19:00","19:05","19:10","19:15","19:20","19:25","19:30","19:35","19:40","19:45","19:50","19:55","20:00","20:05","20:10","20:15","20:20","20:25","20:30","20:35","20:40","20:45","20:50","20:55","21:00","21:05","21:10","21:15","21:20","21:25","21:30","21:35","21:40","21:45","21:50","21:55","22:00","22:05","22:10","22:15","22:20","22:25","22:30","22:35","22:40","22:45","22:50","22:55","23:00","23:05","23:10","23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55"],
                "unit":"KW",
                "value":["0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","1000","1000","1000","1000","1000","1000","0","0","0","1000","1000","1000","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0.00","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"]},"chargeSet":null,"controlAuthority":null,"device_id":null,"device_name":null,"runningMode":null,"value1":null,"value2":null,"value3":null,"value4":null,"xftg_en":null},"success":true,"msg":""},
    //组态实时信息 废弃
    getCurrentPower:{
        success:true,
        data:{
            "bus_power": "-87.5kW",
            "bus_voltage_a": "10KW",
            "bus_voltage_b|1": ["110.25KW","230KW","178.69KW"],
            "bus_voltage_c|1": ["120.29KW","200KW","278.32KW"],
            "bus_frequency": "50HZ",
            "unit": "值的单位",
            "device_status": [
                {
                    "inverter_id": "设备唯一标识",
                    "inverter_name": "设备名称",
                    "inverter_status": "0",
                    "charge_status|1": [0,1],
                    "battery_SOC": "24.8%",
                    "breaker_status|1": [0,1],
                    "power": "15.2kW",
                    "batteryCell": "3",
                    "unit": "单位"
                },
                {
                    "inverter_id": "设备唯一标识",
                    "inverter_name": "设备名称",
                    "inverter_status": "1",
                    "charge_status": 0,
                    "battery_SOC": "52%",
                    "breaker_status|1": [0,1],
                    "power": "15.2kW",
                    "batteryCell": "3",
                    "unit": "单位"
                },
                {
                    "inverter_id": "设备唯一标识",
                    "inverter_name": "设备名称",
                    "inverter_status": "2",
                    "charge_status": 0,
                    "battery_SOC": "52%",
                    "breaker_status|1": [0,1],
                    "power": "15.3kW",
                    "batteryCell": "3",
                    "unit": "单位"
                },
                {
                    "inverter_id": "设备唯一标识",
                    "inverter_name": "设备名称",
                    "inverter_status": "1",
                    "charge_status": 1,
                    "battery_SOC": "52%",
                    "breaker_status|1": [0,1],
                    "power": "16.2kW",
                    "batteryCell": "3",
                    "unit": "单位"
                },
                {
                    "inverter_id": "设备唯一标识",
                    "inverter_name": "设备名称",
                    "inverter_status": "2",
                    "charge_status": 1,
                    "battery_SOC": "52%",
                    "breaker_status|1": [0,1],
                    "power": "12.5kW",
                    "batteryCell": "1",
                    "unit": "单位"
                },
                {
                    "inverter_id": "设备唯一标识",
                    "inverter_name": "设备名称",
                    "inverter_status": "0",
                    "charge_status": 0,
                    "battery_SOC": "电站剩余电量比例",
                    "breaker_status|1": [0,1],
                    "power": "12.6kW",
                    "batteryCell": "3",
                    "unit": "单位"
                }
            ]
        },
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //组态实时信息
    getDynamicData:{
        "success|1":[true,true],
        data:{
            "bus_activepower|1": ["-487.5kW","402.7kW"],
            "bus_current": "10A",
            "bus_frequency": "49.9Hz",
            "bus_reactivepower": "2000kVar",
            "bus_voltage": "200V",
            "dc_current": "10A",
            "dc_power": "234kW",
            "dc_voltage": "200V"
        },
        error:'',
        msg:{
            errorType:'1001',
            message:'组态图网络连接错误！'
        }
    },
    //PCS页面
    getCurrentPCS: {
        "success": true,
        'data|6': [
            {
                "device_id|+1": [
                    "pcs00001",
                    "pcs00002",
                    "pcs00003",
                    "pcs00004",
                    "pcs00005",
                    "pcs00006"
                ],
                "device_name|+1": [
                    "PCS01",
                    "PCS02",
                    "PCS03",
                    "PCS04",
                    "PCS05",
                    "PCS06"
                ],
                "uina_rms": "999.99 V",
                "uinb_rms": "999.99 V",
                "uinc_rms": "999.99 V",
                "iina_rms": "999.99 A",
                "iinb_rms": "999.99 A",
                "iinc_rms": "999.99 A",
                "frequency": "999.99 HZ",
                "activepower": "999.99 kW",
                "reactivepower": "999.99 kVar",
                "ubtra_ever": "999.99 V",
                "ibtra_ever": "999.99 A",
                "pbtra": "999.99 kW",
                "igbt_tempa0_ever": "999.99 ℃",
                "igbt_tempb0_ever": "999.99 ℃",
                "igbt_tempc0_ever": "999.99 ℃",
                "sysstate1_11|1": [0,1],
                "sysstate1_10|1": [0,1],
                "sysstate1_9|1": [0,1],
                "sysstate1_8|1": [0,1],
                "sysstate1_7|1": [0,1],
                "sysstate1_6|1": [0,1],
                "sysstate1_5|1": [0,1],
                "sysstate1_4|1": ["EMS正在控制","BMS正在控制","正在调试"],
                "sysstate1_13|1": ["默认模式","电池维护模式","SOC标定模式","均压维护模式","恒压充放电模式"],
                "sysstate1_0|1": [0,1,2],
                "connected": [0,1]
            }],
        "error": false,
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    setControlAuthority:{
        success:true,
        "data|3":[{
            "device_name": "设备名称",
            "time": "执行时间",
            "flag": "true/false",
            "msg": "切换控制权限 成功/失败"
        }],
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //设置窗体数据
    getCurrentSet:{
        success:true,
        data:{
            "device_id": "设备id",
            "device_name": "设备名称",
            "controlAuthority|1": [0,1,2,''],
            "runningMode|1": [0,1,2,3,4,5,6,7,8,''],
            "xftg_en|1": [0,1,''],
            "value1":{
                "start_time1": "0:00",
                "stop_time1": "6:20",
                "power_set1": "22.22"
            },
            "value2":{
                    "start_time2": "6:20",
                    "stop_time2": "14:40",
                    "power_set2": "-22.23"
                },
            "value3":{
                "start_time3": "6:20",
                "stop_time3": "16:40",
                "power_set3": "-19.22"
            },
            "value4":{
                "start_time4": "16:40",
                "stop_time4": "23:59",
                "power_set4": "22.05"
            },
            /*"periods": [
                {
                    "start_time1": "0:00",
                    "stop_time1": "6:20",
                    "power_set1": "22.22"
                },
                {
                    "start_time2": "6:20",
                    "stop_time2": "14:40",
                    "power_set2": "-22.23"
                },
                {
                    "start_time3": "6:20",
                    "stop_time3": "16:40",
                    "power_set3": "-19.22"
                },
                {
                    "start_time4": "16:40",
                    "stop_time4": "23:59",
                    "power_set4": "22.05"
                }
            ]*/
        },
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    startOrTurnOff:{
        success:true,
        "data|3":[{

            "device_id": "设备id",
            "device_name": "设备名称",
            "time": "执行时间",
            "flag": "true/false",
            "msg": "开/关/急停机成功/失败"
        }],
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //设置使能
    setXFTG_en:{
        success:true,
        "data|3":[{
            "device_id": "设备id",
            "device_name": "设备名称",
            "time": "执行时间",
            "flag": "true/false",
            "msg": "设置充放电使能 成功/失败"
        }],
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    setChargeTime:{
        success:true,
        "data|3":[{
            "device_name": "设备名称",
            "time": "执行时间",
            "flag": "true/false",
            "msg": "设置时间 成功/失败"}],
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    setActivePower:{
        success:true,
        "data|3":[{
            "device_name": "设备名称",
            "time": "执行时间",
            "flag": "true/false",
            "msg": "切换EMS控制 成功/失败"}],
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //运行模式设置
    setRunningMode:{
        success:true,
        "data|3":[{
            "device_name": "设备名称",
            "time": "执行时间",
            "flag": "true/false",
            "msg": "成功/失败"}],
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    setReactivePower:{
        success:true,
        data:{"flag":"true","msg":"设置成功/什么错误"},
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    checkUserRights:{
        success:true,
        data:{"flag":"true","msg":"设置成功/什么错误"},
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    getSingleDevicePower:{
        success:true,
        data:{
            "device_id": "设备唯一标识",
            "activepower": "1597.2",
            "reactivepower": "279.4",
            "unit": "单位"
        },
        error:'',
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //BMS页面
    getCurrentBMS: {
        "success": true,
        'data|6': [
            {
                "device_id|+1": [
                    "bms00001",
                    "bms00002",
                    "bms00003",
                    "bms00004",
                    "bms00005",
                    "bms00006"
                ],
                "device_name|+1": [
                    "BMS01",
                    "BMS02",
                    "BMS03",
                    "BMS04",
                    "BMS05",
                    "BMS06"
                ],
                "volt_cellmax": "999.99 V",
                "num_cellvoltmax": "052",
                "volt_cellmin": "999.99 V",
                "num_cellvoltmin": "052",
                "volt_cellavg": "999.99 V",
                "temp_cellmax": "36.4 ℃",
                "num_tempmax": "052",
                "temp_cellmin": "28.4 ℃",
                "num_tempmin": "052",
                "temp_cellave": "32 ℃",
                "volt_bus": "327 V",
                "curr_bus": "23 A",
                "insulation_res": "999.99",
                "curr_chgLimit": "12 A",
                "curr_dchLimit": "55 A",
                "power_chgLimit": "999.99 W",
                "power_dchLimit": "999.99 W",
                "chg_packvoltmax_limit": "999.99 V",
                "chg_cellvoltmax_limit": "999.99 V",
                "soc|1": ["100%","60%","25%","40%","--","30%"],
                "soh": "1005",
                "bms_lifesignal|1": [0,1],
                "bms_relaystatus|1": [0,1],
                "connected|1": [0,1],
                "bms_mode|1": [50,23,13,3],
            }
            ],
        "error": false,
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //告警管理

    alarmQuery: {
        "success|1":[true,true],
        data:{
            "total": 800,
            'maxId|1':[12,2,22,23],
            'rows|12': [{
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'alarm_id|+1': 1,
                "alarm_name": "@word(3, 5)",
                "device_name": "@word(3, 5)",
                "device_type": "@word(3, 5)",
                "alarm_level|1": [
                    "高",
                    "中",
                    "低"
                ],
                "alarm_type": "@word(3, 5)",
                "status_name": "@word(3, 5)",
                "change_time": "@datetime(yyyy-MM-dd HH:mm:ss:s)",
                "status": "@word(3, 5)"
            }]
        },
        "error": false,
        msg:{
            errorType:'1002',
            message:'网络连接错误！'
        }
    },
    alarmClean:{
        success:true,
        "error": false,
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    alarmConfirm:{
        success:true,
        "error": false,
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //BMS页面报表
    getDevList:{
        success:true,
        data:{
            "enumList":[
                {
                    name:'设备1',
                    value:'1001',
                },
                {
                    name:'设备2',
                    value:'1002',
                },
                {
                    name:'设备3',
                    value:'1003',
                },
                {
                    name:'设备4',
                    value:'1004',
                }
            ]
        },
        "error": false,
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }

    },
    bmsHisData: {
        success:true,
        data:{
            "total": 800,
            'maxId|1':[12,2,22,23],
            'rows|10': [{
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'id|+1': 1,
                "SOC": "45.5%",
                "SOH": "25.3%",
                "batteryBusCurrent": 15,
                "batteryBusVoltage": 220,
                "batteryVoltage": 330,
                "bmsName": "@word(3, 10)",
                "time": "@datetime(yyyy-MM-dd HH:mm:ss:s)",
                "temp_cellmin|5-15": 15,
                "temp_cellmax|25-35": 35,
                "temp_cellaver|20-25": 25,
                "monomeraverVoltage|100-120": 100,
                "monomerMinVoltage|80-100": 100,
                "monomerMaxVoltage|120-220": 100,
                "insulation_res|50-70.2": 50
            }]
        },
        "error": false,
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //PCS页面报表
    pcsHisData: {
        success:true,
        data:{
            "total": 800,
            'maxId|1':[12,2,22,23],
            'rows|10': [{
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'id|+1': 1,
                "pcsName": "@word(3, 5)",
                "time": "@datetime(yyyy-MM-dd HH:mm:ss:s)",
                "aCVoltage": "330",
                "bCVoltage": "220",
                "cCVoltage": "15",
                "aCCurrent": "45.5%",
                "bCCurrent": "330",
                "cCCurrent": "110",
                "gridFrequency": "220",
                "ap": "25.3%",
                "rp": "45.3",
                "aGBT": "35.8",
                "bGBT": "40.8",
                "cGBT": "52.1"
            }]
        },
        "error": false,
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //PCS页面报表
    meterHisData: {
        success:false,
        data:{
            "total": 800,
            'rows|10': [{
                "id|+1": 1,
                "name": "@word(3, 5)",
                "time": "@datetime(yyyy-MM-dd HH:mm:ss:s)",
                "pointDischarge": 3134,
                "peakDischarge": "1279",
                "flatDischarge": "2479",
                "valleyDischarge": "2781",
                "tipCharging": "1348",
                "peakCharging": "58.5%",
                "flatCharge": "58.5%",
                "valleyCharging": "1348"
            }]
        },
        "error": false,
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
    //电站运行报表
    runningReport: {
        success:true,
        data:{
            "total": 800,
            rowSpan:[4,4,4],
            "rows|5": [{
                "id|+1": 1,
                "time": "@datetime(yyyy-MM)",
                "timePeriod|+1": [
                    "尖(08:00-10:00)",
                    "峰(08:00-10:00)",
                    "平(08:00-10:00)",
                    "谷(08:00-10:00)",
                    "当日总计"
                ],
                "price": "0.56",
                "inputCapacity": 3134,
                "outputCapacity": "1279",
                "icPrice": "2479",
                "ocPrice": "2781",
                "esBenefits": "1348",
                "efficiency": "@word(3, 5)"
            }]
        },
        "error": false,
        msg:{
            errorType:'1001',
            message:'网络连接错误！'
        }
    },
//设置
    getUserInfo:
        {
            "msg": {"message": "", "errorType": 1},
            "success": true,
            "data": {
                "loginid": '\u7528\u6237\u540d',
                "email": "\u90ae\u7bb1",
                "gender|1": ["女","男"],
                "role_name": "\u89d2\u8272",
                "cellphone_number": "\u7535\u8bdd",
                "user_name": "\u59d3\u540d"
            }
        },
    updateUserInfo:
        {
            "msg": {"message": "", "errorType": 1},
            "success": true,
            "data": '修改成功！'
        }

};