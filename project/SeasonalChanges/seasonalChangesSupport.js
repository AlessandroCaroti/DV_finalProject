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
    //var valuelineSeasonalBaseline = 
                              
                
    //return valuelineSeasonalBaseline;

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


function getScales(data, seasonalBaseline){
  
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
              .domain([d3.min(seasonalBaseline, function(d) { return parseFloat(d.seasonalBaseline) }), 
                       d3.max(seasonalBaseline, function(d) { return parseFloat(d.seasonalBaseline) })])
              .range([ height, 0 ]);
  
    return [x, y];

}


function getSeasonalBaselineData(dataSeasonalBaseline){

    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
                        'Sep', 'Oct', 'Nov', 'Dec']

    var data = [];
    var baselineVal = []
    var baselineUnc = []
    for(var i=0; i < monthList.length; i++){
        

        data.push({month: monthList[i], seasonalBaseline:  dataSeasonalBaseline.seasonalBaseline[monthName[i]],
                        seasonalUnc: dataSeasonalBaseline.seasonalUnc[monthName[i]]})
    }
    

    
    return data;
}


  function createHottestColdestLineChart(data, dataSeasonalBaseline){

      baselineSeasonal = getSeasonalBaselineData(dataSeasonalBaseline);

      console.log(baselineSeasonal);
   
      var svg = d3.select("#seasonal_changes_graphic")
                  .append("svg")
                  .attr("class","graphics")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                  
                  
      var scales = getScales(data, baselineSeasonal);
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
      
      
      var valuelineSeasonalBaseline = getLineGeneratorsSeasonal(x,y);
    
      svg.append("g")
                  .attr("class","line-seasonal-baseline")
                    .selectAll("path")
                    .data( baselineSeasonal)
                    .enter()
                    .append("path")
                    .attr("d", (d)=>{
                                d3.line()
                                .x(d.month) 
                                .y( (d.seasonalBaseline ))
                                
                    });

                    
  
      
    
  }
  
  

  function UpdateHottestColdestLineChart(data){
  
   //TODO: TO BE IMPLEMENTED YET
  
  }