console.log("STO CAZZO");

// MODIFICARE PER CAMBIARE LE DIMENSIONI DELLA MAPPA
var w = 1000;
var h = 500;

var projection;
var map_container;
var colorsRange = ["rgb(5, 48, 97)", "white", "rgb(103, 0, 31)"];
//var colorsRange = ["blue", "white", "red"];

var geoGenerator;

var zoom = d3
  .zoom()
  .on("zoom", (event) => {
    map_container.attr("transform", event.transform);
  })
  .scaleExtent([1, 8]);

map_file = "../../data/countries-50m.json";
tmp_file = "../../data/data_year/2019/Annual_mean.csv";
var tmp_data;

function drawMap(world) {
  console.log("DRAW-MAP");

  svg = d3.select("#svg-map").attr("width", "100%").attr("height", h); //.call(zoom);
  map_container = svg.select("#map");

  projection = d3
    .geoEquirectangular()
    .scale(140)
    .translate([w / 2, h / 2]);

  geoGenerator = d3.geoPath().projection(projection);

  // Draw the background (country outlines)
  map_container
    .selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("id", (d) => {
      return d.properties.name;
    })
    .attr("d", geoGenerator);

  // Draw gridlines
  var graticule = d3.geoGraticule();

  var maps = map_container.selectAll("path.grat_2").data(graticule.lines());
  maps.enter().append("path").classed("grat_2", true).attr("d", geoGenerator);

  //Associate to each county a color proportionate to it's anomaly
  update_colors();

  //Define the events associated with the country area in the maps(Es, mouseover, click...)
  country_events();
}

function update_colors() {
  //[-2.5169, 0, +3.1986]
  //-2.5168333333333335 3.1985000000000006


  var colorScale = d3
    .scaleLinear()
    //.domain([-5, 0, +5])
    .domain([-2.5169, 0, +3.1986])
    .range(colorsRange);
  console.log(d3.interpolateRdBu(1))

  tmp_data.forEach(function (d) {
    var element = document.getElementById(d.Country);

    if (typeof element != "undefined" && element != null) {
      d3.select(element).style("fill", colorScale(d["ANOMALY"]));
    }
  });
}

function country_events() {
  //MOUSE-OVER EVENT: highlighted country when the mouse is over
  map_container.selectAll(".country").on("mouseenter", function (event, b) {
    d3.select(this).raise();
    d3.select(this).classed("highlighted_country", true);
  });
  map_container.selectAll(".country").on("mouseleave ", function (event, b) {
    d3.select(".highlighted_country").classed("highlighted_country", false);
  });

  //CLICK EVENT:
  map_container.selectAll(".country").on("click", function (event, b) {
    //deselect the previus country
    d3.select(".selected_country").classed("selected_country", false);

    d3.select(this).classed("selected_country", true);
    country_selected(b);
  });
}

function country_selected(country) {
  var bounds = geoGenerator.bounds(country),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / w, dy / h))),
    translate = [w / 2 - scale * x, h / 2 - scale * y];

  map_container
    .transition()
    .duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
}

// LOAD COUNTRIES MENU

var countries = d3
  .select("datalist#countryList")
  .data(["Internet Explorer", "Firefox", "Chrome", "Opera", "Safari"]);

countries
  .enter()
  .append("option")
  .attr("value", (d) => d);

// UPDATE YEAR

// select slider
var slider = document.getElementById("selectYear");
var output = document.getElementById("outputYear");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
};

// UPDATE COUNTRY

function changeCountry() {
  console.log("bubi");
}

// *******************************************************************
// FILES LOADING

d3.csv(tmp_file)
  .then(function (data) {
    console.log("LOAD TEMP");

    data.forEach((d) => {
      d.ANOMALY = parseFloat(d.Anomaly);
    });
    tmp_data = data;
    load_map();
  })
  .catch(function (error) {
    console.log(error);
    throw error;
  });

function load_map() {
  d3.json(map_file)
    .then((world) => {
      console.log("LOAD MAP");

      let topology = world;
      topology = topojson.presimplify(topology);
      topology = topojson.simplify(topology, 0.05);

      drawMap(topology);
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}
