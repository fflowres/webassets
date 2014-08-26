var statex = {
    'volumeupbutton': false,
    'volumedownbutton': false,
    'backbutton': false,
    'searchbutton': false,
    'menubutton' : false,
    'pause': false,
    'resume': false,
    'online': false,
    'offline': false
};

function onDeviceReady()
{    
    addEvents();
}

function turnOff()
{
    for(var state in statex)
    {
        statex[state] = false;        
    }
}

function lightCB(str)
{
    turnOff();    
    
    statex[str] = true;
    
    for(var state in statex)
    {
        document.getElementById(state).checked=statex[state];
    }
}

var callme = function(str) 
{    
    var state = str;
    this.cb = function() 
    {
        lightCB(state);
    };
    
};

var addEvents = function() 
{
    for (var state in statex)
    {
        var x = new callme(state);
        document.addEventListener(state, x.cb);
    }
};    


function eventCB(str)
{
    logme("event", str, false);
    
}

