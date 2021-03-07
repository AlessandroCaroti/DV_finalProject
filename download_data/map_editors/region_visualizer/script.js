// Global vars
var projection;
var region_table;
var map_container;
var curr_polygon = -1;
var c = [0, 0];

var ragion_name = "Norway";

// MODIFICARE PER CAMBIARE LE DIMENSIONI DELLA MAPPA
var w = 1000;
var h = 600;

var zoom = d3.zoom().scaleExtent([1, 20]).on("zoom", zoomed);

function next() {
  curr_polygon ++;
  update();
  console.log(curr_polygon)
}

function prev() {
  curr_polygon --;
  console.log(curr_polygon)
  update();
}

function update() {
  clearMap();

  c = projection(d3.select("#"+ragion_name)._groups[0][0].__data__.geometry.coordinates[curr_polygon][0][0])

  map_container.append("circle").attr("r",1).attr("cx", c[0]).attr("cy",c[1]).style("fill", "red");
  map_container.transition().call(zoom.translateTo, c[0], c[1]);
}

function drawMap(world) {
  svg = d3.select("#svg-map").attr("width", w).attr("height", h);
  map_container = svg.select("#map");

  projection = d3
    .geoEquirectangular()
    .scale(120)
    .translate([w / 2, h / 2]);

  // ******* PART IV *****
  var geoGenerator = d3.geoPath().projection(projection);

  // Draw the background (country outlines)
  map_container
    .selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("id", function (d) {
      return d.properties.name;
    })
    .attr("d", geoGenerator);

  map_container.selectAll(".country").on("click", function (d) {
    text = "ISO-code: " + d.id + " -- Name: " + d3.select(this).attr("name");
    console.log(d3.select(this));

    d3.select("#selected").html(text);
  });

  c = projection([0, 0]);
}

/**
 * Clears the map
 */
function clearMap() {
  map_container.selectAll("polygon").remove();
  map_container.selectAll("circle").remove();
}

function updateMap(info) {
  //Clear any previous selections;
  clearMap();
}

/* ################################################################# */
// ZOOM
function zoomed() {
  map_container.attr("transform", d3.event.transform);
}

function zoomManager() {
  d3.select("#zoom-in").on("click", function () {
    map_container.transition().call(zoom.scaleBy, 1.2);
  });

  d3.select("#zoom-out").on("click", function () {
    map_container.transition().call(zoom.scaleBy, 0.8);
  });
  d3.select("#zoom-reset").on("click", function () {
    origin = projection([0, 0]);
    map_container
      .transition()
      .call(zoom.translateTo, origin[0], origin[1])
      .transition()
      .call(zoom.scaleTo, 1);
  });
}
zoomManager();

/* ################################################################# */
// LOAD

var region_list = [];

d3.json("../../data/map/countries-10m_V34.json", function (error, world) {
  if (error) {
    console.log(error);
    throw error;
  } 

  console.log(world);
  let topology = world;
  topology = topojson.presimplify(topology);
  topology = topojson.simplify(topology, 0.01);

  drawMap(topology);
});
