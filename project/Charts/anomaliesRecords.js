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

function getAnomaliesRecordsStyle(hot_cold_list, d) {
  if (isInList(d[0].Year, hot_cold_list)) {
    var idx = getIdxList(d[0].Year, hot_cold_list);

    var style =
      "stroke:" +
      hot_cold_list[idx].color_value +
      ";" +
      "fill: none;" +
      "stroke-width: 2px;" +
      "stroke-opacity:80%;";
    return style;
  }
}

function createAnomaliesRecordsLegend(id_container, hottest_temp, coldest_temp) {
  container = d3.select("#" + id_container);

  var legend = container
    .append("svg")
    .attr("id", "legend_hot_cold")
    .attr("width", 270)
    .attr("height", 460);
  var curX = 50;
  var curY = 25;

  legend
    .append("rect")
    .attr("x", curX - 20)
    .attr("y", curY);

  legend
    .append("text")
    .attr("x", curX - 20)
    .attr("y", curY)
    .attr("class", "title-legend-h-c")
    .text("Top 5 Hottest Anomalies");

  var id_idx = 0;
  hottest_temp.forEach((el) => {
    curY += 30;
    

    legend
      .append("rect")
      .attr("x", curX)
      .attr("width", 20)
      .attr("y", curY-10)
      .attr("height", 20)
      .attr("fill", el.color_value);

    legend
      .append("text")
      .attr("class", "text-legend")
      .attr("x", curX + 35)
      .attr("y", curY + 5)
      .attr("id", "hot-cold-text-" + id_idx)
      .html(
        el.Year +
          "&nbsp &nbsp" +
          (el.annual_anomaly > 0
            ? "+" + el.annual_anomaly.toFixed(2)
            : el.annual_anomaly.toFixed(2)) +
          " &deg;C"
      );

    legend
      .append("rect")
      .attr("id", "hot-cold-rect-" + id_idx)
      .attr("x", curX - 5)
      .attr("width", 150)
      .attr("y", curY - 5)
      .attr("height", 28)
      .style("fill", "white")
      .style("opacity", "0%")
      .on("mouseenter", anomaliesRecordsTextLegendEnter)
      .on("mouseleave", anomaliesRecordsTextLegendLeave);

    id_idx++;
  });

  curY += 45;
  legend
    .append("text")
    .attr("x", curX - 20)
    .attr("y", curY)
    .attr("class", "title-legend-h-c")
    .text("Top 5 Coldest Anomalies");

  coldest_temp.forEach((el) => {
    curY += 30;

    legend
      .append("rect")
      .attr("x", curX)
      .attr("width", 20)
      .attr("y", curY-15)
      .attr("height", 20)
      .attr("fill", el.color_value);

    legend
      .append("text")
      .attr("class", "text-legend")
      .attr("x", curX + 35)
      .attr("y", curY )
      .attr("id", "hot-cold-text-" + id_idx)
      .html(
        el.Year +
          "&nbsp &nbsp" +
          (el.annual_anomaly > 0
            ? "+" + el.annual_anomaly.toFixed(2)
            : el.annual_anomaly.toFixed(2)) +
          " &deg;C"
      );

    legend
      .append("rect")
      .attr("id", "hot-cold-rect-" + id_idx)
      .attr("x", curX - 5)
      .attr("width", 150)
      .attr("y", curY - 5 )
      .attr("height", 28)
      .style("fill", "white")
      .style("opacity", "0%")
      .on("mouseenter", anomaliesRecordsTextLegendEnter)
      .on("mouseleave", anomaliesRecordsTextLegendLeave);


    id_idx++;

  });

  legend
      .append("line")
      .attr("y1", curY + 30)
      .attr("y2", curY + 30)
      .attr("x1", 30)
      .attr("x2", legend.attr("width")-30)
      .style("stroke", "gray")
      .style("stroke-width", "1px")

  legend
      .append("rect")
      .attr("x", curX)
      .attr("width", 20)
      .attr("y", curY+50)
      .attr("height", 20)
      .attr("fill", "lightgray");
  
  legend
      .append("text")
      .attr("class", "text-legend")
      .attr("x", curX + 35 )
      .attr("y", curY + 65 )
      .attr("id", "selected_line")
      .html("");

}

function updateAnomaliesRecordsLegend(hot_cold_list) {
  var id_idx = 0;
  hot_cold_list.forEach((el) => {
    d3.select("#hot-cold-text-" + id_idx)
      .html(
        el.Year +
          "&nbsp &nbsp" +
          (el.annual_anomaly > 0
            ? "+" + el.annual_anomaly.toFixed(2)
            : el.annual_anomaly.toFixed(2)) +
          " &deg;C"
      )
      .on("mouseenter", anomaliesRecordsTextLegendEnter)
      .on("mouseleave", anomaliesRecordsTextLegendLeave);

    id_idx++;
  });
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
    var years_every5=[];
    var data_every5=[];

    //data every 10 years
    for( var i=0; i < years.length; i+=5) years_every5.push(years[i])
  
    // add hootest coldest years
    for(var i=0; i< hottestYears.length; i++){

      years_every5.push(coldestYears[i].Year);
      years_every5.push(hottestYears[i].Year);
    
    }
    
    years_every5 = years_every5.filter(getUniqueValue);

    years_every5.forEach( (y)=>{
        
      data_every5.push( monthlyData[y])

    })

   return data_every5;

}


function getAverageTemperature(data) {
  var data_annual = [];

  data.forEach((d) => {
    if (d.Month == 6)
      data_annual.push({
        Year: d.Year,
        annual_value: d.annual_value,
        annual_unc: d.annual_unc,
        annual_anomaly: d.annual_anomaly,
      });
  });

  return data_annual;
}

function getHottestYears(data) {
  
  var dataFiltered=getAverageTemperature(data).filter((el)=> !isNaN(el.annual_value))
  
  var temperatures = dataFiltered.sort(
    (x, y) => x.annual_value - y.annual_value
  );


  var hottest_year = [];
  var color_list = ["#FF0020", "#FF4600", "#FF7800", "#FFaa00", "#FFe600"];
  var j = 0;
  var counter_temp = 0;
  for (var i = temperatures.length - 1; i >= 0; i--) {
    if (counter_temp == 5) break;

    if (isNaN(temperatures[i].annual_value)) continue;
    else {
      temperatures[i]["color_value"] = color_list[j];
      hottest_year.push(temperatures[i]);
      j++;
      counter_temp++;
    }
  }

  return hottest_year;
}

function getColdestYears(data) {
  var dataFiltered=getAverageTemperature(data).filter((el)=> !isNaN(el.annual_value))
  
  var temperatures = dataFiltered.sort(
    (x, y) => x.annual_value - y.annual_value
  );

  var coldest_year = [];
  var color_list = [
    "#17ff00",
    "#00ffa8",
    "#00fff4",
    "#0094ff",
    "#0054ff",
  ].reverse();
  var j = 0;
  var counter_temp = 0;
  for (var i = 0; i < temperatures.length; i++) {
    if (counter_temp == 5) break;

    if (isNaN(temperatures[i].annual_value)) continue;
    else {
      temperatures[i]["color_value"] = color_list[j];
      coldest_year.push(temperatures[i]);
      j++;
      counter_temp++;
    }
  }

  return coldest_year;
}


function createHottestColdestLineChart(data){
    
  var title = document.getElementById("title-hot-cold").innerHTML;
  document.getElementById("title-hot-cold").innerHTML = title + " - "+ data[0].region;



    var hottest_temp =  getHottestYears(data);
    var coldest_temp =  getColdestYears(data);


    var hot_cold_list = hottest_temp.concat(coldest_temp);

    var dataMonthly = getMonthlyData(data, hottest_temp, coldest_temp);

    var svg = d3.select("#container-h-c")
                .select("svg#graphics")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .select("g")
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
                    .attr("style", (d) => getAnomaliesRecordsStyle(hot_cold_list,d))
                    .on("mouseover", function(event, d){ anomaliesRecordsMouseEnter(this, event, d, hot_cold_list)})
                    .on("mouseout", function(event, d){ anomaliesRecordsMouseLeave(this)})
  
    
    svg.append("g")
        .attr("class","zero-line")
       .selectAll("path")
       .data(dataMonthly)
        .enter()
        .append("path")
        .attr("d", zero_line)
             
    createAnomaliesRecordsLegend("container-h-c", hottest_temp, coldest_temp);

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
          .attr("style", (d) => getAnomaliesRecordsStyle(hot_cold_list,d))
          .attr("id", function(d){
            if(isInList(d[0].Year, hot_cold_list))
                return String("path-"+ getIdxList(d[0].Year, hot_cold_list));
              })
          .attr("class", function(d){
                      
                if(!isInList(d[0].Year, hot_cold_list))
                    return String("grey-path");
          })  
          .on("mouseover", function(event, d){ anomaliesRecordsMouseEnter(this, event, d, hot_cold_list)})
          .on("mouseout", function(){ anomaliesRecordsMouseLeave(this)})

  var zeroLine = d3.select(".zero-line").selectAll("path").data(dataMonthly);

  zeroLine.exit().remove();
  
  zeroLine.append("g")
          .enter()
          .append("path")
          .merge(zeroLine)
          .attr("d", zero_line)
  updateAnomaliesRecordsLegend(hot_cold_list);
 


}


//-------------------------EVENTS ANOMALIES RECORDS ----------------------------------------------

function anomaliesRecordsTextLegendEnter(event, d) {
  var idx = this.id.split("-")[3];

  var idx_text = "hot-cold-text-" + idx;
  d3.select("#" + idx_text)
    .style("font-weight", "bold")
    .style("text-decoration", "underline");

  d3.select("#path-" + idx).style("stroke-width", "6px");

  d3.select("#path-" + idx).moveToFront();
}

function anomaliesRecordsTextLegendLeave(event, d) {
  var idx = this.id.split("-")[3];

  var idx_text = "hot-cold-text-" + idx;
  d3.select("#" + idx_text)
    .style("font-weight", "normal")
    .style("text-decoration", "none");

  d3.select("#path-" + idx).style("stroke-width", "2px");
}

function anomaliesRecordsMouseEnter(self,event, d, hot_cold_list) {
  var idx = self.id.split("-")[1];

  d3.select(self).style("stroke-width", "6px").moveToFront();

  d3.select("#hot-cold-text-" + idx)
    .style("font-weight", "bold")
    .style("text-decoration", "underline")
    .style("text-decoration-color", "black");

  if(!isInList(d[0].Year, hot_cold_list) ){

    d3.select("#selected_line").html(
      d[0].Year +
        "&nbsp &nbsp" +
        (d[5].annual_anomaly > 0
          ? "+" + d[5].annual_anomaly.toFixed(2)
          : d[5].annual_anomaly.toFixed(2)) +
        " &deg;C"
    );

  }
  
}

function anomaliesRecordsMouseLeave(self) {
  var idx = self.id.split("-")[1];

  d3.select(self).style("stroke-width", "2px");

  d3.select("#hot-cold-text-" + idx)
    .style("font-weight", "normal")
    .style("text-decoration", "none");

  d3.select("#selected_line").html("");
}
