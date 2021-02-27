//UTILS FOR THE CHARTS: LEGENDS AND OTHER

//-------------------------------------------LINECHARTS----------------------------------------

//Support functions for the LineChart
var isAnnual = false;

//Create the legend of the Linechart
function createLineChartLegend(svg) {
  legend = svg.append("g").attr("class", "legend");

  legend
    .append("rect")
    .attr("x", 10)
    .attr("width", 290)
    .attr("y", 1)
    .attr("height", 60)
    .attr("class", "legend-square")
    .attr("id", "legend-square-linechart");

  legend
    .append("line")
    .attr("x1", 15)
    .attr("x2", 30)
    .attr("y1", 15)
    .attr("y2", 15)
    .attr("class", "line_chart_annual")
    .attr("id", "legend-annual-line");

  legend
    .append("text")
    .attr("x", 37)
    .attr("y", 15)
    .attr("class", "legend")
    .text("Annual Average Temperature")
    .attr("id", "legend-annual-text");

  legend
    .append("rect")
    .attr("x", 15)
    .attr("width", 15)
    .attr("y", 24)
    .attr("height", 16)
    .attr("class", "uncertainty")
    .attr("id", "range-name-unc");

  var btn = getCheckedValue("btn-range-year");

  var label = document.getElementById("label-" + btn.id);
  var range_name = label.innerHTML;

  legend
    .append("line")
    .attr("x1", 15)
    .attr("x2", 30)
    .attr("y1", 32)
    .attr("y2", 32)
    .attr("class", "line_chart_range_years")
    .attr("id", "range-name-line");

  legend
    .append("text")
    .attr("x", 37)
    .attr("y", 32)
    .attr("class", "legend")
    .attr("id", "range-name-legend")
    .html(range_name + " Average Temperature with uncertainty");

  legend
    .append("line")
    .attr("x1", 15)
    .attr("x2", 30)
    .attr("y1", 48)
    .attr("y2", 48)
    .attr("class", "baselines");

  legend
    .append("text")
    .attr("x", 37)
    .attr("y", 50)
    .attr("class", "legend")
    .text("Baseline Temperature");
}

function updateRangeNameLegend(svg) {
  var btn = getCheckedValue("btn-range-year");

  var label = document.getElementById("label-" + btn.id);
  var range_name = label.innerHTML;

  d3.select("#legend-square-linechart").remove();
  createLineChartLegend(svg, btn);

  if (btn.value == "annual" && !isAnnual) {
    d3.select("#legend-annual-line").remove();
    d3.select("#legend-annual-text").remove();

    d3.select("#range-name-unc").attr("y", 15);

    d3.select("#range-name-line")
      .attr("y1", 23)
      .attr("y2", 23)
      .style("stroke", "steelblue");

    d3.select("#range-name-legend").attr("y", 23);
    isAnnual = true;
  }

  if (isAnnual && btn.value != "annual") {
    var legend = d3.select(".legend");
    legend
      .append("line")
      .attr("x1", 15)
      .attr("x2", 30)
      .attr("y1", 15)
      .attr("y2", 15)
      .attr("class", "line_chart_annual")
      .attr("id", "legend-annual-line");

    legend
      .append("text")
      .attr("x", 37)
      .attr("y", 15)
      .attr("class", "legend")
      .text("Annual Average Temperature")
      .attr("id", "legend-annual-text");

    d3.select("#range-name-unc")
      .attr("y", 24)
      .attr("class", "uncertainty")
      .attr("id", "range-name-unc");

    d3.select("#range-name-line")
      .attr("y1", 32)
      .attr("y2", 32)
      .style("stroke", "red");
    d3.select("#range-name-legend").attr("y", 32);

    isAnnual = false;
  }

  d3.select("#range-name-legend").html(
    range_name + " Average Temperature with uncertainty"
  );
}

//-------------------------------------------------------TABLE-----------------------------------------

function isInfoNaN(json_field) {
  return json_field == "NaN";
}

function existYear(data, year) {
  var x = false;
  data.forEach((d) => {
    if (d.Year == year) x = true;
  });

  return x;
}

//compute mean rate of changes
function getMeanRateOfChange(temp1, temp2, year_temp1, year_temp2) {
  return (temp2 - temp1) / (year_temp2 - year_temp1);
}

//save temperature to compute mean rate of changes
function getYearTemperatures(row_table) {
  var temperatures = [];
  years_table.forEach((year) => {
    temperatures[year] = row_table[year].temp;
  });

  return temperatures;
}

function fisrtLetterUpperCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

//-----------------------------SEASONAL---------------------------------------------------------

function getMonthName(month) {
  var monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthName[month - 1];
}

function getFullMonthName(month) {
  var monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return monthName[month - 1];
}

//Create the legend of the Seasonal Linechart
function createSeasonalLineChartLegend(svg, dataLastYears) {
  legend = svg.append("g").attr("class", "legend");

  var curY = 15;

  legend
    .append("rect")
    .attr("x", 10)
    .attr("width", 210)
    .attr("y", 1)
    .attr("height", 100)
    .attr("class", "legend-square")
    .attr("id", "legend-square-seasonal");

  legend
    .append("line")
    .attr("x1", 15)
    .attr("x2", 39)
    .attr("y1", curY)
    .attr("y2", curY)
    .attr("class", "seasonal-range-line");

  legend
    .append("text")
    .attr("x", 40)
    .attr("y", curY + 3)
    .attr("class", "legend")
    .attr("id", "text-range")
    .html(
      "Min-Max Range Temp. Untill " +
        dataLastYears[dataLastYears.length - 1][0].year
    );

  curY += 15;
  legend
    .append("rect")
    .attr("x", 15)
    .attr("width", 15)
    .attr("y", curY)
    .attr("height", 16)
    .attr("class", "uncertainty");

  legend
    .append("line")
    .attr("x1", 15)
    .attr("x2", 30)
    .attr("y1", curY + 8)
    .attr("y2", curY + 8)
    .attr("class", "line-seasonal-baseline");

  legend
    .append("text")
    .attr("x", 40)
    .attr("y", curY + 11)
    .attr("class", "legend")
    .html("1951-1980 average with 95% range");

  curY += 12;
  var id_idx = 0;
  for (var i = 0; i < dataLastYears.length; i++) {
    curY += 15;
    legend
      .append("line")
      .attr("x1", 15)
      .attr("x2", 30)
      .attr("y1", curY)
      .attr("y2", curY)
      .attr("stroke", colorsYears[i]);

    legend
      .append("text")
      .attr("x", 40)
      .attr("y", curY + 3)
      .attr("class", "legend")
      .html("Monthly Temperatures of " + dataLastYears[i][0].year)
      .attr("id", "legend-text-" + id_idx);
    id_idx++;
  }
}

function updateSeasonalLegend(dataLastYears, svg) {
  d3.select("#legend-square-seasonal").remove();
  createSeasonalLineChartLegend(svg, dataLastYears);
}

//---------------------------------------------------------HOTTEST-COLDEST--------------------------------------------------------//

function getAverageTemperature(data) {
  var data_annual = [];

  data.forEach((d) => {
    if (d.Month == 6)
      data_annual.push({
        Year: d.Year,
        annual_value: d.annual_value,
        annual_unc: d.annual_unc,
        annual_anomaly: d.annual_anomaly,
      });
  });

  return data_annual;
}

function getHottestYears(data) {
  var temperatures = getAverageTemperature(data).sort(
    (x, y) => x.annual_value - y.annual_value
  );
  var hottest_year = [];
  var color_list = ["#FF0020", "#FF4600", "#FF7800", "#FFaa00", "#FFe600"];
  var j = 0;
  var counter_temp = 0;
  for (var i = temperatures.length - 1; i >= 0; i--) {
    if (counter_temp == 5) break;

    if (isNaN(temperatures[i].annual_value)) continue;
    else {
      temperatures[i]["color_value"] = color_list[j];
      hottest_year.push(temperatures[i]);
      j++;
      counter_temp++;
    }
  }

  return hottest_year;
}

function getColdestYears(data) {
  var temperatures = getAverageTemperature(data).sort(
    (x, y) => x.annual_value - y.annual_value
  );

  var coldest_year = [];
  var color_list = [
    "#17ff00",
    "#00ffa8",
    "#00fff4",
    "#0094ff",
    "#0054ff",
  ].reverse();
  var j = 0;
  var counter_temp = 0;
  for (var i = 0; i < temperatures.length; i++) {
    if (counter_temp == 5) break;

    if (isNaN(temperatures[i].annual_value)) continue;
    else {
      temperatures[i]["color_value"] = color_list[j];
      coldest_year.push(temperatures[i]);
      j++;
      counter_temp++;
    }
  }

  return coldest_year;
}

function isInList(el, list) {
  for (var i = 0; i < list.length; i++) {
    if (el == list[i].Year) return true;
  }

  return false;
}

function getUniqueValue(value, index, self) {
  return self.indexOf(value) === index;
}

function getIdxList(el, list) {
  for (var i = 0; i < list.length; i++) {
    if (el == list[i].Year) return i;
  }

  return -1;
}

function getHotColdStyle(hot_cold_list, d) {
  if (isInList(d[0].Year, hot_cold_list)) {
    var idx = getIdxList(d[0].Year, hot_cold_list);

    var style =
      "stroke:" +
      hot_cold_list[idx].color_value +
      ";" +
      "fill: none;" +
      "stroke-width: 2px;" +
      "stroke-opacity:80%;";
    return style;
  } else {
    var style_base =
      "stroke: lightgray;" +
      "fill: none;" +
      "stroke-width: 1px;" +
      "stroke-opacity: 50%;";

    return style_base;
  }
}

function createHotColdLegend(id_container, hottest_temp, coldest_temp) {
  container = d3.select("#" + id_container);

  var legend = container
    .append("svg")
    .attr("id", "legend_hot_cold")
    .attr("width", 270)
    .attr("height", 500)
    .append("g");
  var curX = 50;
  var curY = 25;

  legend
    .append("rect")
    .attr("x", curX - 20)
    .attr("y", curY);

  legend
    .append("text")
    .attr("x", curX - 20)
    .attr("y", curY)
    .attr("class", "title-legend-h-c")
    .text("Top 5 Hottest Anomalies");

  var id_idx = 0;
  hottest_temp.forEach((el) => {
    curY += 35;

    legend
      .append("rect")
      .attr("x", curX)
      .attr("width", 20)
      .attr("y", curY)
      .attr("height", 20)
      .attr("fill", el.color_value);

    legend
      .append("text")
      .attr("class", "text-legend")
      .attr("x", curX + 35)
      .attr("y", curY + 15)
      .attr("id", "hot-cold-text-" + id_idx)
      .html(
        el.Year +
          "&nbsp &nbsp" +
          (el.annual_anomaly > 0
            ? "+" + el.annual_anomaly.toFixed(2)
            : el.annual_anomaly.toFixed(2)) +
          " &deg;C"
      );

    legend
      .append("rect")
      .attr("id", "hot-cold-rect-" + id_idx)
      .attr("x", curX - 5)
      .attr("width", 150)
      .attr("y", curY - 5)
      .attr("height", 28)
      .style("fill", "white")
      .style("opacity", "0%")
      .on("mouseenter", hotColdTextLegendEnter)
      .on("mouseleave", hotColdTextLegendLeave);

    id_idx++;
  });

  curY += 60;
  legend
    .append("text")
    .attr("x", curX - 20)
    .attr("y", curY)
    .attr("class", "title-legend-h-c")
    .text("Top 5 Coldest Anomalies");

  coldest_temp.forEach((el) => {
    curY += 35;

    legend
      .append("rect")
      .attr("x", curX)
      .attr("width", 20)
      .attr("y", curY)
      .attr("height", 20)
      .attr("fill", el.color_value);

    legend
      .append("text")
      .attr("class", "text-legend")
      .attr("x", curX + 35)
      .attr("y", curY + 15)
      .attr("id", "hot-cold-text-" + id_idx)
      .html(
        el.Year +
          "&nbsp &nbsp" +
          (el.annual_anomaly > 0
            ? "+" + el.annual_anomaly.toFixed(2)
            : el.annual_anomaly.toFixed(2)) +
          " &deg;C"
      );

    legend
      .append("rect")
      .attr("id", "hot-cold-rect-" + id_idx)
      .attr("x", curX - 5)
      .attr("width", 150)
      .attr("y", curY - 5)
      .attr("height", 28)
      .style("fill", "white")
      .style("opacity", "0%")
      .on("mouseenter", hotColdTextLegendEnter)
      .on("mouseleave", hotColdTextLegendLeave);

    id_idx++;
  });
}

function updateHotColdLegend(hot_cold_list) {
  var id_idx = 0;
  hot_cold_list.forEach((el) => {
    d3.select("#hot-cold-text-" + id_idx)
      .html(
        el.Year +
          "&nbsp &nbsp" +
          (el.annual_anomaly > 0
            ? "+" + el.annual_anomaly.toFixed(2)
            : el.annual_anomaly.toFixed(2)) +
          " &deg;C"
      )
      .on("mouseenter", hotColdTextLegendEnter)
      .on("mouseleave", hotColdTextLegendLeave);

    id_idx++;
  });
}

//-----------------------------------------------------------------------------------------

function NavBarDropDownEvt() {
  
  var drop_div = document.getElementById("contributors-div");
  var ul = document.getElementById("contributors-elem");

  if (
    (drop_div.style.display == "" || drop_div.style.display == "none") &&
    (ul.style.display == "" || ul.style.display == "none")
  ) {
    drop_div.style.display = "block";
    ul.style.display = "block";
  
    document.getElementById("bracket_drop_nav").style.transform="rotate(180deg)";

  } else {
    drop_div.style.display = "none";
    ul.style.display = "none";
    document.getElementById("bracket_drop_nav").style.transform="none";
  }
}
