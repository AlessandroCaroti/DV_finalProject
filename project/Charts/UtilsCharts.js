/** @format */

//UTILS FOR THE CHARTS: LEGENDS AND OTHER

//-------------------------------------------LINECHARTS----------------------------------------

//Support functions for the LineChart


function annualDataStyle() {
  d3.select("#legend-annual-line").remove();
  d3.select("#legend-annual-text").remove();

  d3.select("#range-name-unc").attr("y", 15);

  d3.select("#range-name-line")
    .attr("y1", 23)
    .attr("y2", 23)
    .style("stroke", "steelblue");

  d3.select("#range-name-legend").attr("y", 26);
}

//Create the legend of the Linechart
function createLineChartLegend(svg) {
  var btn = getCheckedValue("btn-range-year");
  legend = svg.append("g").attr("class", "legend");

  legend
    .append("rect")
    .attr("x", 10)
    .attr("width", 290)
    .attr("y", 1)
    .attr("height", 60)
    .attr("class", "legend-square")
    .attr("id", "legend-square-linechart");

  if (btn.value != "annual") {
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

  }

  var label = document.getElementById("label-" + btn.id);
  var range_name = label.innerHTML;

  var y1_range_name = 32,
    y2_range_name = 32,
    y_unc = 32;
  //var stroke_color = "purple";
  if (btn.value == "annual") {
    
    y1_range_name = 23;
    y2_range_name = 23;
    y_unc = 15;
    //stroke_color="steelblue"
  
  }


 
  legend
    .append("rect")
    .attr("x", 15)
    .attr("width", 15)
    .attr("y", y_unc)
    .attr("height", 16)
    .attr("class", "uncertainty")
    .attr("id", "range-name-unc");

  legend
    .append("line")
    .attr("x1", 15)
    .attr("x2", 30)
    .attr("y1", y1_range_name)
    .attr("y2", y2_range_name)
    .attr("class", "line_chart_range_years")
    .attr("id", "range-name-line")
    //.style("stroke", stroke_color);

  legend
    .append("text")
    .attr("x", 39)
    .attr("y", y2_range_name+3)
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

  d3.select(".legend").remove();
  createLineChartLegend(svg, btn);

  if (btn.value != "annual") {

    var legend = d3.select("legend-square-linechart");
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
      //.style("stroke", "red");

    
  }else 
      annualDataStyle();

  d3.select("#range-name-legend").html(
    range_name + " Average Temperature with uncertainty"
  )
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


//-----------------------------------------------------------------------------------------
