//CREATING GLOBALS
var passkey=sessionStorage.p;
var questions;
var dataMatrix;

function onError() {
      alert("error");
      }


function getDataMatrix(){
passkey=sessionStorage.p;

var pycom1="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\ngraphall('"+passkey+"')\n";
 //send data to iterate input boxes
navigator.pyRun.PyCommand(pycom1,getQuestions,onError);


}


function getQuestions(text){
passkey=sessionStorage.p;


dataMatrix=eval("(function(){return " + text + ";})()");
//dataMatrix=[{"date":"2014-06-27T23:07:56.000Z","asd":"34","sad":"34"},{"date":"2014-06-27T23:23:23.000Z","asd":"22","sad":"88"}];

var pycom2="import log\nimport sys\nsys.path = ['/pythonHome/Lib','/pythonHome','.']\nfrom appLogicDef import *\ngetreferencequestions('"+passkey+"')\n";
navigator.pyRun.PyCommand(pycom2,PlotData,onError);

}







      function PlotData(text){

        //getDataMatrix();
        //getQuestions();
        questionZ=eval("(function(){return " + text + ";})()");
        
        //alert(questionZ.join());
        //alert(JSON.stringify(dataMatrix));
        
        DrawChart();
        

      }



// [{"date": "2012-01-11","distance": 603,"townName": "Kansas City"},{"date": "2012-01-12","distance": 534}]






            var chart;
            

            var average = 0;

            function DrawChart() {
            
                // SERIAL CHART
                 // SERIAL CHART
                chart = new AmCharts.AmSerialChart();
                chart.dataProvider = dataMatrix; // questions with date data
                chart.categoryField = "date";
                chart.startDuration = 0.5;
                chart.balloon.color = "#000000";
            
                // AXES
                // category
                var categoryAxis = chart.categoryAxis;
                  categoryAxis.parseDates = true; // in order char to understand dates, we should set parseDates to true
                categoryAxis.minPeriod = "ss"; // as we have data with minute interval, we have to set "mm" here.   
                categoryAxis.fillAlpha = 1;
                categoryAxis.fillColor = "#FAFAFA";
                categoryAxis.gridAlpha = 0;
                categoryAxis.axisAlpha = 0;
                categoryAxis.gridPosition = "start";
                categoryAxis.position = "top";
            
                // value
                var valueAxis = new AmCharts.ValueAxis();
                valueAxis.title = "Place taken";
                valueAxis.dashLength = 5;
                valueAxis.axisAlpha = 0;
                valueAxis.minimum = 0;
                valueAxis.maximum = 100;
                valueAxis.integersOnly = true;
                valueAxis.gridCount = 10;
                valueAxis.reversed = false; // this line makes the value axis reversed
                chart.addValueAxis(valueAxis);
            
                // GRAPHS
                var q=Object.keys(questionZ); //gets all questions from Json and forms array (no date)
                for(i=0; i<q.length; i++){ //for each question, create a new line
                    var graph = new AmCharts.AmGraph();
                    graph.type = "smoothedLine";
                    graph.bullet = "round";
                    graph.bulletColor = "#FFFFFF"; 
                    graph.useLineColorForBulletBorder = true;
                    graph.bulletBorderAlpha = 1;
                    graph.bulletBorderThickness = 2;
                    graph.bulletSize = 7;
    
                    graph.lineThickness = 2;
                    //graph.lineColor = "#00BBCC";//should be random colour
                    //graph.connect = false; // this makes the graph not to connect data points if data is missing
    
                    graph.title = q[i];
                    graph.valueField = q[i];
    
    
                    graph.balloonText = "Note: [note]: [[value]]";
                    graph.bullet = "round";
                    chart.addGraph(graph);
            }
                
                // CURSOR
                var chartCursor = new AmCharts.ChartCursor();
                chartCursor.cursorPosition = "mouse";
                chartCursor.zoomable = false;
                chartCursor.cursorAlpha = 0;
                chart.addChartCursor(chartCursor);                

// SCROLLBAR
                var chartScrollbar = new AmCharts.ChartScrollbar();
                chartScrollbar.graph = graph;
                chartScrollbar.scrollbarHeight = 30;
                chart.addChartScrollbar(chartScrollbar);




            
                // LEGEND
                var legend = new AmCharts.AmLegend();
                legend.useGraphSettings = true;
                chart.addLegend(legend);
            
                // WRITE
                chart.write("chartdiv");
            }