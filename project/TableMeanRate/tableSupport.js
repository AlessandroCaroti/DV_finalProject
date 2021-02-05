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


//TODO: Calculate mean rate of change respect to the 50 previous years
function getMeanRateOfChange(){
    
    //TODO: TO BE IMPLEMENTED YET
}



function table_data(data_country, data_emisphere=null, data_continet=null, data_global=null){

    //TODO:SARA DA RICHIAMARE ANCHE PER I DATAI SUI CONTINENTE, EMISFERO, GLOBALI 
    //data for each region
    var data_table = [];
    var row={}
    
    row["Regions"] = data_country[0].region;

    data_country.forEach((d) => row[ String(d.date.getFullYear()) ] = d.annual_value.toFixed(2))
    data_table.push(row)

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
                thead = table.append("thead").attr("class","thead_table"),
                tbody = table.append("tbody").attr("class","tbody_table");
    
    
    //get data for the table and the columns for the header
    
    var data_table = table_data(data_2);
    var columns = Object.keys(data_table[0]);
  
    if( columns[ columns.length - 1 ] == "Regions" ){

        var tmp = columns[columns.length - 1];
        columns.unshift(tmp);
        columns.pop();
    }

 
	var header = thead.append("tr")
		              .selectAll("th")
		              .data(columns)
		              .enter()
                      .append("th")
                      .attr("class","header_table")
			          .text((d) => d);
		
    var rows = tbody.selectAll("tr")
                    .data(data_table)
                    .enter()
                    .append("tr")
                    .attr("class","rows_table")
                    .on("mouseover", function(d){
                        
                        
                        d3.select(this)
                          .style("background-color", "#fff2cc");
                    })
                    .on("mouseout", function(d){
                        
                        d3.select(this)
                        .style("background-color","transparent");
                    });
    

    var cells = rows.selectAll("td")
                    .data(function(row){
                        return columns.map(function(d, i){
                           
                            return {i: d, value: row[d]};
                        });
                    })
                    .enter()
                    .append("td")
                    .attr("class","cells_table")
                    .html(function(d){ return d.value;});

}



function UpdateTable(data){

    data_2 = dataEvery50Years(data);

      //get data for the table and the columns for the header
    
      var data_table = table_data(data_2);
      var columns = Object.keys(data_table[0]);
    
      if( columns[ columns.length - 1 ] == "Regions" ){
  
          var tmp = columns[columns.length - 1];
          columns.unshift(tmp);
          columns.pop();
      }
      
    //var thead = d3.select(".thead_table");
    //var tbody = d3.select(".tbody_table");
    
    var header = d3.select(".header_table")
		            .data(columns)
			        .text((d) => d);
		
    var rows = d3.select(".rows_table")
                .data(data_table)
                .on("mouseover", function(d){
                        
                        
                    d3.select(this)
                      .style("background-color", "#fff2cc");
                })
                .on("mouseout", function(d){
                    
                    d3.select(this)
                    .style("background-color","transparent");
                });

    

    var cells = rows.selectAll("td")
                    .data(function(row){
                        return columns.map(function(d, i){
                           
                            return {i: d, value: row[d]};
                        });
                    })
                    .html(function(d){ 
                        
                        if( String(d.value) == "NaN" ) return "-";
                        else
                            return d.value;
                    
                    });

}