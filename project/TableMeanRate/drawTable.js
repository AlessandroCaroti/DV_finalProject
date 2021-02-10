
const countries = '../../remaining_data/data_new/Countries.csv'
var continent, portion_continent, hemisphere;



function loadData_table(){ 
    
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
            if( option.value == "Italy"){
              dropdown.selectedIndex = i;
              dropdown.options[i].selected = true;
              // set Italy default dataset
              dataset = option.value;
              
            }
            i++;
          });
       
        default_dataset(dataset);
    })

}




function default_dataset(dataFile=""){

    if( dataFile == "") dataFile = "Afghanistan";
  
    
    var dataFile = document.getElementById('dataset').value;
    document.getElementById("table_country").innerHTML= dataFile;
    
    var folder;
    
    if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
    else
        folder = dataFile;

    initBaselineAndInfo(dataFile)
   

    var csv_country = "/../../remaining_data/data_new/"+folder+"/"+dataFile+"_anomalyTable.csv";

    d3.csv(csv_country)
      .then( (data_country) =>{

      
        parseDataAttributes(data_country,dataFile);
    
    
        var csv_global = "/../../remaining_data/general_data/global-land/global-land_anomalyTable.csv";
        d3.csv(csv_global)
          .then( (data_global) =>{

                parseDataAttributes(data_global,"global-land");
           
                d3.json("/../../remaining_data/data_new/"+folder+"/"+dataFile+"_info.json")
                .then( (info) =>{

                   
                  var continent = info["continent"];
                  var portion_continent = info["portion-continent"];
                  var hemisphere = info["hemisphere"];
                  
                  //case continet not null
                
                  if( !isNan(continent) && !isNan(hemisphere) && !isNan(portion_continent))
                      readDataAllNonNull(continent,portion_continent,hemisphere, data_country, data_global)
                  
                  if( !isNan(continent) && isNan(hemisphere) && isNan(portion_continent)) readDataOnlyContinent(continent, data_country, data_global);  
                  if( isNan(continent) && isNan(hemisphere) && !isNan(portion_continent)) readDataOnlyPortionContinent(portion_continent, data_country, data_global);
                  if( isNan(continent) && !isNan(hemisphere) && isNan(portion_continent)) readDataOnlyContinent(hemisphere, data_country, data_global);
                  
                  if(isNan(continent) && !isNan(hemisphere) && !isNan(portion_continent)) readDataContinentNull(portion_continent,hemisphere, data_country, data_global);
                  if(!isNan(continent) && isNan(hemisphere) && !isNan(portion_continent)) readDataHemisphereNull(continent,portion_continent, data_country, data_global);
                  if(!isNan(continent) &&  !isNan(hemisphere) && isNan(portion_continent)) readDataPortionContinentNull(continent,hemisphere, data_country, data_global);
                 
                  console.log("Continent: ", continent,"\nPortion Continent: ", portion_continent,"\nHemisphere: ", hemisphere);
  

            })
              .catch((error) =>{
                console.log(error);
                throw(error);
              })
          }) .catch((error) =>{
            console.log(error);
            throw(error);
          })
    
        }) .catch((error) =>{
          console.log(error);
          //alert("Unable To Load The Dataset!!");
          throw(error);
        })    
           
}


function changeDataTable(){
  
     // prendere dati da mappa selezionata o dropdown menu
     var dataFile = document.getElementById('dataset').value;
     document.getElementById("table_country").innerHTML= dataFile;
     
     initBaselineAndInfo(dataFile);

     var folder;
  
     if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
     else
         folder = dataFile;
     
    //var csv = "/../../data/data_temp/"+folder+"/"+dataFile+"_anomalyTable.csv"
    var csv_country = "/../../remaining_data/data_new/"+folder+"/"+dataFile+"_anomalyTable.csv";

    //Di default c'è dataset 1
    d3.csv(csv_country)
      .then( (data_country) =>{

      
        parseDataAttributes(data_country,dataFile);
    
    
        var csv_global = "/../../remaining_data/general_data/global-land/global-land_anomalyTable.csv";
        d3.csv(csv_global)
          .then( (data_global) =>{


              parseDataAttributes(data_global,"global-land");
           
              
                d3.json("/../../remaining_data/data_new/"+folder+"/"+dataFile+"_info.json")
                .then( (info) =>{

                   
                  var continent = info["continent"];
                  var portion_continent = info["portion-continent"];
                  var hemisphere = info["hemisphere"];
                  
                  //case continet not null
                
                  
                  if( !isNan(continent) && !isNan(hemisphere) && !isNan(portion_continent))
                      readDataAllNonNull(continent,portion_continent,hemisphere, data_country, data_global,true)
                  
                  if( !isNan(continent) && isNan(hemisphere) && isNan(portion_continent)) readDataOnlyContinent(continent, data_country, data_global,true);  
                  if( isNan(continent) && isNan(hemisphere) && !isNan(portion_continent)) readDataOnlyPortionContinent(portion_continent, data_country, data_global,true);
                  if( isNan(continent) && !isNan(hemisphere) && isNan(portion_continent)) readDataOnlyContinent(hemisphere, data_country, data_global,true);
                  
                  if(isNan(continent) && !isNan(hemisphere) && !isNan(portion_continent)) readDataContinentNull(portion_continent,hemisphere, data_country, data_global,true);
                  if(!isNan(continent) && isNan(hemisphere) && !isNan(portion_continent)) readDataHemisphereNull(continent,portion_continent, data_country, data_global,true);
                  if(!isNan(continent) &&  !isNan(hemisphere) && isNan(portion_continent)) readDataPortionContinentNull(continent,hemisphere, data_country, data_global,true);
                 
                  console.log("Continent: ", continent,"\nPortion Continent: ", portion_continent,"\nHemisphere: ", hemisphere);

            
                  
                

            })
              .catch((error) =>{
                console.log(error);
                throw(error);
              })
          }) .catch((error) =>{
            console.log(error);
            throw(error);
          })
    
        }) .catch((error) =>{
          console.log(error);
          throw(error);
        })
}