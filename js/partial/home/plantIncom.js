define(function(){
    return plantIncom
});
var plantIncom = {
    interval:'',
    Render:function () {
        this.getData();
        var _this = this;
        if(_this.interval) clearInterval(_this.interval);
        _this.interval = setInterval(_this.getData,30000);
    },
    getData:function () {
        var _this = this;
        if(main.clearInterCharge(_this.interval,'ps-interval'))return;
        $.ajax({
            url:'/interface/getPlantRevenue',
            type:'post',
            dataType:'JSON',
            data:JSON.stringify({token:Cookies.getCook('token')}),
            success:function (result) {
                if(result.success){
                    var getPR = result.data;
                    $('#daily_revenue_unit').length && $('#daily_revenue_unit').text(getPR.daily_revenue_unit);
                    $('#daily_revenue_unit').length && $('#total_revenue_unit').text(getPR.total_revenue_unit);

                    //当日收益
                    var drArr = !getPR.daily_revenue ? 0:getPR.daily_revenue.toString().split('');
                    var fdrArr = formatterNumber(7,drArr);
                    $('#daily_revenue span').each(function (index,item){
                        $(item).text(fdrArr.shift());
                    });
                    //累计收益
                    var trArr = !getPR.total_revenue ? 0:getPR.total_revenue.toString().split('');
                    var ftrArr = formatterNumber(7,trArr);
                    $('#total_revenue span').each(function (index,item){
                        $(item).text(ftrArr.shift());
                    })

                }else {
                    App.alert(result.msg);
                }
            },
            error:function (e) {
                console.log(e)
            }
        });

        function formatterNumber(len,arr){
            if(arr.length<len){
                arr.unshift(' ');
                formatterNumber(len,arr);
            }
            return arr;
        }
    }
};