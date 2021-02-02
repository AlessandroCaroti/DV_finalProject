
// Functions to Draw and Remove the tooltip
// given the x position find the corresponding value 
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
  

function removeTooltip(tooltipLine) {
  
    if (tooltip) tooltip.style('display', 'none');
    if (tooltipLine) tooltipLine.attr('stroke', 'none');
  }


//Load the baseline of the corresponding country from the nameCountry_info.json file
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

// parse the attribitues useful for the chart and add the baseline
// to the annual_value and ten_years_value
function parseDataAttributes(data){
  
    data.forEach(d => {
        
      d.date = parseTime(d.Year+"-"+d.Month);
      d.annual_value = baseline + parseFloat(d["Annual Anomaly"]);
      d.annual_unc =parseFloat(d["Annual Unc."]);
      d.ten_years_value =  baseline + parseFloat(d["Ten-year Anomaly"])
      d.ten_years_unc =  parseFloat(d["Ten-year Unc."])
    
    })
  }
  


