// function support for the table


function getAnnualData(data){

    var data_annual = [];

    data.forEach((d) => {
        
        if( d.Month == 5  ){
            d["region"] = document.getElementById('dataset').value;
            data_annual.push(d);
            
        }
    });
    
    return data_annual;
}



function dataEvery50Years(data){

    var annual_data = getAnnualData(data);
    var data_2 = [];

    for( i=0; i < annual_data.length; i= i+50){  data_2.push(annual_data[i]);}
    return data_2;
}


function table_data(data_country, data_emisphere=null, data_continet=null, data_global=null){

    //TODO:SARA DA RICHIAMARE ANCHE PER I DATAI SUI CONTINENTE, EMISFERO, GLOBALI 
    //data for each region
    var data_table = [];
    data_table["Regions"] = data_country[0].region;

    data_country.forEach((d) => data_table[ String(d.date.getFullYear()) ] = d.annual_value.toFixed(2))


    console.log(data_table.sort("desc"));
   
    return data_table;
}

function getRowTable(data_2){

    var row = [data_2[0].region];
    data_2.forEach( (d) => row.push(d.annual_value.toFixed(2)  ) );
    return row
}

function createDefaultTable(data){

    data_2 = dataEvery50Years(data);
 
    var svg = d3.select("#table_container")
                .attr("width", width_table + margin_table.left + margin_table.right)
                .attr("height", height_table + margin_table.top + margin_table.bottom)
                .append("g")
                .attr("class","table_mean_rate")
                .attr("transform", "translate(" + margin_table.left + "," + margin_table.top + ")")
    
    var table = svg
                .append("table")
                .attr("class", "mean_rate"),
                thead = table.append("thead"),
                tbody = table.append("tbody");
    


    
    var data_table = table_data(data_2);

   
   
    

    
    console.log()
    
    //var row_data = getRowTable(data_2)

    


}



function UpdateTable(data){

    //TODO:TO BE IMPLEMENTED YET
}