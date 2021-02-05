var width = 31;
var height = 31;
var r = 5;

/* -------------------------------------------------------------------------------------- */
/*                       ZOOM IN                                                          */
var zoom_in = d3.select("#zoom-in");
zoom_in
  .select("path")
  .attr("d", topRoundedRect(0, 0, width, height, r));
zoom_in
  .append("line")
  .attr("x1", width / 2 - 7)
  .attr("y1", height / 2)
  .attr("x2", width / 2 + 7)
  .attr("y2", height / 2)
  .style("stroke", "black")
  .style("stroke-width", 2)
  .attr("pointer-events", "none");

zoom_in
  .append("line")
  .attr("x1", width / 2)
  .attr("y1", height / 2 - 7)
  .attr("x2", width / 2)
  .attr("y2", height / 2 + 7)
  .style("stroke", "black")
  .style("stroke-width", 2)
  .attr("pointer-events", "none");

/* -------------------------------------------------------------------------------------- */
/*                       ZOOM OUT                                                         */
var zoom_out = d3.select("#zoom-out");
zoom_out
  .select("path")
  .attr("d", bottomRoundedRect(0, 0, width, height, r));
zoom_out
  .append("line")
  .attr("x1", width / 2 - 7)
  .attr("y1", height / 2)
  .attr("x2", width / 2 + 7)
  .attr("y2", height / 2)
  .style("stroke", "black")
  .style("stroke-width", 2)
  .attr("pointer-events", "none");

/* -------------------------------------------------------------------------------------- */
/*                       ZOOM RESET                                                       */
var zoom_reset = d3.select("#zoom-reset");
zoom_reset
  .select("rect")
  .attr("width", width)
  .attr("height", height);

zoom_reset
  .append("circle")
  .attr("r", 3)
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .attr("pointer-events", "none");


zoom_reset
  .append("circle")
  .attr("r", 9)
  .attr("cx", width / 2)
  .attr("cy", height / 2)
  .style("fill", "none")
  .style("stroke", "black")
  .style("stroke-width", 1)
  .attr("pointer-events", "none");
