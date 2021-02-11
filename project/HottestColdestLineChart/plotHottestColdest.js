

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

    return;
}