



function startPage(){
    getJSONQuestions();
    pagechange("questions-page");


}


$(document).ready(function () {
    
var toPage = sessionStorage.topage;

$('#page1').bind('click', page1Action);
$('#page2').bind('click', page2Action);
$('#page3').bind('click', page3Action);
$('#page4').bind('click', page4Action);
$('#page5').bind('click', page5Action);

function page1Action(e) {
    getJSONQuestions();
    pagechange("questions-page");
}

function page2Action(e) {
    chainload_questions_json();
    pagechange("answers-page");
}

function page3Action(e) {
    getDataMatrix();
    pagechange("graph-page");
}
function page4Action(e) {

    pagechange("settings-page");
}

function page5Action(e) {
    getcloudlocation();

    
    
}



});

function pagechange(page){

/*clearing function for form pages before being populated*/
$('#boxA').empty();
$('#boxB').empty();
$('#boxC').empty();

    /*page names and things that need resetting*/
var pagearray = ["questions-page","answers-page","graph-page","settings-page","cloudselect-page","clouddropbox-page","cloudftp-page","cloud-complete","cloudgoogledrive-page"]

for(i=0,ii=pagearray.length; i<ii; i++){
    if (page == pagearray[i]){

        $("#"+pagearray[i]).css({ display: "block" });

    }else{

        $("#"+pagearray[i]).css({ display: "none" });
    }
}
}




//

function onError() {
      alert("error");
}

function getcloudlocation(){  // From config file get user settings

var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\ncheckcloudlocation()\n";
navigator.pyRun.PyCommand(pycom,gotcloudlocation,onError); 

}

function gotcloudlocation(text){

sessionStorage.cloudaction = "upload"; //this page is only accessible though upload dialog anyways
var gotolocation = text;

if(gotolocation === "ftp"){

//cloudpage_ftp();
pagechange("cloudftp-page");

}else if(gotolocation === 'googledrive'){

pagechange("cloudgoogledrive-page");

}else if(gotolocation === 'icloud'){


}else if(gotolocation === 'dropbox'){
//cloudpage_dropbox();
pagechange("clouddropbox-page");

}else if(gotolocation === 'skydrive'){


}else{ // if false or other outcome, select cloud provider
    pagechange("cloudselect-page");
}
}

function cloudpage_select() {
pagechange("cloudselect-page");
}


function cloudpage_ftp() {
pagechange("cloudftp-page");
}

function cloudpage_dropbox() {
pagechange("clouddropbox-page");
}


function cloudpage_googledrive() {
pagechange("cloudgoogledrive-page");
}


