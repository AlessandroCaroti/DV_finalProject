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


function getHeader(data_2){

    var header_cols = ["Region:"];
    data_2.forEach( (d) => header_cols.push(d.date.getFullYear()) );
    return header_cols;

}

function getRowTable(data_2){

    var row = [data_2[0].region];
    data_2.forEach( (d) => row.push(d.annual_value.toFixed(2)  ) );
    return row
}

function createDefaultTable(data){

    data_2 = dataEvery50Years(data);

    console.log(data_2);
 
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
    
   
    var header_cols = getHeader(data_2);
    

    var header =  thead.append("tr")
                      .selectAll("th")
                      .data(header_cols).enter()
                      .append("th")
                      .text((d) => String( d ))
    
    
    var row = getRowTable(data_2)
    tbody.selectAll("tr")
                    .data(row).enter()
                    .append("th")
                    .html((d) => "<br/>"+String( d))
                    .on("mouseover", function(d){
                          d3.select(this)
                              .style("background-color", "orange");
                    })
                    .on("mouseout", function(d){
                          d3.select(this)
                              .style("background-color","transparent");
                    });
    

}



function UpdateTable(data){

    //TODO:TO BE IMPLEMENTED YET
}