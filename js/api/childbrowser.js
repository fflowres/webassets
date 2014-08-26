function onDeviceReady()
{
    window.plugins.childBrowser.onOpenExternal = onOpenExternalEvent;
    window.plugins.childBrowser.onClose = onCloseEvent;
    window.plugins.childBrowser.onLocationChange = onLocationChangeEvent;
    window.plugins.childBrowser.onFail = onFailEvent;
}

function onOpenExternalEvent()
{
    document.getElementById('Overlay').className = "OverlayLoading";
}

function onCloseEvent()
{
    document.getElementById('Overlay').className = "";
}

function onLocationChangeEvent(newurl)
{
    document.getElementById('Overlay').className = "";
}

function onFailEvent(message)
{
    alert("Error: " + message);
    document.getElementById('Overlay').className = "";
}


function openChildBrowser(startURL)
{
    if(!startURL || "" === startURL)
        alert("No URL entered");
    else
        window.plugins.childBrowser.showWebPage(startURL);
}

function closeChildBrowser()
{
    window.plugins.childBrowser.close();
}
