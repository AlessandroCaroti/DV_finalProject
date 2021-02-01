//Global Variables
var full_width = 900
var margin = {top: 40, right: 70, bottom: 30, left: 50};
var width = full_width - margin.left - margin.right;
var height = full_width*9/16 - margin.top - margin.bottom;
var parseTime = d3.timeParse("%Y-%m");

var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip");

var baseline;
var baseline_unc;


function initBaseline(dataFile){
  

  var folder;
 
  if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
  else
      folder = dataFile;
  
 
  d3.json("/../../data/data_temp/"+folder+"/"+dataFile+"_info.json")
    .then( (data =>{
  
        baseline = +data["absolute_temp(C)"];
   
    }))

}

function parseDataAttributes(data){
  
  data.forEach(d => {
      
    d.date = parseTime(d.Year+"-"+d.Month);
    d.annual_value = baseline + parseFloat(d["Annual Anomaly"]);
    d.annual_unc =parseFloat(d["Annual Unc."]);
    d.ten_years_value =  baseline + parseFloat(d["Ten-year Anomaly"])
    d.ten_years_unc =  parseFloat(d["Ten-year Unc."])
  
  })
}

function removeTooltip(tooltipLine) {
  
  if (tooltip) tooltip.style('display', 'none');
  if (tooltipLine) tooltipLine.attr('stroke', 'none');
}

function drawTooltip(self, event, x, data, tooltipLine) {
  
  const date = x.invert(d3.pointer(event, self.node())[0]);
  

  //find date correspondece comparing difference in milliseconds
  var elem = data.find( (d) =>  Math.abs( d.date - date ) < 1000*60*60*24*16 );

  tooltipLine.attr('stroke', 'black')
      .attr('x1', x(date))
      .attr('x2', x(date))
      .attr('y1', 0)
      .attr('y2', height);
  


  var tipText =  String(
    "<b> Year: " + elem.date.getFullYear()+"<br/>" +"<br/>" +
    "Annual Average Temperature: "+elem.annual_value.toFixed(2) +" &deg;C " +
    " &plusmn; " +  elem.annual_unc.toFixed(2) + " "+
    "<br/>" +"<br/>" +
    "Ten Years Average Temperature: "+elem.ten_years_value.toFixed(2) +" &deg;C " +
    " &plusmn; " +  elem.ten_years_unc.toFixed(2) + "</b>  "
  )
     
  tooltip.html("")
      .style('display', 'block')
      .style('left', String( (event.pageX) + 20) + "px" )
      .style('top', String( (event.pageY) - 20) + "px" )
      .append('div')
      .html( tipText );
}

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


function createLegend(svg){

 
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

    var svg = d3.select("#linechart")
                .append("svg")
                .attr("class","graphics")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  

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
      .domain(d3.extent(data, function(d) { return d.annual_value; }))
      .range([ height, 0 ]);

    svg.append("g")
      .attr("class", "y_axis")
      .call(d3.axisLeft(y))

    var valueline_annual = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.annual_value); })
        .defined( (d) => { return ( !isNaN(d.annual_value) ) } );        
    
    var valueline_ten_years = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.ten_years_value ); })
        .defined( (d) => { return ( !isNaN(d.ten_years_value ) ) } );        


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
    
    createLegend(svg);
    
    var tooltipLine = svg.append('line').attr("class","line_tip");
    
    var tipBox = svg.append('rect')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('opacity', 0)
                    .attr('id','tipbox')
                    .on('mousemove', (event) => drawTooltip(tipBox, event, x, data, tooltipLine))
                    .on('mouseout', () => removeTooltip(tooltipLine));

  }



function changeData() {
    
    // prendere dati da mappa selezionata o dropdown menu
    var dataFile = document.getElementById('dataset').value;
    document.getElementById("country_t").innerHTML= dataFile;
    
    initBaseline(dataFile);
    
    var folder;
 
    if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
    else
        folder = dataFile;
    
   
    var csv = "/../../data/data_temp/"+folder+"/"+dataFile+"_anomalyTable.csv"
 
    d3.csv(csv)
      .then( (data) =>{ 
          
        parseDataAttributes(data);
                
        var x = d3.scaleTime()
                  .domain(d3.extent(data, function(d) { return d.date; }))
                  .range([ 0, width ]);
                        
                          // Add Y axis
        var y= d3.scaleLinear()
                .domain(d3.extent(data, function(d) { return d.annual_value; }))
                .range([ height, 0 ]);
                    
            
        updateAxis(".x_axis", ".y_axis", x, y);       
                  
        var svg = d3.select(".graphics");               
                          
        var valueline_annual = d3.line()
                        .x(function(d) { return x(d.date); })
                        .y(function(d) { return y(d.annual_value); })
                        .defined( (d) => { return ( !isNaN(d.annual_value) )}); 
        var valueline_ten_years = d3.line()
                                    .x(function(d) { return x(d.date); })
                                    .y(function(d) { return y(d.ten_years_value ); })
                                    .defined( (d) => { return ( !isNaN(d.ten_years_value ) ) } );        
        

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
        
        

        var tooltipLine = d3.select(".line_tip");
        var tipBox = d3.select("#tipbox")
                         .on('mousemove', (event) => drawTooltip(tipBox, event, x, data, tooltipLine))
                         .on('mouseout', () => removeTooltip(tooltipLine));             
         
      })
      .catch((error) =>{
        console.log(error);
        throw(error);
    })  
}


function default_dataset(){

  var dataFile = "Afghanistan"

  document.getElementById("country_t").innerHTML= dataFile;
  var folder;
 
  
  if( dataFile.charAt(dataFile.length  - 1) == '.' ) folder = dataFile.slice(0,-1);
  else
      folder = dataFile;
  
  initBaseline(dataFile);
  var csv = "/../../data/data_temp/"+folder+"/"+dataFile+"_anomalyTable.csv"
  //Di default c'è dataset 1
  d3.csv(csv)
  .then( function(data){ 
    
    parseDataAttributes(data);
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


