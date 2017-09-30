+(function () {
    'use strict';
    define(['jquery'], function ($) {
        var system = {
            login: {
                type: 'GET',
                url: "/login.html"
            },
            noFound: {
                type: 'GET',
                url: "/404.html"
            },
            noRight: {
                type: 'GET',
                url: "/401.html"
            },
            main: {
                type: "GET",
                url: "/partials/main/main.html"
            }
        };

        var userRole = {};

        return {
            login: function (tokenId, user) {
                tokenId && Cookies.setCookByName('hasToken', tokenId);
                if (user) {
                    Cookies.setCookByName('userName', user.userName);
                    Cookies.setCookByName('loginName', user.loginName);
                    Cookies.setCookByName('userid', user.userid);
                    Cookies.setCookByName('userType', user.userType);
                }
            },
            /**
             * 判断是否登录系统
             */
            isLogin: function (validLogin) {
                $.ajax({
                    url:'/interface/isLogin',
                    type:'post',
                    dataType:'JSON',
                    data:$(".cus-login-box").serializeArray(),
                    success:function (result) {
                        if(!result.success){
                            clearTimeout(windowInter);
                            if(validLogin === 1){
                                $('#sysBody').loadPage('partial/login.html');
                                return;
                            }
                            App.alert(result.msg ,function () {
                                window.windowInter = setTimeout(function () {
                                    Menu.isLogin(true);
                                },1860000)
                            });
                        }else {
                            validLogin && $('#sysBody').loadPage('partial/main.html');
                            window.windowInter = setTimeout(function () {
                               Menu.isLogin(0);
                            },1860000)
                        }
                    },
                    error:function (e) {
                        console.log(e)
                    }
                })
            },

            /**
             * 根据URL获取权限
             * @param url
             * @returns {*}
             */
            getRight: function (url) {
                var menu = false;
                $.each($.extend(system, userRole), function (i, e) {
                    if (e && e.url && e.url.replace(/^\//, '') == url.replace(/^\//, '')) {
                        menu = e;
                        return false;
                    }
                });
                return menu;
            },

            setUserRole: function (roles) {
                if (roles) {
                    for (var i = 0; i < roles.length; i++) {
                        var role = roles[i];
                        userRole[role.id] = role;

                        var child = role.childs;
                        if (child && child.length > 0) {
                            this.setUserRole(child);
                        }
                    }
                }
                console.log(userRole);
                window.system = userRole;
            },

            clearUserRole: function () {
                userRole = {};
            },

            /**
             * 检测是否登录
             * @param fn {Function} 回调方法
             */
            checkLogin: function (fn) {
                //console.trace(fn);
                if (this.isLogin()) {
                    typeof fn == 'function' && fn();
                } else {
                    $('#sysBody').loadPage('partial/login.html');
                }
            },

            /**
             * 检测页面元素是否有权限
             */
            hasElementRight: function () {
                var permissions = $('[permission], .item-module');
                if (permissions && permissions.length > 0) {
                    $.each(permissions, function (i, e) {
                        var hasRight = false;
                        var permission = $(e).attr('permission') || e.permission || e.id;
                        $.each(permission.split(/\s+/), function (i, key) {
                            if (userRole[key]) {
                                hasRight = true;
                            } else {
                                hasRight = false;
                                return false;
                            }
                        });
                        if (!hasRight) {
                            //删除input的时候，如果在表格里面，将TD也删除
                            var parent = $(e).parent();
                            if (parent && parent[0].nodeName == 'TD') {
                                $(e).parent().remove();
                            }
                            else {
                                $(e).remove();
                            }
                        }
                    });
                }
            }

        };
    });
})();
