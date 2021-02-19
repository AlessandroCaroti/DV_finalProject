

function changeData() {
    
    // prendere dati da mappa selezionata o dropdown menu
    var dataFile = document.getElementById('dataset').value;

    
    initBaselineAndInfo(dataFile);
    
    var folder;
 
    if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
    else
        folder = dataFile;

    var csv = "/../data/counties/" + dataFile + "/" + dataFile + "_anomalyTable.csv";
 
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


function defaultLineChartDataset(dataFile){

  
  initBaselineAndInfo(dataFile);

  
  var csv = "/../data/counties/" + dataFile + "/" + dataFile + "_anomalyTable.csv";

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


function loadData(){ 
    
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
        defaultLineChartDataset(dataset);
  })
}

