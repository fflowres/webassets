var syncConfig={};
var googleAuthBrowser = {};
var googleAuthLink;

function getcredentials(){  // From config file get user settings
setpagetype();
var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\ngetcloudcreds('dropbox')\n";
navigator.pyRun.PyCommand(pycom,gotcredentials,onError); 

}

function onError() {
      alert("error");
}

function gotcredentials(jtext){
  if (jtext != 'False'){
  credentialsJson=eval("(function(){return " + jtext + ";})()"); //Jquestions

  document.getElementById('textbox1').value=credentialsJson["dropboxid"];

}
}

function authenticate_googledrive(){
  alert('ran1');




$("#cloud-action").css({ display: "none" });
$("#loading").css({ display: "block" });

syncConfig["action"] = 'authenticate';
syncConfig["location"] = 'googledrive';

syncConfig["dbpassword"]=sessionStorage.p;

var syncConfigOut =JSON.stringify(syncConfig);

var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nauthenticate('"+syncConfigOut+"')\n";
navigator.pyRun.PyCommand(pycom,browseout,onError); 

}
function browseout(link){

  if (link == "True"){
    upload(); // means it's already authorized
  }else{
  
  alert(link);
  googleAuthLink = link
  googleAuthBrowser.init();
}
}


googleAuthBrowser.init = function()
{
    // Listen for deviceready before any calls to Web Marmalade
    document.addEventListener("deviceready", googleAuthBrowser.onDeviceReady, false);
};

// Web Marmalade system is ready
googleAuthBrowser.onDeviceReady = function()
{
    window.plugins.childBrowser.onLocationChange = googleAuthBrowser.onLocationChangeEvent;
    window.plugins.childBrowser.onFail = googleAuthBrowser.onFailEvent;

    googleAuthBrowser.openChildBrowser(googleAuthLink);
};

// Called when a new URL is loaded
googleAuthBrowser.onLocationChangeEvent = function(newurl)
{
  //untill it changes to a url with prepended with http://localhost?code=
    var url = newurl;
  if(url.indexOf("http://localhost/?code=") > -1){ // if it's a localhost link, code is right after
    var authCode = url.split("http://localhost/?code=")[1]
    //close browser
  }

};

// Called if an error has occured or if localhost loopback doesnt exist ;P
googleAuthBrowser.onFailEvent = function(message)
{
  //should have found code
    //alert("Error: " + message);
    //document.getElementById('Overlay').className = "";

    var url = message;
  if(url.indexOf("http://localhost/?code=") > -1){ // if it's a localhost link, code is right after
    var authCode = url.split("http://localhost/?code=")[1];
    alert(authCode);
    alert(String(authCode));
    authorize_googledrive(authCode);

}
}

/*
 * The following function(s) will be called by buttons in our html body tag
 */
googleAuthBrowser.openChildBrowser = function(startURL)
{
    window.plugins.childBrowser.showWebPage(startURL);
};

// Start our app
        

function authorize_googledrive(authCode){

$("#cloud-action").css({ display: "none" });
$("#loading").css({ display: "block" });

syncConfig["action"] = 'authorize';
syncConfig["location"] = 'googledrive';
syncConfig["authcode"] = authCode;

syncConfig["dbpassword"]=sessionStorage.p;

var syncConfigOut =JSON.stringify(syncConfig);

var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nauthorize('"+syncConfigOut+"')\n";
navigator.pyRun.PyCommand(pycom,browseout,onError); 

}










// ===================== upload Section ===================== 

function upload_googledrive(){
    $("#cloud-action").css({ display: "none" });
    $("#loading").css({ display: "block" });

syncConfig["action"] = 'upload';
syncConfig["location"] = 'googledrive';

syncConfig["dbpassword"]=sessionStorage.p;

var syncConfigOut =JSON.stringify(syncConfig);

var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nsync('"+syncConfigOut+"')\n";
navigator.pyRun.PyCommand(pycom,uploadComplete,onError);
}

function uploadComplete(text) {
//will be second wizard section after
pagechange("cloud-complete");
}



// ===================== Import Section ===================== 

function importdb(){//FTP variant
    $("#cloud-action").css({ display: "none" });
    $("#loading").css({ display: "block" });

syncConfig["action"] = 'import';



syncConfig["dbname"]=document.getElementById('dbnametextbox').value;
syncConfig["dbpassword"]=document.getElementById('dbpassword').value;



var syncConfigOut = JSON.stringify(syncConfig);

var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nsyncimportdb('"+syncConfigOut+"')\n";
navigator.pyRun.PyCommand(pycom,importComplete,onError);
}

function importComplete(text) {
//decrpytion and marshall ok, password is good
var dbKey=document.getElementById('dbpassword').value;
sessionStorage.p = dbKey; //store password for later


sessionStorage.topage = 'graph.html'; 
location.href = 'index_p.html'; //load graph in regular frame
}




function onError() {
      alert("error");
}

function setpagetype(){
var cloudaction = sessionStorage.cloudaction;
//run once page loaded
if(cloudaction === 'upload'){ //reload internally
    $("#cloud-action").prop('value', 'Upload');
    }
    else if(cloudaction === 'select'){  
      $("#account-p").css({ display: "none" }); // remove password input as it is not saved
      $("#cloud-action").prop('value', 'Save Config');
    } 
    else if(cloudaction === 'import'){ // divert to full page

      $("#database-info").css({ display: "block" }); // display database info block area
      $("#cloud-action").prop('value', 'Import');
    }

}






  function cloudaction_handle() {
  var cloudaction = sessionStorage.cloudaction;
    if(cloudaction === 'upload'){ //reload internally
      authenticate(); 
    }
    else if(cloudaction === 'select'){ 
      saveconfig();
    } 
    else if(cloudaction === 'import'){ // divert to full page
      importdb();
    }
  }

  function selectcloud_handle() {
  var cloudaction = sessionStorage.cloudaction;
    if(cloudaction === 'upload' || cloudaction === 'select'){ //reload internally
      sessionStorage.topage = 'cloud-select.html';
      location.reload();
    }
    else if(cloudaction === 'import'){ // divert to full page
      location.href = 'cloud-select.html';
    }
  }
