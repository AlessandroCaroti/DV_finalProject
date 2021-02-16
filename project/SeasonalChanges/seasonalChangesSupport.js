//Global Variables

//TODO: Quando si unisce tutto, si può lascare un unica dichiarazione di queste varibili 
//TODO: per tutti i grafici tranne che per lo stripechart
var full_width = 900
var margin = {top: 40, right: 70, bottom: 30, left: 50};
var width = full_width - margin.left - margin.right;
var height = full_width*9/16 - margin.top - margin.bottom;

var parseMonth = d3.timeParse("%m");
var monthList = ["1","2","3","4","5","6","7","8","9","10","11","12"];
var colorsYears=["red", "blue","green"];


function getLineGeneratorsSeasonal(x, y){


    var valuelineUnc = d3.area()
                         .x(function(d){ return x(parseMonth(d.month))})
                         .y0(function(d){ return y(d.seasonalBaseline+ d.unc)} )
                         .y1(function(d){ return y(d.seasonalBaseline- d.unc)} );
    
    var valuelineSeasonalBaseline = d3.line()
                                      .x(function(d){ return x(parseMonth(d.month))})
                                      .y(function(d){ return y(d.seasonalBaseline)} );
    
    var valuelineMaxRange = d3.line()
                              .x(function(d){ return x(parseMonth(d.month))})
                              .y(function(d){ return y(d.max + d.seasonalBaseline)} );
    
    var valuelineMinRange = d3.line()
                              .x(function(d){ return x(parseMonth(d.month))})
                              .y(function(d){ return y(d.min + d.seasonalBaseline)} );
    
    var valuelineLastYears = d3.line()
                              .x(function(d){ return x(parseMonth(d.month))})
                              .y(function(d){ return y(d.monthlyTemp)} )
                              .defined( (d) => { return ( !isNaN( d.monthlyTemp ) ) } );
        

    return [ valuelineUnc, valuelineSeasonalBaseline, valuelineMaxRange, valuelineMinRange, valuelineLastYears];
}


function parseSeasonalBaseline(data, region="NaN"){
    
    data.seasonalBaseline = data[0];
    data.seasonalUnc = data[1];
    data.region = region;

}

function getMonthName(month){

    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
                        'Sep', 'Oct', 'Nov', 'Dec']

    return monthName[month - 1]

}


function getScales(data, dataSeasonal){

  var m =[];
    monthList.forEach((d)=>{
        m.push( parseMonth(d));
      })
    
    var x = d3.scaleTime()
              .domain(d3.extent(m, function(d) { return d }))
              .range([ 0, width ]);             
    
           // Add Y axis
    var y = d3.scaleLinear()
              .domain([ d3.min(data, function(d) { return +dataSeasonal.seasonalBaseline[getMonthName(d.Month)] + d.monthly_value - 6} ),
                        d3.max(data, function(d) { return +dataSeasonal.seasonalBaseline[getMonthName(d.Month)] + d.monthly_value + 10 })])
              .range([ height, 0 ]);
  
    return [x, y];

}


function getSeasonalBaselineData(dataSeasonalBaseline){

    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
                        'Sep', 'Oct', 'Nov', 'Dec']
    var data = [];
    for(var i=0; i < monthList.length; i++)
         data.push({month: monthList[i], seasonalBaseline:  +dataSeasonalBaseline.seasonalBaseline[monthName[i]],
                        seasonalUnc: +dataSeasonalBaseline.seasonalUnc[monthName[i]]})
  
    return data;
}

function getDataSeasonal(data, dataSeasonalBaseline){
  
  var dataChart = [];

  for( var i = 1; i <=12; i++ ) {
    var item = {};
    item.month = i;
    //take all data for the i-th month, from 1951 to 1980
    data2 = data.filter( e => e.Month == i && e.date.getFullYear() >= 1951 && 
                         e.date.getFullYear() <= 1980 ); 
    
    item.seasonalBaseline= +dataSeasonalBaseline.seasonalBaseline[getMonthName(i)]; 
    item.unc = +(1.96*d3.deviation( data2, e => e.monthly_value )); 

    data2 = data.filter( e => e.Month == i && e.monthly_unc < 1 ); 

    item.max = d3.max( data2, e => e.monthly_value );
    item.min = d3.min( data2, e => e.monthly_value );
    
    dataChart.push( item );
  }

  return dataChart;
}

function lastYearSeasonalData(data, dataSeasonalBaseline){
  
  max_year = d3.max( data, function(d) { return d.date.getFullYear(); } );
  var dataLastYears = [];
  var i=0;
  for( var yr = max_year - 2; yr <= max_year; yr = yr + 1 ) {
      //take 
      var dataYear = data.filter( e => e.date.getFullYear() == yr ) ;

      dataYear2 = dataYear.map( function(e){ return {year: e.Year, month: e.Month, 
                                                     monthlyTemp: (e.monthly_value + (+dataSeasonalBaseline.seasonalBaseline[getMonthName(e.Month)]) )} })
      //test                                             
      console.log("year-"+i+": "+yr);
      i++;

      dataLastYears.push( dataYear2);
      
    }

    return dataLastYears;
}


function styleLastYearsLines(d, dataLastYears){

  var years = []

  for(var i=0; i< dataLastYears.length; i++ ) years.push( dataLastYears[i][0].year);
  

  for(i=0; i < colorsYears.length; i++)
    if( dataLastYears[i][0].year == d[0].year )
        return colorsYears[i];

    
}

//Create the legend of the Seasonal Linechart
function createSeasonalLineChartLegend(svg, dataLastYears){
  console.log(dataLastYears)
  legend = svg.append( "g" ).attr("class", "legend" );
  
  var curY = 15;
  
  legend.append( "rect" )
        .attr("x", 10).attr("width", 210)
        .attr("y", 1).attr("height", 100)
        .attr("class", "legend")
        .attr("id","legend-square");

  legend.append( "line" )
      .attr("x1", 15).attr("x2", 39)
      .attr("y1", curY).attr("y2", 15)
      .attr("class", "seasonal-range-line");
  
  legend.append( "text" )
      .attr("x", 40)
      .attr("y", curY)
      .attr("class", "legend")
      .attr("id", "text-range")
      .html("Min-Max Range Temp. Untill "+ dataLastYears[dataLastYears.length-1][0].year);
  
  curY+=15;
  legend.append( "rect" )
        .attr("x", 15).attr("width", 15)
        .attr("y", curY ).attr("height", 16)
        .attr("class", "uncertainty");
  
  legend.append( "line" )
        .attr("x1", 15).attr("x2", 30)
        .attr("y1", (curY + 8) ).attr("y2", (curY+8))
        .attr("class", "line-seasonal-baseline");
        
  legend.append( "text" )
        .attr("x", 40)
        .attr("y", curY+8)
        .attr("class", "legend")
        .html("1951-1980 average with 95% range"); 

  
  curY +=12;
  for(var i=0; i<dataLastYears.length; i++){

    curY+=15;
    legend.append( "line" )
            .attr("x1", 15).attr("x2", 30)
            .attr("y1", (curY) ).attr("y2", (curY))
            .attr("id", "legend-"+dataLastYears[i][0].year)
            .attr("stroke", colorsYears[i]);


    legend.append( "text" )
          .attr("x", 40)
          .attr("y", curY)
          .attr("class", "legend")
          .html("Monthly Temperatures of "+dataLastYears[i][0].year); 

  }

}

  function createHottestColdestLineChart(data, dataSeasonalBaseline){

      var seasonalData = getDataSeasonal(data, dataSeasonalBaseline);
      var lastYearsData = lastYearSeasonalData(data,dataSeasonalBaseline);
   
      var svg = d3.select("#seasonal_changes_graphic")
                  .append("svg")
                  .attr("class","graphics")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                  
                  
      var scales = getScales(data, dataSeasonalBaseline);
      var x = scales[0] 
      var y =  scales[1]
  
      var valuelineSeasonalBaseline = getLineGeneratorsSeasonal(x,y);

      svg.append("g")
                  .attr("class","uncertainty")
                  .attr("id", "baseline-unc")
                    .selectAll("path")
                    .data( [seasonalData])
                    .enter()
                    .append("path")
                    .attr("d", valuelineSeasonalBaseline[0]);


      svg.append("g")
                  .attr("class","line-seasonal-baseline")
                    .selectAll("path")
                    .data( [seasonalData])
                    .enter()
                    .append("path")
                    .attr("d", valuelineSeasonalBaseline[1]);
      
      svg.append("g")
                  .attr("class","seasonal-range-line")
                  .attr("id","seasonal-range-max")
                    .selectAll("path")
                    .data( [seasonalData])
                    .enter()
                    .append("path")
                    .attr("d", valuelineSeasonalBaseline[2]);
      
      svg.append("g")
                  .attr("class","seasonal-range-line")
                  .attr("id","seasonal-range-min")
                    .selectAll("path")
                    .data( [seasonalData])
                    .enter()
                    .append("path")
                    .attr("d", valuelineSeasonalBaseline[3]);
      
      svg.append("g")
                  .attr("class","last-years-lines")
                    .selectAll("path")
                    .data( lastYearsData)
                    .enter()
                    .append("path")
                    .attr("id",(d)=>d[0].year )
                    .attr("stroke", (d)=> styleLastYearsLines(d, lastYearsData))
                    .attr("d", valuelineSeasonalBaseline[4]);

                          
      //Add X, Y axes          
      svg.append("g")
         .attr("transform", "translate(0," + height + ")")
          .attr("class", "x_axis_seasonal")
          .call(d3.axisBottom(x)
                  .tickFormat(d3.timeFormat("%b"))
                );
              
              
      svg.append("g")
          .attr("class", "y_axis_seasonal")
          .call(d3.axisLeft(y));
                          
  
          createSeasonalLineChartLegend(svg, lastYearsData)
    
  }
  
  
  function UpdateHottestColdestLineChart(data, dataSeasonalBaseline){
  
    var seasonalData = getDataSeasonal(data, dataSeasonalBaseline);
    var lastYearsData = lastYearSeasonalData(data,dataSeasonalBaseline);

                
    var scales = getScales(data, dataSeasonalBaseline);
    var x = scales[0] 
    var y =  scales[1]

    
    var valuelineSeasonalBaseline = getLineGeneratorsSeasonal(x,y);

    var baseline_unc = d3.select("#baseline-unc").selectAll("path").data([seasonalData]);
    
    baseline_unc.exit().remove();  
    baseline_unc.enter()
                  .append("path")
                  .merge(baseline_unc)
                  .attr("d", valuelineSeasonalBaseline[0]);
    
    var baseline = d3.select(".line-seasonal-baseline").selectAll("path").data([seasonalData]);
    baseline.exit().remove();
    baseline.enter()
                  .append("path")
                  .merge(baseline)
                  .attr("d", valuelineSeasonalBaseline[1]);
    
    var range_max = d3.select("#seasonal-range-max").selectAll("path").data([seasonalData]); 
    range_max.exit().remove();   
    range_max.enter()
                  .append("path")
                  .merge(range_max)
                  .attr("d", valuelineSeasonalBaseline[2]);
    
    var range_min = d3.select("#seasonal-range-min").selectAll("path").data([seasonalData]); 
    range_min.exit().remove();   
    range_min.enter()
                  .append("path")
                  .merge(range_min)
                  .attr("d", valuelineSeasonalBaseline[3]);

                
    var lastYearLine = d3.select(".last-years-lines").selectAll("path").data(lastYearsData); 
    lastYearLine.exit().remove();   
    lastYearLine.enter()
                  .append("g")
                  .append("path")
                  .merge(lastYearLine)
                  .attr("d", valuelineSeasonalBaseline[4]);
                  
        // update  y Axis
    d3.select(".y_axis_seasonal")
        .transition().duration(500)
        .call(d3.axisLeft(y));    
    
  }