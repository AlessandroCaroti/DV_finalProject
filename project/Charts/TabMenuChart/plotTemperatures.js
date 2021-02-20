

function changeDataRangeYears() {

  var dataFile = document.getElementById("selectCountryMenu").value;
  var folder;
  
  if(dataFile == ""){
    
    dataFile="Global Land";
    folder = "regions";
  
  }else folder = "counties";
  

  var csv = "/../data/"+folder+ "/" +"/"+dataFile+"/"+ dataFile + "_anomalyTable.csv";
  var json = "/../../data/"+folder+"/"  + dataFile + "/" + dataFile + "_info.json";

  d3.csv(csv)
    .then((data) => {
      
      d3.json(json)
        .then((info) => {
          var baseline = +info["absolute_temp(C)"];
          
          parseDataAttributes(data, baseline, dataFile);
          //Update the LineChart
          updateLineChart(data, ".graphics");
          //Update StripesChart
          updateStripesChart(data);

        })
        .catch((error) => {
          console.log(error);
          //alert("Unable To Load The Dataset!!");
          throw error;
        });
    })
    .catch((error) => {
      console.log(error);
      //alert("Unable To Load The Dataset!!");
      throw error;
    });

}


function defaultDatasetTabMenu(dataFile){

 
  initBaselineAndInfo(dataFile);
  
  var csv = "/../../data/counties/"+dataFile+"/"+dataFile+"_anomalyTable.csv";

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


function loadDataTabMenu(){ 
    
  var dataset = "";
  d3.csv(countries)
    .then((data)=>{

        var i = 0;
        data.forEach( d => {

          var dropdown = document.getElementById("dataset");
          
          var option =  document.createElement("option");
          if(d.Temp != ""){
            
            option.setAttribute("value", d.Temp);
            option.innerHTML = d.Temp;
            dropdown.append(option)

          }
          if( option.value == "Italy"){
            dropdown.selectedIndex = i;
            dropdown.options[i].selected = true;
            // set Italy default dataset
            dataset = option.value;
            
          }
          i++;
        });
        defaultDatasetTabMenu(dataset);
  })
}

