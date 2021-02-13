var debug = true;
const separator = "\n-------------------------------";

function debug_log(message) {
  if (debug) console.log(message + separator);
}

function changeStroke(obj, multiplyer){
  let el = d3.select(obj)
  el.style("stroke-width", parseFloat(el.style("stroke-width")) * multiplyer);
}

function roundedFigure_1(x, y, width_top, width_bottom, height, dy1=-0.1, dy2=0.1, p_dx1=0.5, p_dx2=0.5) {
  var l = (width_top - width_bottom) / 2;

  return "M" + x + "," + y
          + "h" + (width_top)
          + "c" + (-(l*p_dx1)) +" "+ (-dy1) + ","
                + ((l*p_dx2)-l) +" "+ (+(height+dy2)) + ","
                + -l + " " + (+height)
          + "h" + (-width_bottom)
          + "c" + (-(l*p_dx2)) +" "+ (+dy1) + ","
                + ((l*p_dx1)-l) +" "+ (-(height+dy2)) + ","
                + -l + " " + (-height)
          + "Z";
}

function roundedTriangle(x, y, b, h){
  return "M" + x + "," + y
          + "l" + h + " " + b/2
          + "l" + -h + " " + b/2
          + "Z"
}

/*
var svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 500)
  .append("g")
    .attr("transform", "translate(230,230)");

svg.append("path").attr("d", roundedFigure_1(-200, -200, 60, 40, 10));
*/