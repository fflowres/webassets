// A helpful logging function to spit out optional debuggin information.
// Set the visibility property of the CSS style .debug to visible in
// kitchensink.css to display optional debugging information.
function logme(elemstr, logstr, append)
{
    append = append || true;
    var element = document.getElementById(elemstr);
    if (!element)
        return;
    if (append)
        element.innerHTML += logstr + '<br />';
    else
        element.innerHTML = logstr;
}

// Called by body onload event
function init()
{
    // Register for the event "deviceready".  This will fire once Web
    // Marmalade has completely initialised and is the cue to start the
    // app logic.
    document.addEventListener("deviceready", onDeviceReady, false);
}


