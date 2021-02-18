function readDataAllNonNull(continent,portion_continent,hemisphere, data_country, data_global, update=false){

    console.log("1")
    var csv_continent = "/../../remaining_data/general_data/"+ continent+"/"+continent+"_anomalyTable.csv";
    var csv_portion_continent = "/../../remaining_data/general_data/"+ portion_continent+"/"+portion_continent+"_anomalyTable.csv";
    var csv_hemisphere = "/../../remaining_data/general_data/"+ hemisphere+"/"+hemisphere+"_anomalyTable.csv";    
    
    d3.csv(csv_continent)
      .then( (data_continent) =>{
        parseDataAttributes(data_continent, continent);
        
        d3.csv(csv_portion_continent)
        .then((data_portion_continent)=>{
            
          parseDataAttributes(data_portion_continent, portion_continent );
          d3.csv(csv_hemisphere)
            .then((data_hemisphere)=>{          
                
                parseDataAttributes(data_hemisphere, hemisphere);

                if(update) UpdateTable(data_country, data_hemisphere, data_continent, data_global, data_portion_continent);
                else
                    createDefaultTable(data_country, data_hemisphere, data_continent, data_global, data_portion_continent);
            }).catch((error) =>{
                console.log(error);
                throw(error);
              })

        }).catch((error) =>{
            console.log(error);
            throw(error);
          })

      }).catch((error) =>{
        console.log(error);
        throw(error);
      })


}

function readDataAllNull( data_country, data_global, update=false){


  if(update) UpdateTable(data_country, null, null, data_global, null);
  else
      UpdateTable(data_country, null, null, data_global, null);


}

function readDataContinentNull(portion_continent,hemisphere, data_country, data_global, update = false){

    console.log("2")
    var csv_portion_continent = "/../../remaining_data/general_data/"+ portion_continent+"/"+portion_continent+"_anomalyTable.csv";
    var csv_hemisphere = "/../..remaining_data/general_data/"+ hemisphere+"/"+hemispheret+"_anomalyTable.csv";
  
        d3.csv(csv_portion_continent)
        .then((data_portion_continent)=>{
            
            parseDataAttributes(data_portion_continent, portion_continent );
            d3.csv(csv_hemisphere)
            .then((data_hemisphere)=>{          
                
                parseDataAttributes(data_hemisphere, hemisphere);
                
                if(update) UpdateTable(data_country, data_hemisphere, null, data_global, data_portion_continent);
                else
                    createDefaultTable(data_country, data_hemisphere, null, data_global, data_portion_continent);
            }).catch((error) =>{
                console.log(error);
                throw(error);
              })

        }).catch((error) =>{
            console.log(error);
            throw(error);
          })


}


function readDataHemisphereNull(continent,portion_continent, data_country, data_global, update=false){

    console.log("3")
    var csv_continent = "/../../remaining_data/general_data/"+ continent+"/"+continent+"_anomalyTable.csv";
    var csv_portion_continent = "/../../remaining_data/general_data/"+ portion_continent+"/"+portion_continent+"_anomalyTable.csv";
    
    d3.csv(csv_continent)
      .then( (data_continent) =>{
           
        parseDataAttributes(data_continent, continent );
        d3.csv(csv_portion_continent)
        .then((data_portion_continent)=>{

            parseDataAttributes(data_portion_continent, portion_continent );

            if(update) UpdateTable(data_country, null, data_continent, data_global, data_portion_continent);
            else
                createDefaultTable(data_country, null, data_continent, data_global, data_portion_continent);

        }).catch((error) =>{
            console.log(error);
            throw(error);
          })
      }).catch((error) =>{
        console.log(error);
        throw(error);
      })

}

function readDataPortionContinentNull(continent,hemisphere, data_country, data_global, update=false){

    console.log("4")
    var csv_continent = "/../../remaining_data/general_data/"+ continent+"/"+continent+"_anomalyTable.csv";
    var csv_hemisphere = "/../../remaining_data/general_data/"+ hemisphere+"/"+hemisphere+"_anomalyTable.csv";    
    
     d3.csv(csv_continent)
        .then((data_continent)=>{
           
            parseDataAttributes(data_continent, continent );
            d3.csv(csv_hemisphere)
                .then((data_hemisphere)=>{          
                
                parseDataAttributes(data_hemisphere, hemisphere);

                if(update) UpdateTable(data_country, data_hemisphere, data_continent, data_global, null);
                else
                    createDefaultTable(data_country, data_hemisphere, data_continent, data_global, null);
            }).catch((error) =>{
                console.log(error);
                throw(error);
              })

        }).catch((error) =>{
            console.log(error);
            throw(error);
          })
     
}



function readDataOnlyContinent(continent, data_country, data_global,update=false){

    console.log("5")
    var csv_continent = "/../..remaining_data/general_data/"+ continent+"/"+continent+"_anomalyTable.csv";
    
     d3.csv(csv_continent)
        .then((data_continent)=>{
            
            parseDataAttributes(data_continent, continent);

            if(update) UpdateTable(data_country, null, data_continent, data_global, null);
            else
                createDefaultTable(data_country, null, data_continent, data_global, null);  

        }).catch((error) =>{
            console.log(error);
            throw(error);
          })
     
     
}
function readDataOnlyPortionContinent(portion_continent, data_country, data_global, update=false){


    var csv_portion_continent = "/../../remaining_data/general_data/"+ portion_continent+"/"+portion_continent+"_anomalyTable.csv";
    
     d3.csv(csv_portion_continent)
        .then((data_portion_continent)=>{
            
            parseDataAttributes(data_portion_continent, portion_continent);

            if(update) UpdateTable(data_country, null, null, data_global, data_portion_continent);  
            else
                createDefaultTable(data_country, null, null, data_global, data_portion_continent);  

        }).catch((error) =>{
            console.log(error);
            throw(error);
          })
     
     
}

function readDataOnlyHemisphere(hemisphere, data_country, data_global,update=false){

    console.log("7")
    var csv_hemisphere = "/../../remaining_data/general_data/"+ hemisphere+"/"+hemisphere+"_anomalyTable.csv";    
    
     d3.csv(csv_hemisphere)
        .then((data_hemisphere)=>{
            
            parseDataAttributes(data_hemisphere, hemisphere);
            if(update) UpdateTable(data_country, data_hemisphere, null, data_global, null);  
            else
                createDefaultTable(data_country, data_hemisphere, null, data_global, null);  

        }).catch((error) =>{
            console.log(error);
            throw(error);
          })
       
}