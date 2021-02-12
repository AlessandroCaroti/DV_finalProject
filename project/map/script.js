// *********************************************************** //
//                    START GLOBAL VARIABLE                    //

// MAP DIMANSION
var w = 1000;
const h = 500;

var projection;
var map_container;
var colorsRange = ["rgb(5, 48, 97)", "white", "rgb(103, 0, 31)"];
var colorScale;
var unknown_temp = "#999999" // color indicating there is no data for such country in that year
var default_transition = 500;
//var colorsRange = ["blue", "white", "red"];

var geoGenerator;

var tmp_data;
var country_list = new Array(); //List of the name of the countries present in the map

var selected_country = null;

// FILES & DIRECTORY PATH VARIABLE
map_file = "../../data/countries-50m.json";
tmp_file_prefix = "../../data/data_year/";
tmp_file_suffix = "/Annual_mean.csv";

//                    END GLOBAL VARIABLE                   //
// ******************************************************** //
// ******************************************************** //
//                START FUNCTION FOR THE MAP                //

function drawMap(world) {
  debug_log("DRAW-MAP");

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

  drawGlobeBackground();

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
  drawGridlines();

  //Define the events of the countries(Es, mouseover, click...)
  country_events();
}

function drawGridlines() {
  var graticule = d3.geoGraticule();

  var maps = map_container.selectAll("path.grat_2").data(graticule.lines());
  maps.enter().append("path").classed("grat_2", true).attr("d", geoGenerator);
}

function modeFrontGrid(){
  d3.selectAll(".grat_2").moveToFront();
}

function drawGlobeBackground() {
  map_container
    .select(".background_globe")
    .datum({ type: "Sphere" })
    .attr("d", geoGenerator);
}

function update_colors(temperatures, time_trasition) {

  // define the transition
  var temp_transition = d3.transition()
                            .duration(time_trasition)
                            .ease(d3.easeLinear);

  // set new anomalies
  temperatures.forEach(function (d) {
    var element = document.getElementById(d.Country);
    
    if (typeof element != "undefined" && element != null) {

      // update anomaly color
      d3.select(element).transition(temp_transition)
                        .style("fill", colorScale(d["ANOMALY"]));

      // update anomaly value
      d3.select(element).attr("anomaly", d["ANOMALY"]);
    }
    
  });
}

function country_events() {
  //MOUSE-OVER EVENT: highlighted country when the mouse is over
  map_container.selectAll(".country").on("mouseenter", function (event, b) {

    // move to front the gridlines
    modeFrontGrid();

    //d3.select(this).raise();

    d3.select(this).classed("highlighted_country", true);
  });

  map_container.selectAll(".country").on("mouseleave ", function (event, b) {
    d3.select(".highlighted_country").classed("highlighted_country", false);
    d3.select(".selected_country").moveToFront();

    // hide tooltip
    d3.select(".tooltip-map").style("display", "none");

    // move to front the gridlines
    modeFrontGrid();
  });

  // MOUSE-OVER: tooltip
  map_container
    .selectAll(".country")
    .on("mouseover", function (event, b) {

      let anomaly = d3.select(this).attr("anomaly");

      // show tooltip
      d3.select(".tooltip-map")
        .style("top", event.pageY + 13 + "px")
        .style("left", event.pageX + 13 + "px")
        .style("display", "block")
        .select(".tooltip-name")
        .html(b.properties.name);

      d3.select(".tooltip-map").select(".tooltip-anomaly").datum(anomaly)
        .html(d =>{
          if (typeof d != "undefined" && d != null && d != "NaN"){
              return parseFloat(d).toFixed(2) + " °C";
          }
          return "unknown"
        });
        
    })
    .on("mousemove", function (event, b) {
      // update position tooltip
      d3.select(".tooltip-map")
        .style("top", event.pageY + 13 + "px")
        .style("left", event.pageX + 13 + "px");
    });

  //CLICK EVENT:
  map_container.selectAll(".country").on("click", function (event, b) {

    // move to front the gridlines
    modeFrontGrid();

    //deselect the previus country
    d3.select(".selected_country").classed("selected_country", false);

    d3.select(this).classed("selected_country", true);
    d3.select(this).moveToFront();
    d3.select("#selectCountry").attr("value", this.id);

    debug_log("CLICK ON " + this.id);
    country_selected(this.__data__);
  });
}

function country_selected(country) {
  selected_country = country;
  zoom_in(selected_country);
}

//                 END FUNCTION FOR THE MAP                 //
// ******************************************************** //
// ******************************************************** //
//                    START ZOOM SECTION                    //

var max_zoom = 8;
var zoomIn_scale = 1.2,
  zoomOut_scale = 0.8,
  zommed = false;

var borderCountryScale = d3.scaleLinear()
                              .domain([1, max_zoom]) 
                              .range([0.5, 0.2]);

var widthGridScale = d3.scaleLinear()
                              .domain([1, max_zoom])
                              .range([0.3, 0.2]);

var zoom = d3
  .zoom()
  .on("zoom", (event) => {
    zommed = event.transform.k != 1.0;
    map_container.attr("transform", event.transform);

    // change border width
    map_container.selectAll("path.country").style("stroke-width", borderCountryScale(event.transform.k) + "px");
    map_container.selectAll("path.grat_2").style("stroke-width", widthGridScale(event.transform.k) + "px");
  })
  .scaleExtent([1, max_zoom]);

function reset_zoom() {
  map_container
    .transition()
    .duration(1000)
    .call(function(selection){
      zoom.transform(selection, d3.zoomIdentity.translate(0, 0).scale(1));
    });
}

function zoom_in(country) {
  debug_log("ZOOM IN " + country.properties.name);

  var bounds = geoGenerator.bounds(country),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    scale = Math.max(1, Math.min(max_zoom, 0.9 / Math.max(dx / w, dy / h))),
    translate = [w / 2 - scale * x, h / 2 - scale * y];

  
  map_container
    .transition()
    .duration(1000)
    .call(function(selection){
      zoom.transform(selection, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
    });
    
}

//                      END ZOOM SECTION                    //
// ******************************************************** //
// ******************************************************** //
//                START FUNCTION MAP OVERLAY                //

function init_map_controls() {
  init_zoomBtns();
  init_yearSpace();
}

function changeView() {
  console.log(zommed);
  if (zommed) {
    debug_log("RESET_ZOOM");
    no_zoom();
    reset_zoom();
  } else if (selected_country != null) {
    debug_log("ZOOM COUNTRY");
    local_zoom();
    zoom_in(selected_country);
  }
}

function init_zoomBtns() {
  d3.select("#zoom-reset")
    .select("rect")
    .on("click", function (event, b) {
      changeView();
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

function init_yearSpace() {
  var bBox = document.getElementById("sliderLabel").getBBox();

  var gap = 40,
    w_1 = bBox.width + gap * 2,
    w_2 = bBox.width,
    x = bBox.x - gap;

  d3.select(".col-sm-2")
    .select("path")
    .attr("d", roundedFigure_1(x, -1, w_1, w_2, 37))
    .style("fill", "rgb(202, 202, 202)")
    .style("stroke", "black")
    .style("stroke-width", 1.5);
}

// funtion to move path in front of the charts
d3.selection.prototype.moveToFront = function () {
  return this.each(function () {
    this.parentNode.appendChild(this);
  });
};

//                END FUNCTION MAP OVERLAY                //
// ****************************************************** //


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

// ******************************************************** //
//                   START FILES LOADING                    //

function load_tempYear(temp_file, time_transition) {
  d3.csv(temp_file)
    .then(function (data) {
      console.log("LOAD TEMP: " + temp_file);

      data.forEach((d) => {
        d.ANOMALY = parseFloat(d.Anomaly);
      });

      //Associate to each county a color proportionate to it's anomaly
      update_colors(data, time_transition);
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
      load_tempYear(tmp_file_prefix + "2019" + tmp_file_suffix, default_transition);
      init_dropdown_menu(country_list);
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

//                   END FILES LOADING                    //
// ****************************************************** //
// ****************************************************** //
//                   DOVE INIZIA TUTTO                    //

function init_page() {

  // load map
  load_map();

  // set colorscale and  legend
  set_colorScale();
  draw_legend();

  // trovare modo automatico per trovare min e max
  init_slider(1743, 2020, 1);
  
  init_map_controls();

  //set_value_slider(1800);
  //animation_years();
}
