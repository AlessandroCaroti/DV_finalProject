
const countries = '../../data/Countries.csv';


function loadData(){ 
    
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
    
    initBaseline(dataFile);
    var csv = "/../../data/data_temp/"+folder+"/"+dataFile+"_anomalyTable.csv"
    //Di default c'è dataset 1
    d3.csv(csv)
    .then( function(data){ 
      
      parseDataAttributes(data);
   
      
    })
      .catch((error) =>{
        console.log(error);
        //alert("Unable To Load The Dataset!!");
        throw(error);
    })
}



//TODO:ALLA FINE UNIRE IN UN UNICO CHANGE DATA
function changeDataTable(){
  
     // prendere dati da mappa selezionata o dropdown menu
     var dataFile = document.getElementById('dataset').value;
     document.getElementById("table_country").innerHTML= dataFile;
     
     initBaseline(dataFile);
     
     var folder;
  
     if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
     else
         folder = dataFile;
     
    
     var csv = "/../../data/data_temp/"+folder+"/"+dataFile+"_anomalyTable.csv"
  
     d3.csv(csv)
       .then( (data) =>{ 
         
         parseDataAttributes(data);
          

       })
       .catch((error) =>{
         console.log(error);
         throw(error);
     })  
}