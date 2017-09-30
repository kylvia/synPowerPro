var gulp = require('gulp'),
    plugins = require("gulp-load-plugins")({
        pattern: '*' //让gulp-load-plugins插件能匹配除了gulp插件之外的其他插件
    }),

    merge = require('merge-stream'),
    path = {
        staticFile: 'staticFile/*',
        html: 'html/**/*.html',
        htmlDir: 'dest',
        css: 'css/*.css',
        cssDir: 'dest/css',
        less: 'less/**/*.less',
        js: ['js/**/*.js', '!js/**/*.min.js', 'js/**/*.min.js', 'js/**/*.json', 'js/**/*'],
        jsDir: 'dest/js',
        images: 'images/**/*.+(jpg|png|gif|svg|ico)',
        imagesDir: 'dest/images',
        MockData: './dataJs/*'
    },
    middleware = [],
    isMock = true;

var fs = require('fs');

// 第三方插件管理
gulp.task('vendor', function () {
    return merge(
        gulp.src('node_modules/jquery/dist/*.*')
            .pipe(gulp.dest('dest/js/vendor/jquery')),
        gulp.src('node_modules/bootstrap/dist/**/*')
            .pipe(gulp.dest('dest/js/vendor/bootstrap'))
    );
});
//压缩css,压缩后的文件放入dest/css
gulp.task('minifycss', function () {
    return gulp.src(path.css)
        // .pipe(plugins.cssmin()) //压缩
        .pipe(gulp.dest(path.cssDir));//输出
});
//静态资源，文件放入dest/
gulp.task('staticFile', function () {
    return gulp.src(path.staticFile)
        // .pipe(plugins.cssmin()) //压缩
        .pipe(gulp.dest(path.htmlDir));//输出
});

//合并并压缩css，合并压缩后的文件放入dest/css
gulp.task('concatminifycss', function () {
    return gulp.src(path.css)
        .pipe(plugins.concat('main.css'))    //合并所有css到main.css
        //.pipe(gulp.dest(path.cssDir))    //输出main.css到文件夹
        //.pipe(plugins.rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(plugins.cssmin())//压缩
        .pipe(gulp.dest(path.cssDir));//输出
});

//压缩js，压缩后的文件放入dest/js
gulp.task('minifyjs', function () {
    return gulp.src(path.js.slice(0, 1))
        // .pipe(plugins.uglify())//压缩
        .pipe(gulp.dest(path.jsDir));//输出
});

//合并并压缩js，合并压缩后的文件放入dest/js
gulp.task('concatminifyjs', function () {
    return gulp.src(path.js.slice(0, 1))
        .pipe(plugins.concat('main.js'))    //合并所有js到main.js
        .pipe(gulp.dest(path.jsDir))    //输出main.js到文件夹
        .pipe(plugins.rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(plugins.uglify())//压缩
        .pipe(gulp.dest(path.jsDir));//输出
});
gulp.task('unscripts', function () {
    return gulp.src(path.js.slice(2))
        .pipe(gulp.dest(path.jsDir));
});
//合并并压缩html，合并压缩后的文件放入dest/
gulp.task('html', function () {
    gulp.src(path.html)
        .pipe(plugins.replace('__VERSION', Date.now().toString(16)))
        .pipe(plugins.htmlmin({
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        }))
        .pipe(gulp.dest(path.htmlDir))
        .pipe(plugins.browserSync.stream());
});
//压缩图片，压缩后的文件放入dest/images
gulp.task('image', function () {
    gulp.src(path.images)
        .pipe(plugins.imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(path.imagesDir));//输出
});

//执行压缩前，先删除dest文件夹里的内容
gulp.task('clean', function (cb) {
    plugins.del(['dest/*'], cb)
});

//编译less到css
gulp.task("less", function () {
    gulp.src(path.less)
        .pipe(plugins.less())
        .pipe(gulp.dest(path.cssDir));

});
//监视文件的变化
gulp.task("watch", function () {
    gulp.watch(path.less, ['less']);
    gulp.watch(path.css, ['minifycss']);
    gulp.watch(path.html, ['html']);
    gulp.watch(path.images, ['image']);
    gulp.watch(path.js[4], ['unscripts', 'minifyjs']);
});
gulp.task("build", ["clean"], function (cb) {
    if(isMock){
        plugins.runSequence(['staticFile','minifycss','MockData', 'image', 'less', 'vendor', 'minifyjs', 'unscripts', 'html', "watch"], cb);

    }else{
        plugins.runSequence(['staticFile','minifycss', 'image', 'less', 'vendor', 'minifyjs', 'unscripts', 'html', "watch"], cb);

    }
});
// MockData
gulp.task('MockData', function (){
    var baseUrl = 'dataJs';
    var appendData='';
    var mockJsFile = './js/main/MockData.js';
    var files;
    fs.writeFileSync(mockJsFile,'define( [ \'../plugins/mock-min\'], function (Mock) {\n' +
        'var errorData = {"success": false,"data": null,"failCode": 404,"params": null,"message": "没有找到此文件"};\n','utf8'); //同步写入
    if (fs.existsSync(baseUrl)) { //获取目录下的文件
        files = fs.readdirSync(baseUrl);

        for(var i = 0,fileLen = files.length;i < fileLen; i++){
            var _thisFile = files[i];
            var objName = _thisFile.replace('.js','');
            var requireFile = "./"+baseUrl+"/"+objName;
            var _thisObj = require(requireFile);
            for(var item in _thisObj){
                var _thisTemplate = _thisObj[item];
                if(typeof _thisObj[item] === "object"){
                    _thisTemplate = JSON.stringify(_thisTemplate);
                }
                appendData = 'Mock.mock("/'+objName+'/'+item+'",'+_thisTemplate+');\n';
                fs.appendFileSync(mockJsFile,appendData,'utf8');
            }
        }
        var weather = 'Mock.mock("http://api.map.baidu.com/telematics/v3/weather?callback=jQuery213032161341261632215_1501509035094&location=104.079373%2C30.629169&output=json&ak=t5uryEXGfrHPNNGbgam7eEl2",{"error":0,"status":"success","date":"2017-07-31","results":[{"currentCity":"成都市","pm25":"55","index":[{"title":"穿衣","zs":"炎热","tipt":"穿衣指数","des":"天气炎热，建议着短衫、短裙、短裤、薄型T恤衫等清凉夏季服装。"},{"title":"洗车","zs":"不宜","tipt":"洗车指数","des":"不宜洗车，未来24小时内有雨，如果在此期间洗车，雨水和路上的泥水可能会再次弄脏您的爱车。"},{"title":"感冒","zs":"少发","tipt":"感冒指数","des":"各项气象条件适宜，发生感冒机率较低。但请避免长期处于空调房间中，以防感冒。"},{"title":"运动","zs":"较不宜","tipt":"运动指数","des":"有降水，推荐您在室内进行低强度运动；若坚持户外运动，须注意选择避雨防滑地点，并携带雨具。"},{"title":"紫外线强度","zs":"弱","tipt":"紫外线强度指数","des":"紫外线强度较弱，建议出门前涂擦SPF在12-15之间、PA+的防晒护肤品。"}],"weather_data":[{"date":"周一 07月31日 (实时：31℃)","dayPictureUrl":"http://api.map.baidu.com/images/weather/day/xiaoyu.png","nightPictureUrl":"http://api.map.baidu.com/images/weather/night/xiaoyu.png","weather":"小雨","wind":"无持续风向微风","temperature":"31 ~ 24℃"},{"date":"周二","dayPictureUrl":"http://api.map.baidu.com/images/weather/day/zhenyu.png","nightPictureUrl":"http://api.map.baidu.com/images/weather/night/xiaoyu.png","weather":"阵雨转小雨","wind":"无持续风向微风","temperature":"33 ~ 25℃"},{"date":"周三","dayPictureUrl":"http://api.map.baidu.com/images/weather/day/duoyun.png","nightPictureUrl":"http://api.map.baidu.com/images/weather/night/xiaoyu.png","weather":"多云转小雨","wind":"无持续风向微风","temperature":"33 ~ 26℃"},{"date":"周四","dayPictureUrl":"http://api.map.baidu.com/images/weather/day/duoyun.png","nightPictureUrl":"http://api.map.baidu.com/images/weather/night/xiaoyu.png","weather":"多云转小雨","wind":"无持续风向微风","temperature":"34 ~ 23℃"}]}]});';
        fs.appendFileSync(mockJsFile,weather+'\n   ' ,'utf8');
        var reg = /^\//;
        fs.appendFileSync(mockJsFile,'\n  $.ajaxPrefilter(function (options, originalOptions, jqXHR) { if((options.type).toUpperCase() == \'GET\'){options.cache = true;} (!('+reg+'.test(options.url))) && (options.url = "/" + options.url)});\n }); ' ,'utf8');

        console.log('copy Done');
        //createStreamFile();
    } else {
        console.log(baseUrl + "  Not Found!");
    }

});
//同步刷新
gulp.task("serve", ['staticFile','minifycss','MockData', 'image', 'less', 'vendor', 'minifyjs', 'unscripts', 'html', "watch"], function () {

    var path = require('path');
    var url = require('url');
// var uuid = require('uuid');
    var Mock = require('mockjs');
    var proxyMiddleware = require('http-proxy-middleware');
    if(isMock){
        middleware=function (req, res, next) {
            var urlObj = url.parse(req.url, true),
                method = req.method,
                paramObj = urlObj.query,
                mockUrl,
                newSearch = '';

            if (urlObj.pathname.match(/\..+$/) || urlObj.pathname.match(/\/$/)) {
                next();
                return;
            }
            // console.log('[requist] ', method, urlObj.pathname, paramObj);
            var rts = /([?&])_=[^&]*/;
            if(rts.test( req.url)){
                delete paramObj._;

                if(JSON.stringify(paramObj) !== "{}"){
                    newSearch = '?';
                    newSearch += JSON.stringify(paramObj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
                }
            }

            var pathTree = urlObj.pathname.split('/');
            // console.log('[pathTree]',pathTree);
            var mockDataFile = path.join(__dirname + path.sep + 'dataJs', pathTree[1]) + ".js";
            // console.log('[mockDataFile]',mockDataFile);
            fs.access(mockDataFile, fs.F_OK, function (err) {
                var isImage = req.headers.accept.indexOf('image') != -1;
                // console.log('[err]',err);
                if (err) {
                    var c = {
                        "success": false,
                        "data": null,
                        "failCode": 404,
                        "params": null,
                        "message": "无响应数据",
                        "notFound": mockDataFile
                    };
                    //console.log('[response] ', c);
                    res.setHeader('Content-Type', (isImage ? 'image/*' : 'application/json'));
                    res.end(JSON.stringify(c));
                    next();
                    return;
                }

                try {
                    delete require.cache[require.resolve(mockDataFile)];
                    var data = require(mockDataFile) || {};
                    var curNode = pathTree[2];
                    if(!pathTree[2])curNode = pathTree[1];
                    var result,mockUrl = curNode+newSearch;
                    // console.log('[mockUrl]',mockUrl);
                    if(data[mockUrl] && typeof data[mockUrl] === "object"){
                        result = Mock.mock(data[mockUrl]);
                    }else if(data[mockUrl]){
                        var params={body: JSON.stringify(paramObj)};
                        result = Mock.mock(data[mockUrl](params));
                    }
                    isImage && (result = Mock.Random.image(data[pathTree[2]]));
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Content-Type', (isImage ? 'image/!*' : 'application/json'));
                    // res.setHeader('tokenId', uuid.v1());
                    var s = result || {
                            "success": false,
                            "data": null,
                            "failCode": 0,
                            "params": null,
                            "message": null
                        };
                    //console.log('[response] ', JSON.stringify(s));
                    res.end(JSON.stringify(s) || s);
                } catch (e) {
                    console.error(e);
                }
            });
            //next();
        }
    }else{
        var host = 'http://192.168.1.127:8080';
        middleware = [
            proxyMiddleware(['/interface/loginAuth'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/updatePassword'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/isLogin'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getPlantInfo'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getPlantStatus'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getPlantPosition'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getStatistics'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getPlantRevenue'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getRevenueBar'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getChargeTimes'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getChargedBar'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getPowerCurve'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getCurrentEMS'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getDynamicData'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getCurrentPCS'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/setControlAuthority'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getCurrentSet'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/startOrTurnOff'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/setXFTG_en'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/setChargeTime'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/setActivePower'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/setRunningMode'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/setReactivePower'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/checkUserRights'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getSingleDevicePower'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getCurrentBMS'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/alarmQuery'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/alarmClean'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/alarmConfirm'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/getDevList'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/bmsHisData'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/pcsHisData'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/meterHisData'], {target: host, changeOrigin: true}),
            proxyMiddleware(['/interface/runningReport'], {target: host, changeOrigin: true})
        ];
    }
    plugins.browserSync({
        //files: '/build/**', //监听整个项目
        open: 'local', // 'external' 打开外部URL, 'local' 打开本地主机URL
//        https: true,
        port: 80,
        online: false,
        notify: false,
        logLevel: "info",
        logPrefix: "test",
        logConnections: true, //日志中记录连接
        logFileChanges: true, //日志信息有关更改的文件
        scrollProportionally: false, //视口同步到顶部位置
        ghostMode: {
            clicks: false,
            forms: false,
            scroll: false
        },
        server: {
            baseDir: './dest',
            middleware: middleware
        }
    });

});

//默认命令，在cmd中输入gulp后，执行的就是这个命令
gulp.task('default', ['serve']);