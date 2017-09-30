define(function(){
    return homeIndex;
});
var homeIndex = {
    Render:function () {

        //退出
        $('#exitSys').on('click',function () {
            $.post("/interface/exit",function (result) {
                if(result.success){
                    clearTimeout(windowInter);
                    $('#sysBody').loadPage('partial/login.html');
                }else {
                    App.alert(result.msg);
                }
            },'json')
        });

        //设置
        $('#setting').on('click',function () {
            $('#mainPage').loadPage('partial/setting/setIndex.html');
        });


        $('#setting').click();
        //密码修改
        $('#modifyPwd').on('click',function () {
            var cusModifyPwdContent = '\n' +
                '<!--修改密码-->\n' +
                '<div id="modifyPwdWin" class="cus-modifyPwdWin">\n' +
                '    <form id="modifyPedForm">\n' +
                '        <div class="mf-inp">\n' +
                '            <label for="password">原密码：</label>\n' +
                '            <input autocomplete="off" placeholder="请输入原始密码" type="text" id="password" name="password">\n' +
                '        </div>\n' +
                '        <div class="mf-inp">\n' +
                '            <label for="newPassword">新密码：</label>\n' +
                '            <input autocomplete="off" placeholder="请输入新密码" type="text" id="newPassword" name="newPassword">\n' +
                '        </div>\n' +
                '        <div class="mf-inp">\n' +
                '            <label for="newRePassword">确认新密码：</label>\n' +
                '            <input autocomplete="new-password" placeholder="请确认新密码" type="password" id="newRePassword">\n' +
                '        </div>\n' +
                '    </form>\n' +
                '</div>';
            App.dialog({
                title: "修改密码",
                width: 500,
                height: 160,
                content: cusModifyPwdContent,
                buttons: [{text:'确认',id:'setPwdOk',type:'cus-img-btn cus-ib-confirm'},
                    {text:'取消',type:'cus-img-btn cus-ib-cancel',clickToClose :true}]
            });

            $('#setPwdOk').on('click',function () {

                if(!$.trim($('#password').val())){
                    App.alert('请输入原密码');
                    return;
                }
                if(!$.trim($('#newPassword').val())){
                    App.alert('请输入新密码');
                    return;
                }
                if(!$.trim($('#newRePassword').val())){
                    App.alert('请输入确认新密码');
                    return;
                }
                if($('#newPassword').val() !== $('#newRePassword').val()){
                    App.alert('确认新密码与新密码不相等，请重新输入！');
                    return;
                }

                var queryData = $("#modifyPedForm").getForm();
                $.each(queryData, function (key,value) {
                    queryData[key] = hex_md5(value);
                });
                console.log(queryData);
                $.ajax({
                    url:'/interface/updatePassword',
                    type:'post',
                    dataType:'JSON',
                    data: queryData,
                    success:function (result) {
                        if(result.success){
                            $(".modal").modal("hide");
                            App.alert(result.data,function () {
                                $('#exitSys').click()
                            });
                        }else {
                            App.alert(result.msg);
                        }
                    },
                    error:function (e) {
                        console.log(e)
                    }
                })
            })
        });

        //菜单
        $('#topNav li').on('click',function () {
            $('#topNav li').removeClass('active');
            $(this).addClass('active');
            var toPage = $(this).find('a').attr('attr-href');
            $('#mainContainer').loadPage(toPage);
        });
        $('#topNav li').eq(0).click();
    }
};