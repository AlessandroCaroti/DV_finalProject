//Support functions for the LineChart





//Create the legend of the Linechart
function createLineChartLegend(svg){

 
    legend = svg.append( "g" ).attr("class", "legend" );
    
    legend.append( "rect" )
    .attr("x", 10).attr("width", 170)
    .attr("y", 1).attr("height", 60)
    .attr("class", "legend")
    .attr("id","legend-square");
  
    legend.append( "line" )
        .attr("x1", 15).attr("x2", 30)
        .attr("y1", 15).attr("y2", 15)
        .attr("class", "line_chart_annual");
  
    legend.append( "text" )
        .attr("x", 37)
        .attr("y", 15)
        .attr("class", "legend")
        .text("Annual Average Temperature");
  
    legend.append( "rect" )
          .attr("x", 15).attr("width", 15)
          .attr("y", 24).attr("height", 16)
          .attr("class", "uncertainty");
          
    legend.append( "line" )
          .attr("x1", 15).attr("x2", 30)
          .attr("y1", 32).attr("y2", 32)
          .attr("class", "line_chart_ten_years");
  
    legend.append( "text" )
          .attr("x", 37)
          .attr("y", 32)
          .attr("class", "legend")
          .text("10-years Average Temperature"); 
    
    legend.append( "line" )
          .attr("x1", 15).attr("x2", 30)
          .attr("y1", 50).attr("y2", 50)
          .attr("class", "baselines");

    legend.append( "text" )
          .attr("x", 37)
          .attr("y", 50)
          .attr("class", "legend")
          .text("Baseline Temperature"); 
  
  }


//Draw the area that represents the uncertainty of the temperature measurement
function drawUncertainty(data, svg, x, y){
    

    var areaUncGenerator = d3.area()
                             .x(function(d) { return x(d.date) })
                             .y0(function(d) { return y(d.ten_years_value + d.ten_years_unc ) })
                             .y1(function(d) { return y(d.ten_years_value - d.ten_years_unc ) })
                             .defined( (d) => { return ( !isNaN(d.ten_years_unc ) ) } );
  /*
  
    svg.append("path")
      .datum(data)
      .attr("class", "uncertainty")
      .attr("d", areaUncGenerator)
    */
    svg.append("g")
                .attr("class","uncertainty")
                .selectAll("path")
                .data([data])
                .enter()
                .append("path")
                .attr("d", areaUncGenerator);
            
      
  
  }
  
  
  //Update the area that represents the uncertainty of the temperature measurement
  function UpdateUncertainty(data, x, y){
      
    
    var areaUncGenerator = d3.area()
                             .x(function(d) { return x(d.date) })
                             .y0(function(d) { return y(d.ten_years_value + d.ten_years_unc ) })
                             .y1(function(d) { return y(d.ten_years_value - d.ten_years_unc ) })
                             .defined( (d) => { return ( !isNaN(d.ten_years_unc ) ) } );
  
  
    var unc= d3.select(".uncertainty")
                .selectAll("path")
                .data([data]);
                 
    unc.exit().remove();
             
    unc.enter()
        .append("path")
        .merge(unc)
        .attr("d", areaUncGenerator);
                    
                   
               
               }
               
//get x and Y scales of the Linechart
function getScales(data){

    var x = d3.scaleTime()
              .domain(d3.extent(data, function(d) { return d.date; }))
              .range([ 0, width ]);
                        
                          // Add Y axis
    var y = d3.scaleLinear()
             .domain([d3.min(data, function(d) { return d.annual_value - d.ten_years_unc - 0.5; }), 
                          d3.max(data, function(d) { return d.annual_value + d.ten_years_unc + 0.5; })])
             .range([ height, 0 ]);
    
    return [x, y];

}

function getLineGenerators(x, y){
    
    var valueline_annual = d3.line()
                            .x(function(d) {  return x(d.date); })
                            .y(function(d) { return y(d.annual_value); })
                            .defined( (d) => { return ( !isNaN(d.annual_value) ) } );        
    
    var valueline_ten_years = d3.line()
                                .x(function(d) { return x(d.date); })
                                .y(function(d) { return y(d.ten_years_value ); })
                                .defined( (d) => { return ( !isNaN(d.ten_years_value ) ) } );
    
    var valueline_baseline = d3.line()
                                .x(function(d) { return x(d.date); })
                                .y(function(d) { return y(d.baseline); });  
    
    return [valueline_annual, valueline_ten_years, valueline_baseline];

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
    var valueline_annual = lineGenerators[0];
    var valueline_ten_years = lineGenerators[1];
    var valueline_baseline = lineGenerators[2];

    
    drawUncertainty(data, svg, x, y);
    


   svg  
        .append("g")
        .attr("class","line_chart_annual")
        .selectAll("path")
        .data([data])
        .enter()
        .append("path")
        .attr("d", valueline_annual);
         
   svg  
        .append("g")
        .attr("class","line_chart_ten_years")
        .selectAll("path")
        .data([data])
        .enter()
        .append("path")
        .attr("d", valueline_ten_years);
         
   
    svg  
        .append("g")
        .attr("class","baselines")
        .selectAll("path")
        .data([data])
        .enter()
        .append("path")
        .attr("d", valueline_baseline);
        

    createLineChartLegend(svg);

    
    var tooltipLine = svg.append('line').attr("class","line_tip");
    
    var tipBox = svg.append('rect')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('opacity', 0)
                    .attr('class','tipbox')
                    .on('mousemove', (event) => drawTooltip(tipBox, event, x, data, tooltipLine,"#linechart", height))
                    .on('mouseout', () => removeTooltip(tooltipLine,"#linechart"));

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
    var valueline_annual = lineGenerators[0];
    var valueline_ten_years = lineGenerators[1];
    var valueline_baseline = lineGenerators[2];

    
    //Update the area that represents the uncertainty                      
    UpdateUncertainty(data, x, y);
    

    var annual_line= svg.select(".line_chart_annual").selectAll("path").data([data]);
    annual_line.exit().remove();
    annual_line
       .enter()
       .append("path")
       .merge(annual_line)
       .attr("d", valueline_annual)
    
    
    var ten_line= svg.select(".line_chart_ten_years").selectAll("path").data([data]);
    ten_line.exit().remove();
    ten_line
       .enter()
       .append("path")
       .merge(ten_line)
       .attr("d", valueline_ten_years);
    
    
    var base_line= svg.select(".baselines").selectAll("path").data([data]);
    base_line.exit().remove();
    base_line
       .enter()
       .append("path")
       .merge(base_line)
       .attr("d", valueline_baseline);
 

    //Update The tooltip
    var tooltipLine = d3.select(".line_tip");
    var tipBox = d3.select(".tipbox")
                         .on('mousemove', (event) => drawTooltip(tipBox, event, x, data, tooltipLine, "#linechart", height))
                         .on('mouseout', () => removeTooltip(tooltipLine,"#linechart")); 


}




