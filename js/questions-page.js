//-----------------globals-------------------

var counter=0; // not used for itteration, only to keep unique ID's

//original starting questions loaded from db, if new, there are none
//normally queried from embedded NoSQL server
//var iJSON={'drink':{'active':'True','typ':'slider','range':'0-100'},'sleep':{'active':'True','typ':'slider','range':'0-100'},'eat':{'active':'False','typ':'slider','range':'0-100'},'run':{'active':'unInit','typ':'slider','range':'0-100'}};
var iJSON={};


var nJSON={}; //new output json

var iQA = []; //all questions array

var oQA=[]; //old Valid questions array

var oHQA=[]; //old hidden questions array

var oUQA=[]; //old uninitialized questions array

//-----------------globals-------------------END
//=================python callbacks==============

var passkey=sessionStorage.p;




function getJSONQuestions(){  // From NoSQL
var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nloadquestions('"+passkey+"')\n";
 //send data to iterate input boxes
navigator.pyRun.PyCommand(pycom,listQ,onError); //listQ declares iJSON global


}












function insertQuestions(questionJSON){
var pycom="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\nsavequestions('"+passkey+"','"+questionJSON+"')\n";
navigator.pyRun.PyCommand(pycom,onDataOut,onError);

}


function onDataOut(text) {
    if(text=='True'){
        chainload_questions_json(); //external answers-page javascript
        pagechange("answers-page");
    }else{
         alert("Question Parsing Error");
    }
}

function onError() {
    alert("General Failure");
}


//=================python callbacks==============END


//sorting script
$(function () {
    var oldList, newList, item;
    $(".categories-sortable").sortable({
        connectWith: $('.categories-sortable'),
        start: function (event, ui) {
            item = ui.item;
            newList = oldList = ui.item.parent();
        },
        stop: function (event, ui) {


          // to trash list
          if (newList.attr('id')=="boxB"){
            //select inner DIV

                var infoJ=GetQData(item);//returns json object with info
                //new blank Question
                if(infoJ[Object.keys(infoJ)[0]]["active"] =="unInit"){//Object.keys(infoJ)[0] selects the first and only question in object
                item.remove();
                }
                //old blank Question
                if(infoJ[Object.keys(infoJ)[0]]["active"] =="True"){//Object.keys(infoJ)[0] selects the first and only question in object
                item.remove(); //remove previous while preserving info
                infoJ[Object.keys(infoJ)[0]]["active"] = "False"; //change
                //range already exists in JSON
                infoJ[Object.keys(infoJ)[0]]["count"] = counter; //change
                dynNew(infoJ,"#boxB");//json input must contain ONLY ONE question,count,active_status,range
                counter++;
                }
          }
          // to questions list
          if (newList.attr('id')=="boxA"){
            //select inner DIV

                var infoJ=GetQData(item);//returns json object with info

                //old trash Question
                if(infoJ[Object.keys(infoJ)[0]]["active"] =="False"){//Object.keys(infoJ)[0] selects the first and only question in object
                item.remove(); //remove previous while preserving info
                infoJ[Object.keys(infoJ)[0]]["active"] = "True"; //change
                //range already exists in JSON
                infoJ[Object.keys(infoJ)[0]]["count"] = counter; //change
                dynNew(infoJ,"#boxA");//json input must contain ONLY ONE question,count,active_status,range
                counter++;
                }
          }

            console.log("Moved " + item.text() + " from " + oldList.attr('id') + " to " + newList.attr('id'));
        },
        change: function (event, ui) {
            if (ui.sender) {
                newList = ui.placeholder.parent();
            }
        },
    })
    //fix text boxes
       // .disableSelection();
});




// iterate questions
function listQ(jtext){
iJSON=eval("(function(){return " + jtext + ";})()");


iQA = Object.keys(iJSON);
oQA = []; //clear old globally cached 
oUQA = [];
oHQA = [];

for (i=0,ii=iQA.length; i<ii; i++){
  if (iJSON[iQA[i]].active == 'True'){
    oQA.push(iQA[i]);
    }
  

  if (iJSON[iQA[i]].active == 'unInit'){
    oUQA.push(iQA[i]);
    }
  if (iJSON[iQA[i]].active == 'False'){
    oHQA.push(iQA[i]);
    }
  }


//list old true questions
for(i=0,ii=oQA.length; i<ii; i++){

  //alert(iJSON[oQA[i]]['aggregate']);
var tJSON={};
  tJSON[oQA[i]]={};
  tJSON[oQA[i]]["count"]=counter;
  tJSON[oQA[i]]["active"]="True";
  tJSON[oQA[i]]["range"]=iJSON[oQA[i]].range;
  tJSON[oQA[i]]["typ"]=iJSON[oQA[i]].typ;
  tJSON[oQA[i]]["aggregate"]=iJSON[oQA[i]].aggregate;
  tJSON[oQA[i]]["multipoint"]=iJSON[oQA[i]].multipoint;



  dynNew(tJSON,"#boxA"); //create new question at box B
  //data to be displayed is stored in value attribute to be able to easily grab all data from question boxes through simple itteration, no scraping html, refer to CSS
  counter++;
  }


//list old uninitialized questions
for(i=0,ii=oUQA.length; i<ii; i++){
  var tJSON={};
  tJSON[oUQA[i]]={};
  tJSON[oUQA[i]]["count"]=counter;
  tJSON[oUQA[i]]["active"]="unInit";
  tJSON[oUQA[i]]["range"]=iJSON[oUQA[i]].range;
  tJSON[oUQA[i]]["typ"]=iJSON[oUQA[i]].typ;
  tJSON[oUQA[i]]["aggregate"]=iJSON[oUQA[i]].aggregate;
  tJSON[oUQA[i]]["multipoint"]=iJSON[oUQA[i]].multipoint;

  dynNew(tJSON,"#boxA"); //create new question at box A
  counter++;
  }

//list old trash questions

for(i=0,ii=oHQA.length; i<ii; i++){
  var tJSON={};
  tJSON[oHQA[i]]={};
  tJSON[oHQA[i]]["count"]=counter;
  tJSON[oHQA[i]]["active"]="False";
  tJSON[oHQA[i]]["range"]=iJSON[oHQA[i]].range;
  tJSON[oHQA[i]]["typ"]=iJSON[oHQA[i]].typ;
  tJSON[oHQA[i]]["aggregate"]=iJSON[oHQA[i]].aggregate;
  tJSON[oHQA[i]]["multipoint"]=iJSON[oHQA[i]].multipoint;

  dynNew(tJSON,"#boxB"); //create new question at box B
  counter++;
  }

}  // end list


function dynNew(Jobj,toLocation){
//json input must contain ONLY ONE question,count,active status,range
//location must reference ID
var k=Object.keys(Jobj);

var Q = k[0];
var count = Jobj[k[0]]["count"];
var active = Jobj[k[0]]["active"];
var range = Jobj[k[0]]["range"];
var typ = Jobj[k[0]]["typ"]; //currently un displayed
var aggre = Jobj[k[0]]["aggregate"];
var aggrecheck="";
var multip = Jobj[k[0]]["multipoint"];
var multipcheck="";

// to location must be in #XXX format to reference ID

var newTextBoxDiv = $(document.createElement('div'))
    .attr({
    "id":'question'+count,
    "class" : "ui-state-default questionArea",
    });

  //data to be displayed is stored in value attribute to be able to easily grab all data from question boxes through simple itteration, no scraping html, refer to CSS
  if(active==="True"){
    if(typ==="slider"){
      newTextBoxDiv.after().html('<div class="questionData colortype-'+aggre+'-'+multip+'" id="textbox' + count + '" aggregate="' + aggre + '" multipoint="' + multip + '" stat="True" rng="'+range+'" typ="slider">'+Q+'</div>'+ '<input type="button" value="Trash" onClick="trashQ('+count+');" class="removeButton" id="removeButton'+count+'"></input>');
    }
    if(typ==="note"){
      newTextBoxDiv.after().html('<div class="questionData colortype-'+aggre+'-'+multip+' notetype" id="textbox' + count + '" aggregate="' + aggre + '" multipoint="' + multip + '" stat="True" rng="'+range+'" typ="note">'+Q+'</div>'+ '<input type="button" value="Trash" onClick="trashQ('+count+');" class="removeButton" id="removeButton'+count+'"></input>');
    }
  }
  if(active==="unInit"){
  // keey uninitialized questions editable
  var rangetemp = range.split('-'); //y1-y2
  var range1 = rangetemp[0];
  var range2 = rangetemp[1];

  if(aggre === "True"){aggrecheck="checked"}
  if(multip === "True"){multipcheck="checked"}
  newTextBoxDiv.after().html('<h3>Your Quesion: </h3>'+ '<img src="style/icons/remove.png" type="button" value="Delete" onClick="deleteQ('+count+');" class="removeButton" id="removeButton'+count+'"></img>'+'<input type="text" class="questionData colortype-'+aggre+'-'+multip+'" id="textbox' + count + '" value="'+Q+'" stat="unInit" typ="slider"></input>'+ '<input class="range1Data" type="number" value="'+range1+'"></input><input class="range2Data" type="number" value="'+range2+'"></input>' +'<br>'+ '<input type="checkbox" '+aggrecheck+' class="aggregateData">Sum Daily</input>'+ '<input type="checkbox" '+multipcheck+' class="multipointData">Reccur daily</input>' );

  }

  if(active==="False"){
    newTextBoxDiv.after().html('<div class="questionData colortype-'+aggre+'-'+multip+'" id="textbox' + count + '" aggregate="' + aggre + '" multipoint="' + multip + '" stat="False" rng="'+range+'" typ="slider">'+Q+'</div>'+ '<input type="button" value="Restore" onClick="restoreQ('+count+');" class="removeButton" id="removeButton'+count+'"></input>');
      if(typ==="note"){
      newTextBoxDiv.after().html('<div class="questionData colortype-'+aggre+'-'+multip+' notetype" id="textbox' + count + '" aggregate="' + aggre + '" multipoint="' + multip + '" stat="False" rng="'+range+'" typ="note">'+Q+'</div>'+ '<input type="button" value="Restore" onClick="restoreQ('+count+');" class="removeButton" id="removeButton'+count+'"></input>');
    }
  }
newTextBoxDiv.appendTo(toLocation);
}



function deleteQ(number){

  $("#question" + number).remove();
}


function trashQ(number){

var selectItem = $("#question" + number);
var infoJ=GetQData(selectItem);//returns json object with info
$("#question" + number).remove();
infoJ[Object.keys(infoJ)[0]]["active"] = "False"; //change
//range already exists in JSON
infoJ[Object.keys(infoJ)[0]]["count"] = counter; //change
dynNew(infoJ,"#boxB")//json input must contain ONLY ONE question,count,active_status,range
counter++;
}


function restoreQ(number){

var selectItem = $("#question" + number);
var infoJ=GetQData(selectItem);//returns json object with info
$("#question" + number).remove();
infoJ[Object.keys(infoJ)[0]]["active"] = "True"; //change
//range already exists in JSON
infoJ[Object.keys(infoJ)[0]]["count"] = counter; //change
dynNew(infoJ,"#boxA")//json input must contain ONLY ONE question,count,active_status,range
counter++;
}

//takes in json and creates appropriate box in new location
function GetQData(obj){ //dynamic info glue I/O

//obj must be selecting the node with questionArea Class
//var objSelector=obj.find(".questionData");
var objSelector=$(".questionData",obj);
var key;
var range;
var aggre;
var multip
var tJSON={};
//create question key
if (objSelector.attr("stat") =="unInit"){ // if it's a new text box
  key=objSelector.prop("value"); //get actual entered text value from property
  var range1 =$(".range1Data",obj).prop("value");
  var range2 =$(".range2Data",obj).prop("value");

  if ($(".aggregateData",obj).is(":checked")){aggre = "True";}else{aggre = "False";}
  if ($(".multipointData",obj).is(":checked")){multip = "True";}else{multip = "False";}

  range = range1 +"-" + range2;

  }else{ // if it's regular uneditable text
    key=objSelector.text(); 
    range = objSelector.attr("rng");
    aggre = objSelector.attr("aggregate");
    multip = objSelector.attr("multipoint");   
}
//insert metadata to question
tJSON[key] ={};
//insert metadata to
tJSON[key]['active'] = objSelector.attr("stat");
tJSON[key]['typ'] = objSelector.attr("typ")
tJSON[key]['range'] = range;
tJSON[key]['aggregate'] = aggre;
tJSON[key]['multipoint'] = multip;
return tJSON;
}





function Getframequestions() {
nJSON={}; //erase previous entries
var areaSelector = $(".questionArea"); //get all questions

for (i = 0; i < areaSelector.length; i++) { //itterate over all questions
  var tJSON = GetQData(areaSelector[i]);

  //check for blanks
  var k=Object.keys(tJSON);
  
  if (k==='undefined'||k==null||k==""||k==="") continue; //skips current itteration
  
  nJSON[Object.keys(tJSON)[0]] ={};
  //insert metadata to question
  nJSON[Object.keys(tJSON)[0]]['active'] =tJSON[Object.keys(tJSON)[0]]['active'];
  nJSON[Object.keys(tJSON)[0]]['range'] =tJSON[Object.keys(tJSON)[0]]['range'];
  nJSON[Object.keys(tJSON)[0]]['typ'] =tJSON[Object.keys(tJSON)[0]]['typ'];
  nJSON[Object.keys(tJSON)[0]]['aggregate'] =tJSON[Object.keys(tJSON)[0]]['aggregate'];
  nJSON[Object.keys(tJSON)[0]]['multipoint'] =tJSON[Object.keys(tJSON)[0]]['multipoint'];
}
  var out1 = JSON.stringify(nJSON);

 insertQuestions(out1);
} //end get












function New(){ //new entry

//<li class="ui-state-default">I have been chosen</li>
var tJSON={};
tJSON[""]={};
tJSON[""]["count"]=counter;
tJSON[""]["active"]="unInit";
tJSON[""]["range"]="0-100";
tJSON[""]['aggregate']="False"
tJSON[""]['multipoint']="False"
dynNew(tJSON,"#boxA"); //create new question at box A
counter++;
}
