
const countries = '../../../remaining_data/data_new/Countries.csv';

//----------------------- TAB EVENT ----------------------------------------------------

function click_tab(evt, graphic_name) {
  

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


//-------------------------LINE CHART TOOLTIP----------------------------------------

// Functions to Draw and Remove the tooltip
// given the x position find the corresponding value 
function drawTooltipLineChart(self, event, x, data, tooltipLine, id_chart, height) {

  var tooltip = d3.select(id_chart+" .tooltip-map")

  
  const date = x.invert(d3.pointer(event, self.node())[0]);

  //find date correspondece comparing difference in milliseconds
  var elem = data.find( (d) =>  Math.abs( d.date - date ) < 1000*60*60*24*16 );

  tooltipLine.attr('stroke', 'black')
      .attr('x1', x(date))
      .attr('x2', x(date))
      .attr('y1', 0)
      .attr('y2', height);
  
  var range_selected =  document.getElementById('rage-year');
  range_name = range_selected.options[range_selected.selectedIndex].text;

  var tipText =  String(
    "<b> <p style='text-align: center; font-size: 12px;'> Year: " + elem.date.getFullYear()+"</p>" +
    "Baseline Temp. : "+elem.baseline+" &deg;C <br/>" +
    "Annual  Avg.  Temp. : "+elem.annual_value.toFixed(2) +" &deg;C " +
    " &plusmn; " +  elem.annual_unc.toFixed(2) + "<br/>"+
    (range_selected.value != "annual"? String(range_name+"  Avg. Temp: "+elem[range_selected.value+"_value"].toFixed(2) +" &deg;C " + 
    " &plusmn; " +  elem[range_selected.value+"_unc"].toFixed(2)+"</b>"):"")
  )
     
  tooltip.html("")
      .style('display', 'block')
      .style('left', String( (event.pageX) + 20) + "px" )
      .style('top', String( (event.pageY) - 20) + "px" )
      .append('div')
      .html( tipText );
}


function removeTooltipLineChart(tooltipLine, id_chart) {
  
var tooltip = d3.select(id_chart+" .tooltip-map")
  if (tooltip) tooltip.style('display', 'none');
  if (tooltipLine) tooltipLine.attr('stroke', 'none');
}
  
//--------------------------------STRIPE CHART TOOLTIP----------------------------------------

function stripesEnter(event, d){


  var tooltip = d3.select("#stripechart .tooltip-map");
  tooltip.transition();
  var tipText =  String(
      "<b> Year: " + d.date.getFullYear()+"<br/>" +"<br/>" +
      "Annual Avg.  Anomaly: "+d.annual_anomaly.toFixed(2) +" &deg;C " +
      " &plusmn; " +  d.annual_unc.toFixed(2) + " </b>"
    )
  
  tooltip.style('left', String( (event.pageX) + 20) + "px" )
         .style('top', String( (event.pageY) - 20) + "px" )
         .style("display", "block")
         .html(tipText)

}

function stripesLeave(){
  var tooltip = d3.select("#stripechart .tooltip-map");
  if (tooltip) tooltip.style('display', 'none');
}







