//
// clipboard API
//

var pyRun = function() {};
pyRun.Proxy = function(obj, cbx)
{
    pyRun.Proxy._super.constructor.apply(this, [obj, cbx]);
};

wm.helper.inherit(pyRun.Proxy, wm.Bridge.ProxyBase);

if (typeof navigator.pyRun === 'undefined') 
{

navigator.pyRun = new pyRun();
    
navigator.pyRun.getText = function(pyRunSuccess, pyRunError)
{
    // Check for required parameters
    if (typeof pyRunSuccess === "undefined")
    {
        wm.error("Parameter pyRunSuccess is undefined");
        return false;
    }

    // Check parameter types and default unsupplied ones
    if (pyRunSuccess !== null && typeof pyRunSuccess != 'function')
    {
        wm.error("Parameter pyRunSuccess must be a function or null");
        return false;
    }
    
    if (typeof pyRunError === "undefined")
    {
        pyRunError = null;
    }
    else if (pyRunError !== null && typeof pyRunError != 'function')
    {
        wm.error("Parameter pyRunError must be a function or null");
        return false;
    }

    var proxy = new pyRun.Proxy(this, {'pyRunSuccess':pyRunSuccess, 'pyRunError':pyRunError});
    proxy.method = 'getText';
    proxy.params = {};

    if (typeof proxy._getText == 'function')
        proxy._getText();

    wm.bridge.exec(proxy, 'pyRun', proxy.method, proxy.params);

    return true;
};

navigator.pyRun.PyCommand = function(text, pyRunSuccess, pyRunError)
{
    // Check for required parameters
    if (typeof text === "undefined")
    {
        wm.error("Parameter text is undefined");
        return false;
    }

    // Check parameter types and default unsupplied ones
    if (text !== null && typeof text != 'string')
    {
        wm.error("Parameter text must be a string or null");
        return false;
    }
    
    if (typeof pyRunSuccess === "undefined")
    {
        pyRunSuccess = null;
    }
    else if (pyRunSuccess !== null && typeof pyRunSuccess != 'function')
    {
        wm.error("Parameter pyRunSuccess must be a function or null");
        return false;
    }
       
    if (typeof pyRunError === "undefined")
    {
        pyRunError = null;
    }
    else if (pyRunError !== null && typeof pyRunError != 'function')
    {
        wm.error("Parameter pyRunError must be a function or null");
        return false;
    }

    var proxy = new pyRun.Proxy(this, {'pyRunSuccess':pyRunSuccess, 'pyRunError':pyRunError});
    proxy.method = 'PyCommand';
    proxy.params = {text:text};

    if (typeof proxy._PyCommand == 'function')
        proxy._PyCommand();
    
    wm.bridge.exec(proxy, 'pyRun', proxy.method, proxy.params);
    
    return true;
};

}

// callback proxies
// callback proxies are used to revive the JSON object and pass data through to the user callbacks
// these proxies are also useful for modifying the data before passing it on to the user
// e.g. to convert a date in millseconds to a proper Date object
pyRun.Proxy.prototype.pyRunSuccess = function(obj)
{    
    var text = obj.text;
    this.userCallback('pyRunSuccess')(text);
};

pyRun.Proxy.prototype.pyRunError = function(obj)
{
    this.userCallback('pyRunError')();
};

wm.bridge.registerModule("pyRun");
