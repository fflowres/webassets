var syncConfig={};


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






  function cloudaction_handle_dropbox() {
      upload_db_dropbox(); 
  }



// ===================== upload Section ===================== 

function authenticate_dropbox(){
syncConfig["action"] = 'authenticate';
syncConfig["location"] = 'dropbox';
alert('ok1');
var syncConfigOut = JSON.stringify(syncConfig);
var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nauthenticate('"+syncConfigOut+"')\n";
navigator.pyRun.PyCommand(pycom,auth_link_dropbox,onError);

}

function auth_link_dropbox(link){
alert("ok100");
alert(link);
openChildBrowser(link);

}

function upload_db_dropbox(){ //FTP variant
    $("#cloud-action").css({ display: "none" });
    $("#loading").css({ display: "block" });

syncConfig["action"] = 'upload';
syncConfig["location"] = 'dropbox';
syncConfig["authcode"] = document.getElementById('authcode').value;
syncConfig["dbpassword"]=sessionStorage.p;

var syncConfigOut =JSON.stringify(syncConfig);

var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nsync('"+syncConfigOut+"')\n";
navigator.pyRun.PyCommand(pycom,uploadComplete_dropbox,onError);
}

function uploadComplete_dropbox(text) {
//will be second wizard section after
pagechange("cloud-complete");
}


// ===================== Save Section ===================== 

function saveconfig(){ //FTP variant
    $("#cloud-action").css({ display: "none" });
    $("#loading").css({ display: "block" });

syncConfig["action"] = 'save';
syncConfig["dropboxid"] = document.getElementById('textbox1').value;
//syncConfig["password"] = document.getElementById('cloudpass').value;

var syncConfigOut =JSON.stringify(syncConfig);

var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nsavecreds('"+syncConfigOut+"')\n";
navigator.pyRun.PyCommand(pycom,saveComplete,onError);
}

function saveComplete(text) {
//will be second wizard section after
sessionStorage.topage = 'cloud-complete.html';
location.reload();   
}

// ===================== Import Section ===================== 

function importdb(){//FTP variant
    $("#cloud-action").css({ display: "none" });
    $("#loading").css({ display: "block" });

syncConfig["action"] = 'import';

syncConfig["dropboxid"] = document.getElementById('textbox1').value;
syncConfig["password"] = document.getElementById('cloudpass').value;

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