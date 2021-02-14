

function defaultDataHottestColdest(dataFile=""){

    if( dataFile == "") dataFile = "Afghanistan";

    
    document.getElementById("hottest_coldest_title").innerHTML= dataFile;

    var folder;
    
    
    if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
    else
        folder = dataFile;
    
        initBaselineAndInfo(dataFile);
    //var csv = "/../../data/data_temp/"+folder+"/"+dataFile+"_anomalyTable.csv"
    var csv = "/../../remaining_data/data_new/"+folder+"/"+dataFile+"_anomalyTable.csv";
    //Di default c'è dataset 1
    d3.csv(csv)
    .then( function(data){ 
        
        parseDataAttributes(data);
        createHottestColdestLineChart(data);
    
    })
        .catch((error) =>{
        console.log(error);
        //alert("Unable To Load The Dataset!!");
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
        //Di default c'è dataset 1
    d3.csv(csv)
        .then( function(data){ 
            
            parseDataAttributes(data, dataFile);
            UpdateHottestColdestLineChart(data);
        
        })
            .catch((error) =>{
            console.log(error);
            //alert("Unable To Load The Dataset!!");
            throw(error);
        })


}



//TODO: TO DELETE
function test(dataFile){

   
    document.getElementById("hottest_coldest_title").innerHTML= dataFile;

    var folder;
    
    if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
    else
        folder = dataFile;


    var csv = "/../../remaining_data/data_new/"+folder+"/"+dataFile+"_anomalyTable.csv";
        //Di default c'è dataset 1
    d3.csv(csv)
        .then( function(data){ 
            
            parseDataAttributes(data, dataFile);
            UpdateHottestColdestLineChart(data);
        
        })
            .catch((error) =>{
            console.log(error);
            //alert("Unable To Load The Dataset!!");
            throw(error);
        })


}




