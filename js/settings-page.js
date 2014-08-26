function eraseALL(){
      $("#upload").css({ display: "none" });
    $("#loading").css({ display: "block" });

var passkey=document.getElementById('textbox5').value;

//if(sessionStorage.p == passkey ){
 // should verify against database encryption

var pycom="import log\nimport sys\nimport socket\nsys.path = ['/pythonHome/Lib/site-packadges','/pythonHome/Lib','/pythonHome/system','/pythonHome','.']\nfrom syncHandle import *\nlog.CaptureStdout(eraseALL())\n";
navigator.pyRun.PyCommand(pycom,onDeletion,onError);
}
//alert("wrong password")
//}








function onError() {
      alert("error");
}

function onDeletion(text) { // after deleted
location.href = 'index.html'; //new start
//will be second wizard section after

}