//Support functions for the LineChart
var isAnnual=false;

//Create the legend of the Linechart
function createLineChartLegend(svg){

 
    legend = svg.append( "g" ).attr("class", "legend" );
    
    legend.append( "rect" )
    .attr("x", 10).attr("width", 290)
    .attr("y", 1).attr("height", 60)
    .attr("class", "legend")
    .attr("id","legend-square");
  
    legend.append( "line" )
        .attr("x1", 15).attr("x2", 30)
        .attr("y1", 15).attr("y2", 15)
        .attr("class", "line_chart_annual")
        .attr("id", "legend-annual-line");
  
    legend.append( "text" )
        .attr("x", 37)
        .attr("y", 15)
        .attr("class", "legend")
        .text("Annual Average Temperature")
        .attr("id", "legend-annual-text");
  
    legend.append( "rect" )
          .attr("x", 15).attr("width", 15)
          .attr("y", 24).attr("height", 16)
          .attr("class", "uncertainty")
          .attr("id","range-name-unc");

    var range_name =  document.getElementById('rage-year');
    range_name = range_name.options[range_name.selectedIndex].text;
  


    legend.append( "line" )
          .attr("x1", 15).attr("x2", 30)
          .attr("y1", 32).attr("y2", 32)
          .attr("class", "line_chart_range_years")
          .attr("id","range-name-line");
  
    legend.append( "text" )
          .attr("x", 37)
          .attr("y", 32)
          .attr("class", "legend")
          .attr("id","range-name-legend")
          .html(range_name+" Average Temperature with uncertainty"); 
    
    legend.append( "line" )
          .attr("x1", 15).attr("x2", 30)
          .attr("y1", 48).attr("y2", 48)
          .attr("class", "baselines")
         

    legend.append( "text" )
          .attr("x", 37)
          .attr("y", 50)
          .attr("class", "legend")
          .text("Baseline Temperature"); 
  
  }


  function updateRangeNameLegend(){
    
    var range_name =  document.getElementById('rage-year');

    if(range_name.value == "annual" && !isAnnual){

        d3.select("#legend-annual-line").remove();
        d3.select("#legend-annual-text").remove();

        d3.select("#range-name-unc").attr("y",15);
                
        
        d3.select("#range-name-line")
                        .attr("y1", 23).attr("y2", 23)
                        .style("stroke","steelblue")
                       
        
        d3.select("#range-name-legend").attr("y", 23)
        isAnnual = true;
    }

    if( isAnnual && range_name.value != "annual"){
        
        var legend = d3.select(".legend")
        legend
            .append( "line" )
            .attr("x1", 15).attr("x2", 30)
            .attr("y1", 15).attr("y2", 15)
            .attr("class", "line_chart_annual")
            .attr("id", "legend-annual-line");
            
        legend.append( "text" )
            .attr("x", 37)
            .attr("y", 15)
            .attr("class", "legend")
            .text("Annual Average Temperature")
            .attr("id", "legend-annual-text");

        d3.select("#range-name-unc").attr("y",24)
                .attr("class", "uncertainty")
                .attr("id","range-name-unc");

        d3.select("#range-name-line")
                .attr("y1", 32).attr("y2", 32)
                .style("stroke","red")
        d3.select("#range-name-legend").attr("y", 32)
        
                isAnnual = false;
    }
    
    range_name = range_name.options[range_name.selectedIndex].text;
    
    d3.select("#range-name-legend")
        .html(range_name+" Average Temperature with uncertainty"); 
  }


//Draw the area that represents the uncertainty of the temperature measurement
function drawUncertainty(data, svg, x, y){
    
    var range_year =  document.getElementById('rage-year').value; 

   
    var areaUncGenerator = d3.area()
                             .x(function(d) { return x(d.date) })
                             .y0(function(d) { return y(d[range_year+"_value"] + d[range_year+"_unc"]) })
                             .y1(function(d) { return  y(d[range_year+"_value"] - d[range_year+"_unc"]) })
                             .defined( (d) => { return ( !isNaN(d[range_year+"_unc"] ) ) } );

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
      
    var range_year =  document.getElementById('rage-year').value; 
    var areaUncGenerator = d3.area()
                             .x(function(d) { return x(d.date) })
                             .y0(function(d) { return y(d[range_year+"_value"] + d[range_year+"_unc"]) })
                             .y1(function(d) { return  y(d[range_year+"_value"] - d[range_year+"_unc"]) })
                             .defined( (d) => { return ( !isNaN(d[range_year+"_unc"] ) ) } );
  
  
    var unc= d3.select(".uncertainty")
                .selectAll("path")
                .data([data]);
                 
    unc.exit().remove();
             
    unc.enter()
        .append("path")
        .merge(unc)
        .attr("d", areaUncGenerator);
                    
                   
}




function getTimeScale(){

    var monthList = ["1","2","3","4","5","6","7","8","9","10","11","12"];
    var timeScale = [];
    for(var Y = 1750; Y<=2020; Y++){

        monthList.forEach((m)=>{

            timeScale.push(Y+"-"+m);
        })
    }

    return timeScale
} 

function baseLine(data){

    var timeScale = getTimeScale();
    data_baselines=[];
    timeScale.forEach(()=>{
            
        data_baselines.push({baseline: data[0].baseline});
    })
    
    return data_baselines;
}
               
//get x and Y scales of the Linechart
function getScales(data){


    var x = d3.scaleTime()
              .domain(d3.extent(data, function(d) { return d.date; }))
              .range([ 0, width ]);
                        
    var range_year =  document.getElementById('rage-year').value; 
              // Add Y axis
    var y = d3.scaleLinear()
             .domain([d3.min(data, function(d) { return d.annual_value - d[range_year+"_unc"] - 0.5; }), 
                          d3.max(data, function(d) { return d.annual_value + d[range_year+"_unc"] + 0.5; })])
             .range([ height, 0 ]);
    
    return [x, y];

}

function getLineGenerators(x, y){
    
    var valueline_annual = d3.line()
                            .x(function(d) {  return x(d.date); })
                            .y(function(d) { return y(d.annual_value); })
                            .defined( (d) => { return ( !isNaN(d.annual_value) ) } );        
    

    var range_year =  document.getElementById('rage-year').value;   
  
    var valueline_ten_years = d3.line()
                                .x(function(d) { return x(d.date); })
                                .y(function(d) { return y(d[range_year+"_value"] ); })
                                .defined( (d) => { return ( !isNaN(d[range_year+"_value"] ) ) } );
    
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

    createGridLine(x,y, svg, "linechart", 10, 10);
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
        .attr("class","line_chart_range_years")
        .selectAll("path")
        .data([data])
        .enter()
        .append("path")
        .attr("d", valueline_ten_years);
         
   data_baselines = baseLine(data);

    svg  
        .append("g")
        .attr("class","baselines")
        .selectAll("path")
        .data([data])
        .enter()
        .append("path")
        .attr("d", valueline_baseline);
        

    createLineChartLegend(svg);

    
    var tooltipLine = svg.append('line').attr("class","line_tip").attr("id","linechart-tip");
    
    var tipBox = svg.append('rect')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('opacity', 0)
                    .attr('class','tipbox')
                    .attr('id', 'tipbox-linechart')
                    .on('mousemove', (event) => drawTooltipLineChart(tipBox, event, x, data, tooltipLine,"#linechart", height))
                    .on('mouseout', () => removeTooltipLineChart(tooltipLine,"#linechart"));

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
    var svg = d3.select(grafic_class+" g");
    
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
    
    
    var ten_line= svg.select(".line_chart_range_years").selectAll("path").data([data]);
    ten_line.exit().remove();
    ten_line
       .enter()
       .append("path")
       .merge(ten_line)
       .attr("d", valueline_ten_years)
       .style("stroke", function(d){
                
                var range_year =  document.getElementById('rage-year').value;
                if( range_year == "annual") return "steelblue";
                else
                    return "red";
       })
       .style("stroke-width", function(d){
                
                var range_year =  document.getElementById('rage-year').value;
                if( range_year == "annual") return "1px";
                else
                    return "2px";
       })
       
    
    
    var base_line= svg.select(".baselines").selectAll("path").data([data]);
    base_line.exit().remove();
    base_line
       .enter()
       .append("path")
       .merge(base_line)
       .attr("d", valueline_baseline);
 

    //Update The tooltip
    var tooltipLine = d3.select("#linechart-tip");
    var tipBox = d3.select("#tipbox-linechart")
                         .on('mousemove', (event) => drawTooltipLineChart(tipBox, event, x, data, tooltipLine, "#linechart", height))
                         .on('mouseout', () => removeTooltipLineChart(tooltipLine,"#linechart")); 
    
    updateGrid("#linechart", x, y,svg, 12, 10);
    updateRangeNameLegend();

}




