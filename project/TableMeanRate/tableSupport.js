// function support for the table

function dataEvery50Years(data){

    var data_2 = [];

    for( i=0; i < data.length; i= i+50) data_2.push(data[i]);


    return data_2;
}


function createDefaultTable(data){

    data_2 = dataEvery50Years(data);
 
    var svg = d3.select("#table_container")
                .attr("class","table_")
                .attr("width", width_table + margin_table.left + margin_table.right)
                .attr("height", height_table + margin_table.top + margin_table.bottom)
                .append("g")
                .attr("transform", "translate(" + margin_table.left + "," + margin_table.top + ")")
    
    var table = d3.select("#table_container")
                .append("table")
                .attr("class", "table table-condensed table-striped"),
                thead = table.append("thead"),
                tbody = table.append("tbody");

    var header = thead.append("tr")
                      .selectAll("th")
                      .data(data_2).append("th")
                      .text( function(d){ console.log(d); String( d.date.getFullyYear())} )
                    
    var rows = tbody.selectAll("tr")
                    .data(data_2)
                    .enter()
                    .append("tr")
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