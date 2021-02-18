

function defaultDataHottestColdest(dataFile=""){

    if( dataFile == "") dataFile = "Afghanistan";

    
    document.getElementById("hottest_coldest_title").innerHTML= dataFile;

    var folder;
    
    if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
    else
        folder = dataFile;
    
        initBaselineAndInfo(dataFile);

    var csv = "/../../remaining_data/data_new/"+folder+"/"+dataFile+"_anomalyTable.csv";
    //Di default c'è dataset 1
    d3.csv(csv)
    .then( function(data){ 
        
        parseDataAttributes(data);
        createHottestColdestLineChart(data);
    
    })
        .catch((error) =>{
        console.log(error);
        throw(error);
    })

}




function changeDataHottestColdest(){
    
    
    var dataFile = document.getElementById('dataset').value;

    document.getElementById("hottest_coldest_title").innerHTML= dataFile;

    var folder;
    
    if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
    else
        folder = dataFile;

    var csv = "/../../remaining_data/data_new/"+folder+"/"+dataFile+"_anomalyTable.csv";
   
    d3.csv(csv)
        .then( function(data){ 
            
            parseDataAttributes(data, dataFile);
            UpdateHottestColdestLineChart(data);
        
        })
            .catch((error) =>{
            console.log(error);
            throw(error);
        })

}


function loadDataHotCold(){ 
    
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
  
            
            defaultDataHottestColdest(dataset);
            
      })
  }