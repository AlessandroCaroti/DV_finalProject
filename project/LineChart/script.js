

  function drawCircles(svg, data, x, y){
    
    circle = svg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 5)
                .attr("cx", function(d) { return x(d.date); })
                .attr("cy", function(d) { return y(d.value); });
    
    return circle;
  }


  function add_corresponding_circle(id_chart, data, x, y, radius_dot, color ){
        
    d3.select(id_chart)
        .selectAll("circle")
        .data(data)
        .enter().append("circle")
        .attr("cx", function(d) { return x(d.date); })
        .attr("cy", function(d) { return y(d.value); })
        .attr("r", radius_dot)
        .style("fill", color);
}

function remove_corresponding_circle(id_chart){

    d3.select(id_chart).select("circle").remove();

}



  function changeData() {
   
    // prendere dati da mappa selezionata o dropdown menu
   
    //test
    dataFile = "anscombe_I"
           //select svg
    var margin = {top: 10, right: 30, bottom: 30, left: 60}
    
    var formatTime = d3.timeFormat("%e %B");
    var parseTime = d3.timeParse("%Y-%m-%d");
          
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
    var svg = d3.select("#line_chart_graph")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv")
      .then( function(data){

          data.forEach(function(d){
            
            d.date = parseTime(d.date);
            d.value = +d.value;   
          
          });
          
            // Add X axis --> it is a date format
            var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);
        
          svg.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

            // Add Y axis
          var y = d3.scaleLinear()
              .domain([0, d3.max(data, function(d) { return + d.value; })])
              .range([ height, 0 ]);
          
          svg.append("g")
              .call(d3.axisLeft(y))
          
          var valueline = d3.line()
                            .x(function(d) { return x(d.date); })
                            .y(function(d) { return y(d.value); });
          
          //create tooltips
          var tooltip = d3.select("body")
                            .append("div")
                            .attr("class", "tooltip");
          
              // Add the line
          var line = svg.append("path")
                        .data([data])
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1.5)
                        .attr("d", valueline);             
          
          
          var circles =  svg.selectAll("circle")
                        .data(data)
                        .enter().append("circle")
                        .attr("cx", function(d) { return x(d.date); })
                        .attr("cy", function(d) { return y(d.value); })
                        .attr("r", 3)
                        .classed("unselected_circle", true)
                        .on("mouseenter", function(){
                          d3.select(this).classed("selected_circle", true)
                        })
                        .on("mouseleave", function(){
                          
                          d3.select(this).classed("unselected_circle", true)
                        })
                        
                        
                        //.style("display", "none")
                        
      
                          /*
                            console.log("d.date", d);
                            tooltip.transition()
                                        .duration(200);

                            tooltip.html(formatTime(d.date) + "<br/>" + d.close)
                                      .style("left", (event.pageX) + "px")
                                      .style("top", (event.pageY - 20) + "px")
                                      .style("display", "block")
                                      .html("<b> date: " + d.date+"\n\nvalue: "+d.value+"</b>")
                            */
          
        
        })
          .catch((error) =>{
              console.log(error);
              //alert("Unable To Load The Dataset!!");
              throw(error)
          })
    
}



function click_tab_linechart(evt, graphic_name) {
    
  document.getElementById("starting_tab_content").style.display = "none"

  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(graphic_name).style.display = "block";
  evt.currentTarget.className += " active";

  changeData()
}


function click_tab_stripechart(evt, graphic_name) {

  document.getElementById("starting_tab_content").style.display = "none"

  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(graphic_name).style.display = "block";
  evt.currentTarget.className += " active";
}



