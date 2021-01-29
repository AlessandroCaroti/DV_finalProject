console.log("STO CAZZO");

// MODIFICARE PER CAMBIARE LE DIMENSIONI DELLA MAPPA
var w = 900;
var h = 500;

var projection;
var map_container;

map_file = "../../data/countries-50m.json";

function drawMap(world) {
  console.log("DRAW-MAP");

  svg = d3.select("#svg-map").attr("width", w).attr("height", h);
  map_container = svg.select("#map");

  projection = d3
    .geoEquirectangular()
    .scale(140)
    .translate([w / 2, h / 2]);

  var geoGenerator = d3.geoPath().projection(projection);

  // Draw the background (country outlines)
  map_container
    .selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("d", geoGenerator);

  // Draw gridlines
  var graticule = d3.geoGraticule();

  var maps = map_container.selectAll("path.grat_2").data(graticule.lines());
  maps.enter().append("path").classed("grat_2", true).attr("d", geoGenerator);

  country_events();
}

function country_events() {
  map_container.selectAll(".country").on("mouseenter", function (event, b) {
    d3.select(this).classed("highlighted_country", true);
  });
  map_container.selectAll(".country").on("mouseleave ", function (event, b) {
    d3.select(".highlighted_country").classed("highlighted_country", false);
  });
}

// LOAD COUNTRIES MENU

/*
<datalist id="countryList">
  <option value="Internet Explorer">
  <option value="Firefox">
  <option value="Chrome">
  <option value="Opera">
  <option value="Safari">
</datalist>
*/

// UPDATE YEAR

// select slider
var slider = document.getElementById("selectYear");
var output = document.getElementById("outputYear");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;
};

// UPDATE COUNTRY

// *******************************************************************
// FILES LOADING

d3.json(map_file)
  .then((world) => {
    console.log("LOAD MAP");

    let topology = world;
    topology = topojson.presimplify(topology);

    drawMap(world);
  })
  .catch((error) => {
    console.log(error);
    throw error;
  });

