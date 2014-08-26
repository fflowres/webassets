//-----------------globals-------------------

var counter_R=0; // not used for itteration, only to keep unique ID's

//original starting responses loaded from db, if new, there are none
//normally queried from embedded NoSQL server
//var iJSON_R={'drink':{'active':'True','typ':'slider','range':'0-100'},'sleep':{'active':'True','typ':'slider','range':'0-100'},'run':{'active':'unInit','typ':'slider','range':'0-100'}};
var iJSON_R={};
var rJSON_R={};

var nJSON_R={}; //new output json

var iQA_R = []; //all responses array


//-----------------globals-------------------END
//=================python callbacks==============

var passkey=sessionStorage.p;


//create initialtion chain
//must load responses first (callback to load responses)
//must load daily responses second ( this initiates the callback )
//then parse everything




function chainload_questions_json(){  // From NoSQL
var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nloadresponsequestions('"+passkey+"')\n";

 //send data to iterate input boxes
navigator.pyRun.PyCommand(pycom,chainload_responses_json,onError); //listR declares iJSON_R global


}

function chainload_responses_json(json_chain){  // From NoSQL
  iJSON_R=eval("(function(){return " + json_chain + ";})()"); //Jresponses
var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nloadtodayresponses('"+passkey+"')\n";

 //send data to iterate input boxes
 //listj input is actually listR(responses_json,responses_json)
navigator.pyRun.PyCommand(pycom,listR,onError); //listR declares iJSON_R global


}

var insertData_R=function(jsonIN){


var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nsaveresponsedata('"+passkey+"','"+jsonIN+"')\n";

navigator.pyRun.PyCommand(pycom,oninserted,onError);


};





function oninserted(text) {
    if(text=='True'){
      // goto graph page
      getDataMatrix(); // external graph loading javascript
      pagechange("graph-page");
    }else{
         alert("Response Parsing Error");
    }
}

function onError() {
    alert("error");
}


//=================python callbacks==============END
//=================Handlers====================




//=================Handlers====================END


// iterate responses
function listR(Jresponses){

iQA_R = Object.keys(iJSON_R);

rJSON_R=eval("(function(){return " + Jresponses + ";})()");

//list old true responses
for(i=0,ii=iQA_R.length; i<ii; i++){
  //build new single, json object to create entry
var tJSON={};
//splitting up large object
  tJSON[iQA_R[i]]={};
  tJSON[iQA_R[i]]["count"] = counter_R; //object counter_R, only for html/js
  tJSON[iQA_R[i]]["active"] = "True"; //not really used, maybe sohuld be the same as it is. maybe omit
  tJSON[iQA_R[i]]["range"] = iJSON_R[iQA_R[i]].range;
  tJSON[iQA_R[i]]["typ"] = iJSON_R[iQA_R[i]].typ;
  tJSON[iQA_R[i]]["aggregate"] = iJSON_R[iQA_R[i]].aggregate;
  tJSON[iQA_R[i]]["multipoint"] = iJSON_R[iQA_R[i]].multipoint;

  if (!(rJSON_R[iQA_R[i]])){ //if value exists
    tJSON[iQA_R[i]]["dailyvalue"] = 0;
  }else{
    tJSON[iQA_R[i]]["dailyvalue"] = rJSON_R[iQA_R[i]];
    
  }

  
  
  dynNew_R(tJSON,"#boxC"); //create new response at box C
  //data to be displayed is stored in value attribute to be able to easily grab all data from response boxes through simple itteration, no scraping html, refer to CSS
  counter_R++;
  }

$(function () {
    $(".slider").each(function () {
        var begin = $(this).data("begin"),
            end = $(this).data("end"),
            startval = $(this).data("startval");

        $(this).slider({
            range: "min",
            value: startval,
            min: begin,
            max: end,
            slide: function (event, ui) {
                //update text box quantity
                var slideramount = ("#" + $(this).attr("id") + "_amount");
                $(slideramount).val(ui.value);
            }
        })

        //initialise text box quantity
        var slideramount = ("#" + $(this).attr("id") + "_amount");
        $(slideramount).val($(this).slider("value"));
    })

    //When text box is changed, update slider
    $('.amount').change(function () {
        var value = this.value,
            selector = $(this).parent('p').next();
        selector.slider("value", value);
    })
});


}  // end list


function dynNew_R(Jobj,toLocation){
//json input must contain ONLY ONE response,count,active status,range
//location must reference ID
var k=Object.keys(Jobj);

var Q = k[0];
var count = Jobj[k[0]]["count"];
var active = Jobj[k[0]]["active"];
var range = Jobj[k[0]]["range"];
var typ = Jobj[k[0]]["typ"];
var aggre = Jobj[k[0]]["aggregate"];
var multip = Jobj[k[0]]["multipoint"];
var dailyval = Jobj[k[0]]["dailyvalue"];

// to location must be in #XXX format to reference ID

var newTextBoxDiv = $(document.createElement('div'))
    .attr({
    "id":'response'+count,
    "class" : "ui-state-default responseData",
    });

  //data to be displayed is stored in value attribute to be able to easily grab all data from response boxes through simple itteration, no scraping html, refer to CSS
  if(typ==="slider"){
  var rangetemp = range.split('-'); //y1-y2
  var range1 = rangetemp[0];
  var range2 = rangetemp[1];

    if (aggre==="True" && multip==="True"){ // totalizer displays all points and sum
      newTextBoxDiv.after().html('<div class="responseData multi-aggregate-entry" id="textbox' + count + '" stat="True" rng="'+range+'" typ="slider" >'+Q+'</div><h3>Daily Total: '+ dailyval +'</h3>'+'<p><input type="number" class="amount" id="slider'+ count +'_amount" /></p><div id="slider'+ count +'" class="slider" data-begin="'+ range1 +'" data-end="'+ range2 +'" data-startval="0"></div>');
    }
    if (aggre==="True" && multip==="False"){ // if totalizer, display sum
      newTextBoxDiv.after().html('<div class="responseData daily-aggregate-entry" id="textbox' + count + '" stat="True" rng="'+range+'" typ="slider" >'+Q+'</div><h3>Daily Total: '+ dailyval +'</h3>'+'<p><input type="number" class="amount" id="slider'+ count +'_amount" /></p><div id="slider'+ count +'" class="slider" data-begin="'+ range1 +'" data-end="'+ range2 +'" data-startval="0"></div>');
    }

    //^^^ kindof the same ^^^^


    if (aggre==="False" && multip==="True"){ // only care if there is a total
      newTextBoxDiv.after().html('<div class="responseData multi-entry" id="textbox' + count + '" stat="True" rng="'+range+'" typ="slider" >'+Q+'</div><h3>Multi Point</h3>'+'<p><input type="number" class="amount" id="slider'+ count +'_amount" /></p><div id="slider'+ count +'" class="slider" data-begin="'+ range1 +'" data-end="'+ range2 +'" data-startval="0"></div>');
    }
    if (aggre==="False" && multip==="False"){ // if regular
      newTextBoxDiv.after().html('<div class="responseData daily-entry" id="textbox' + count + '" stat="True" rng="'+range+'" typ="slider" >'+Q+'</div><h3>Daily</h3>'+'<p><input type="number" class="amount" id="slider'+ count +'_amount" /></p><div id="slider'+ count +'" class="slider" data-begin="'+ range1 +'" data-end="'+ range2 +'" data-startval="'+ dailyval +'"></div>');
    }


  }

  if(typ==="note"){
    if (multip==="False"){
  newTextBoxDiv.after().html('<div class="responseData daily-entry" id="textbox' + count + '" stat="True" rng="'+range+'" typ="note" >'+Q+'</div><br><textarea class="textarea" rows="4" maxlength="250">'+ dailyval +'</textarea>' );
  }else{
    newTextBoxDiv.after().html('<div class="responseData daily-entry" id="textbox' + count + '" stat="True" rng="'+range+'" typ="note" >'+Q+'</div><br><textarea class="textarea rows="4" maxlength="250"></textarea>' );
  }


}
  newTextBoxDiv.appendTo(toLocation);

}


//takes in json and creates appropriate box in new location
function GetQData_R(obj){ //dynamic info glue I/O

//obj must be selecting the node with responseData Class
//var objSelector=obj.find(".responseData");
var objSelector=$(".responseData",obj);
var key;
var range;
var dataValue;
var tJSON={};
//create response key
if (objSelector.attr("typ") =="slider"){ // if it's a slider
   var tmpstrint= String($(".slider",obj).slider("option","value"));
  dataValue = parseInt(tmpstrint);
  }
  if (objSelector.attr("typ") =="note"){ // if it's a slider
  dataValue = String($(".textarea",obj).val());

  }
key=objSelector.text(); 
//insert data to response

tJSON[key] = dataValue;
return tJSON;
}





function Getframeresponses() { // get data from the frame
nJSON_R={}; //erase previous entries
var areaSelector = $(".responseData"); //get all responses

for (i = 0; i < areaSelector.length; i++) { //itterate over all responses
  var tJSON = GetQData_R(areaSelector[i]);

  //check for blanks
  var k=Object.keys(tJSON);
  
  if (k==='undefined'||k==null||k==""||k==="") continue; //skips current itteration
  //insert data to rest of responses
  nJSON_R[Object.keys(tJSON)[0]] = tJSON[Object.keys(tJSON)[0]];



}
  var out1 =JSON.stringify(nJSON_R);

 insertData_R(out1);
} //end get












