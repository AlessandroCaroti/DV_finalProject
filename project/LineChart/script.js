//Global Variable

var margin = {top: 10, right: 30, bottom: 30, left: 60}
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;
var parseTime = d3.timeParse("%Y-%m-%d");

var baseline;
var baseline_unc;


d3.json("/../../data/data_temp/Afghanistan/Afghanistan_info.json")
  .then( (data =>{

      baseline = +data["absolute_temp(C)"];
      baseline_unc = +data["absTemp_unc(C)"];

      console.log(baseline, "\n", baseline_unc)

  
  }))


function drawCircles(svg, data, x, y, tooltip){
  
  var circle = svg.selectAll("circle")
                    .data(data)
                    .enter().append("circle")
                    .attr("cx", function(d) { return x(d.date); })
                    .attr("cy", function(d) { return y(d.value); })
                    .attr("r", 5)
                    .attr("class","scatter")
                    .classed("unselected_circle", true)
                    .on("mouseenter", function(event, d){
                      tooltip_circle_enter(this, event, d, tooltip)              
                    })
                    .on("mouseleave", function(){
                      tooltip_circle_leave(this, tooltip)
                    })
                
    
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

  function createDefaultLineChart(data){

    var svg = d3.select("#line_chart_graph")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("id", "svg");

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
        .y(function(d) { return y(d.value); })
        .defined( (d) => { return ( !isNaN(d.value) )});        

    // Draw the line the line
    svg.append("path")
              .data([data])
              .attr("class","line_chart")
              .attr("fill", "none")
              .attr("stroke", "steelblue")
              .attr("stroke-width", 1.5)
              .attr("d", valueline);       
      
    var tooltip = d3.select("body")
                  .append("div")
                  .attr("class", "tooltip");      

    //drawCircles(svg, data, x, y, tooltip);
    
  
    console.log("EGEGEEGEG")
  }



  function changeData() {
    
    // prendere dati da mappa selezionata o dropdown menu
    var dataFile = document.getElementById('dataset').value;
    
    //quando cambio dati, devo leggere un nuovo csv

    var csv;
    //only to test the update
 
    parseTime = d3.timeParse("%Y");
    
    csv = "../../data/data_temp/Afghanistan/Afghanistan_anomalyTable.csv"
    
    console.log(csv);
    //select svg
    
    d3.csv(csv)
      .then( function(data){ 

        
          console.log(data, "\nbaseline", baseline, "\nbaseline_unc: ", baseline_unc)
          data.forEach(d => {
                  
            d.date = parseTime(d.Year);
            d.value = baseline + parseFloat(d["Annual Anomaly"]);
            d.uncertainty = baseline_unc + parseFloat(d["Annual Unc."]);
          })
       

                  
        var x = d3.scaleTime()
                  .domain(d3.extent(data, function(d) { return d.date; }))
                  .range([ 0, width ]);
                        
                          // Add Y axis
        var y= d3.scaleLinear()
                .domain(d3.extent(data, function(d) { return d.value; }))
                .range([ height, 0 ]);
                    
            
        updateAxis(".x_axis", ".y_axis", x, y);       
                  
        var svg = d3.select("#svg");               
                          
        var valueline = d3.line()
                        .x(function(d) { return x(d.date); })
                        .y(function(d) { return y(d.value); })
                        .defined( (d) => { return ( !isNaN(d.value) )});
        
        console.log(valueline(data));              
        
                  
            // Draw the line the line
        svg.select(".line_chart")
          .data([data])
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 1.5)
          .attr("d", valueline)
          .transition().duration();      
                                
                    
        var tooltip = d3.select("body")
                        .append("div")
                        .attr("class", "tooltip");      
                              
        //remove old circles and update
        svg.selectAll(".scatter").remove();
        drawCircles(svg, data, x, y, tooltip);  
         
      })
      .catch((error) =>{
        console.log(error);
        //alert("Unable To Load The Dataset!!");
        throw(error);
    })  
}



function default_dataset(){

  //Di default c'è dataset 1
  dataset_1 = "https://raw.githubusercontent.com/holtzy//master/Example_dataset/3_TwoNumOrdered_comma.csv";
  d3.csv(dataset_1)
  .then( function(data){ 

    data.forEach(d => {
      d.date = parseTime(d.date);
      d.value = +d.value;
    
    });
    
    createDefaultLineChart(data);
    })
    .catch((error) =>{
      console.log(error);
      //alert("Unable To Load The Dataset!!");
      throw(error);
  })



}



























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


