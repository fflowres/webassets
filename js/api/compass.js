var watchIds = [];
var watchData = [];

var g_IsUpdatable = true;

function data(options)
{
    var me = this;
    this.onSuccess = function(heading)
    {
            me.headingData = heading;
            refreshList();
    };

    var g_pass = false;
    this.onFail = function()
    {
        if (!g_pass)
            navigator.notification.alert("Compass Failed", function(){ g_pass = true; });
    };

    if(0 == options.filter)
        watchIds.push(navigator.compass.watchHeading(this.onSuccess, this.onFail, options));
    else
        watchIds.push(navigator.compass.watchHeadingFilter(this.onSuccess, this.onFail, options));
};

function onDeviceReady()
{
    (function () {navigator.compass.getCurrentHeading(function(){},function(){})})();
}

function refreshList()
{
    if(g_IsUpdatable)
    {
        var content       = '';
        var $watchDetails = $('#listview');

        for (i = 0; i < watchData.length; i++)
        {
            content += '<li>' +
                        'Magnetic Heading:' + watchData[i].headingData.magneticHeading + '<br />' +
                        'True Heading:' + watchData[i].headingData.trueHeading + '<br />' +
                        'Heading Accuracy:' + watchData[i].headingData.headingAccuracy + '<br />' +
                        'Timestamp:' + watchData[i].headingData.timestamp + '<br />' +
                        '</li>';
        }

        $watchDetails.html(content);
    }
};

function setAllowEdit(check)
{
    g_IsUpdatable = (check.checked == false);
}

function addWatcher(Frequency, Filter)
{
    options.frequency = Frequency;
    options.filter = Filter;

    watchData.push(new data(options));
}

function clearWatcher()
{
    var watchID = watchIds.pop();
    if(watchID)
        navigator.compass.clearWatch(watchID);

    if(watchData)
        watchData.pop();


    refreshList();
}

var options =
{
    frequency: 1000,
    filter: 0
};
