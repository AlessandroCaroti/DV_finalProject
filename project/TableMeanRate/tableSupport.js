// function support for the table


//Global variables
var years = ["1750","1800","1850","1900","1950","2000","2020"];

var full_width = 900
var margin_table = {top: 10, right: 10, bottom: 10, left: 20};
var width_table = full_width - margin_table.left - margin_table.right;
var height_table = full_width*9/16 - margin_table.top - margin_table.bottom;


function isNan(json_field){

    return json_field == "NaN";
}


//get annual average data, saved at every june
function getAnnualData(data){

    var data_annual = [];

    data.forEach((d) => {
        
        if( d.Month == 5  ) data_annual.push(d);
    });

    return data_annual;
}


function existYear(data, year){
    
    var x = false;
    data.forEach( (d) =>{
        if( d.Year == year)  x = true;
    });
    
    return x;
}


//Get data every 50 years with also the 2019 at the end
function dataEvery50Years(data){

    var annual_data = getAnnualData(data);   
    var data_2 = [];

    years.forEach( (year) =>{

        annual_data.forEach( (d)=>{

            if( d.Year == year ) data_2.push(d); 
            
        })
        
        if(!existYear(annual_data, year)){
            // handle missing year
            data_2.push({ Year: year, annual_value:NaN, region: annual_data[0].region, annual_unc:NaN})
        }       
        
    })
    
    return data_2;
}


//compute mean rate of changes
function getMeanRateOfChange(temp1,temp2, year_temp1, year_temp2){
  
    return (temp2 - temp1) / (year_temp2 - year_temp1);
}

//save temperature to compute mean rate of changes
function getYearTemperatures(row_table){

    var temperatures = [];
    years.forEach((year)=>{
        
        temperatures[year] = row_table[year].temp;
    })

    return temperatures;
}


function fisrtLetterUpperCase(name){
    return  name.charAt(0).toUpperCase()+ name.slice(1);
}



function addRowTable(dataRegion50, data_region, data_table){

    var row={}
    dataRegion50 = dataEvery50Years(data_region);
    res = dataRegion50[0].region.split("-");
    var regionName;
    if( res.length == 2) regionName= fisrtLetterUpperCase(res[0])+"-"+fisrtLetterUpperCase(res[1]);
    else
        regionName = fisrtLetterUpperCase(res[0])
    
    row["Region"] = regionName;

    dataRegion50.forEach((d) => row[ String(d.Year) ] = {temp: d.annual_value.toFixed(2), mean_rate:NaN, 
                                                            annual_unc:d.annual_unc.toFixed(2), starting_value:false })

    data_table.push(row)

}



// Return a table in which the keys are the Region and all the years
// Each row contains the name of the country (or cointient, or emisphere or global) and the annual average temperature
// Each row correspond to a csv (specific countri, emisphere, continet, global)
function table_data(data_country, data_hemisphere=null, data_continent=null, data_global=null,  data_partial_continent = null){

    
    //data for each region
    var dataCountry50 = null
    var dataGlobal50 = null;
    var dataHemisphere50 = null;
    var dataContinent50 = null;
    var dataPortionContinent50 = null;
    
    var data_table = [];
    
    //COUNTRY
    addRowTable(dataCountry50, data_country, data_table);
    
    // PARTIAL CONTINENT IF IS AVAILABLE
    if( data_partial_continent != null) addRowTable(dataPortionContinent50, data_partial_continent, data_table);

    // CONTINENT IF IS AVAILABLE
    if( data_continent != null) addRowTable(dataContinent50, data_continent, data_table);
    
    // HEMISPHERE IF IS AVAILABLE
    if( data_hemisphere != null ) addRowTable(dataHemisphere50, data_hemisphere, data_table);
    
    //GLOBAL DATA
    addRowTable(dataGlobal50, data_global, data_table);
 
    
    for(var i=0; i<data_table.length; i++){
        
        //get list of temperature to calculate the mean rate of change
        var temperatures = getYearTemperatures(data_table[i]);
        var year_list = Object.keys(temperatures);
    
        var index_year = 0;
        var year_1 = year_list[index_year]; 
        var year_2 = year_list[index_year+1];
        
     
        for( var j =0; j < Object.keys(data_table[i]).length - 2; j++){
            
            // set starting temperature in the first non null cell of the row
            if( isNaN(data_table[i][year_1].mean_rate) ){ 
                
                data_table[i][year_1].mean_rate = temperatures[year_1]; 
                if(!isNaN(temperatures[year_1])) data_table[i][year_1].starting_value=true;
        
            }
                     
            //for each year is saved the mean rate of change and the correspondive temperature of that year
             data_table[i][year_2].temp= String(temperatures[year_2]);
             //comuputing mean rate of change
             
             var meanRate = String(getMeanRateOfChange(temperatures[year_1], temperatures[year_2], year_1, year_2).toFixed(3));
             //Adding + for the positive mean rate
             data_table[i][year_2].mean_rate= meanRate > 0 ? String("+"+meanRate) : meanRate

            //update years
            index_year++;
            year_1 = year_list[index_year];
            year_2 = year_list[index_year+1];     
        }
              
    }
    return data_table;
}


function tableCellEnter(self, event, d){

    var tooltip = d3.select("#table_container .tooltip-map");

    
    var meanRateHtml= d.starting_value ? "<b> Starting Temp. "+ d.mean_rate+" &deg;C":
                     "<b> Mean Rate: " + d.mean_rate+" &deg;C / year"+"<br/>" +"<br/>" +
                     "Temp. Avg.: "+d.temp +" &deg;C " +
                     " &plusmn; " +  d.annual_unc+ " </b>"

    if( d.i != "Region"){

        tooltip.transition();
    
        tooltip.style('left', String( (event.pageX) + 25) + "px" )
            .style('top', String( (event.pageY) - 20) + "px" )
            .style("display", "block")
            .html(meanRateHtml)

        d3.select(self).classed("selected_cell", true);

    }
    
      

}

function tableCellLeave(self){
    var tooltip = d3.select("#table_container .tooltip-map");
    if (tooltip) tooltip.style('display', 'none');
    d3.select(self).classed("selected_cell", false);
}



function createDefaultTable(data_country, data_hemisphere=null, data_continent=null, data_global=null,  data_partial_continent = null){
 
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
    
    
    //getting data for the table and the columns for the header
    var data_table = table_data( data_country, data_hemisphere, data_continent, data_global,  data_partial_continent);

    var columns_head = Object.keys(data_table[0]);
    //Move Regions as first column
    if( columns_head[ columns_head.length - 1 ] == "Region" ){

        var tmp = columns_head[columns_head.length - 1];
        columns_head.unshift(tmp);
        columns_head.pop();
    }

	thead.append("tr")
		 .selectAll("th")
		 .data(columns_head)
		 .enter()
         .append("th")
         .attr("class","header_table")
		 .text((d) => d);
		
    var rows = tbody.selectAll("tr").data(data_table);
    
    rows.enter().append("tr")
                .attr("class","rows_table")
                
                       
    //draw columns
    var columns = tbody.selectAll("tr")
                        .selectAll("td")
                        .data(function(row){
                       
                            return columns_head.map(function(d){

                                                if(d == columns_head[0]) return{i: d, region: row[d] }
                                                return {i: d, mean_rate: row[d].mean_rate, temp: row[d].temp, 
                                                        annual_unc:row[d].annual_unc, starting_value:row[d].starting_value};
                                              
                                             });
                        })
                                       
                      
    columns.enter().append("td");
    

    var count_nan = 0;
    var idx_year = 0;
    var previous_idx;
    
    tbody.selectAll("td")
         .attr("class", function(d,i){
             
            //find cells with regions name
            if(d.i == columns_head[0]) return "region_cell";
            
            //first available values: case fisrt year non null
            if(d.i == years[0] && !isNaN(d.mean_rate) )
                return "start_value_table";
            
            // first available values: case first year null
            //need to calculate where is the fisrt non NaN value
            if( d.i == years[idx_year] && isNaN(d.mean_rate)){
                
                count_nan++;
                idx_year++;
                previous_idx = i; 
                
            }

            if(d.i == years[idx_year] && !isNaN(d.mean_rate) && d.mean_rate != columns_head[0] ) 
            if( previous_idx == (i-1)){
            
                    count_nan = 0;
                    idx_year=0;
                    return "start_value_table";
            }
            
        })
        .attr("id", "cell")
         .html(function(d){ 
            
            
            if( d.i == columns_head[0] ) return d.region;
            if( String(d.mean_rate) == "NaN" ) return "-";
            else
                return d.mean_rate;
                          
        }).on("mouseover",function(event, d){tableCellEnter(this, event, d)})
          .on("mouseout",function(){tableCellLeave(this)})
          

   
}



function UpdateTable(data_country, data_hemisphere=null, data_continent=null, data_global,  data_partial_continent = null){



    //get data for the table and the columns for the header
    
    var data_table = table_data(data_country, data_hemisphere, data_continent, data_global,  data_partial_continent);

    var columns_head = Object.keys(data_table[0]);
    
      if( columns_head[ columns_head.length - 1 ] == "Region" ){
  
          var tmp = columns_head[columns_head.length - 1];
          columns_head.unshift(tmp);
          columns_head.pop();
      }
      	
  
    var tbody= d3.select(".tbody_table")
    var rows = tbody.selectAll("tr").data(data_table);
    

    //exit data and remove
    rows.exit().remove();
    
    rows.enter().append("tr")
                .merge(rows)
                .attr("class","rows_table");

            
    //bind the data to columns in each row
    var columns = tbody.selectAll("tr")
                         .selectAll("td")
                         .data(function(row){
                       
                            return columns_head.map(function(d){

                                                if(d == columns_head[0]) return{i: d, region: row[d] }
                                                return {i: d, mean_rate: row[d].mean_rate, temp: row[d].temp, 
                                                            annual_unc:row[d].annual_unc, starting_value:row[d].starting_value}
                                              
                                             });
                        })
                     
    columns.exit().remove();
    columns.enter().append("td").merge(columns);
   
    
    //variables to find the first values available
    var count_nan = 0;
    var idx_year = 0;
    var previous_idx;
    //update the columns
    tbody.selectAll("td")
    .attr("class", function(d,i){

        if(d.i == columns_head[0]) return "region_cell";

        if(d.i == years[0] && !isNaN(d.mean_rate) && d.mean_rate != columns_head[0])
            return "start_value_table";

        if( d.i == years[idx_year] && isNaN(d.mean_rate) && d.mean_rate != columns_head[0]){

            count_nan++;
            idx_year++;
            previous_idx = i; 
        }

        if(d.i == years[idx_year] && !isNaN(d.mean_rate) && d.mean_rate != columns_head[0] ) 
        if( previous_idx == (i-1)){
               
                count_nan = 0;
                idx_year=0;
                return "start_value_table";
        }
        
     })
     .attr("id", "cell")
    .html(function(d){ 
                            
        if( d.i == columns_head[0] ) return d.region;
        if( String(d.mean_rate) == "NaN" ) return "-";
        else
            return d.mean_rate;
        
        }).on("mouseover",function(event, d){tableCellEnter(this, event, d)})
          .on("mouseout",function(){tableCellLeave(this)})
      

   
}

