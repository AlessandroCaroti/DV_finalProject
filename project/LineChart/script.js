
  function changeData() {
   
    // prendere dati da mappa selezionata o dropdown menu
   
    //test
    dataFile = "anscombe_I"
 
    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv")
      .then((data) => {
          
          var margin = {top: 10, right: 30, bottom: 30, left: 60},
          
          width = 500 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

          data.forEach(d => {
            console.log(d.date)
            d.date = d3.timeParse("%Y-%m-%d")(d.date) 
            d.value = d.value;
            console.log(d.date)
          });
        
          
        //select svg
        var svg = d3.select("#line_chart_graph")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        
        // Now I can use this dataset:
        data_ =>{
          // Add X axis --> it is a date format
          var x = d3.scaleTime()
            .domain(d3.extent(data_, function(d) { return d.date; }))
            .range([ 0, width ]);
          svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

          // Add Y axis
          var y = d3.scaleLinear()
            .domain([0, d3.max(data_, function(d) { return +d.value; })])
            .range([ height, 0 ]);
          svg.append("g")
            .call(d3.axisLeft(y));

          // Add the line
          svg.append("path")
            .datum(data_)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
              .x(function(d) { return x(d.date) })
              .y(function(d) { return y(d.value) })
              ) 
        }
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