//Global Variable

var margin = {top: 10, right: 30, bottom: 30, left: 60}
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;
var parseTime = d3.timeParse("%Y-%m-%d");
  





function drawCircles(svg, data, x, y){
    
  var circle = svg.selectAll("circle")
                    .data(data)
                    .enter().append("circle")
                    .attr("cx", function(d) { return x(d.date); })
                    .attr("cy", function(d) { return y(d.value); })
                    .attr("r", 5)
                    .classed("unselected_circle", true)
    
    return circle;
  }


  function tooltip_circle_enter(self, event, d, tooltip_div){
    
    tooltip_div.transition().duration(200);
          
    tooltip_div.html("<b> Year: " + d.date.getFullYear()+"<br/>" +"<br/>" +"Value: "+d.value+"</b>")
           .style("left", (event.pageX) + "px")
           .style("top", (event.pageY) + "px")
           .style("opacity", .9)
           .style("display", "inline")

    d3.select(self).classed("selected_circle", true)

  }
  
  
  function tooltip_circle_leave(self, tooltip_div){
    
    d3.select(self).classed("selected_circle", false)
    tooltip_div.transition()
    .duration(500)
    .style("opacity", 0);
  }


  function updateAxis(x_axis_class, y_axis_class){
    
    var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, width ]);

    var y = d3.scaleLinear()
              .domain(d3.extent(data, function(d) { return d.value; }))
              .range([ height, 0 ]);

    
  }

  function createDefaultLineChart(data){

    var svg = d3.select("#line_chart_graph")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis --> it is a date format
    // extent reuturn [min-max]
    var x = d3.scaleTime()
              .domain(d3.extent(data, function(d) { return d.date; }))
              .range([ 0, width ]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x_axis")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y= d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.value; }))
      .range([ height, 0 ]);

    svg.append("g")
      .attr("class", "y_axis")
      .call(d3.axisLeft(y))

    var valueline = d3.line()
                    .x(function(d) { return x(d.date); })
                    .y(function(d) { return y(d.value); });

    // Draw the line the line
    var line = svg.append("path")
                .data([data])
                .attr("class","line_chart")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", valueline);       
      
    var tooltip = d3.select("body")
                  .append("div")
                  .attr("class", "tooltip");      

    var circles = drawCircles(svg, data, x, y);
                
    circles.on("mouseenter", function(event, d){
            tooltip_circle_enter(this, event, d, tooltip)              
          })
          .on("mouseleave", function(){
            tooltip_circle_leave(this, tooltip)
          })


  }


  function changeData() {
    
    
    // prendere dati da mappa selezionata o dropdown menu
    var dataFile = document.getElementById('dataset').value;
    
    //quando cambio dati, devo leggere un nuovo csv

    var csv;
    //only to test the update
    if( dataFile == "dataset_1"){
      parseTime = d3.timeParse("%Y-%m-%d");
      csv = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv"
    }
    else{
      parseTime = d3.timeParse("%m-%d-%Y");
      csv = "anscombe_I.csv"
    }
    console.log(csv);
    //select svg
    
    d3.csv(csv)
      .then( function(data){ 

                  data.forEach(d => {
                
                    d.date = parseTime(d.date);
                    d.value = +d.value;
                  });
                  
                  var x = d3.scaleTime()
                            .domain(d3.extent(data, function(d) { return d.date; }))
                            .range([ 0, width ]);
                      
                        // Add Y axis
                  var y= d3.scaleLinear()
                        .domain(d3.extent(data, function(d) { return d.value; }))
                        .range([ height, 0 ]);

                  // Select the section we want to apply our changes to
                  var div = d3.select("#line_chart_graph").transition().duration(2000);
                              
                        
                  var valueline = d3.line()
                                    .x(function(d) { return x(d.date); })
                                    .y(function(d) { return y(d.value); });
                
                   // update Axis
                  d3.select(".x_axis")
                    .transition().duration(500)
                    .call(d3.axisBottom(x));                 
                  
                  d3.select(".y_axis")
                    .transition().duration(500)
                    .call(d3.axisLeft(y));               


                  // Draw the line the line
                   d3.select(".line_chart")
                              .attr("fill", "none")
                              .attr("stroke", "steelblue")
                              .attr("stroke-width", 1.5)
                              .attr("d", valueline(data))
                              .transition().duration(2000);      
                  
                  var svg =  d3.select("#line_chart_graph");       
                  
                  var tooltip = d3.select("body")
                                  .append("div")
                                  .attr("class", "tooltip");      
                        
                  
                  var circles = drawCircles(svg, data, x, y);
                                      
                  circles.on("mouseenter", function(event, d){
                                  tooltip_circle_enter(this, event, d, tooltip)              
                                })
                          .on("mouseleave", function(){
                                  tooltip_circle_leave(this, tooltip)
                                })
                  
      })
      .catch((error) =>{
        console.log(error);
        //alert("Unable To Load The Dataset!!");
        throw(error)
    })  
}



//Di default c'è dataset 1
dataset_1 = "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv";
d3.csv(dataset_1)
  .then( function(data){ 

    data.forEach(d => {
      
      d.date = parseTime(d.date);
      d.value = +d.value;
    });
    createDefaultLineChart(data)
  })
  .catch((error) =>{
    console.log(error);
    //alert("Unable To Load The Dataset!!");
    throw(error)
})





//------------EVENTS FOR CLICKING TAB MEU ----------------------------------
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



