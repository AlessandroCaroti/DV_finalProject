//Support function for the LineChart





//Create the legend of the Linechart
function createLineChartLegend(svg){

 
    legend = svg.append( "g" ).attr("class", "legend" );
    
    legend.append( "rect" )
    .attr("x", 10).attr("width", 237)
    .attr("y", 10).attr("height", 40)
    .attr("class", "legend");
  
    legend.append( "line" )
        .attr("x1", 15).attr("x2", 30)
        .attr("y1", 20).attr("y2", 20)
        .attr("class", "line_chart_annual");
  
    legend.append( "text" )
        .attr("x", 37)
        .attr("y", 20)
        .attr("class", "legend")
        .text("Annual Average Temperature");
  
    legend.append( "rect" )
          .attr("x", 15).attr("width", 15)
          .attr("y", 29).attr("height", 16)
          .attr("class", "uncertainty");
          
    legend.append( "line" )
          .attr("x1", 15).attr("x2", 30)
          .attr("y1", 37).attr("y2", 37)
          .attr("class", "line_chart_ten_years");
  
    legend.append( "text" )
          .attr("x", 37)
          .attr("y", 37)
          .attr("class", "legend")
          .text("10-years Average Temperature");
  
  }


//Draw the area that represents the uncertainty of the temperature measurement
function drawUncertainty(data, svg, x, y){
    

    var areaUncGenerator = d3.area()
                             .x(function(d) { return x(d.date) })
                             .y0(function(d) { return y(d.ten_years_value + d.ten_years_unc ) })
                             .y1(function(d) { return y(d.ten_years_value - d.ten_years_unc ) })
                             .defined( (d) => { return ( !isNaN(d.ten_years_unc ) ) } );
  
  
    svg.append("path")
      .datum(data)
      .attr("class", "uncertainty")
      .attr("d", areaUncGenerator)
      
      
  
  }
  
  
  //Update the area that represents the uncertainty of the temperature measurement
  function UpdateUncertainty(data, x, y){
      
    
    var areaUncGenerator = d3.area()
                             .x(function(d) { return x(d.date) })
                             .y0(function(d) { return y(d.ten_years_value + d.ten_years_unc ) })
                             .y1(function(d) { return y(d.ten_years_value - d.ten_years_unc ) })
                             .defined( (d) => { return ( !isNaN(d.ten_years_unc ) ) } );
  
  
    d3.select(".uncertainty")
      .datum(data)
      .attr("d", areaUncGenerator)
      
    
  }
  
//get x and Y scales of the Linechart
function getScales(data){

    var x = d3.scaleTime()
              .domain(d3.extent(data, function(d) { return d.date; }))
              .range([ 0, width ]);
                        
                          // Add Y axis
    var y = d3.scaleLinear()
             .domain([d3.min(data, function(d) { return d.annual_value - d.ten_years_unc; }), 
                          d3.max(data, function(d) { return d.annual_value + d.ten_years_unc; })])
             .range([ height, 0 ]);
    
    return [x, y];

}

function getLineGenerators(x, y){
    
    var valueline_annual = d3.line()
                            .x(function(d) { return x(d.date); })
                            .y(function(d) { return y(d.annual_value); })
                            .defined( (d) => { return ( !isNaN(d.annual_value) ) } );        
    
    var valueline_ten_years = d3.line()
                                .x(function(d) { return x(d.date); })
                                .y(function(d) { return y(d.ten_years_value ); })
                                .defined( (d) => { return ( !isNaN(d.ten_years_value ) ) } );  
    
    return [valueline_annual, valueline_ten_years];

}




function createDefaultLineChart(data){

    var svg = d3.select("#linechart")
                .append("svg")
                .attr("class","graphics")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                
                
    var scales = getScales(data);
    var x = scales[0] 
    var y =  scales[1]


    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x_axis")
      .call(d3.axisBottom(x));


    svg.append("g")
      .attr("class", "y_axis")
      .call(d3.axisLeft(y))

    var lineGenerators = getLineGenerators(x,y);
    var valueline_annual = lineGenerators[0] 
    var valueline_ten_years = lineGenerators[1]


    drawUncertainty(data, svg, x, y);
    // Draw the line the line
    svg.append("path")
              .data([data])
              .attr("class","line_chart_annual")
              .attr("d", valueline_annual);       
      
    svg.append("path")
              .data([data])
              .attr("class","line_chart_ten_years")
              .attr("d", valueline_ten_years);       
    
    createLineChartLegend(svg);
    
    var tooltipLine = svg.append('line').attr("class","line_tip");
    
    var tipBox = svg.append('rect')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('opacity', 0)
                    .attr('id','tipbox')
                    .on('mousemove', (event) => drawTooltip(tipBox, event, x, data, tooltipLine))
                    .on('mouseout', () => removeTooltip(tooltipLine));

  }



//Update the X and Y axes
function updateAxis(x_axis_class, y_axis_class, x, y){
        
        // update  x Axis
    d3.select(x_axis_class)
    .transition().duration(500)
    .call(d3.axisBottom(x));                 
        
        // update  y Axis
    d3.select(y_axis_class)
    .transition().duration(500)
    .call(d3.axisLeft(y));    

}


function updateLineChart(data, grafic_class){

    //Get scales and update axis
    var scales = getScales(data);
    var x = scales[0] 
    var y =  scales[1]
    updateAxis(".x_axis", ".y_axis", x, y);  
    
    //.graphics
    var svg = d3.select(grafic_class);
    
    //re-define the lines generator
    // .defined(...) => are not considered the NaN values
    var lineGenerators = getLineGenerators(x,y);
    var valueline_annual = lineGenerators[0] 
    var valueline_ten_years = lineGenerators[1]
    
    //Update the area that represents the uncertainty                      
    UpdateUncertainty(data, x, y);
    
     // Draw the line the line
    svg.select(".line_chart_annual")
        .data([data])
        .attr("d", valueline_annual)
        .transition().duration();      
                           
    svg.select(".line_chart_ten_years")
        .data([data])
        .attr("d", valueline_ten_years)
        .transition().duration();  
    
    //Update The tooltip
    var tooltipLine = d3.select(".line_tip");
    var tipBox = d3.select("#tipbox")
                         .on('mousemove', (event) => drawTooltip(tipBox, event, x, data, tooltipLine))
                         .on('mouseout', () => removeTooltip(tooltipLine)); 


}




