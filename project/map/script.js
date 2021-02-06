// *************************************************** //
//                START GLOBAL VARIABLE                //

// MAP DIMANSION
var w = 1000;
var h = 500;

var projection;
var map_container;
var colorsRange = ["rgb(5, 48, 97)", "white", "rgb(103, 0, 31)"];
//var colorsRange = ["blue", "white", "red"];

var geoGenerator;

var tmp_data;
var country_list = new Array(); //List of the name of the countries present in the map

var selected_country = null;

var zoom = d3
  .zoom()
  .on("zoom", (event) => {
    map_container.attr("transform", event.transform);
  })
  .scaleExtent([1, 8]);

// FILES & DIRECTORY PATH VARIABLE
map_file = "../../data/countries-50m.json";
tmp_file_prefix = "../../data/data_year/";
tmp_file_suffix = "/Annual_mean.csv";

//                    END GLOBAL VARIABLE                   //
// ******************************************************** //
// ******************************************************** //
//                START FUNCTION FOR THE MAP                //

function drawMap(world) {
  console.log("DRAW-MAP");

  svg = d3.select("#svg-map").attr("width", "100%").attr("height", h); //.call(zoom);
  map_container = svg.select("#map");

  projection = d3
    //.geoEquirectangular()
    //.geoMercator()
    //.geoEqualEarth()
    .geoNaturalEarth1()
    .scale(120)
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
      country_list.push(d.properties.name);
      return d.properties.name;
    })
    .attr("d", geoGenerator);

  // Draw gridlines
  drwaGridlines();

  //Associate to each county a color proportionate to it's anomaly
  update_colors();

  //Define the events of the countries(Es, mouseover, click...)
  country_events();
}

function drwaGridlines() {
  var graticule = d3.geoGraticule();

  var maps = map_container.selectAll("path.grat_2").data(graticule.lines());
  maps.enter().append("path").classed("grat_2", true).attr("d", geoGenerator);
}

function update_colors() {
  //GLOBAL MIN & MAX
  // [-2.998, +3.7969999999999997]

  var colorScale = d3
    .scaleLinear()
    //.domain([-5, 0, +5])
    .domain([-3.0, 0, +3.8])
    .range(colorsRange);

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
    d3.select(".selected_country").moveToFront();

    // revome tooltip
    //map_container.select(".tooltip")
  });

  // MOUSE-OVER: tooltip
  map_container.selectAll(".country")
                .on("mouseover", function (event, b) {
                        // show tooltip
                        let coord = d3.pointer(event);
                        let x= coord[0]
                        let y = coord[1];

                        d3.select(".tooltip")
                          .style("top", event.pageY + "px")
                          .style("left", event.pageX  + "px" )
                          .style("display", "block")
                          .html("PINOOOOOO")
                })
                .on("mousemove", function(event,b ){
                        // update position tooltip
                        let coord = d3.pointer(event);
                        let x= coord[0]
                        let y = coord[1];

                        d3.select(".tooltip")
                          .style("top", event.pageY + "px")
                          .style("left", event.pageX  + "px" )
                })

  //CLICK EVENT:
  map_container.selectAll(".country").on("click", function (event, b) {
    //deselect the previus country
    d3.select(".selected_country").classed("selected_country", false);

    d3.select(this).classed("selected_country", true);
    d3.select(this).moveToFront();
    d3.select("#selectCountry").attr("value", this.id);

    debug_log("CLICK ON "+this.id);
    country_selected(this.__data__);
  });
}

function country_selected(country) {
  selected_country = country;

  zoom_in(selected_country);
  // update the button that manage the zoom
  global_view = false;
  changeImage_view();
}

//                 END FUNCTION FOR THE MAP                 //
// ******************************************************** //
// ******************************************************** //
//                    START ZOOM SECTION                    //
var zoomIn_scale = 1.2
var zoomOut_scale = 0.8

function reset_zoom() {
  map_container
    .transition()
    .duration(1000)
    .call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));
}

function zoom_in(country) {
  var bounds = geoGenerator.bounds(country),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / w, dy / h))),
    translate = [w / 2 - scale * x, h / 2 - scale * y];

  map_container
    .transition()
    .duration(1000)
    .call(
      zoom.transform,
      d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
}

//                      END ZOOM SECTION                    //
// ******************************************************** //
// ******************************************************** //
//                START FUNCTION MAP OVERLAY                //

function init_map_controls() {
  init_zoomBtns();
}

//CHANGE VIEW
var global_view = false; //if TRUE => the current view of the map is global (NO ZOOM)
const global_img = "../../data/images/globe_32px.ico";
const country_img = "../../data/images/country_32px.ico";

function changeImage_view() {
  if (selected_country == null) {
    global_view = !global_view;
    debug_log("No country selected. Impossible to change the view!");
  } else {
    if (global_view) {
      debug_log("RESET_ZOOM")
      no_zoom();
      reset_zoom();
    } else {
      debug_log("ZOOM COUNTRY")
      local_zoom();
      zoom_in(selected_country);
    }
  }
}

function init_zoomBtns() {
  d3.select("#zoom-reset")
    .select("rect")
    .on("click", function (event, b) {
      global_view = !global_view;
      changeImage_view();
    });

  d3.select("#zoom-in")
    .select("path")
    .on("click", function (event, b) {
      debug_log("ZOOM_IN");
      map_container.transition().call(zoom.scaleBy, zoomIn_scale);
    });

  d3.select("#zoom-out")
    .select("path")
    .on("click", function (event, b) {
      debug_log("ZOOM_OUT");
      map_container.transition().call(zoom.scaleBy, zoomOut_scale);
    });
}

// funtion to move path in front of the charts
d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

//                END FUNCTION MAP CONTROL                //
// ****************************************************** //


// LOAD SLIDER YEAR
function init_slider(min, max) {
  var sliderAlternativeHandle = d3
    .sliderBottom()
    .min(min)
    .max(max)
    .step(1)
    .width(500)
    .tickFormat(d3.format("0"))
    .ticks(7)
    .default(2019)
    .handle(d3.symbol().type(d3.symbolCircle).size(200)())
    .on("end", (val) => {
      d3.select("#sliderLabel").text("Year: " + d3.format("0")(val));
      load_tempYear(tmp_file_prefix + val + tmp_file_suffix);
    });

  var g2 = d3
    .select("div#sliderYear")
    .append("svg")
    .attr("width", 600)
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(40,40)");

  g2.call(sliderAlternativeHandle);

  d3.select("#sliderLabel").text("Year: " + sliderAlternativeHandle.value());

  d3.select("div#sliderYear")
    .select("g .parameter-value")
    .select("text")
    .attr("y", -35);
}

// LOAD COUNTRIES MENU
function init_dropdown_menu(list_countries) {
  var countries = d3
    .select("datalist#countryList")
    .selectAll("option")
    .data(list_countries);
  countries.exit().remove();

  countries
    .enter()
    .merge(countries)
    .append("option")
    .attr("value", (d) => d);
}

// MAKE LEGEND
function init_legend() {
  return;
}

// UPDATE COUNTRY
function changeCountry() {
  var listInput = document.getElementById("selectCountry");

  // get country name
  var name = listInput.value;

  console.log("SELECTED COUNTRY: " + name);

  //check is a country is selected
  if (name.length == 0) return;

  // find path
  country = document.getElementById(name);

  // fake click()
  var evObj = document.createEvent("Events");
  evObj.initEvent("click", true, false);
  country.dispatchEvent(evObj);
}

// **************************************************** //
//                    FILES LOADING                    //

function load_tempYear(temp_file) {
  d3.csv(temp_file)
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
}

function load_map() {
  d3.json(map_file)
    .then((world) => {
      console.log("LOAD MAP");

      let topology = world;
      topology = topojson.presimplify(topology);
      topology = topojson.simplify(topology, 0.05);

      drawMap(topology);
      init_dropdown_menu(country_list);

    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

// **************************************************** //
//                  DOVE INIZIA TUTTO                  //

function init_page() {
  load_tempYear(tmp_file_prefix + "2019" + tmp_file_suffix);

  init_map_controls();
  // trovare modo automatico per trovare min e max
  init_slider(1743, 2020);
}
