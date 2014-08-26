function onDeviceReady()
{
}

function captureError(error)
{
    document.getElementById('displayedImage').src = "";
    document.getElementById('labelForInfo').innerHTML = "";
    document.getElementById('mediabox').innerHTML = "";

    message = "unknown";
    switch (error.code) {
        case CaptureError.CAPTURE_INTERNAL_ERR:
            message = "internal error";
            break;
        case CaptureError.CAPTURE_APPLICATION_BUSY:
            message = "application busy";
            break;
        case CaptureError.CAPTURE_INVALID_ARGUMENT:
            message = "invalid argument";
            break;
        case CaptureError.CAPTURE_NO_MEDIA_FILES:
            message = "no media returned";
            break;
        case CaptureError.CAPTURE_NOT_SUPPORTED:
            message = "Capture not supported on this platform";
            break;
    }

    document.getElementById('labelForError').innerHTML = "Error Occured: " + message;
}


// Audio Capture Functions
///////////////////////////////////////////////////////////////////////////////
var gMedia = null;
function onAudioFinish()
{
    gMedia.release();
}

function onAudioError(error)
{
    gMedia.release();
    gMedia = null;
}

function onSuccess(list)
{
    if (list.length != 1)
    {
        return;
    }

    if(gMedia != null) 
    {
        gMedia.release();
    }
    
    gMedia = new Media(list[0].fullPath, onAudioFinish, onAudioError);    

    document.getElementById('displayedImage').src = "";
    document.getElementById('labelForInfo').innerHTML = "";
    document.getElementById('labelForError').innerHTML = "";


    var id = "medx" + 0;
    document.getElementById('mediabox').innerHTML = createControl(id);
};

function playAudio()
{
    gMedia.play();
}

function stopAudio()
{
    gMedia.stop();
    gMedia.release();
}

function createControl(id)
{
    return '<div id="'+id+'" class="mediacontrols">\
            <div class="label">' + 'Recorded Audio' + '</div>\
            <button class="play" class="button" onclick="playAudio()"><span></span></button>\
            <button class="stop" class="button" onclick="stopAudio()"><span></span></button>\
        </div>';
}

function captureAudio(audioLimit, audioDuration)
{
    // Launch device audio recording application
    navigator.device.capture.captureAudio(onSuccess, captureError, {limit: Number(audioLimit), duration: Number(audioDuration), mode:{type:""} });
}


// Image Capture Functions
///////////////////////////////////////////////////////////////////////////////
function captureImageSuccess(mediaFiles)
{
    document.getElementById('labelForInfo').innerHTML = "";
    document.getElementById('labelForError').innerHTML = "";
    document.getElementById('mediabox').innerHTML = "";

    // Get image src from the device and output it to html
    document.getElementById('displayedImage').src = mediaFiles[0].fullPath;
}

function captureImage(imageLimit)
{
    // Launch device camera application
    navigator.device.capture.captureImage(captureImageSuccess, captureError, {limit: Number(imageLimit)});
}


// Video Capture Functions
///////////////////////////////////////////////////////////////////////////////
function captureVideoSuccess(mediaFiles)
{
    document.getElementById('displayedImage').src = "";
    document.getElementById('labelForError').innerHTML = "";
    document.getElementById('mediabox').innerHTML = "";

    // Output image path
    document.getElementById('labelForInfo').innerHTML = "Video Stored Successfully: Path -" + mediaFiles[0].fullPath;
}

function captureVideo(videoLimit, videoDuration)
{
    // Launch device video recording application
    navigator.device.capture.captureVideo(captureVideoSuccess, captureError, {limit: Number(videoLimit), duration: Number(videoDuration)});
}