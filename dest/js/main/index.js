/**
 * Created by deng on 2017/7/13.
 */
require.config({
    baseUrl:'/js/',
    paths: {
        'jquery': 'vendor/jquery/jquery.min',
        'validation': 'plugins/jquery-validation/dist/jquery.validate',
        'messagesZh': 'plugins/jquery-validation/dist/localization/messages_zh',
        'metadata': 'plugins/jquery-validation/jquery.metadata',
        'mustache': 'plugins/mustache.min',
        'bootstrap': 'vendor/bootstrap/js/bootstrap',
        'bootstrap-table': 'plugins/bootstrap-table/bootstrap-table',
        'bootstrap-table-zh': 'plugins/bootstrap-table/bootstrap-table-zh-CN',
        'mCustomScrollbar': 'plugins/mCustomScrollbar/jquery.mCustomScrollbar.concat.min',
        'App': 'plugins/App',
        'main': 'main',
        'jsLang': 'jsLang',
        'Cookies': 'plugins/Cookies',
        'md5': 'plugins/md5',
        'echarts': 'plugins/echarts/echarts.min',
        'leaflet':'plugins/Leaflet/leaflet',
        'WdatePicker':'plugins/My97DatePicker/WdatePicker',
        'MapUtil':'plugins/Leaflet/MapUtil'
    },
    shim:{
        'validation':['jquery'],
        'bootstrap':['jquery','css!vendor/bootstrap/css/bootstrap.css'],
        'bootstrap-table':['bootstrap','css!plugins/bootstrap-table/bootstrap-table.css'],
        'bootstrap-table-zh':['bootstrap-table'],
        'leaflet':['css!plugins/Leaflet/leaflet.css'],
        'mCustomScrollbar':['jquery','css!plugins/mCustomScrollbar/jquery.mCustomScrollbar.min.css'],
        'MapUtil':['leaflet'],
        'right':['Cookies']
    },
    waitSeconds: 15
});
// 使用 Mock
require(["jquery",
    "echarts",
    "mustache",
    "WdatePicker",
    "jsLang",
    "Cookies",
    "validation",
    "md5",
    "bootstrap",
    "mCustomScrollbar",
    "bootstrap-table",
    "bootstrap-table-zh"],function($,echarts,mustache){
    require([
        "main",
        // "messagesZh",
        "metadata",
        "css!/css/index.css"],function(){

        $(function(){
            window.Echarts=echarts;
            window.Mustache = mustache;
            var isMock = false;
            if(isMock){
                require(['./main/MockData'],function () {
                    main.loadSys(1);
                })

            }else {
                main.loadSys(1);
            }

            $("body").mCustomScrollbar({
                theme:"3d",
                axis:"yx" // vertical and horizontal scrollbar
            });
        })
    });
});