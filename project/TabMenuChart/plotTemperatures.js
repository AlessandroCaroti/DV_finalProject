//Global Variables
var full_width = 900
var margin = {top: 40, right: 70, bottom: 30, left: 50};
var width = full_width - margin.left - margin.right;
var height = full_width*9/16 - margin.top - margin.bottom;





function changeData() {
    
    // prendere dati da mappa selezionata o dropdown menu
    var dataFile = document.getElementById('dataset').value;
    document.getElementById("country_line").innerHTML= dataFile;
    document.getElementById("country_stripe").innerHTML= dataFile;
    
    initBaseline(dataFile);
    
    var folder;
 
    if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
    else
        folder = dataFile;
    
   
    var csv = "/../../data/data_temp/"+folder+"/"+dataFile+"_anomalyTable.csv"
 
    d3.csv(csv)
      .then( (data) =>{ 
        
        parseDataAttributes(data);
         
        //Update the LineChart
        updateLineChart(data, ".graphics");
        //Update StripesChart
        updateStripesChart(data)
           
                     
      })
      .catch((error) =>{
        console.log(error);
        throw(error);
    })  
}


function default_dataset(dataFile=""){

  if( dataFile == "") dataFile = "Afghanistan";

  
  document.getElementById("country_line").innerHTML= dataFile;
  document.getElementById("country_stripe").innerHTML= dataFile;
  var folder;
  
  
  if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
  else
      folder = dataFile;
  
  initBaseline(dataFile);
  var csv = "/../../data/data_temp/"+folder+"/"+dataFile+"_anomalyTable.csv"
  //Di default c'è dataset 1
  d3.csv(csv)
  .then( function(data){ 
    
    parseDataAttributes(data);
    createDefaultLineChart(data);
    createDefaultStripesChart(data);
    
  })
    .catch((error) =>{
      console.log(error);
      //alert("Unable To Load The Dataset!!");
      throw(error);
  })



}
