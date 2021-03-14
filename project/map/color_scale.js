 // da trovare modo per trovare min e max automaticamente 
 var min_scale = -3.0;
 var max_scale = +3.8;
 var width_legend = h_map - 20; // width of the legend axis
 var n_ticks = 11;
 var step_list = [];
 var step_color_list = [];
 var ranges_scale = new Set();

// define the anomaly color space
function set_colorScale(){
    //GLOBAL MIN & MAX

    var colorBase = d3.scaleDiverging(t => d3.interpolateRdBu(1 - t))
                                                    .domain([min_scale, 0, max_scale]);
   
    let step = (max_scale - min_scale)/parseFloat(n_ticks);
    // color quantization
    step_color_list = d3.range(min_scale, max_scale + step, step).map(d => colorBase(parseFloat(d.toFixed(1)) ));

    colorScale = d3.scaleQuantize()
                        .domain([min_scale, max_scale])
                        .range(step_color_list);

    
    step_color_list.forEach(element => {

        ranges_scale.add(colorScale.invertExtent(element)[0]);
        ranges_scale.add(colorScale.invertExtent(element)[1]);
    });
    
             
  }
  
  
  // draw the anomaly legend
  function draw_legend(){
    
    // axis quantization
    let ticks = Array.from(ranges_scale);
    let bar_step = width_legend/parseFloat(step_color_list.length);

    let step_bar_list = d3.range(0, width_legend + bar_step , bar_step).map(d => parseFloat(d.toFixed(2)) );
    
    var quantizeBarScale = d3.scaleQuantize()
                                  .domain([min_scale, max_scale])
                                  .range(step_bar_list );
    // draw axis
    var anomaly_axis = d3.axisBottom().scale(quantizeBarScale)
                                        .tickValues(ticks)
                                        .tickFormat(d3.format(".1f"))
                                        .tickSize(13);

    var axis = d3.select('.legend-anomaly')

    // generate axis
    
    axis.attr("transform", "translate(" + 40 +","+ 625  +" ) rotate(-90 0 0)") 
                                                                .call(anomaly_axis);

    // draw bars
    var rects = axis.selectAll("rect")
                      .data(step_color_list);

    var rect_width = width_legend/parseFloat(step_color_list.length)
    
    rects.enter()
          .append("rect")
          .attr("x", d => {
              let range = colorScale.invertExtent(d);
              return quantizeBarScale(range[0]);
            })
          .attr("y", "-10")
          .attr("width", rect_width + 1.5)
          .attr("height", "15px")
          .style("fill", d => d)
    
    var axis_unkown = d3.select("#legend-no_data")
                            .attr("transform", "translate(-553, 0)");
    
    axis_unkown.append("rect")
            .attr("x", quantizeBarScale(max_scale) + 3 * rect_width/2)
            .attr("y", "10")
            .attr("width", rect_width)
            .attr("height", "15px")
            .style("fill", "#999999");
      
    axis_unkown.append("rect")
            .attr("x", quantizeBarScale(max_scale) + 3 * rect_width)
            .attr("y", "10")
            .attr("width", rect_width)
            .attr("height", "15px")
            .style("fill", "url(#diagonalHatch_legend)");
    
            
    axis_unkown.append("g")
            .classed("tick", true)
            .attr("transform", "translate(" + (width_legend + 2 * (width_legend / n_ticks)/2 - 10) + ", 20)")
            .append("text")
            .attr("fill", "currentColor")
            .attr("y", "9")
            .attr("x", "14")
            .attr("dy", "0.71em")
            .html("unknown");

    axis_unkown.append("g")
            .classed("tick", true)
            .attr("transform", "translate(" + (width_legend + 2 * (width_legend / n_ticks) + 20) + ", 20)")
            .append("text")
            .attr("fill", "currentColor")
            .attr("y", "9")
            .attr("x", "9")
            .attr("dy", "0.71em")
            .html("no data");
    
    // change axis style
    axis.selectAll(".tick")
         .selectAll("text")
         .attr("transform", "rotate(90 0 0) translate(30, -24)")
          .attr("dy", "0.91em")
          .style("font-size", "14px");

    axis.selectAll(".tick")
          .selectAll("line")
              .attr("stroke" , "gray");

    axis.select(".domain").remove();

    // move label
    d3.select("#label-legend")
            .attr("transform", "rotate(180 0 0)")
            .attr("x", "-225")
            .attr("y", "-55")
            .style("fill", "black")
            .style("font-size", "15px")
            .raise();
    
    
  }

  