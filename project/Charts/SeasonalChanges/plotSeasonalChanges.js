
function parseSeasonalBaseline(data, region="NaN"){
    
  data.seasonalBaseline = data[0];
  data.seasonalUnc = data[1];
  data.region = region;

}

function loadDataSeasonal(){ 
    
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

            //test(option.value)
            if( option.value == "Italy"){
              dropdown.selectedIndex = i;
              dropdown.options[i].selected = true;
              // set Italy default dataset
              dataset = option.value;
              
            }
            i++;
          });
          defaultSeasonalChanges(dataset)
    })
}






function defaultSeasonalChanges(dataFile=""){

    if( dataFile == "") dataFile = "Afghanistan";

    
    document.getElementById("hottest_coldest_title").innerHTML= dataFile;

    initBaselineAndInfo(dataFile);

    var csv = "/../data/counties/" + dataFile + "/" + dataFile + "_anomalyTable.csv";
    var csvBaseline = "/../data/counties/" + dataFile + "/" + dataFile+"_monthlyAbsoluteTemperature.csv";

    d3.csv(csv)
    .then( (data)=>{ 
        
        d3.csv(csvBaseline)
          .then((dataBaseline)=>{

            parseDataAttributes(data);
            parseSeasonalBaseline(dataBaseline, dataFile);
            createHottestColdestLineChart(data, dataBaseline)
          
          }).catch((error) =>{
            console.log(error);
            throw(error);
        })
     
    }).catch((error) =>{
        console.log(error);
        throw(error);
        })

}




function changeDataSeasonal(){
    
    
    var dataFile = document.getElementById('dataset').value;

    document.getElementById("hottest_coldest_title").innerHTML= dataFile;
    initBaselineAndInfo(dataFile);

    var csv = "/../data/counties/" + dataFile + "/" + dataFile + "_anomalyTable.csv";
    var csvBaseline = "/../data/counties/" + dataFile + "/" + dataFile+"_monthlyAbsoluteTemperature.csv";

    d3.csv(csv)
    .then( (data)=>{ 
        
        d3.csv(csvBaseline)
          .then((dataBaseline)=>{

            parseDataAttributes(data);
            parseSeasonalBaseline(dataBaseline, dataFile);
            UpdateHottestColdestLineChart(data, dataBaseline);
          
          }).catch((error) =>{
            console.log(error);
            throw(error);
        })
     
    }).catch((error) =>{
        console.log(error);
        throw(error);
        })

}