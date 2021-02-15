var projection;
var map_container;
var svg;
pol_num = -1;
tot_plo = 0;
// MODIFICARE PER CAMBIARE LE DIMENSIONI DELLA MAPPA
var w = 800;
var h = 500;
var c = [0, 0];
var max_zoom = 20;

var highlights_Country = "U.S. Virgin Is.";

var zoom = d3.zoom().scaleExtent([1, max_zoom]).on("zoom", zoomed);

var scale = d3.scaleLinear().domain([0, max_zoom]).range([3, 0.1]);

var selcted_country;

d3.json("../../download_data/data/map/countries-10m_V31.json", function (error, world) {
  if (error) {
    console.log("ERRORE", error);
    throw error;
  }
  console.log(world.objects.countries.geometries);
  console.log(world.objects.countries.geometries[22]);
  draw_all(world);

  id_nation = 850;
  test(world, id_nation);
});

function test(world, id) {
  data = topojson.feature(world, world.objects.countries).features;

  data.forEach((element) => {
    if (element.id == id) {
      selcted_country = element;
      console.log(element);
      tot_plo = element.geometry.coordinates.length;
      console.log("ID:", element.id);
      console.log("Name:", element.properties.name);
      console.log("Number of ploygon:", tot_plo);

      draw([element]);
    }
  });
}

function draw_all(world) {
  svg = d3.select("#svg-map").attr("width", w).attr("height", h);
  map_container = svg.select("#map");

  projection = d3
    .geoEquirectangular()
    .scale(120)
    .translate([w / 2, h / 2]);
  var geoGenerator = d3.geoPath().projection(projection);

  // Draw the background (country outlines)
  map_container
    .selectAll("path")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("name", function (d) {
      if (d.properties.name == highlights_Country) {
        d3.select(this).style("fill", "rgb(255,0,255)");
      }
      return d.properties.name;
    })
    .attr("d", geoGenerator);
}

function draw(data) {
  svg = d3.select("#svg-map").attr("width", w).attr("height", h);
  map_container = svg.select("#map2");

  projection = d3
    .geoEquirectangular()
    .scale(120)
    .translate([w / 2, h / 2]);
  var geoGenerator = d3.geoPath().projection(projection);

  map_container
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "country country_selected")
    .attr("d", geoGenerator);
}

/* ################################################################# */
// ZOOM
var zoom_scale = 1;
function zoomed() {
  d3.select("#all-map").attr("transform", d3.event.transform);
}

function zoomManager() {
  d3.select("#zoom-in").on("click", function () {
    d3.select("#all-map").transition().duration(0).call(zoom.scaleBy, 1.2);
    if (zoom_scale < max_zoom) {
      zoom_scale += 1;
    }
    d3.selectAll("circle").attr("r", scale(zoom_scale));
  });

  d3.select("#zoom-out").on("click", function () {
    d3.select("#all-map").transition().duration(0).call(zoom.scaleBy, 0.8);
    if (zoom_scale > 0) {
      zoom_scale += 1;
    }
    d3.selectAll("circle").attr("r", scale(zoom_scale));
  });
  d3.select("#zoom-reset").on("click", function () {
    origin = projection([0, 0]);
    zoom_scale = 1;
    d3.select("#all-map")
      .transition()
      .duration(0)
      .call(zoom.translateTo, origin[0], origin[1])
      .transition()
      .call(zoom.scaleTo, 1);
    d3.selectAll("circle").attr(scale(zoom_scale));
  });
}
zoomManager();
// END ZOOM
/* ################################################################# */
/* ################################################################# */
// STRAT - NEXT & PREV

function next() {
  pol_num = (pol_num + 1) % tot_plo;
  update();
}

function prev() {
  if (pol_num > 0) {
    pol_num = pol_num - 1;
  }
  update();
}

function update() {
  d3.select("#pol").html("Poligon num: " + pol_num);
  d3.select("#arcs").html(
    "Poligon num: " +
      selcted_country.geometry.coordinates[Math.abs(pol_num)][0].length
  );

  if (selcted_country.geometry.coordinates.length == 1) {
    c = projection(selcted_country.geometry.coordinates[Math.abs(pol_num)][0]);
  } else {
    c = projection(
      selcted_country.geometry.coordinates[Math.abs(pol_num)][0][0]
    );
  }
  d3.select("#all-map").transition().call(zoom.translateTo, c[0], c[1]);

  d3.select("#map2").selectAll("circle").remove();
  d3.select("#map2")
    .append("circle")
    .attr("cx", c[0])
    .attr("cy", c[1])
    .attr("r", scale(zoom_scale))
    .attr("fill", "rgb(0,255,0)");
}

// END - NEXT & PREV
/* ################################################################# */
