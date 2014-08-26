var geoApp = null;

var App = function()
{
    var me = this;
    
    this.options = {
        center:    new google.maps.LatLng(53.51333, -0.0889),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom:      12        
    };
    
    this.marker = null;
    this.map = null;
    this.lastll = null;
    
    this.onSuccess = function(position) 
    {
        var ll = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
        me.lastll = ll;
        
        if (me.map === null)
        {
            me.map = new google.maps.Map(document.getElementById("map_canvas"), me.options);
            
            me.marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,                
                map:       me.map,
                position:  ll,
                title:     'Your location'
            });
            
            me.map.panTo(ll);
        }
        
        if (me.map !== null && me.marker !== null)
        {
            me.marker.setPosition(ll);            
        }
    };
    
    this.onFail = function() 
    {
        wm.error('Failed to get geolocation');
    };
    
    this.centerMap = function()
    {
        if (me.map !== null && me.lastll !== null)
            me.map.panTo(me.lastll);
    }
};

// Main entry point for the app
function onDeviceReady()
{
    geoApp = new App();

    navigator.geolocation.watchPosition(geoApp.onSuccess, geoApp.onFail, {maximumAge: 2000, enableHighAccuracy: true});

    $('#panner').bind('click',
        function()
        {
            if (geoApp !== null)
                geoApp.centerMap();
        });
}
