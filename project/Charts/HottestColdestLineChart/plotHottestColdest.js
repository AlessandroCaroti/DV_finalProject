

function defaultDataHottestColdest(dataFile=""){

    if( dataFile == "") dataFile = "Afghanistan";

    
    document.getElementById("hottest_coldest_title").innerHTML= dataFile;

    initBaselineAndInfo(dataFile);

    var csv = "/../data/counties/" + dataFile + "/" + dataFile + "_anomalyTable.csv";
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

    var csv = "/../data/counties/" + dataFile + "/" + dataFile + "_anomalyTable.csv";
    initBaselineAndInfo(dataFile);

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
  
            
            defaultDataHottestColdest(dataset);
            
      })
  }