define(function(){
    return plantMap
});
var plantMap = {
    Render:function () {

        this.getLocation();

    },

    getLocation:function () {
        var _this = this;
        $.ajax({
            url:'/interface/getPlantInfo',
            type:'post',
            dataType:'JSON',
            data:JSON.stringify({token:Cookies.getCook('token')}),
            success:function (result) {
                if(result.success){
                    _this.setMap(result.data.loaction)
                }else {
                    App.alert(result.msg);
                }
            },
            error:function (e) {
                console.log(e)
            }
        })
    },
    setMap:function (center) {
        var _this = this;
        require(['MapUtil'],function (MapUtil) {
            if(!$('#plantMap').length) return;
            var map = L.map('plantMap', {
                center: center || [],
                zoomControl:false,
                attributionControl:false,
                zoom: 8
            });
            L.tileLayer.provider('Google.Satellite.Map').addTo(map);
            function getRandomLatLng(map){
                return L.latLng(center);
            }
            var markers = L.markerClusterGroup();
            markers.addLayer(L.marker(getRandomLatLng(map)));
            map.addLayer(markers);
        })
    }
};