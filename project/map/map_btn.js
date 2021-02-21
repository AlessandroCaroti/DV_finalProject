var width_btn = 31;
var height_btn = 31;
var r = 5;

/* -------------------------------------------------------------------------------------- */
/*                       ZOOM IN                                                          */
var zoom_in = d3.select("#zoom-in");
zoom_in.select("path").attr("d", topRoundedRect(0, 0, width_btn, height_btn, r));
zoom_in
  .append("line")
  .attr("x1", width_btn / 2 - 7)
  .attr("y1", height_btn / 2)
  .attr("x2", width_btn / 2 + 7)
  .attr("y2", height_btn / 2)
  .style("stroke", "black")
  .style("stroke-width", 2)
  .attr("pointer-events", "none");

zoom_in
  .append("line")
  .attr("x1", width_btn / 2)
  .attr("y1", height_btn / 2 - 7)
  .attr("x2", width_btn / 2)
  .attr("y2", height_btn / 2 + 7)
  .style("stroke", "black")
  .style("stroke-width", 2)
  .attr("pointer-events", "none");

/* -------------------------------------------------------------------------------------- */
/*                       ZOOM OUT                                                         */
var zoom_out = d3.select("#zoom-out");
zoom_out.select("path").attr("d", bottomRoundedRect(0, 0, width_btn, height_btn, r));
zoom_out
  .append("line")
  .attr("x1", width_btn / 2 - 7)
  .attr("y1", height_btn / 2)
  .attr("x2", width_btn / 2 + 7)
  .attr("y2", height_btn / 2)
  .style("stroke", "black")
  .style("stroke-width", 2)
  .attr("pointer-events", "none");

/* -------------------------------------------------------------------------------------- */
/*                       ZOOM RESET                                                       */
var zoom_reset = d3.select("#zoom-reset");
zoom_reset.select("rect").attr("width", width_btn).attr("height", height_btn);

var inner_circle = zoom_reset
  .append("circle")
  .attr("r", 1)
  .attr("cx", width_btn / 2)
  .attr("cy", height_btn / 2)
  .attr("fill", "black")
  .attr("pointer-events", "none");

var outer_circle = zoom_reset
  .append("circle")
  .attr("r", 10)
  .attr("cx", width_btn / 2)
  .attr("cy", height_btn / 2)
  .style("fill", "none")
  .style("stroke", "black")
  .style("stroke-width", 3)
  .attr("pointer-events", "none");

function no_zoom() {
  inner_circle.attr("r", 4);
  outer_circle.style("stroke-width", 1);
}

function local_zoom() {
  inner_circle.attr("r", 1);
  outer_circle.style("stroke-width", 3);
}

/* -------------------------------------------------------------------------------------- */
/*                       ANIMATION                                                        */

var animation = d3.select("#animation");
var l = 8;
animation
  .select("path")
  .attr("d", roundedRect(0, 0, width_btn, width_btn, width_btn / 2))
  .style("stroke-width", 2);

var play_ico = animation
  .append("path")
  .attr("d", roundedTriangle(width_btn / 2 - l + 2, width_btn / 2 - l, l * 2, l * 2))
  .attr("fill", "balck")
  .attr("visibility", "hidden")
  .attr("pointer-events", "none");

var stop_ico = animation
  .append("path")
  .attr("d", roundedRect(width_btn / 2 - l, width_btn / 2 - l, l * 2, l * 2, 1))
  .attr("fill", "black")
  .attr("visibility", "hidden")
  .attr("pointer-events", "none");

async function play() {
  stop_ico.attr("visibility", "hidden");
  play_ico.attr("visibility", "visible");
  console.log("PLAY");
}

async function stop() {
  play_ico.attr("visibility", "hidden");
  stop_ico.attr("visibility", "visible");
  console.log("STOP");
}
