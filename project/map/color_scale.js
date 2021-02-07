 // da trovare modo per trovare min e max automaticamente 
 var min = -3.0;
 var max = +3.8;
 var width_legend = 350; // width of the legend axis
 var n_ticks = 11;
 var step_list = [];
 var step_color_list = [];
 var ranges = new Set();

// define the anomaly color space
function set_colorScale(){
    //GLOBAL MIN & MAX
    // [-2.998, +3.7969999999999997]
  
    /*var colorScale = d3
      .scaleLinear()
      //.domain([-5, 0, +5])
      .domain([-3.0, 0, +3.8])
      .range(colorsRange);*/

    var colorBase = d3.scaleDiverging(t => d3.interpolateRdBu(1 - t))
                                                    .domain([min, 0, max]);
   
    let step = (max - min)/parseFloat(n_ticks);
    // color quantization
    step_color_list = d3.range(min, max + step, step).map(d => colorBase(parseFloat(d.toFixed(2)) ));

    colorScale = d3.scaleQuantize()
                        .domain([min, max])
                        .range(step_color_list);

    
    step_color_list.forEach(element => {

        ranges.add(colorScale.invertExtent(element)[0]);
        ranges.add(colorScale.invertExtent(element)[1]);
        //console.log(colorScale.invertExtent(element))
    });
    
             
  }
  
  
  // draw the anomaly legend
  function draw_legend(){
    
    // axis quantization
    let ticks = Array.from(ranges);
    //let step = (max - min)/parseFloat(n_ticks);

    //step_list = d3.range(min, max + step , step).map(d => parseFloat(d.toFixed(2)) );
    let step_bar_list = d3.range(0, width_legend +  width_legend/parseFloat(step_color_list.length), width_legend/parseFloat(step_color_list.length)).map(d => parseFloat(d.toFixed(2)) );
    
    var quantizeBarScale = d3.scaleQuantize()
                                  .domain([min, max])
                                  .range(step_bar_list );
    // draw axis
    var anomaly_axis = d3.axisBottom().scale(quantizeBarScale)
                                        .tickValues(ticks)
                                        .tickFormat(d3.format(".2f"))
                                        
  
    //console.log(quantizeBarScale.ticks(n_ticks));
    d3.select('.axis-anomaly')
              .attr("transform", "translate(" + (500 -width_legend / 2) +","+ 475  +" )")
              .call(anomaly_axis);

    d3.select('.axis-anomaly').selectAll("text")
                                .style("font-size", "10px");

    // draw bars
    var rects = d3.select(".axis-anomaly")
              .selectAll("rect")
              .data(step_color_list);
  
    rects.enter()
          .append("rect")
          .attr("x", d => {
              let range = colorScale.invertExtent(d);
              return quantizeBarScale(range[0]);
            })
          .attr("y", "-10")
          .attr("width", width_legend/parseFloat(step_color_list.length))
          .attr("height", "10px")
          .style("fill", d => d)
  }