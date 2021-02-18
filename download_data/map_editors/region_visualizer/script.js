// Global vars
var projection;
var region_table;
var cur_region = -1;
var map_container;
var c = [0, 0];
var country_list = [];

// MODIFICARE PER CAMBIARE LE DIMENSIONI DELLA MAPPA
var w = 800;
var h = 500;

var zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed);

function next() {
  cur_region = cur_region + 1;

  update();
}

function prev() {
  if (cur_region > 0) {
    cur_region = cur_region - 1;
  }
  update();
}

function update() {
  region_name = region_table[cur_region].Country;
  d3.select("#text").html(region_name);

  info_flie_path =
    "../../data/data_temp/" + region_name + "/" + region_name + "_info.json";
  d3.json(info_flie_path, function (error, info) {
    if (error) {
      console.log(error);
      throw error;
    }
    updateMap(info);
  });
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
      return d.id;
    })
    .attr("name", function (d) {
      country_list.push(d.properties.name);
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

  console.log(info.Name);
  console.log("LAT", info.LatitudeRange);
  console.log("LONG", info.LongitudeRange);

  p1 = projection([info.LongitudeRange[0], info.LatitudeRange[0]]); //sx alto
  p2 = projection([info.LongitudeRange[1], info.LatitudeRange[0]]); //dx alto
  p3 = projection([info.LongitudeRange[1], info.LatitudeRange[1]]); //dx basso
  p4 = projection([info.LongitudeRange[0], info.LatitudeRange[1]]); //sx basso

  //console.log(p1, p2, p3, p4);
  console.log("_________________________________");

  map_container
    .append("polygon")
    .attr("points", function (d) {
      return [p1, p2, p3, p4].join(",");
    })
    .attr("fill", "rgba(255,0,0,0.5)");

  // centro
  c = projection([
    (info.LongitudeRange[0] + info.LongitudeRange[1]) / 2,
    (info.LatitudeRange[0] + info.LatitudeRange[1]) / 2,
  ]);
  map_container
    .append("circle")
    .attr("cx", c[0])
    .attr("cy", c[1])
    .attr("r", 0.5)
    .attr("fill", "rgba(255,0,0,0.8)");

  map_container.transition().call(zoom.translateTo, c[0], c[1]);
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

d3.json("../../download_data/data/map/countries-10m.json", function (error, world) {
  if (error) {
    console.log(error);
    throw error;
  }

  console.log(world);
  let topology = world;
  topology = topojson.presimplify(topology);
  //topology = topojson.simplify(topology, 0.1);

  drawMap(topology);
  console.log(country_list.sort());
});

function find_in_list(el, list) {
  for (var i = 0; i < list.length; i++) {
    el2 = list[i];

    if (el2[el2.length - 1] == ".") el2 = el2.substring(0, el2.length - 1);

    if (el2 == el) return true;
  }
  return false;
}

function get_differece(smaller_list, bigger_list) {
  var difference_list = [];

  for (var i = 0; i < smaller_list.length; i++) {
    if (!find_in_list(smaller_list[i], bigger_list)) {
      difference_list.push(smaller_list[i]);
    }
  }

  return difference_list;
}

// Load CSV files
d3.csv("../../data/table.csv", function (error, csv) {
  if (error) {
    console.log(error);
    throw error;
  }

  csv.forEach(function (d) {
    // Convert numeric values to 'numbers'
    d.id = parseInt(d[""], 10);
  });

  //console.log(region_list);

  region_table = csv;
});

d3.csv("../../data_manipulaion/script compare/compare data/country_corrected.csv", function (error, csv) {
  if (error) {
    console.log(error);
    throw error;
  }

  csv.forEach(function (d) {
    // Convert numeric values to 'numbers'
    d.id = parseInt(d[""], 10);
    region_list.push(d.Country);
  });

  //console.log(region_list);

  region_table = csv;
});

function printCountries() {
  difference_list = get_differece(country_list, region_list);
  console.log("Countries not in region: \n\n");
  console.log(difference_list);
  console.log("Region not in countries: \n\n ");
  console.log(get_differece(region_list, country_list));
}
