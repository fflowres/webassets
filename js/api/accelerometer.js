var App = {}
App.watchId = null;
App.showErrorAlert = true;
App.options = 
{
    frequency: 80
};

App.callbacks = {}
App.helperFunctions = {}

App.helperFunctions.updateme = function(elemstr, value)
{       
    value = (value + 1) * 50;
    if (value < 0) 
        value = 0;
        
    value = Math.floor(Math.min(100, value));

    var elem = document.getElementById(elemstr);
    elem.style.width = value + "%";
};

App.helperFunctions.myAlert = function(msg)
{
    if (App.showErrorAlert)
    {
        App.showErrorAlert = false;
        alert(msg);
    }
};

// Called every time watch acceleration ticks
App.callbacks.onSuccess = function(acceleration) 
{    
    App.helperFunctions.updateme("accx", acceleration.x);
    App.helperFunctions.updateme("accy", acceleration.y);
    App.helperFunctions.updateme("accz", acceleration.z);
    App.showErrorAlert = true;
};

// Error callback
App.callbacks.onFail = function() 
{
    App.helperFunctions.myAlert("Failed to get accelerometer reading");
};

// Main entry point for the app
function onDeviceReady() 
{   
    // Set off a watch which will poll the accelerometer every App.options.frequency ms
    App.watchId = navigator.accelerometer.watchAcceleration(App.callbacks.onSuccess, App.callbacks.onFail, App.options);
}