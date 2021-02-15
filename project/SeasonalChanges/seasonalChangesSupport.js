//Global Variables

//TODO: Quando si unisce tutto, si può lascare un unica dichiarazione di queste varibili 
//TODO: per tutti i grafici tranne che per lo stripechart
var full_width = 900
var margin = {top: 40, right: 70, bottom: 30, left: 50};
var width = full_width - margin.left - margin.right;
var height = full_width*9/16 - margin.top - margin.bottom;

var parseMonth = d3.timeParse("%m");
var monthList = ["1","2","3","4","5","6","7","8","9","10","11","12"];




function getLineGenerators(x, y){
    
    //TODO:TO CHANGE
    var valueline_annual = d3.line()
                              .x(function(d) { console.log();return x(parseMonth(d.month))})
                              .y(function(d) {  return y(d.monthly_value ); })
                              .defined( (d) => { return ( !isNaN(d.monthly_value) ) } );  
                              
                              
                         
    var zeroline = d3.line()
                      .x(function(d) { return x(parseMonth(d.month))})
                      .y(function(d) {  return y(d.zero_val ); })
 
    return [valueline_annual, zeroline];

}


function getScales(data){
  
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
               .domain(d3.extent(data, function(d) { return d.monthly_value }))
               .range([height, 0 ]);
  
    return [x, y];

}


function getSeasonalData(){

    return false
}