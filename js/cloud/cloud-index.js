

function getlocation(){  // From config file get user settings
var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\ncheckcloudlocation()\n";
navigator.pyRun.PyCommand(pycom,gotlocation,onError); 

}



function gotlocation(text){
sessionStorage.cloudaction = "upload"; //this page is only accessible though upload dialog anyways
var gotolocation = text;
if(gotolocation === "ftp"){
      sessionStorage.topage = 'cloud-ftp.html';
      location.reload();
}else if(gotolocation === 'googledrive'){
      sessionStorage.topage = 'cloud-googledrive.html';
      location.reload();
}else if(gotolocation === 'icloud'){
      sessionStorage.topage = 'cloud-icloud.html';
      location.reload();
}else if(gotolocation === 'dropbox'){
      sessionStorage.topage = 'cloud-dropbox.html';
      location.reload();
}else if(gotolocation === 'skydrive'){
      sessionStorage.topage = 'cloud-skydrive.html';
      location.reload();

}else{ // if false or other outcome, select cloud provider
      sessionStorage.topage = 'cloud-select.html';
      location.reload();
}
}



function onError() {
      alert("error");
}






