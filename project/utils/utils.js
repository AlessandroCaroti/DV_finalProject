var debug = true;
const separator = "\n-------------------------------";

function debug_log(message) {
  if (debug) console.log(message + separator);
}

function roundedFigure_1(x, y, width_1, width_2, height, dy1=-0.1, dy2=0.1, p_dx1=0.5, p_dx2=0.5) {
  var l = (width_1 - width_2) / 2;

  return "M" + x + "," + y
          + "h" + (width_1)
          + "c" + (-(l*p_dx1)) +" "+ (-dy1) + ","
                + ((l*p_dx2)-l) +" "+ (+(height+dy2)) + ","
                + -l + " " + (+height)
          + "h" + (-width_2)
          + "c" + (-(l*p_dx2)) +" "+ (+dy1) + ","
                + ((l*p_dx1)-l) +" "+ (-(height+dy2)) + ","
                + -l + " " + (-height)
          + "Z";
}

/*
var svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 500)
  .append("g")
    .attr("transform", "translate(230,230)");

svg.append("path").attr("d", roundedFigure_1(-200, -200, 60, 40, 10));
*/