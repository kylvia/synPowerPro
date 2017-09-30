/**
 * Created by deng on 2017/7/13.
 */
define(function () {
    return Enumeration;
});
var Enumeration={
    DCEnergy:{enum:[{name:'请选择',value:''},{name:'EMS控制',value:'0'},{name:'BMS控制',value:'1'},{name:'调试人员本地控制',value:'2'}]},
    RunningModel:{enum:[{name:'请选择',value:''},{name:'V/F',value:'0'},{name:'恒流模式',value:'1'},{name:'恒压模式',value:'2'},{name:'电池维护模式',value:'3'},{name:'SOC标定模式',value:'4'},{name:'均压维护模式',value:'5'},{name:'P/Q',value:'6'},{name:'I/V',value:'7'},{name:'恒功率模式',value:'8'}]},
    BMS:{enum:[{name:'请选择',value:''},{name:'BMS-01',value:'0'},{name:'BMS-02',value:'1'}]},
    PCS:{enum:[{name:'请选择',value:''},{name:'PCS-01',value:'0'},{name:'PCS-02',value:'1'}]},
    AlarmStatus:{enum:[{name:'全部',value:'0'},{name:'未确认',value:'1'},{name:'已确认',value:'2'}]},
    Ammeter:{enum:[{name:'请选择',value:''},{name:'电表-01',value:'0'},{name:'电表-02',value:'1'}]},
    tXFTGEn:{enum:[{name:'请选择',value:''},{name:'使能策略',value:'1'},{name:'禁止策略',value:'0'}]}

};
