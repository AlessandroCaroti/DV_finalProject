function getLineGeneratorsHottestColdest(x, y){
    
    var valueline_annual = d3.line()
                              .x(function(d) { return x(parseMonth(d.month))})
                              .y(function(d) {  return y(d.monthly_value ); })
                              .defined( (d) => { return ( !isNaN(d.monthly_value) ) } );  
                              
                              
    var zeroline = d3.line()
                      .x(function(d) { return x(parseMonth(d.month))})
                      .y(function(d) {  return y(d.zero_val ); })
 
    return [valueline_annual, zeroline];

}


function getScalesHottestColdest(data){
  
  var x_data =[];
  monthList.forEach((d)=>{
    x_data.push( parseMonth(d));
      })
    
  var y_data = [];
  
  data.forEach(row => {

    row.forEach(element =>{

      y_data.push(element.monthly_value);

    })
    
  });

    var x = d3.scaleTime()
              .domain(d3.extent(x_data, function(d) { return d }))
              .range([ 0, width ]);             

    //  Y axis
    var y = d3.scaleLinear()
               .domain([d3.min(y_data) - 0.5, d3.max(y_data) + 0.5])
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
        row["monthly_value"] = d.annual_anomaly;
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

      years_every10.push(coldestYears[i].Year);
      years_every10.push(hottestYears[i].Year);
    
    }
    
    years_every10 = years_every10.filter(getUniqueValue);

    years_every10.forEach( (y)=>{
        
      data_every10.push( monthlyData[y])

    })

 

   return data_every10;

}


function createHottestColdestLineChart(data){
    
  var title = document.getElementById("title-hot-cold").innerHTML;
  document.getElementById("title-hot-cold").innerHTML = title + " - "+ data[0].region;



    var hottest_temp =  getHottestYears(data);
    var coldest_temp =  getColdestYears(data);


    var hot_cold_list = hottest_temp.concat(coldest_temp);

    var dataMonthly = getMonthlyData(data, hottest_temp, coldest_temp);

    var svg = d3.select("#container-h-c")
                .append("svg")
                .attr("id","graphics")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
                
    var scales = getScalesHottestColdest(dataMonthly);
    var x = scales[0];
    var y =  scales[1];

   
    
    linegenerator= getLineGeneratorsHottestColdest(x,y);
    
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
                    .attr("id", function(d){
                        if(isInList(d[0].Year, hot_cold_list))
                            return String("path-"+ getIdxList(d[0].Year, hot_cold_list));
                          })
                    .attr("class", function(d){
                      
                      if(!isInList(d[0].Year, hot_cold_list))
                          return String("grey-path");
                    })
                    .attr("style", (d) => getHotColdStyle(hot_cold_list,d))
                    .on("mouseover", function(event, d){ hotColdMouseEnter(this)})
                    .on("mouseout", function(event, d){ hotColdMouseLeave(this)})
  
    
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

  var title = document.getElementById("title-hot-cold").innerHTML.split("-");
  document.getElementById("title-hot-cold").innerHTML = title[0] + " - "+ data[0].region;

  var hottest_temp =  getHottestYears(data);
  var coldest_temp =  getColdestYears(data);
  var hot_cold_list = hottest_temp.concat(coldest_temp);


  var dataMonthly = getMonthlyData(data, hottest_temp, coldest_temp);
       
  var scales = getScalesHottestColdest(dataMonthly);
  var x = scales[0] 
  var y =  scales[1]


  //update y axis
  d3.select(".y_axis_hc")
    .transition().duration(500)
    .call(d3.axisLeft(y));  


  var valueline_annual = getLineGeneratorsHottestColdest(x,y)[0];
  var zero_line = getLineGeneratorsHottestColdest(x,y)[1];

  var line = d3.select(".line_chart_hottest_coldest").selectAll("path").data(dataMonthly);

  line.exit().remove();
        
  line.enter()
          .append("g")
          .append("path")
          .merge(line)
          .attr("d", valueline_annual)
          .attr("style", (d) => getHotColdStyle(hot_cold_list,d))
          .attr("id", function(d){
            if(isInList(d[0].Year, hot_cold_list))
                return String("path-"+ getIdxList(d[0].Year, hot_cold_list));
              })
          .attr("class", function(d){
                      
                if(!isInList(d[0].Year, hot_cold_list))
                    return String("grey-path");
          })  
          .on("mouseover", function(){ hotColdMouseEnter(this)})
          .on("mouseout", function(){ hotColdMouseLeave(this)})

  var zeroLine = d3.select(".zero-line").selectAll("path").data(dataMonthly);

  zeroLine.exit().remove();
  
  zeroLine.append("g")
          .enter()
          .append("path")
          .merge(zeroLine)
          .attr("d", zero_line)
  updateHotColdLegend(hot_cold_list);
 


}