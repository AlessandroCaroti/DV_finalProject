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
    
    //TODO:TO CHANGE
    var valueline_annual = d3.line()
                              .x(function(d) { console.log();return x(parseMonth(d.month))})
                              .y(function(d) {  return y(d.monthly_value ); })
                              .defined( (d) => { return ( !isNaN(d.monthly_value) ) } );  
                              
                
    return valueline_annual;

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


function getScales(data, dataSeasonalBaseline){
  
//TODO:TO CHANGE
  var m =[];
    monthList.forEach((d)=>{
        m.push( parseMonth(d));
      })
    
    var x = d3.scaleTime()
              .domain(d3.extent(m, function(d) { return d }))
              .range([ 0, width ]);             
    
           // Add Y axis
    var y = d3.scaleLinear()
              .domain(d3.extent(data, function(d) {  return ( dataSeasonalBaseline.seasonalBaseline[ getMonthName(d.Month)] +10 ) }))
              .range([height, 0 ]);
  
    return [x, y];

}


function getSeasonalData(){

    return false
}


  function createHottestColdestLineChart(data, dataSeasonalBaseline){

      //TODO:TO CHANGE
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
  
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x_axis_seasonal")
        .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%b"))
              );
  
  
      svg.append("g")
        .attr("class", "y_axis_seasonal")
        .call(d3.axisLeft(y));
      
      linegenerator= getLineGeneratorsSeasonal(x,y);
      
      var valueline_annual = linegenerator[0];
      
  
      
    
  }
  
  

  function UpdateHottestColdestLineChart(data){
  
   //TODO: TO BE IMPLEMENTED YET
  
  }