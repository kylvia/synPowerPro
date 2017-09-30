define(function () {
    return confMsg
});
var confMsg = {
    interval: '',
    repeat:true,
    Render: function () {
        var _this = this;

        $('.cus-toPage').on('click', function () {
            $('#mainContainer').loadPage($(this).attr('attr-href'));
        });

        //组态信息
        _this.getConfMsg();
        if (_this.interval) clearInterval(_this.interval);

    },
    getConfMsg: function () {
        var _this = this;
        var data = {};
        var dataInter;
        require(['plugins/jtopo-0.4.8-min'], function () {
            CanvasRenderingContext2D.prototype.JtopoDrawPointPath = function (a, b, c, d, e, f, g) {
                var animespeed = (new Date()) / 30;
                var xs = c - a,
                    xy = d - b,
                    l = Math.floor(Math.sqrt(xs * xs + xy * xy)),
                    // l = Math.floor(xs + xy),
                    colorlength = 3,
                    j = l;
                xl = xs / l,
                    yl = xy / l;
                var colorpoint = animespeed % (l + colorlength) - colorlength;

                for (var i = 0; i < j; i++) {
                    if (((i) > colorpoint) && ((i) < (colorpoint + colorlength))) {

                        this.translate(a + i * xl, b + i * yl);
                        this.rotate((Math.atan(xy / xs)));
                        this.drawImage(g, -5, -5, 10, 10);
                        this.rotate(-(Math.atan(xy / xs)));
                        this.translate(-a - i * xl, -b - i * yl);
                    } else {
                        this.beginPath();
                        this.strokeStyle = 'rgb(0,204,204)';
                        this.lineWidth = 3;
                        this.moveTo(a + (i - 1) * xl, b + (i - 1) * yl);
                        this.lineTo(a + i * xl, b + i * yl);
                        this.stroke();
                    }
                }
            };
            var canvas = document.getElementById('canvas');
            if(!canvas){
                console.log('no canvas');
                clearTimeout(dataInter);
                return;
            }
            var stage = new JTopo.Stage(canvas);
            var scene = new JTopo.Scene(stage);
            scene.mode="select";


            // var falgOne = true;
            getDatd(1);
            // requestAnimationFrame(drawCofMsg);
           /* _this.interval = setInterval(function () {
                scene.clear();
                getDatd();
            }, 5000);*/
            function getDatd(falgOne){
                if(main.clearInterCharge(_this.interval,'ps-interval'))return;
                    $.ajax({
                    url:'/interface/getDynamicData',
                    type:'post',
                    dataType:'JSON',
                    success:function (result) {
                        if(result.success){
                            if(!_this.repeat)return;
                            stage.paint();
                            // drawCofMsg(result.data);
                            data = result.data;
                            dataInter = setTimeout(function () {
                                getFlowData()
                            },5000);

                        }else {
                            console.log('error');
                            var isDialog = _this.repeat;
                            _this.repeat = false;
                            isDialog && App.alert(result.msg,function (e) {
                                dataInter = setTimeout(function () {
                                    getFlowData()
                                },5000);
                            });
                        }
                        if(falgOne){
                            requestAnimationFrame(drawCofMsg);
                        }
                    },
                    error:function (e) {
                        console.log('e',e)
                    }
                })
            }


            function getFlowData(){
                getDatd(0);
                scene.clear();
                arr = data.bus_activepower && data.bus_activepower.substring(0,1);
                drawCofMsg();
            }

            function drawCofMsg(){
                if (!canvas.getContext) {
                    window.G_vmlCanvasManager.initElement(canvas);
                }
                //背景颜色设置
                // scene.background = '#CDC5BF';
                // scene.alpha = 0;

                var nodeFlag = 6;
                var beginDrawLink = false;
                function addNode(text, icon, x, y, wid, hei) {
                    var node = new JTopo.Node(text);
                    node.setImage('./images/index/' + icon + '.png', true);
                    node.fontColor = '51,204,255';
                    node.font = "16px Consolas";
                    node.fillColor = '6,21,42';
                    node.setLocation(x + (84 - wid) / 2, y + (84 - hei) / 2);
                    node.dragable = false;
                    node.showSelected = false; // 不显示选中矩形
                    scene.add(node);
                    --nodeFlag;
                    if(!nodeFlag){
                        beginDrawLink = !beginDrawLink;
                    }
                    return node;
                }

                function addLink(nodeA, nodeZ, texts, type, direction) {
                    var link;
                    if (type === 'foldLine') {
                        link = new JTopo.FoldLink(nodeA, nodeZ);
                        link.strokeColor = '0,204,204';
                        link.direction = direction || 'vertical';

                        //路径
                        link.getPath = function (a) {
                            var b = [], c = this.getStartPosition(), d = this.getEndPosition();
                            if (this.nodeA === this.nodeZ) return [c, d];
                            var f, g, h = 1, i = (h - 1) * this.bundleGap,
                                j = this.bundleGap * a - i / 2, l = -26.5;
                            return "horizontal" == this.direction ? (f = d.x + j, g = c.y - j, b.push({
                                x: c.x,
                                y: g + l
                            }), b.push({x: f - 2, y: g + l}), b.push({
                                x: f - 2,
                                y: d.y + 2
                            })) : (f = c.x + j, g = d.y - j, b.push({
                                x: f - 2,
                                y: c.y
                            }), b.push({x: f - 2, y: g - l}), b.push({x: d.x+2, y: g - l})), b
                        }
                    } else {
                        link = new JTopo.Link(nodeA, nodeZ)
                    }
                    link.lineWidth = 3;
                    link.texts = texts;
                    link.font = "14px Consolas";
                    link.fontNameColor = "51,204,255";
                    link.fontValueColor = "0,255,51";
                    link.strokeColor = 'rgb(195,46,63)';
                    link.PointPathColor = "rgb(0,204,204)";
                    link.textAlign = 'bottom';
                    // link.showSelected = !0; // 不显示选中矩形

                    var linkpointimage = new Image();//设置图片
                    linkpointimage.src = "images/index/lineIcon.png";
                    link.PointAnimeImg = linkpointimage;

                    //重写文字样式
                    link.paintText = function (a, b) {
                        var c = b[0], d = b[b.length - 1];
                        if (4 == b.length && (c = b[1], d = b[2]), this.texts && this.texts.length > 0) {
                            var hei = 0;
                            for(var i = 0, len = this.texts.length ;i < len; i++ ){
                                hei += i*15; //文字垂直间隔
                                var j = this.bundleGap * (this.nodeIndex + 1) / 2, e = this.nodeA.x + j * Math.cos(i),
                                    f = this.nodeA.y + j * Math.sin(i);

                                var e = (d.x + c.x) / 2 + this.textOffsetX, f = (d.y + c.y) / 2 + this.textOffsetY;
                                a.save(), a.beginPath(), a.font = this.font;
                                var g = a.measureText(this.text).width, h = a.measureText("ç”°").width;

                                var txtAlign = 0;


                                if(i > 2){ //行数大于3就自动放线条下面去
                                    txtAlign = f - h / 2 + (i - 1)*20
                                }else {
                                    txtAlign = f + (-1 - i)*20
                                }
                                a.fillStyle = "rgba(" + this.fontNameColor + ", " + this.alpha + ")";
                                a.fillText(this.texts[i].name, e - g / 2 - 10, txtAlign);

                                a.fillStyle = "rgba(" + this.fontValueColor + ", " + this.alpha + ")";
                                a.fillText(this.texts[i].value, e - g / 2 + 28, txtAlign);
                            }

                        }
                    };
                    link.paintPath = function (a, b) {
                        if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
                        a.beginPath(),
                            a.moveTo(b[0].x, b[0].y);
                        for (var c = 1; c < b.length; c++) {
                            null == this.dashedPattern ? (
                                (null == this.PointPathColor ? a.lineTo(b[c].x, b[c].y) : a.JtopoDrawPointPath(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, a.strokeStyle, this.PointPathColor, this.PointAnimeImg))
                            ) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
                        }
                        if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
                            var d = b[b.length - 2],
                                e = b[b.length - 1];
                            this.paintArrow(a, d, e)
                        }
                    };

                    //容器边缘对齐
                    link.getStartPosition = function () {
                        var a;
                        return (a = (function (thisl) {
                            var b = thisl.nodeA, c = thisl.nodeZ;
                            var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy),
                                e = b.getBound(),
                                f = JTopo.util.intersectionLineBound(d, e);
                            // f.x += 3 ;
                            return f
                        })(this)),
                        null == a && (a = {
                            // x: this.nodeZ.cx + 3,
                            y: this.nodeZ.cy
                        }), a

                    };
                    link.getEndPosition = function () {
                        var a;
                        return (a = (function (thisl) {
                            var b = thisl.nodeZ, c = thisl.nodeA;
                            var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy),
                                e = b.getBound(),
                                f = JTopo.util.intersectionLineBound(d, e);
                            // f.x + 1 ;
                            return f
                        })(this)),
                        null == a && (a = {
                            x: this.nodeZ.cx ,
                            y: this.nodeZ.cy
                        }), a
                    };

                    scene.add(link);
                    return link;
                }


                // data.bus_activepower.substring(0,1) === '-' ? bpArrow = 'arrow-l' : bpArrow = 'arrow-r';
                var bpLineF = '';
                var bpLineE = '';
                var pdLineF = '';
                var pdLineE = '';

                var arr = data.bus_activepower && data.bus_activepower.substring(0,1);
                // getFlowData();
                /*dataInter = setTimeout(function () {
                    console.log(_this.repeat);
                    getFlowData()
                },5000);*/

                // dataInter = setInterval(getFlowData, 5000);

                drawFlow();
                function drawFlow(){
                    var zcNode = addNode('BMS', 'Battery', 50, 160, 74, 53);
                    var nbqNode = addNode('PCS', 'pcs', 300, 160, 64, 64);
                    var dbNode = addNode('Transformer', 'transformer', 650, 55, 75, 60);
                    var dwNode = addNode('Grid', 'powerGrid', 900, 55, 75, 80);
                    var ydfhNode = addNode('Load', 'load', 850, 250, 64, 64);
                    var dotNode = addNode('', 'dot', 500, 160, 3, 3);

                    if(arr === '-'){
                        bpLineF = nbqNode;
                        bpLineE = zcNode;
                        pdLineF = dotNode;
                        pdLineE = nbqNode;
                    }else {
                        bpLineF = zcNode;
                        bpLineE = nbqNode;
                        pdLineF = nbqNode;
                        pdLineE = dotNode;
                    }

                    if(beginDrawLink){
                        addLink(bpLineF, bpLineE, [{name:'电压: ',value:data.dc_voltage},{name:'电流: ',value:data.dc_current},{name:'功率: ',value:data.dc_power}]);
                        addLink(pdLineF, pdLineE, [{name:'有功: ',value:data.bus_activepower},{name:'无功: ',value:data.bus_reactivepower},{name:'频率: ',value:data.bus_frequency},{name:'电压: ',value:data.bus_voltage},{name:'电流: ',value:data.bus_current}]);
                        addLink(dbNode, dotNode, '', 'foldLine', 'horizontal');
                        addLink(dwNode, dbNode);
                        addLink(dotNode, ydfhNode, '', 'foldLine', 'vertical');

                    }
                }

            }
        })
    },
};