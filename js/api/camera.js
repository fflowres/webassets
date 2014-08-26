var g_maxWidth = null;
var g_DEFAULT_WIDTH = 100;
var g_DEFAULT_HEIGHT = 100;
var g_cameraOptions = 
{
    quality: 80,
    allowEdit: false,   
    mediaType: Camera.MediaType.PICTURE,
    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: Camera.DestinationType.DATA_URL
};

function onSuccessFile(uri) 
{
    var d = new Date();
    document.getElementById('label_for_displayed_image').innerHTML = "";
    document.getElementById('displayed_image').src = uri + "?ver=" + d.getTime();  // Add ver to prevent caching
}

function onSuccessUrl(data) 
{
    document.getElementById('label_for_displayed_image').innerHTML = "";
    document.getElementById('displayed_image').src = data;
};

function onFail() 
{
    document.getElementById('displayed_image').src = "";
    document.getElementById('label_for_displayed_image').innerHTML = "ERROR RETRIEVING IMAGE";
};

function getMedia()
{
    if (g_cameraOptions.destinationType == Camera.DestinationType.DATA_URL)
        navigator.camera.getPicture(onSuccessUrl, onFail, g_cameraOptions);
    else
        navigator.camera.getPicture(onSuccessFile, onFail, g_cameraOptions);
}

function onDeviceReady()
{
    g_maxWidth = document.getElementById("image").offsetWidth;
}

function setSourceType(button)
{
    g_cameraOptions.sourceType = eval("Camera.PictureSourceType." + button.value);
}

function setDestinationType(button)
{
    g_cameraOptions.destinationType = eval("Camera.DestinationType." + button.value);
}

function setMediaType(button)
{
    g_cameraOptions.mediaType = eval("Camera.MediaType." + button.value);
}

function setEncodingType(button)
{
    if (button.value == "NONE")
        delete g_cameraOptions.encodingType;
    else
        g_cameraOptions.encodingType = eval("Camera.EncodingType." + button.value);       
}

function setAllowEdit(check)
{
    g_cameraOptions.allowEdit = check.checked;
}

function toggleOptions(check)
{
    if (check.checked)
    {
        document.getElementById('parent_fieldset').style.visibility = 'hidden';
        document.getElementById('parent_fieldset').style.height = 0;
    }
    else
    {
        document.getElementById('parent_fieldset').style.visibility = 'visible';
        document.getElementById('parent_fieldset').style.height = 'auto';
    }
}

function setQuality(input)
{
    if (isNaN(input.value))
    {
        input.value = g_cameraOptions.quality;
        return;
    }

    var value = parseInt(input.value);
    value = Math.min(Math.max(0, value), 100);
    input.value = value;
    g_cameraOptions.quality = value;
}

function setWidth(testInput)
{
    if (testInput.value == "" || isNaN(testInput.value))
    {      
        testInput.value = "";
        delete g_cameraOptions.targetWidth;
        return;
    }    
    
    if (testInput.value > g_maxWidth)
        testInput.value = g_maxWidth;
        
    g_cameraOptions.targetWidth = parseInt(testInput.value);
}

function setHeight(testInput)
{
    if (testInput.value == "" || isNaN(testInput.value))
    {
        testInput.value = "";
        delete g_cameraOptions.targetHeight;
        return;
    }    
        
    g_cameraOptions.targetHeight = parseInt(testInput.value);
}



