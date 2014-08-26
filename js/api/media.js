// 
// 
//
var gMedia = {};
var gNextIndex = 0;
var gIntervalTime = 40;
var gRecNum = 0;
var WMPATH = '/android_asset/wm/sound/';  // '/android_asset/' on PG
var RECPATH = ''; // '' on PG

//
// mediaTracks (todo: load existing files)
//
var mediaTracks = [ 
    [1, RECPATH + 'record0.wav'],
    [0, WMPATH + 'ClockTicking.mp3'],
    [0, WMPATH + 'Countdown.mp3'],
    [0, WMPATH + 'Hello.mp3'],
    [0, WMPATH + 'ThingsLikeThat.mp3'],
    [0, WMPATH + 'Water.mp3']
];

    
var mediaHandler = function(helper)
{
    var me = this;
    
    this.helper = helper;
    
    this.playAudio = function()
    {
        if (me.helper.media != null)
        {
            logme("debug", "playAudio");
            me.helper.media.play();
        }
        else
        {
            logme("debug", "playAudio null");
        }
    };
    
    this.stopAudio = function()
    {
        if (me.helper.media != null)
        {
            if (me.helper.type == 0) 
            {
                logme("debug", "stopAudio");
                me.helper.media.stop();
            }
            else
            {
                logme("debug", "stopAudioRecording");
                me.helper.media.stopRecord();
            }
        }
        else
        {
            logme("debug", "stopAudio null");
        }
    };

    this.recordAudio = function()
    {
        if (me.helper.media != null)
        {
            logme("debug", "recordAudio");
            me.helper.media.startRecord();
        }
        else
        {
            logme("debug", "recordAudio null");
        }
    };
    
    
    this.pauseAudio = function()
    {
        if (me.helper.media != null)
        {
            logme("debug", "pauseAudio");
            me.helper.media.pause();
        }
        else
        {
            logme("debug", "pauseAudio null");
        }
    };

    this.releaseAudio = function()
    {
        if (me.helper.media != null)
        {
            logme("debug", "releaseAudio");
            me.helper.media.release();
            me.helper.media = null;
            // todo
            //alert(me.helper.id);
            $('#' + me.helper.id).remove();
            gMedia[me.helper.id] = false;
            
        }
        else
        {
            logme("debug", "releaseAudio null");
        }
    };
    
    
};
 
 
function mediaHelper(id, type, track)
{    
    var me = this;
    
    this.id = id;    
    this.track = track;
    this.type = (typeof type == undefined) ? 0 : type;
    this.media = null;
    
    this.onSuccess = function()
    {
        logme("debug", "onSuccess: " + me.id);
        if (me.type == 1)
        {
            logme("debug", "successful recording" + gRecNum);            
            // push recording to end of mediaTracks:
            mediaTracks[mediaTracks.length] = [0, mediaTracks[0][1]];            
            
            // release the media obj
            me.media.release();
            gMedia[me.id] = null;
            $('#'+me.id).remove();
            
            // increment recording track number
            gRecNum++;
            mediaTracks[0][1] = RECPATH + 'record'+gRecNum+'.wav';
            
            loadTracks(false);
        }
        
    };

    this.onError = function(error)
    {
        alert("Error playing media.  If you are running on desktop then you may need to free up an audio resource.  Try hitting the cross on the last played track");
    };

    this.onStatusChange = function(status)
    {
        logme("debug", "onStatusChange: " + status);
        
        if (me.type==0)
        {
            if (status == Media.MEDIA_STOPPED)
            {
                $('#'+me.id+' .width-slider').css("left", "0px");
            }
        }
        
    };    
    
    this.update = function()
    {
        if (me.media != null)
        {
            if (me.type == 0) 
            {
                if (me.media._duration != -1) 
                {
                    me.media.getCurrentPosition(
                        function(milli) {
                            
                            var duration = me.media.getDuration();

                            if (duration > 0 && milli >= 0)
                            {                                
                                var perc = Math.round((milli / duration) * 100);
                                // todo get width 280px
                                
                                if (perc>=0 && perc<=100)
                                    $('#'+me.id+' .width-slider').css("left", perc*2.8 + "px");
                            }
                        },
                        function() {
                            logme("debug", "getCurrentPos error");
                        }
                    );
                }
            }
        }
    };
};    

function onDeviceReady()
{
    logme("debug", "onDeviceReady");
    loadTracks(true);
    gInterval = setInterval("updatePos()", gIntervalTime);    
}

function createMedia(id, type, src)
{
    logme("debug", "createMedia");
    gMedia[id] = new mediaHelper(id, type, src);     
    gMedia[id].media = new Media(src, gMedia[id].onSuccess, gMedia[id].onError, gMedia[id].onStatusChange);
}
    
function loadTracks(renew)
{
    logme("debug", "loading tracks");        
    
    
    for (var i=0; i<mediaTracks.length; i++)
    {
        var id = "medx" + i;
        var type = mediaTracks[i][0];
        var src = mediaTracks[i][1];
        
        if (renew === true)
        {
            if (gMedia[id]===false)
                gMedia[id] = null;
        }
                
        if ((typeof gMedia[id] == 'undefined') || (gMedia[id] == null) ) 
        {            
            createMedia(id, type, src);
            addControl(id, type);
        }
    }
    
    bindHandlers();
}

function createControl(id, type)
{
    if (type == 0) 
    {
        return '<div id="'+id+'" class="mediacontrols">\
                <div class="label">' + gMedia[id].track + '</div>\
                <button class="play" class="button"><span></span></button>\
                <button class="stop" class="button"><span></span></button>\
                <button class="pause" class="button"><span></span></button>\
                <button class="release" class="button"><span></span></button>\
                <div class="width-area">\
                    <div class="width-slider"></div>\
                </div>\
            </div>';
    }
    else 
    {
        return '<div id="'+id+'" class="mediacontrols recording">\
                <div class="label">' + gMedia[id].track + '</div>\
                <button class="record" class="button"><span></span></button>\
                <button class="stop" class="button"><span></span></button>\
            </div><div class="recend"></div>';
    }
}

function clearControls()
{
    document.getElementById('mediabox').innerHTML = "";
}

function addControl(id, type)
{
    if (type==0)
        document.getElementById('mediabox').innerHTML += createControl(id, type);
    else
        document.getElementById('mediabox').innerHTML = createControl(id, type) + document.getElementById('mediabox').innerHTML;
}


function bindHandlers()
{
    logme("debug", "bindHandler");
	for (var id in gMedia)
	{
        if (gMedia[id] != null && gMedia[id] !== false)
        {   
            var handler = new mediaHandler(gMedia[id]);
            $('#' + id + ' .play').bind('click', handler.playAudio);
            $('#' + id + ' .stop').bind('click', handler.stopAudio);
            $('#' + id + ' .pause').bind('click', handler.pauseAudio);
            $('#' + id + ' .release').bind('click', handler.releaseAudio);
            $('#' + id + ' .record').bind('click', handler.recordAudio);
        }
	}
}

function updatePos()
{

    for (var myid in gMedia)
    {        
        if (typeof gMedia[myid] != 'undefined' && gMedia[myid] != null && gMedia[myid] !== false)
        {
            gMedia[myid].update();
        }
    
        var elem = document.getElementById('debug');
        elem.scrollTop = elem.scrollHeight;
    }
}
