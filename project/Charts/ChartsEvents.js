
//-------------------------LINE CHART TOOLTIP----------------------------------------

// Functions to Draw and Remove the tooltip
// given the x position find the corresponding value
function drawTooltipLineChart(
  self,
  event,
  x,
  data,
  tooltipLine,
  id_chart,
  height
) {
  var btn = getCheckedValue("btn-range-year");

  var label = document.getElementById("label-" + btn.id);
  var range_name = label.innerHTML;

  var tooltip = d3.select(id_chart + " .tooltip");

  const date = x.invert(d3.pointer(event, self.node())[0]);

  //find date correspondece comparing difference in milliseconds
  var elem = data.find(
    (d) => Math.abs(d.date - date) < 1000 * 60 * 60 * 24 * 16
  );

  tooltipLine
    .attr("stroke", "black")
    .attr("x1", x(date))
    .attr("x2", x(date))
    .attr("y1", 0)
    .attr("y2", height);

  var tipText = String(
    "<b> <p style='text-align: center; font-size: 15px;'>" +
      elem.date.getFullYear() +
      "</p>" +
      "Baseline: " +
      elem.baseline +
      " &deg;C <br/>" +
      "Annual  Avg: " +
      elem.annual_value.toFixed(2) +
      " &deg;C " +
      " &plusmn; " +
      elem.annual_unc.toFixed(2) +
      "<br/>" +
      (btn.value != "annual"
        ? String(
            range_name +
              "  Avg: " +
              elem[btn.value + "_value"].toFixed(2) +
              " &deg;C " +
              " &plusmn; " +
              elem[btn.value + "_unc"].toFixed(2) +
              "</b>"
          )
        : "")
  );

  tooltip
    .html("")
    .style("display", "block")
    .style("left", String(event.pageX + 20) + "px")
    .style("top", String(event.pageY - 20) + "px")
    .append("div")
    .html(tipText);
}

function removeTooltipLineChart(tooltipLine, id_chart) {
  var tooltip = d3.select(id_chart + " .tooltip");
  if (tooltip) tooltip.style("display", "none");
  if (tooltipLine) tooltipLine.attr("stroke", "none");
}

//--------------------------------STRIPE CHART TOOLTIP----------------------------------------

function stripesEnter(event, d) {
  var range_year = getCheckedValue("btn-range-year").value;
  var tooltip = d3.select("#stripechart .tooltip");

  tooltip.transition();
  var tipText = String(
    "<p style='text-align: center; font-weight: bold; font-size: 13px'> " +
      d.Year +
      "</p>" +
      "<p style='text-align: center; font-weight: bold; font-size: 12px'> " +
      (isNaN(d[range_year + "_anomaly"])
        ? "unknown"
        : d[range_year + "_anomaly"].toFixed(2) + " &deg;C ") +
      (isNaN(d[range_year + "_anomaly"])
        ? ""
        : " &plusmn; " + d[range_year + "_unc"].toFixed(2)) +
      " </p>"
  );

  tooltip
    .style("left", String(event.pageX + 20) + "px")
    .style("top", String(event.pageY - 20) + "px")
    .style("display", "block")
    .html(tipText);
}

function stripesLeave() {
  var tooltip = d3.select("#stripechart .tooltip");
  if (tooltip) tooltip.style("display", "none");
}

function stripesMove() {
  var tooltip = d3.select("#stripechart .tooltip");
  tooltip
    .style("left", String(event.pageX + 20) + "px")
    .style("top", String(event.pageY - 20) + "px");
}

//--------------------------------- TOOLTIP SEASONAL LINECHART --------------------------------------------

function drawTooltipSeasonal(
  tipBox,
  event,
  x,
  data,
  tooltipLine,
  lastYearsData
) {
  var tooltip = d3.select("#tooltip-seasonal-changes");

  const date = x.invert(d3.pointer(event, tipBox.node())[0]);

  //find the element of the corresponding month
  var elem = data.find(
    (d) =>
      (d.month - 1 == date.getMonth() + 1 && date.getDate() >= 15) ||
      (d.month - 1 == date.getMonth() && date.getDate() < 15) ||
      (date.getDate() >= 15 && date.getMonth() == 11 && d.month == 1)
  );

  tooltipLine
    .attr("stroke", "black")
    .attr("x1", x(parseMonth(elem.month)))
    .attr("x2", x(parseMonth(elem.month)))
    .attr("y1", 0)
    .attr("y2", height);

  var tipText =
    "<p id='text-tip-seasonal'>" +
    getFullMonthName(elem.month) +
    "</p>" +
    "Average (1951-1980): " +
    String(elem.seasonalBaseline.toFixed(1)) +
    " &deg;C" +
    "<br/>Min-Max Temp Range: " +
    "[ " +
    String((elem.seasonalBaseline - elem.unc).toFixed(2)) +
    " &deg;C  -  " +
    String((elem.seasonalBaseline + elem.unc).toFixed(2)) +
    " &deg;C  ]";

  for (var i = 0; i < lastYearsData.length; i++) {
    var row = lastYearsData[i].filter((d) => d.month == elem.month)[0];

    if (row != undefined)
      tipText +=
        "<br/>" + row.year + ": " + row.monthlyTemp.toFixed(2) + " &deg;C";
    else tipText += "<br/>" + lastYearsData[i][0].year + ": NaN";
  }

  tooltip
    .html("")
    .style("display", "block")
    .style("left", String(event.pageX + 20) + "px")
    .style("top", String(event.pageY - 20) + "px")
    .append("div")
    .html(tipText);
}

function removeTooltipSeasonal(tooltipLine) {
  var tooltip = d3.select("#tooltip-seasonal-changes");
  if (tooltip) tooltip.style("display", "none");
  if (tooltipLine) tooltipLine.attr("stroke", "none");
}

//------------------------------------------HOTTTEST-COLDEST LINECHART -------------------------------------------------------------------

function hotColdTextLegendEnter(event, d) {
  var idx = this.id.split("-")[3];

  var idx_text = "hot-cold-text-" + idx;
  d3.select("#" + idx_text)
    .style("font-weight", "bold")
    .style("text-decoration", "underline");

  d3.select("#path-" + idx).style("stroke-width", "6px");

  d3.select("#path-" + idx).moveToFront();
}

function hotColdTextLegendLeave(event, d) {
  var idx = this.id.split("-")[3];

  var idx_text = "hot-cold-text-" + idx;
  d3.select("#" + idx_text)
    .style("font-weight", "normal")
    .style("text-decoration", "none");

  d3.select("#path-" + idx).style("stroke-width", "2px");
}

function hotColdMouseEnter(self) {
  var idx = self.id.split("-")[1];

  d3.select(self).style("stroke-width", "6px").moveToFront();

  d3.select("#hot-cold-text-" + idx)
    .style("font-weight", "bold")
    .style("text-decoration", "underline")
    .style("text-decoration-color", "black");
}

function hotColdMouseLeave(self) {
  var idx = self.id.split("-")[1];

  d3.select(self).style("stroke-width", "2px");

  d3.select("#hot-cold-text-" + idx)
    .style("font-weight", "normal")
    .style("text-decoration", "none");
}
