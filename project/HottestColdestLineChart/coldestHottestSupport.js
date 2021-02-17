//Global Variables
var full_width = 900
var margin = {top: 40, right: 70, bottom: 30, left: 50};
var width = full_width - margin.left - margin.right;
var height = full_width*9/16 - margin.top - margin.bottom;

var parseMonth = d3.timeParse("%m");
var monthList = ["1","2","3","4","5","6","7","8","9","10","11","12"];


function getLineGenerators(x, y){
    
    
    var valueline_annual = d3.line()
                              .x(function(d) { return x(parseMonth(d.month))})
                              .y(function(d) {  return y(d.monthly_value ); })
                              .defined( (d) => { return ( !isNaN(d.monthly_value) ) } );  
                              
                              
    var zeroline = d3.line()
                      .x(function(d) { return x(parseMonth(d.month))})
                      .y(function(d) {  return y(d.zero_val ); })
 
    return [valueline_annual, zeroline];

}


function getScales(data){
  
  var m =[];
    monthList.forEach((d)=>{
        m.push( parseMonth(d));
      })
    
    var x = d3.scaleTime()
              .domain(d3.extent(m, function(d) { return d }))
              .range([ 0, width ]);             

           // Add Y axis
    var y = d3.scaleLinear()
               .domain(d3.extent(data, function(d) { return d.monthly_value}))
               .range([height, 0 ]);
  
    return [x, y];

}


// data grouped by year
function getMonthlyData(data, hottestYears, coldestYears){
    
    var monthlyData =[];
    
    for(var i=0; i< data.length; i++){

        monthlyData[String(data[i].Year)]= [];
    }

    data.forEach((d)=>{

        var row = {};
        row["month"] = d.Month;
        row["monthly_value"] = d.monthly_value;
        row["Year"] = d.Year;
        row["annual_anomaly"] = d.annual_anomaly;
        row["zero_val"] = 0;
    
        monthlyData[String(d.Year)].push(row);
    })

   
    var years = Object.keys(monthlyData);
    var years_every10=[];
    var data_every10=[];

    //data every 10 years
    for( var i=0; i < years.length; i+=10) years_every10.push(years[i])
    
    // add hootest coldest years
    for(var i=0; i< hottestYears.length; i++){

       if(!isInList( hottestYears[i].Year, years_every10))
          years_every10.push(hottestYears[i].Year);
        
        if(!isInList( coldestYears[i].Year, years_every10)) 
            years_every10.push(coldestYears[i].Year)
    }


    years_every10.forEach( (y)=>{

      data_every10.push( monthlyData[y])

    })


   return data_every10;

}


function getAverageTemperature(data){

  var data_annual = [];

    data.forEach((d) => {
        
        if( d.Month == 6  ) data_annual.push({ Year:d.Year, annual_value: d.annual_value, 
                                              annual_unc: d.annual_unc, annual_anomaly: d.annual_anomaly});
    });

  return data_annual;

}


function getHottestYears(data){
  var temperatures = getAverageTemperature(data).sort( (x, y) => x.annual_value - y.annual_value);
  var hottest_year = [];
  var color_list = ["#FF0020", "#FF4600", "#FF7800", "#FFaa00","#FFe600"];
  var j =0;
  var counter_temp = 0;
  for(var i=(temperatures.length-1); i >= 0 ; i--){

    if( counter_temp == 5) break;

    if( isNaN(temperatures[i].annual_value) ) continue;
    else{
      temperatures[i]["color_value"] = color_list[j];
      hottest_year.push(temperatures[i]);
      j++;
      counter_temp++;

    }
  }
  console.log("aaaaa", hottest_year)

  return hottest_year;

}


function getColdestYears(data){

  var temperatures = getAverageTemperature(data).sort( (x, y) => x.annual_value - y.annual_value)
 
  var coldest_year = [];
  var color_list = ["#17ff00", "#00ffa8", "#00fff4", "#0094ff","#0054ff"].reverse();
  var j =0;
  var counter_temp = 0;
  for(var i=0; i < temperatures.length; i++){

    if( counter_temp == 5) break;

    if( isNaN(temperatures[i].annual_value) ) continue;
    else{
      temperatures[i]["color_value"] = color_list[j];
      coldest_year.push(temperatures[i]);
      j++;
      counter_temp++;

    }
   
  }


  return coldest_year;

}


function isInList(el, list){

  for(var i=0; i< list.length; i++){
    if( el == list[i].Year) return true;
  }

  return false;
}


function getIdxList(el, list){

  for(var i=0; i< list.length; i++){
    if( el == list[i].Year) return i;
  }

  return -1;

}



function getHotColdStyle(hot_cold_list, d){

    if( isInList(d[0].Year, hot_cold_list)  ){
                          
                            
      var idx = getIdxList(d[0].Year, hot_cold_list);
      
       var style= "stroke:" + hot_cold_list[idx].color_value+";"+
                  "fill: none;"+
                  "stroke-width: 2px;"+
                  "stroke-opacity:80%;"
      return style;
    }
    else{

     var style_base = "stroke: lightgray;"+
                  "fill: none;"+
                  "stroke-width: 1px;"+
                  "stroke-opacity: 50%;"

      return style_base;
    }
}



function hotColdMouseEnter(self, event, d, hottest_temp, coldest_temp){

    d3.select(self).style("stroke-width","6px");
    d3.select(self).style("stroke-opacity","80%");

    year = self.className.baseVal.split("-")[1];
    
    if( isInList(year, hottest_temp)  ){
      var idx = getIdxList(year, hottest_temp);
      d3.select("#hot-text-"+idx).style("font-weight", "bold")
                                .style("text-decoration", "underline")
                                .style("text-decoration-color", "black");
                                

    }
    
    if( isInList(year, coldest_temp)  ){
      var idx = getIdxList(year, coldest_temp);
      d3.select("#cold-text-"+idx).style("font-weight", "bold")
                                  .style("text-decoration", "underline")
                                  .style("text-decoration-color", "black");
    
    }

}

function hotColdMouseLeave(self, event, d, hot_cold_list, hottest_temp, coldest_temp){    
    
    year = self.className.baseVal.split("-")[1]; 
    if( isInList(year, hot_cold_list)  )
      d3.select(self).style("stroke-width","1.5px");
    else{
      d3.select(self).style("stroke-width","1px");
      d3.select(self).style("stroke-opacity","50%");
    }

    if( isInList(year, coldest_temp)  ){
      var idx = getIdxList(year, coldest_temp);
      d3.select("#cold-text-"+idx).style("font-weight", "normal").style("text-decoration", "none");

    }

    if( isInList(year, hottest_temp)  ){
      var idx = getIdxList(year, hottest_temp);
      d3.select("#hot-text-"+idx).style("font-weight", "normal").style("text-decoration", "none");
 
    }
}



function createHotColdLegend(id_container, hottest_temp, coldest_temp){

    container = d3.select("#"+id_container);
    
    var width = document.getElementById(id_container).offsetWidth
    var height = document.getElementById(id_container).offsetHeight
 
    legend = container.append("svg")
                      .attr("id","legend_hot_cold")
                      .attr("width", 270)
                      .attr("height", 500)
                      .attr("transform", "translate("+(width-300)+","+-(height-200)+")")
                      .append("g")
    var curX = 50;
    var curY = 25;
    legend.append("text")
          .attr("x", curX-20)
          .attr("y", curY)
          .attr("class", "title-legend-h-c")
          .text("Top 5 Hottest Anomalies");

    var id_idx = 0;
    hottest_temp.forEach( (el)=>{

        curY += 35
        legend.append( "rect" )
              .attr("x", curX ).attr("width", 20)
              .attr("y", curY).attr("height", 20)
              .attr("fill", el.color_value)
        
        legend.append( "text" )
              .attr("class","text-legend")
              .attr("x", curX + 35)
              .attr("y", curY + 15)
              .attr("id", "hot-text-"+id_idx )
              .html(el.Year + "&nbsp &nbsp"+
                (el.annual_anomaly> 0? "+"+el.annual_anomaly.toFixed(2): el.annual_anomaly.toFixed(2)) + " &deg;C")
        

      id_idx ++;
        
    }) 
    
    curY += 60
    legend.append("text")
          .attr("x", curX-20)
          .attr("y", curY)
          .attr("class", "title-legend-h-c")
          .text("Top 5 Coldest Anomalies");
    
    id_idx = 0;

    coldest_temp.forEach( (el)=>{

            curY += 35
            legend.append( "rect" )
                  .attr("x", curX ).attr("width", 20)
                  .attr("y", curY).attr("height", 20)
                  .attr("fill", el.color_value)
                  
            legend.append( "text" )
                  .attr("class","text-legend")
                  .attr("x", curX + 35)
                  .attr("y", curY + 15)
                  .attr("id", "cold-text-"+id_idx )
                  .html(el.Year + "&nbsp &nbsp"+
                      (el.annual_anomaly> 0? "+"+el.annual_anomaly.toFixed(2): el.annual_anomaly.toFixed(2)) + " &deg;C")
        
          id_idx ++;
                    
        }) 
 
  
}


function updateHotColdLegend(hottest_temp, coldest_temp){

  var id_idx=0;
  hottest_temp.forEach( (el)=>{

    d3.select("#hot-text-"+id_idx).html(el.Year);
    d3.select("#hot-temp-"+id_idx).html((el.annual_anomaly> 0? "+"+el.annual_anomaly.toFixed(2): el.annual_anomaly.toFixed(2)) + " &deg;C");
    id_idx ++;
      
  })
  
  id_idx = 0;
  coldest_temp.forEach( (el)=>{

    d3.select("#cold-text-"+id_idx).html(el.Year);
    d3.select("#cold-temp-"+id_idx).html((el.annual_anomaly> 0? "+"+el.annual_anomaly.toFixed(2): el.annual_anomaly.toFixed(2)) + " &deg;C");
    id_idx ++;

  })


}
function createHottestColdestLineChart(data){
    
    var hottest_temp =  getHottestYears(data);
    var coldest_temp =  getColdestYears(data);

    console.log("EQUAL: ", hottest_temp.length == coldest_temp.length)
    var hot_cold_list = hottest_temp.concat(coldest_temp);

    var dataMonthly = getMonthlyData(data, hottest_temp, coldest_temp);

    var svg = d3.select("#hottest_coldest_container")
                .append("svg")
                .attr("class","graphics")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
                
    var scales = getScales(data);
    var x = scales[0] 
    var y =  scales[1]

   
    
    linegenerator= getLineGenerators(x,y);
    
    var valueline_annual = linegenerator[0];
    var zero_line = linegenerator[1];

    

    // Draw the line the line
    svg.append("g")
                  .attr("class","line_chart_hottest_coldest")
                    .selectAll("path")
                    .data(dataMonthly)
                    .enter()
                    .append("path")
                      .attr("d", valueline_annual)
                      .attr("class", (d)=>String("path-"+d[0].Year))
                      .attr("style", (d) => getHotColdStyle(hot_cold_list,d))
                      .on("mouseover", function(event, d){ hotColdMouseEnter(this, event, d, hottest_temp, coldest_temp)})
                      .on("mouseout", function(event, d){ hotColdMouseLeave(this, event, d, hot_cold_list, hottest_temp, coldest_temp)})
  
    
    svg.append("g")
        .attr("class","zero-line")
       .selectAll("path")
       .data(dataMonthly)
        .enter()
        .append("path")
        .attr("d", zero_line)
             
    createHotColdLegend("container-h-c", hottest_temp, coldest_temp);

    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x_axis_hc")
    .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%b"))
          );


  svg.append("g")
    .attr("class", "y_axis_hc")
    .call(d3.axisLeft(y));

} 


function UpdateHottestColdestLineChart(data){

   
  var hottest_temp =  getHottestYears(data);
  var coldest_temp =  getColdestYears(data);
  var hot_cold_list = hottest_temp.concat(coldest_temp);
  console.log("EQUAL: ", hottest_temp.length == coldest_temp.length)

  var dataMonthly = getMonthlyData(data, hottest_temp, coldest_temp);


              
  var scales = getScales(data);
  var x = scales[0] 
  var y =  scales[1]


  //update y axis
  d3.select(".y_axis_hc")
    .transition().duration(500)
    .call(d3.axisLeft(y));  


  var valueline_annual = getLineGenerators(x,y)[0];
  var zero_line = getLineGenerators(x,y)[1];

  var line = d3.select(".line_chart_hottest_coldest").selectAll("path").data(dataMonthly);

  line.exit().remove();
        
  line.enter()
          .append("g")
          .append("path")
          .merge(line)
          .attr("d", valueline_annual)
          .attr("class", (d)=>String("path-"+d[0].Year))
          .attr("style", (d) => getHotColdStyle(hot_cold_list,d))
          .on("mouseover", function(event, d){ hotColdMouseEnter(this, event, d,hottest_temp, coldest_temp)})
          .on("mouseout", function(event, d){ hotColdMouseLeave(this, event, d, hot_cold_list, hottest_temp, coldest_temp)})

  var zeroLine = d3.select(".zero-line").selectAll("path").data(dataMonthly);

  zeroLine.exit().remove();
  
  zeroLine.append("g")
          .enter()
          .append("path")
          .merge(zeroLine)
          .attr("d", zero_line)
  updateHotColdLegend(hottest_temp, coldest_temp);
 


}