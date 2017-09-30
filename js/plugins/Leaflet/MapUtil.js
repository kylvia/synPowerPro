"use strict";
define([
    // 'css!plugins/Leaflet/leaflet.search.min.css',
    'css!plugins/Leaflet/L.Control.Basemaps.css',
    'css!plugins/Leaflet/MarkerCluster.css',
    'plugins/Leaflet/leaflet.providers',
    'plugins/Leaflet/leaflet.awesome-markers',
    'plugins/Leaflet/leaflet.markercluster',
    // 'Leaflet/Leaflet.activearea',
    // 'plugins/Leaflet/leaflet.search.min',
    'plugins/Leaflet/L.Control.Basemaps'
], function () {
    var MapUtil = {
        ready: false,
        Cache: [], // 缓存数据
        defaultLanguage: 'zh',

        //theme: {
        //    'default': 'openstreet', // 默认主题 （openstreetmap地图）
        //    'streets': 'streets-v10', // 2D地图
        //    'satellite': 'satellite-v9', // 卫星地图（无街道等浮标信息）
        //    'outdoors': 'outdoors-v10', // 等高线地图
        //    'dark': 'dark-v9', // 暗色主题
        //    'light': 'light-v9', // 亮色主题
        //    'satellite-streets': 'satellite-streets-v10' // 卫星街道地图
        //},

        OptionTemplates: {
            "default": {
                zoomLevel: 3,
                minZoom: 3,
                maxZoom: 17,
                controls: {
                    zoomControl: {
                        show: true,
                        position: 'topleft',
                        zoomInTitle: "放大",
                        zoomOutTitle: "缩小"
                    },
                    scaleControl: {
                        show: true
                    },
                    mapTypeControl: {
                        show: true,
                        position: 'bottomright',
                        tileX: 0,
                        tileY: 0,
                        tileZ: 0,
                        layers: ['satellite', '2D']
                    }
                }
            },
            "streets": {
                zoomLevel: 3,
                minZoom: 3,
                maxZoom: 17,
                controls: {
                    zoomControl: {
                        show: true,
                        position: 'topleft',
                        zoomInTitle: "放大",
                        zoomOutTitle: ""
                    },
                    scaleControl: {
                        show: true,
                        position: 'bottomleft'
                    },
                    mapTypeControl: {
                        show: false,
                        position: 'bottomright',
                        tileX: 0,
                        tileY: 0,
                        tileZ: 0,
                        layers: ['satellite', '2D']
                    },
                    searchControl: {
                        show: true
                    }
                },
                mapType: 0
            },
            "plants": {
                zoomLevel: 3,
                minZoom: 3,
                maxZoom: 17,
                controls: {
                    zoomControl: {
                        show: false
                    },
                    scaleControl: {
                        show: false
                    },
                    mapTypeControl: {
                        show: false,
                        layers: ['satellite']
                    }
                },
                mapType: 1
            }
        },

        /**
         * 绘制并初始化地图
         * @param id 容器ID
         * @param option 配置参数
         * @returns {MapUtil}
         */
        Instance: function (id, option) {
            this.ready = !!(window.L);
            var self = this;

            try {
                if (this.Cache[id]) {
                    this.Cache[id].map && this.Cache[id].map.remove();
                }

                var p = this.option = {
                    map: {},
                    option: $.extend(true, {}, this.OptionTemplates[option.theme || 'default'], option),
                    container: id
                };
                var lng = p.option.center[0];
                var lat = p.option.center[1];

                var tileLayers = [], initLayer = [];
                if (p.option.mapType) {
                    initLayer.push(L.tileLayer.provider('Google.Satellite', {language: (p.option.language || self.defaultLanguage)}));
                } else {
                    initLayer.push(L.tileLayer.provider('Google.Normal', {language: (p.option.language || self.defaultLanguage)}));
                }
                tileLayers.push(initLayer);

                // 创建地图实例
                p.map = L.map(p.container, {
                    center: this.createPoint(lng, lat),
                    zoom: p.option.zoomLevel || 5,
                    minZoom: 3,
                    maxZoom: 15,
                    layers: initLayer,
                    zoomControl: false,
                    attributionControl: false,
                    inertia: true,
                    worldCopyJump: true,
                    keyboard: false,
                    //maxBounds: [[0, 0], [180, 90], [-180, -90]]
                });
                p.option.activeArea && p.map.setActiveArea(p.option.activeArea);

                /* TODO 添加控件 */
                if (p.option.controls) {
                    // 地图类型切换控件
                    if (p.option.controls.mapTypeControl && p.option.controls.mapTypeControl.show) {
                        $.each(p.option.controls.mapTypeControl.layers, function (idx, layerName) {
                            if ("2D" == layerName) {
                                if (p.option.mapType != 0) {
                                    tileLayers.unshift([L.tileLayer.provider('Google.Normal', {language: (p.option.language || self.defaultLanguage)})]);
                                }
                            } else if ("satellite" == layerName) {
                                if (p.option.mapType != 1) {
                                    tileLayers.unshift([L.tileLayer.provider('Google.Satellite', {language: (p.option.language || self.defaultLanguage)})]);
                                }
                            }
                        });
                        p.map.addControl(L.control.basemaps({
                            position: p.option.controls.mapTypeControl.position || 'bottomright',
                            tileLayers: tileLayers,
                            tileX: p.option.controls.mapTypeControl.tileX || 1,
                            tileY: p.option.controls.mapTypeControl.tileY || 0,
                            tileZ: p.option.controls.mapTypeControl.tileZ || 1
                        }));
                    }
                    // 比例尺
                    if (p.option.controls.scaleControl && p.option.controls.scaleControl.show) {
                        p.map.addControl(L.control.scale({
                            position: p.option.controls.scaleControl.position || 'bottomleft',
                            maxWidth: p.option.controls.scaleControl.maxWidth || 100,
                            metric: p.option.controls.scaleControl.metric || true,
                            imperial: p.option.controls.scaleControl.imperial || true
                        }));
                    }
                    // 缩放控件
                    if (p.option.controls.zoomControl && p.option.controls.zoomControl.show) {
                        p.map.addControl(L.control.zoom({
                            position: p.option.controls.zoomControl.position || 'topleft',
                            zoomInText: p.option.controls.zoomControl.zoomInText || '+',
                            zoomInTitle: p.option.controls.zoomControl.zoomInTitle || 'Zoom in',
                            zoomOutText: p.option.controls.zoomControl.zoomOutText || '-',
                            zoomOutTitle: p.option.controls.zoomControl.zoomOutTitle || 'Zoom out'
                        }));
                    }
                }

                this.Cache[id] = this.option;
            } catch (e) {
                console.info(e);
            }

            return this;
        },

        /**
         * 创建坐标点（Point）
         * @param lng 经度
         * @param lat 纬度
         * @return {* || o.LatLng}
         */
        createPoint: function (lng, lat) {
            if (!this.ready) return null;
            return new L.LatLng(lat, lng);
        },

        /**
         * 创建像素位置
         * @param x
         * @param y
         * @return {* || o.point}
         */
        createPixel: function (x, y) {
            if (!this.ready) return null;
            return L.point(x, y);
        },

        /**
         * 创建图标（Icon）
         * @param options 图标样式参数
         * <pre>
         *     {
         *          iconUrl: './images/marker-icon.png', // 图标图片地址
         *          iconSize: [38, 95], // 图标大小[x, y]
         *          iconAnchor: [22, 94], // 图标标识中心位置[x, y]
         *          popupAnchor: [-3, -76], // 弹出层指向图标位置[x, y]
         *          shadowUrl: './images/marker-shadow.png', // 图标阴影图层
         *          shadowSize: [68, 95], // 阴影大小[x, y]
         *          shadowAnchor: [22, 94] // 阴影标识中心位置[x, y]
         *     }
         * </pre>
         * @returns {* || o.Icon || L.AwesomeMarkers.Icon}
         */
        createIcon: function (options) {
            if (!this.ready) return null;
            var icon = L.icon($.extend({
                iconUrl: '/js/Leaflet/images/marker-icon.png',
                iconSize: [25, 38],
                iconAnchor: [15, 36],
                popupAnchor: [-1, -50],
                shadowUrl: '/js/Leaflet/images/marker-shadow.png',
                shadowSize: [25, 38],
                shadowAnchor: [13, 38]
            }, options));
            return icon || L.Icon.Default();
        },

        /**
         * 创建预定义标注点图标（AwesomeMarkersIcon）
         * @param options 图标参数
         * <pre>
         *     {<br>
         *          icon: 'home', // 图标名称，如：（'home', 'glass', 'flag', 'star', 'bookmark', ....）* 所有在：http://fortawesome.github.io/Font-Awesome/icons/，http://getbootstrap.com/components/#glyphicons，http://ionicons.com中的图标可以直接使用<br>
         *          prefix: 'glyphicon', // 图标前缀，可选图标库'glyphicon'（bootstrap 3）、'fa'(FontAwesome)<br>
         *          markerColor: 'blue', // 标注点颜色（可选值：'red', 'darkred', 'orange', 'green', 'darkgreen', 'blue', 'purple', 'darkpuple', 'cadetblue'）<br>
         *          iconColor: 'white', // 图标颜色（可选值：'white', 'black' 或者 颜色值 (hex, rgba 等)<br>
         *          spin: false, // 是否转动，* FontAwesome图标必填！<br>
         *          extraClasses: '' // 为Icon生成标签添加指定自定义的 class 属性，如：'fa-rotate90 myclass'<br>
         *     }<br>
         * </pre>
         * @returns {* || L.AwesomeMarkers.Icon}
         */
        createAwesomeMarkersIcon: function (options) {
            if (!this.ready) return null;
            var icon = L.AwesomeMarkers.icon($.extend({
                icon: 'home',
                prefix: 'glyphicon',
                markerColor: 'blue',
                iconColor: 'white',
                spin: true
            }, options));
            return icon || L.Icon.Default();
        },

        /**
         * 创建标注点(Marker)
         *
         * @param point {L.point} 点对象
         * @param options {*} 参数
         *  <pre>
         *      {<br>
         *          icon: L.Icon.Default(), // {L.Icon || L.AwesomeMarkers.Icon} 默认图标<br>
         *          draggable: true, // 使图标可拖拽<br>
         *          title: 'Title', // 添加一个标题<br>
         *          opacity: 0.5 // 设置透明度<br>
         *      }<br>
         *  </pre>
         * @return {Marker}
         */
        createMarker: function (point, options) {
            if (!this.ready) return null;
            options = $.extend({
                draggable: false,
                opacity: 1
            }, options);

            var marker = L.marker(point, options);
            options.popup && marker.bindPopup(options.popup, {
                autoPan: true,
                keepInView: true,
                maxWidth: 950,
                closeButton: false,
                autoPanPadding: [15, 15]
            }).openPopup();
            options.tooltip && marker.bindTooltip(options.tooltip, {
                direction: 'right',
                permanent: true,
                opacity: 0.7,
                offset: [8, -8]
            }).openTooltip();
            // 添加事件
            if (options && options.events) {
                for (var event in options.events) {
                    options.events.hasOwnProperty(event)
                    && options.events[event]
                    && (typeof options.events[event] == 'function')
                    && marker.on(event, function (e) {
                        options.events[e.type](e);
                    });
                }
            }
            return marker;
        },

        /**
         * 创建域标注点
         * @param map
         * @param center
         * @param radius
         * @param options
         * @returns {Highcharts.theme.plotOptions.line.marker}
         */
        createDomainMarker: function (map, center, radius, options) {
            var cssIcon = L.divIcon({
                className: 'domain-icon',
                html: '<div class="domain-wrapper">'  + options.content + '</div>',
                iconSize: [radius || 60, radius || 60],
                iconAnchor: [(radius || 60) / 2, (radius || 60) / 3]
            });
            var marker = new L.marker(center, {
                icon: cssIcon,
                domainId:options.domainId
            });
            if (options && options.events) {
                for (var event in options.events) {
                    options.events.hasOwnProperty(event)
                    && options.events[event]
                    && (typeof options.events[event] == 'function')
                    && marker.on(event, function (e) {
                        options.events[e.type](e);
                    });
                }
            }
            return marker;
        },

        /**
         * 添加一个标注点到地图
         * @param map {Map} 地图
         * @param marker {Marker} 标注点对象
         */
        addMarker: function (map, marker) {
            if (!this.ready) return this;
            marker && marker.addTo(map);
            return this;
        },

        /**
         * 添加若干个注点到地图，并返回点聚合对象
         * @param map {Map} 地图对象
         * @param cluster {MarkerClusterGroup} 点聚合对象，如果不存在，会自动创建一个聚合对象
         * @param markers {Array<Marker>} 标注点数组
         * @return {* || MarkerClusterGroup} 返回添加点聚合对象
         */
        addCluster: function (map, cluster, markers) {
            if (!this.ready) return {};
            if (markers && markers.length > 0) {
                if (!cluster) {
                    cluster = new L.MarkerClusterGroup({
                        spiderfyOnMaxZoom: true,
                        showCoverageOnHover: false,
                        zoomToBoundsOnClick: true,
                        spiderLegPolylineOptions: {
                            weight: 1.5,
                            color: '#222',
                            opacity: 0.5
                        }
                    });
                }

                for (var i = 0; i < markers.length; i++) {
                    cluster.addLayer(markers[i]);
                }

                map && map.addLayer && map.addLayer(cluster);
            }
            return cluster;
        },

        /**
         * 添加地图搜索控件
         * @param map
         * @param layerGroup {L.layerGroup}
         * @param options
         * @returns {*}
         */
        addSearchControl: function (map, layerGroup, options) {
            if (!this.ready) return {};
            var searchControl = new L.Control.Search($.extend({
                position: 'topleft',
                layer: layerGroup,
                initial: false,
                zoom: 12,
                marker: false,
                propertyName: 'tooltip',
                collapsed: false,
                textErr: '无法找到该电站',	//error message
                textCancel: '取消',		    //title in cancel button
                textPlaceholder: '请输入电站名...'   //placeholder value
            }, options));
            map && map.addControl && map.addControl(searchControl);

            return searchControl;
        },

        /**
         * 使地图自适应显示到合适的范围
         *
         * @return {LatLng} 新的中心点
         */
        fitView: function (map) {
            if(!(map && map.getCenter)) return;
            if (!this.ready) return map.getCenter();
            var bounds = new L.LatLngBounds();
            map.eachLayer(function (t, e) {
                try {
                    if (typeof(t.getBounds)=="function") {
                        t.getBounds() && bounds.extend(t.getBounds());
                    } else if (typeof(t.getLatLng)=="function") {
                        t.getLatLng() && bounds.extend(t.getLatLng());
                    }
                } catch (e) {
                }
            });
            //当地图上无任何域或者电站显示时, 不做fitBounds操作
            return bounds.isValid() && map.fitBounds(bounds);
        },

        /**
         * 定位到指定点
         * @param map
         * @param lng 经度
         * @param lat 纬度
         * @param zoomLevel 定位缩放级别（默认最大）
         * @param success 定位成功回调方法
         * @param error 定位失败回调方法
         */
        panToPoint: function (map, lng, lat, zoomLevel, success, error) {
            if (!this.ready) error && error instanceof Function && error();
            var p = this.createPoint(lng, lat);
            if (zoomLevel) {
                map.setZoom(zoomLevel);
                setTimeout(function () {
                    map.panTo(p);
                }, 500);
            }
            else {
                setTimeout(function () {
                    this.fitView(map);
                }, 200);
            }
            success && success instanceof Function && success();
        },

        /**
         * 清除地图
         * @param map
         * @return {MapUtil}
         */
        clearMap: function (map) {
            if (!this.ready) return this;
            map.remove();
            return this;
        },

        /**
         * 创建layerGroup, 用于保存电子围栏, 电站域, 电站等的标注信息, 重绘前可以方便的直接删除整个layerGroup
         * @param map
         * @returns {*}
         */
        createMarkerGroup: function (map) {
            var markerGroup = L.layerGroup().addTo(map);
            return markerGroup;
        },

        /**
         * 绘制折线
         * @param map
         * @param lineArr {Array.<LatLng>} 折线各端点坐标
         * @param properties {Object}
         */
        polyline: function (map, lineArr, properties) {
            var p = new L.polyline(lineArr, {
                color: (properties && properties.color) || 'red',            // 线颜色
                opacity: (properties && properties.opacity) || 1,            // 线透明度
                weight: (properties && properties.weight) || 2              // 线宽
            });
            p.addTo(map);

            return p;
        },

        /**
         * 绘制多边形
         * @param map
         * @param gonArr {Array.<LatLng>} 多边形各顶点坐标
         * @param properties {Object}
         */
        polygon: function (map, gonArr, properties) {
            var p = new L.polygon(gonArr, $.extend({
                strokeColor: (properties && properties.color) || "#0000ff",
                strokeOpacity: (properties && properties.strokeOpacity) || 1,
                strokeWeight: (properties && properties.weight) || 2,
                fillColor: (properties && properties.fillColor) || "#f5deb3",
                fillOpacity: (properties && properties.fillOpacity) || 0.35
            },properties));
            p.addTo(map);

            return p;
        },

        /**
         * 绘制圆
         * @param map
         * @param center {LatLng} 圆心经纬度坐标
         * @param radius {Number} 半径
         * @param properties {Object}
         */
        circle: function (map, center, radius, properties) {
            return new L.circle(center, {
                opacity: (properties && properties.opacity) || 0.2,
                color: (properties && properties.color) || "orange", //线颜色
                fillColor: (properties && properties.fillColor) || "#ff0", //填充颜色
                fillOpacity: (properties && properties.fillOpacity) || 0.6,//填充透明度
                radius: radius
            });
        },
        /**
         * 打开信息窗体
         *
         * @param map {Map} 地图
         * @param infoWindow {InfoWindow} 信息窗体
         * @param position {Position} 显示位置
         */
        openInfoWindow: function (map,e,p) {    //, infoWindow, position
            var latLng = {"lat": 1, "lng": 1};
            var popup = new L.popup();
            function onMapClick(e) {
                popup.setLatLng(latLng)
                    .setContent("You clicked the map at " + e.latlng.toString())
                    .openOn(map);
            }
            map.on('click', onMapClick);
        },
        /**
         * 标注点击选择菜单(自定义窗体)
         * @returns {InfoWindow}
         */
        getMenuWindow: function(map, opt){

            var mWin = $('<div style="width: 152%"></div>');
            var menu = $('<div class="selectMenu"></div>');
            menu.css({'margin':'0 -5px -10px 0',
                'border':'1px solid #d3d3d3',
                'float': 'right',
                'background-color':'rgba(255, 255, 255, 0.5)',
                'font-size': '13px',
                'color': '#232323',
                'text-align': 'center',
                'box-shadow': '0 5px 32px #d3d4d5',
                'border-radius': '4px',
                'overflow':'hidden'
            });
            if(opt && typeof opt != 'undefined' && opt.length > 0){
                for(var i = 0; i < opt.length; i++){
                    var selectItem = $('<div class="selectItem"></div>');
                    selectItem.html("<span>"+opt[i].name+"</span>");
                    selectItem.css({'padding': '6px 12px', 'cursor': 'pointer','border-bottom': '1px solid #d3d3d3'});
                    selectItem.hover(function(){
                        $(this).css({'background-color': 'rgba(168, 168, 168, 0.6)', 'color': '#fefefe'});
                    },function(){
                        $(this).css({'background-color': 'rgba(255, 255, 255, 0)', 'color': '#232323'});
                    });
                    !function(i){
                        var action = opt[i].action;
                        selectItem.bind('click',action,function(){
                            action();
//	            			MapUtil.closeInfoWindow(map);
                            map.closePopup();
                        });
                    }(i);
                    menu.append(selectItem);
                }
            };
            //var menuWindow = new L.popup();
            mWin.append(menu[0]);
            var menuWindow = mWin[0];
            //menuWindow.setContent(mWin[0]);
            return menuWindow;
        },
    };

    return MapUtil;
});