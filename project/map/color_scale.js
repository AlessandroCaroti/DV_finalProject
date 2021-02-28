 // da trovare modo per trovare min e max automaticamente 
 var min_scale = -3.0;
 var max_scale = +3.8;
 var width_legend = 500; // width of the legend axis
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
    step_color_list = d3.range(min_scale, max_scale + step, step).map(d => colorBase(parseFloat(d.toFixed(2)) ));

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
    let bar_step = width_legend/parseFloat(step_color_list.length)

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
    
    axis.attr("transform", "translate(" +   (w_map/2 - width_legend/2) +","+ 40  +" )") 
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
          .attr("width", rect_width)
          .attr("height", "15px")
          .style("fill", d => d)
    
    
    axis.append("rect")
            .attr("x", quantizeBarScale(max_scale) + 2 * rect_width)
            .attr("y", "-10")
            .attr("width", rect_width)
            .attr("height", "15px")
            .style("fill", "#999999");
    
            
    axis.append("g")
            .classed("tick", true)
            .attr("transform", "translate(" + (width_legend + 2 * (width_legend / n_ticks)) + ", 0)")
            .append("text")
            .attr("fill", "currentColor")
            .attr("y", "9")
            .attr("x", "10")
            .attr("dy", "0.71em")
            .html("unknown");
    
    // change axis style
    axis.selectAll(".tick").selectAll("text")
          .attr("dy", "0.91em")
          .style("font-size", "14px");

    /*axis.selectAll(".tick")
          .moveToFront();*/

    axis.select(".domain").remove();

    // move label
    d3.select("#label-legend")
            .attr("x", ((w_map / bar_step) + 70))
            .attr("y", "-15")
            .style("fill", "black")
            .style("font-size", "15px")
            .raise();
    
    d3.select("#global-anomaly")
              .attr("x", width_legend + 2 * (width_legend / n_ticks) + 150)
              .attr("y", "0")
              .style("fill", "black")
              .style("font-size", "15px")
              .style("font-weight", "bold");

    //init_legendSpace();
  }

  function init_legendSpace() {

    var bBox = document.getElementById("legend-anomaly").getBBox();
  
    var gap = 5,
      w_1 = bBox.width + gap * 2,
      w_2 = bBox.width,
      x = bBox.x - gap;
  
    d3.select(".legend-anomaly")
      .select("path")
      .attr("d", roundedFigure_1(x, bBox.y + 26, w_1, w_2, -37))
      .style("fill", "white")
      .style("stroke", "black")
      .style("stroke-width", 0.5);

    console.log(bBox)
  }