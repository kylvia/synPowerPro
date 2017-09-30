define(function(){
    return setIndex
});
var setIndex = {
    Render:function () {
        var _this = this;
        _this.viewTemp();


    },
    bindEnebt:function () {
        var _this = this;

        $(".radioStyle input").on("click",function(){
            $(".radioStyle").removeClass("on");
            $(this).parent().addClass("on");
        })
        //    修改
        $('#paModify').on('click',function () {
            _this.modifyTemp();
        })
        //    取消
        $('#paView').on('click',function () {
            _this.viewTemp();
        })
        //    确认
        $('#paOk').on('click',function () {
            console.log($('#modifyForm').validate())
            var queryData = $('#modifyForm').getForm();
            // $('#modifyForm').validate();
            return
            $.ajax({
                url: '/interface/updateUserInfo',
                type: 'post',
                dataType: 'JSON',
                data: queryData,
                success: function (result) {
                    if (result.success) {
                        App.alert(result.data,function () {
                            _this.viewTemp();
                        });
                    } else {
                        App.alert(result.msg);
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            });

        })
    },
    modifyTemp:function () {
        var modifyTemStr = '\n' +
            '    <form class="modifyForm" id="modifyForm" style="display: block"><fieldset>\n' +

            '        <div class="formLine">\n' +
            '            <label for="user_name">姓名: </label>\n' +
            '            <input required minlength="5" placeholder="请输入姓名" name="user_name" id="user_name" type="text">\n' +
            '        </div>\n' +
            '        <div class="formLine">\n' +
            '            <label>性别: </label>\n' +
            '            <div class="genderInp"><span class="radioStyle on"><input value="男" id="gender_male" type="radio" name="gender"></span><label for="gender_male">男</label>\n' +
            '                &nbsp;&nbsp;&nbsp;\n' +
            '                <span class="radioStyle"><input value="女" id="gender_formale" type="radio" name="gender"></span><label for="gender_formale">女</label></div>\n' +
            '        </div>\n' +
            '        <div class="formLine">\n' +
            '            <label for="">角色: </label>\n' +
            '            <input type="text" readonly id="role_name" name="role_name">\n' +
            '        </div>\n' +
            '        <div class="formLine">\n' +
            '            <label>用户名: </label>\n' +
            '            <input readonly type="text" id="loginid" name="loginid">\n' +
            '        </div>\n' +
            '        <div class="formLine">\n' +
            '            <label for="cellphone_number">电话: </label>\n' +
            '            <input class="required phone" placeholder="请输入电话号码" name="cellphone_number" id="cellphone_number" type="text" name="user">\n' +
            '        </div>\n' +
            '        <div class="formLine">\n' +
            '            <label for="email">邮箱: </label>\n' +
            '            <input class="required email" placeholder="请输入邮箱" name="email" id="email" type="text" name="user">\n' +
            '        </div>\n' +
            '       <div class="formLine cus-btnBar">\n' +
            '           <button type="submit" class="cus-img-btn cus-ib-confirm submit" id="paOk" >确认</button>\n' +
            '           <a class="cus-img-btn cus-ib-cancel" id="paView">取消</a>\n' +
            '       </div>\n' +
            '    </fieldset></form>';
        $('#paFormContent').html(modifyTemStr);
        this.bindEnebt();

        $('#modifyForm').validate();
        // App.initValidate()

        $.ajax({
            url: '/interface/getUserInfo',
            type: 'post',
            dataType: 'JSON',
            data: {loginid:$('#loginIdSave').val()},
            success: function (result) {
                if (result.success) {
                    var getData = result.data;
                    $.each(getData,function(item,value){
                            $('#'+item).length && $('#'+item).val(value);
                        item === 'loginid' && $('#loginIdSave').val(value);
                        // item === 'gender' && $('input[name=\'gender\']').val(value);
                        item === 'gender' && (value === '男' ? $("#gender_male").click() : $("#gender_formale").click())
                    });
                } else {
                    App.alert(result.msg);
                }
            },
            error: function (e) {
                console.log(e)
            }
        });
    },
    viewTemp:function () {
        var viewTempStr = '\n' +
            '    <form class="viewForm" style="display: block">\n' +
            '        <div class="formLine">\n' +
            '            <label>姓名: </label>\n' +
            '            <span id="user_name">xxx</span>\n' +
            '        </div>\n' +
            '        <div class="formLine">\n' +
            '            <label>性别: </label>\n' +
            '            <span id="gender">xxx</span>\n' +
            '        </div>\n' +
            '        <div class="formLine">\n' +
            '            <label>角色: </label>\n' +
            '            <span id="role_name">xxx</span>\n' +
            '        </div>\n' +
            '        <div class="formLine">\n' +
            '            <label>用户名: </label>\n' +
            '            <span id="loginid">xxx</span>\n' +
            '        </div>\n' +
            '        <div class="formLine">\n' +
            '            <label for="cellphone_number">电话: </label>\n' +
            '            <span id="cellphone_number">xxx</span>\n' +
            '        </div>\n' +
            '        <div class="formLine">\n' +
            '            <label for="email">邮箱: </label>\n' +
            '            <span id="email">xxx</span>\n' +
            '        </div>\n' +
            '       <div class="formLine cus-btnBar">\n' +
            '           <a class="cus-img-btn cus-ib-confirm" id="paModify">修改</a>\n' +
            '       </div>\n' +
            '    </form>';
        $('#paFormContent').html(viewTempStr);

        this.bindEnebt();

        $.ajax({
            url: '/interface/getUserInfo',
            type: 'post',
            dataType: 'JSON',
            data: {loginid:$('#loginIdSave').val()},
            success: function (result) {
                if (result.success) {
                    var getData = result.data;
                    $.each(getData,function(item,index){
                        $('#'+item).length && $('#'+item).text(getData[item]);
                        item === 'loginid' && $('#loginIdSave').val(getData[item]);
                    });
                } else {
                    App.alert(result.msg);
                }
            },
            error: function (e) {
                console.log(e)
            }
        });
    }
}