/**
 * Created by deng on 2017/7/13.
 */
'use strict';
define(['plugins/App','main/configure','plugins/right'],function(App,Configure,Menu){
    window.App=App;
    window.Menu = Menu;
    window.windowInter = '';

    // if (typeof window.main != 'undefined' && !window.main) {
    //     window.main = {};
    // }
    window.main = {};
    if (jQuery)(function ($){
            $.fn.extend ({
                loadPage: function (url, params, callback) {
                var $this = $(this);
                if (App.getClassOf(params) == 'Function') {
                    callback = params;
                    params = {};
                }
                !params && (params = {});

                var preLoad = url.replace('.html','');
                var action = Configure[preLoad];
                var loadMainPage = function () {
                    require(action.styles || [], function () {
                        $this.empty();
                        $this.load(url, function (data, status, xhr) {
                            var loadList = [];
                            action.loadJs && (loadList = loadList.concat(action.loadJs));
                            require(loadList, function () {
                                $.each(arguments, function (i, arg) {
                                    if (arg) {
                                        App.getClassOf(arg.Render) == 'Function' &&
                                        $(function () {
                                            try {
                                                arg.Render(params);
                                            } catch (e) {
                                                console.error(e);
                                            }
                                        });
                                    }
                                });
                                App.getClassOf(callback) == 'Function' && callback(data, arguments);
                            });
                        });
                    });
                };
                loadMainPage();
            }
            });


        //首先备份下jquery的ajax方法
        var _ajax=$.ajax;

        //重写jquery的ajax方法
        $.ajax=function(opt){
            /*opt.success = function(data, textStatus){
                //统一错误处理
                console.log('[data]:',data)
                console.log('[textStatus]：',textStatus)

                if(!data.success && data.msg){
                    if(data.msg.errorType === '1002'){
                        App.alert({msg:"登录过期，请重新登录系统！"},function () {
                            $('#sysBody').loadPage('partial/login.html');
                        });
                    }else {
                        data.msg = data.msg.message;
                    }
                }
            }*/
            var res = _ajax(opt);
            if(!!res.responseJSON && !res.responseJSON.success && res.responseJSON.msg){
                if(res.responseJSON.msg.errorType === '1002'){
                    App.alert({message:"登录过期，请重新登录系统！"},function () {
                        $('#sysBody').loadPage('partial/login.html');
                    });
                }
            }
            return res
        };

        $(document).ready(function(){

            /*$('img').each(function(){
                var error = false;
                if (!this.complete) {
                    error = true;
                }

                if (typeof this.naturalWidth != "undefined" && this.naturalWidth == 0) {
                    error = true;
                }

                if(error){
                    $(this).bind('error.replaceSrc',function(){
                        this.src = "default_image_here.png";

                        $(this).unbind('error.replaceSrc');
                    }).trigger('load');
                }
            });*/

            // 判断各种浏览器，找到正确的方法 进入全屏
            /*function launchFullscreen (element) {
                if (element.requestFullscreencreen) {
                    element.requestFullScreen()
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen()
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen()
                } else if (element.msRequestFullScreen) {
                    element.msRequestFullScreen()
                }
            }*/
            // 必须用户事件触发（可以是鼠标事件，键盘事件等）
//某个元素全屏
//             launchFullscreen(dom)
// 整个网页全屏!


            /*$('#sysBody').on('click',function () {
                launchFullscreen(document.documentElement)
            })
            $('#sysBody').click();*/
        });

    }(jQuery));

    main.loadSys = function (index) {
        console.time('系统界面加载');
        // Menu.isLogin(isLogin) ? $('#sysBody').loadPage('partial/main.html')
        Menu.isLogin(index)

        // $('#sysBody').loadPage('partial/main.html');
    };
    main.clearInterCharge = function(inter,domId){

        if(!$('#'+domId).length){
            clearInterval(inter);
            return true;
        }
        return false;
    }
});
