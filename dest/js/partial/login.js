define(function(){
    return login;
});
var login = {
    Render:function () {

        main.loginFlag = false; //非登陆页面
        $('#loginBtn').unbind('click').on('click',function (e) {

            e.stopPropagation();
            if(!$.trim($('#userName').val())){
                App.alert('请输入用户名');
                return;
            }
            if(!$.trim($('#passWord').val())){
                App.alert('请输入密码');
                return;
            }else {
                $('#passWord').val(hex_md5($('#passWord').val()));
            }
            // console.log($(".cus-login-box").serializeArray());
            $.ajax({
                url:'/interface/loginAuth',
                type:'post',
                dataType:'JSON',
                data:$(".cus-login-box").serializeArray(),
                success:function (result) {
                    if(result.success){
                     // result.data.token && Cookies.setCookByName('hasToken', result.data.token);
                        main.loadSys(2);
                    }else {
                        App.alert(result.msg);
                    }
                    /*Menu.login(result.data.success);
                    main.loadSys();*/

                    // $('#sysBody').loadPage('partial/main.html');
                },
                error:function (e) {
                    console.log(e)
                }
            })
            /*var user = {
                userName:'aa',
                loginName:'admin',
                userid:'4324324',
                userType:'1'
            }
            Menu.login('12344',user);*/

        });

        //绑定回车事件
        $('#passWord').unbind('keypress').keypress(function (event) {
            var key = event.which;
            if(key==13){
                $('#loginBtn').click();
            }
        });
    }
};