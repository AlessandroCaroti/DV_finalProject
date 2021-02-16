//Global Variables

//TODO: Quando si unisce tutto, si può lascare un unica dichiarazione di queste varibili 
//TODO: per tutti i grafici tranne che per lo stripechart
var full_width = 900
var margin = {top: 40, right: 70, bottom: 30, left: 50};
var width = full_width - margin.left - margin.right;
var height = full_width*9/16 - margin.top - margin.bottom;

var parseMonth = d3.timeParse("%m");
var monthList = ["1","2","3","4","5","6","7","8","9","10","11","12"];


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
    console.log(data)
}

function getMonthName(month){

    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
                        'Sep', 'Oct', 'Nov', 'Dec']

    return monthName[month - 1]

}
function getMonthNumber(month){

    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
                        'Sep', 'Oct', 'Nov', 'Dec'];
    
    for(var i=0; i< monthName.length; i++){
        if( month == monthName[i]) return (i+1);
    }
    return -1;

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
              .domain(d3.extent(data, function(d) { return +dataSeasonal.seasonalBaseline[getMonthName(d.Month)]+d.monthly_value} ))
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
  for( var yr = max_year - 2; yr <= max_year; yr = yr + 1 ) {
      //take 
      var dataYear = data.filter( e => e.date.getFullYear() == yr ) ;

      dataYear2 = dataYear.map( function(e){ return {year: e.Year, month: e.Month, 
                                                     monthlyTemp: (e.monthly_value + (+dataSeasonalBaseline.seasonalBaseline[getMonthName(e.Month)]) )} })
      
      dataLastYears.push( dataYear2);
     
    }
    console.log(dataLastYears);
    return dataLastYears;
}


function styleLastYearsLines(d, dataLastYears){

  var years = []

  for(var i=0; i< dataLastYears.length; i++ ) years.push( dataLastYears[i][0].year);
  var colors=["red", "blue","green"];

  for(i=0; i < colors.length; i++)
    if( dataLastYears[i][0].year == d[0].year )
        return colors[i];

    
}

  function createHottestColdestLineChart(data, dataSeasonalBaseline){

      var seasonalData = getDataSeasonal(data, dataSeasonalBaseline);
      var lastYearsData = lastYearSeasonalData(data,dataSeasonalBaseline);

      console.log(lastYearsData);
   
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
                    .selectAll("path")
                    .data( [seasonalData])
                    .enter()
                    .append("path")
                    .attr("d", valuelineSeasonalBaseline[2]);
      
      svg.append("g")
                  .attr("class","seasonal-range-line")
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
                          
  
      
    
  }
  
  

  function UpdateHottestColdestLineChart(data){
  
   //TODO: TO BE IMPLEMENTED YET
  
  }