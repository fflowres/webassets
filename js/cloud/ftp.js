var syncConfig={};


function getcredentials(){  // From config file get user settings
setpagetype();
var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\ngetcloudcreds('ftp')\n";
navigator.pyRun.PyCommand(pycom,gotcredentials,onError); 

}

function onError() {
      alert("error");
}

function gotcredentials(jtext){
  if (jtext != 'False'){
  credentialsJson=eval("(function(){return " + jtext + ";})()"); //Jquestions

  document.getElementById('textbox1').value=credentialsJson["ftphost"];
  document.getElementById('textbox2').value=credentialsJson["ftpuser"];
}
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
      upload(); 
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



 

// ===================== upload Section ===================== 

function upload(){ //FTP variant
    $("#cloud-action").css({ display: "none" });
    $("#loading").css({ display: "block" });

syncConfig["action"] = 'upload';
syncConfig["location"] = 'ftp';
syncConfig["ftphost"] = document.getElementById('textbox1').value;
syncConfig["ftpuser"] = document.getElementById('textbox2').value;
syncConfig["password"] = document.getElementById('cloudpass').value;
syncConfig["dbpassword"]=sessionStorage.p;

var syncConfigOut =JSON.stringify(syncConfig);

var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nsync('"+syncConfigOut+"')\n";
navigator.pyRun.PyCommand(pycom,uploadComplete,onError);
}

function uploadComplete(text) {
//will be second wizard section after
sessionStorage.topage = 'cloud-complete.html';
location.reload();   
}


// ===================== Save Section ===================== 

function saveconfig(){ //FTP variant
    $("#cloud-action").css({ display: "none" });
    $("#loading").css({ display: "block" });

syncConfig["action"] = 'save';
syncConfig["ftphost"] = document.getElementById('textbox1').value;
syncConfig["ftpuser"] = document.getElementById('textbox2').value;
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

syncConfig["ftphost"] = document.getElementById('textbox1').value;
syncConfig["ftpuser"] = document.getElementById('textbox2').value;
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