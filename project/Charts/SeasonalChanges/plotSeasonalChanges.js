

//TODO: FUNCTION TO DELETE AT THE END
/*

function loadDataSeasonal(){ 
    
    var dataset = "";
    d3.csv(countries)
      .then((data)=>{

          var i = 0;
          data.forEach( d => {

            var dropdown = document.getElementById("dataset");
            
            var option =  document.createElement("option");
            option.setAttribute("value", d.Country);
            option.innerHTML = d.Country;
            dropdown.append(option)

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

*/


/*


function defaultSeasonalChanges(dataFile=""){

    

    initBaselineAndInfo(dataFile);

    var csv = "/../../data/counties/" + dataFile + "/" + dataFile + "_anomalyTable.csv";
    var csvBaseline = "/../../data/counties/" + dataFile + "/" + dataFile+"_monthlyAbsoluteTemperature.csv";

    d3.csv(csv)
    .then( (data)=>{ 
        
        d3.csv(csvBaseline)
          .then((dataBaseline)=>{

            parseDataAttributes(data);
            parseSeasonalBaseline(dataBaseline, dataFile);
            createDeafaultSeasonalLinechart(data, dataBaseline)
          
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

    var folder;
    
    if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
    else
        folder = dataFile;


    var csv = "/../../remaining_data/data_new/"+folder+"/"+dataFile+"_anomalyTable.csv";
    var csvBaseline = "/../../remaining_data/data_new/"+folder+"/"+dataFile+"_monthlyAbsoluteTemperature.csv";

    d3.csv(csv)
    .then( (data)=>{ 
        
        d3.csv(csvBaseline)
          .then((dataBaseline)=>{

            parseDataAttributes(data);
            parseSeasonalBaseline(dataBaseline, dataFile);
            updateSeasonalLineChart(data, dataBaseline);
          
          }).catch((error) =>{
            console.log(error);
            throw(error);
        })
     
    }).catch((error) =>{
        console.log(error);
        throw(error);
        })

}


*/