//Global Variables
var full_width = 900
var margin = {top: 40, right: 70, bottom: 30, left: 50};
var width = full_width - margin.left - margin.right;
var height = full_width*9/16 - margin.top - margin.bottom;

var parseMonth = d3.timeParse("%m");
var monthList = ["1","2","3","4","5","6","7","8","9","10","11","12"];


function loadData(){ 
    
  
  const countries = '../../remaining_data/data_new/Countries.csv';
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

            //test(option.value)
            if( option.value == "Italy"){
              dropdown.selectedIndex = i;
              dropdown.options[i].selected = true;
              // set Italy default dataset
              dataset = option.value;
              
            }
            i++;
          });

          
          defaultDataHottestColdest(dataset);
          
    })
}



function getLineGenerators(x, y){
    
    
    var valueline_annual = d3.line()
                              .x(function(d) { console.log();return x(parseMonth(d.month))})
                              .y(function(d) {  return y(d.monthly_value); })
                              .defined( (d) => { return ( !isNaN(d.monthly_value) ) } );        
 
    return valueline_annual;

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
             .domain([d3.min(data, function(d) { return d.monthly_value }), 
                          d3.max(data, function(d) { return d.monthly_value })])
             .range([ height, 0 ]);
  
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
        
        if( d.Month == 5  ) data_annual.push({ Year:d.Year, annual_value: d.annual_value, annual_unc: d.annual_unc});
    });

  return data_annual;

}


function getHottestYears(data){
  var temperatures = getAverageTemperature(data).sort( (x, y) => x.annual_value - y.annual_value);
 
  var hottest_year = [];
  var color_list = ["#ff0000", "#FF7100", "#FFAF00", "#FFE700","#F3FF00"];
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


  return hottest_year;

}


function getColdestYears(data){

  var temperatures = getAverageTemperature(data).sort( (x, y) => x.annual_value - y.annual_value)
 
  var coldest_year = [];
  var color_list = ["#8000ff", "#0000ff", "#00bfff", "#00ffbf","#00ff00"];
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
                  "stroke-opacity:100%;"
      return style;
    }
    else{

     var style_base = "stroke: lightgray;"+
                  "fill: none;"+
                  "stroke-width: 1px;"+
                  "stroke-opacity: 70%;"

      return style_base;
    }

    

}



function hotColdMouseEnter(self, event, d){

    d3.select(self).style("stroke-width","6px");
    d3.select(self).style("stroke-opacity","100%");
  

}

function hotColdMouseLeave(self, event, d, hot_cold_list){    
    
    year = self.className.baseVal.split("-")[1]; 
    if( isInList(year, hot_cold_list)  )
      d3.select(self).style("stroke-width","2px");
    else{
      d3.select(self).style("stroke-width","1px");
      d3.select(self).style("stroke-opacity","70%");
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
    var curX = 25;
    var curY = 25;
    legend.append("text")
          .attr("x", curX)
          .attr("y", curY)
          .attr("class", "title-legend-h-c")
          .text("Top 5 Hottest Temperatures");

    var id_idx = 0;
    hottest_temp.forEach( (el)=>{

        curY += 35
        legend.append( "rect" )
              .attr("x", curX ).attr("width", 20)
              .attr("y", curY).attr("height", 20)
              .attr("fill", el.color_value)
        
        legend.append( "text" )
              .attr("x", curX + 50)
              .attr("y", curY + 15)
              .html(el.Year)
              .attr("class","text-legend")
              .attr("id", "hot-text-"+id_idx) 
        
        legend.append( "text" )
              .attr("x", curX + 90)
              .attr("y", curY + 15)
              .html(" - "+el.annual_value.toFixed(2) + " &deg;C")
              .attr("class","text-legend")
              .attr("id", "hot-temp-"+id_idx) 
      id_idx ++;
        
    }) 
    
    curY += 60
    legend.append("text")
          .attr("x", curX)
          .attr("y", curY)
          .attr("class", "title-legend-h-c")
          .text("Top 5 Coldest Temperatures");
    
    id_idx = 0;
    coldest_temp.forEach( (el)=>{

            curY += 35
            legend.append( "rect" )
                  .attr("x", curX ).attr("width", 20)
                  .attr("y", curY).attr("height", 20)
                  .attr("fill", el.color_value)
                  
            legend.append( "text" )
                  .attr("x", curX + 50)
                  .attr("y", curY + 15)
                  .html(el.Year)
                  .attr("class","text-legend")
                  .attr("id", "cold-text-"+id_idx) ;

            legend.append( "text" )
                  .attr("x", curX + 90)
                  .attr("y", curY + 15)
                  .html(" - "+el.annual_value.toFixed(2) + " &deg;C")
                  .attr("class","text-legend")
                  .attr("id", "cold-temp-"+id_idx) 
          
          id_idx ++;
                    
        }) 
 
  
}


function updateHotColdLegend(hottest_temp, coldest_temp){

  var id_idx=0;
  hottest_temp.forEach( (el)=>{

    d3.select("#hot-text-"+id_idx).html(el.Year);
    d3.select("#hot-temp-"+id_idx).html(" - "+el.annual_value.toFixed(2) + " &deg;C");
    id_idx ++;
      

  })
  
  id_idx = 0;
  coldest_temp.forEach( (el)=>{

    d3.select("#cold-text-"+id_idx).html(el.Year);
    d3.select("#cold-temp-"+id_idx).html(" - "+el.annual_value.toFixed(2) + " &deg;C");
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

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x_axis_hc")
      .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%b"))
            );


    svg.append("g")
      .attr("class", "y_axis_hc")
      .call(d3.axisLeft(y));

    var valueline_annual = getLineGenerators(x,y);

    

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
                      .on("mouseover", function(event, d){ hotColdMouseEnter(this, event, d)})
                      .on("mouseout", function(event, d){ hotColdMouseLeave(this, event, d, hot_cold_list)})
                  
  createHotColdLegend("container-h-c", hottest_temp, coldest_temp);
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


  var valueline_annual = getLineGenerators(x,y);

  var line = d3.select(".line_chart_hottest_coldest").selectAll("path").data(dataMonthly);

  line.exit().remove();
        
  line.enter()
          .append("g")
          .append("path")
          .merge(line)
          .attr("d", valueline_annual)
          .attr("class", (d)=>String("path-"+d[0].Year))
          .attr("style", (d) => getHotColdStyle(hot_cold_list,d))
          .on("mouseover", function(event, d){ hotColdMouseEnter(this, event, d)})
          .on("mouseout", function(event, d){ hotColdMouseLeave(this, event, d, hot_cold_list)})

  
  updateHotColdLegend(hottest_temp, coldest_temp);
 


}