var myconnection = function()
{
    this.state = navigator.network.connection.type;
};

myconnection.onDeviceReady = function()
{    
    logme("onDeviceReady");  
    myconnection.ginterval = setInterval("myconnection.update()", 500);    
};


myconnection.prototype.addtohtml = function()
{
    // add to list
    logme("adding to list");
    $('#connectionlist').append('<li><span class="status">' + this.state + '</span></li>');
};

myconnection.prototype.updatehtml = function()
{           
   $('#connectionType').html(this.state);
};

myconnection.list = [];

myconnection.ginterval = null;

myconnection.update = function()
{    
    var tmpconnection = new myconnection();
    if (myconnection.list.length > 0)
    {        
        if (tmpconnection.state != myconnection.list[myconnection.list.length-1].state)
        {
            logme("connection change: " + tmpconnection.state);
            myconnection.list.push(tmpconnection);
            tmpconnection.updatehtml();
        }
    }
    else
    {
        logme("connection: " + tmpconnection.state);
        myconnection.list.push(tmpconnection);
        tmpconnection.updatehtml();
    }
};

// Main entry point for the app
function onDeviceReady()
{
    myconnection.onDeviceReady();
};
