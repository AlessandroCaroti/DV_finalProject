x = -8;
y = +6;

w1 = 27;
h1 = 37;
p = 2;

//STYLE OPEN
d3.select("#setting_btn_open").attr("d", roundedRect(x, y, w1, h1, 3));
d3.select("#setting_icon_open")
  .attr("xlink:href", "/project/images/angular bracket.svg")
  .attr("pointer-events", "none")
  .attr("width", w1 - p * 2)
  .attr("height", h1 - p * 2)
  .attr("x", x + p)
  .attr("y", y + p);

//STYLE CLOSE
d3.select("#setting_btn_close")
  .attr("d", roundedRect(-200 - x + w1, y, w1, h1, 3))
  .attr("visibility", "hidden");
d3.select("#setting_icon_close")
  .attr("xlink:href", "/project/images/angular bracket close.svg")
  .attr("pointer-events", "none")
  .attr("width", w1 - p * 2)
  .attr("height", h1 - p * 2)
  .attr("x", -200 - x + w1 + p)
  .attr("y", y + p)
  .attr("visibility", "hidden");

//STYLE MENU'
d3.select("#menu")
  .attr("d", roundedRect(x, y, w1, h1, 3))
  .style("fill", "white")
  .style("stroke", "black")
  .style("stroke-width", "2px");

// EVENTS OPEN
d3.select("#setting_btn_open").on("click", function () {
  console.log("CLICK");
  d3.select("#menu")
    .transition()
    .attr("visibility", "visible")
    .attr("d", roundedRect(-200 + w1, 0, 200, 300, 10))
    .on("end", function () {
      d3.select("#setting_btn_close").attr("visibility", "visible");
      d3.select("#setting_icon_close").attr("visibility", "visible");
    });

  d3.select("#setting_icon_open").attr("visibility", "hidden");
  d3.select(this).attr("visibility", "hidden");
});

// EVENTS CLOSE
d3.select("#setting_btn_close").on("click", function () {
  console.log("CLICK");
  d3.select("#menu")
    .transition()
    .attr("visibility", "visible")
    .attr("d", roundedRect(x, y, w1, h1, 3))
    .on("end", function () {
      d3.select("#setting_btn_open").attr("visibility", "visible");
      d3.select("#setting_icon_open").attr("visibility", "visible");
    });

  d3.select("#setting_icon_close").attr("visibility", "hidden");
  d3.select(this).attr("visibility", "hidden");
});