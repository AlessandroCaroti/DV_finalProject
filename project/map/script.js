// *********************************************************** //
//                    START GLOBAL VARIABLE                    //

// MAP DIMANSION
var w_map = 1000;
const h_map = 500;

var projection;
var map_container;
var colorsRange = ["rgb(5, 48, 97)", "white", "rgb(103, 0, 31)"];
var colorScale;
var unknown_temp = "#999999"; // color indicating there is no data for such country in that year
var default_transition = 500;
var map_data;
var context;
//var colorsRange = ["blue", "white", "red"];

var geoGenerator;

var country_list_map = []; //List of the name of the countries present in the map

var selected_country = null;

// FILES & DIRECTORY PATH VARIABLE
map_file = "../../data/map/countries-10m_v34_6.json";
tmp_file_prefix = "../../data/years/";
tmp_file_suffix = "/Annual_mean.csv";
countries_file = "../../data/15_countries_list.csv";

//                    END GLOBAL VARIABLE                   //
// ******************************************************** //
// ******************************************************** //
//                START FUNCTION FOR THE MAP                //

function drawMap(world) {
  debug_log("DRAW-MAP");

  svg = d3.select("#svg-map").attr("height", h_map);
  map_container = svg.select("#map").call(zoom);

  var bBox = document.getElementById("svg-map").getBBox();

  projection = d3
    .geoNaturalEarth1()
    .scale(140)
    .translate([bBox.width / 2, h_map / 2]);

  geoGenerator = d3.geoPath().projection(projection);

  drawGlobeBackground();

  // Draw the background (country outlines)
  map_container
    .selectAll("path.country")
    .data(topojson.feature(world, world.objects.countries).features)
    .enter()
    .append("path")
    .attr("class", "country")
    .attr("id", (d) => {
      country_list_map.push(d.properties.name);
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

  var gridLines = map_container
    .select("#map_graticule")
    .selectAll("path")
    .data(graticule.lines());
  gridLines
    .enter()
    .append("path")
    .classed("grat_2", true)
    .attr("d", geoGenerator);
}

function drawGlobeBackground() {
  map_container
    .select(".background_globe")
    .datum({ type: "Sphere" })
    .attr("d", geoGenerator);
}

function update_colors(temperatures, time_trasition) {
  // define the transition
  var temp_transition = d3
    .transition()
    .duration(time_trasition)
    .ease(d3.easeLinear);

  // set new anomalies
  temperatures.forEach(function (d) {
    var element = document.getElementById(d.Country);

    // update anomaly color
    d3.select(element)
      .transition(temp_transition)
      .style("fill", colorScale(d["ANOMALY"]));

    // update anomaly value
    d3.select(element).attr("anomaly", d["ANOMALY"]);

    // update tooltip
    let tooltip = d3.select(".tooltip-map");
    if (tooltip.select(".tooltip-name").html() === d.Country) {
      tooltip
        .select(".tooltip-anomaly")
        .datum(d["ANOMALY"])
        .html((d) => {
          if (
            typeof d != "undefined" &&
            d != null &&
            d != "NaN" &&
            !Number.isNaN(d)
          ) {
            return parseFloat(d).toFixed(2) + " °C";
          }
          return "unknown";
        });
    }
  });
}

function country_events() {
  //MOUSE-OVER EVENT: highlighted country when the mouse is over
  map_container.selectAll(".country").on("mouseenter", function (event, b) {
    d3.select(this)
      .raise()
      .classed("highlighted_country", true)
      .style("stroke-width", borderCountryScale(curr_zoomScale) * over_stroke); // increase stroke width to make country more visible
  });

  map_container.selectAll(".country").on("mouseleave ", function (event, b) {
    d3.select(".highlighted_country").classed("highlighted_country", false);
    d3.select(".selected_country").moveToFront();

    // hide tooltip
    d3.select(".tooltip-map").style("display", "none");

    // reset the stroke width to the original one
    var orginal_stroke = borderCountryScale(curr_zoomScale);
    if (b === selected_country) {
      orginal_stroke = orginal_stroke * selected_stroke;
    }
    d3.select(this).style("stroke-width", orginal_stroke);
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

      d3.select(".tooltip-map")
        .select(".tooltip-anomaly")
        .datum(anomaly)
        .html((d) => {
          if (
            typeof d != "undefined" &&
            d != null &&
            d != "NaN" &&
            !Number.isNaN(d)
          ) {
            return parseFloat(d).toFixed(2) + " °C";
          }
          return "unknown";
        });
    })
    .on("mousemove", function (event, b) {
      // update position tooltip
      d3.select(".tooltip-map")
        .style("top", event.pageY + 13 + "px")
        .style("left", event.pageX + 13 + "px");
    });

  //CLICK EVENT: on country
  map_container.selectAll(".country").on("click", function (event, b) {
    //deselect the previus country
    d3.select(".selected_country").style(
      "stroke-width",
      borderCountryScale(curr_zoomScale)
    );
    d3.select(".selected_country").classed("selected_country", false);

    d3.select(this).classed("selected_country", true);
    d3.select(this).moveToFront();
    d3.select(this).style(
      "stroke-width",
      borderCountryScale(curr_zoomScale) * selected_stroke
    );

    // set the name visible in the drop-down menu TODO
    $("#selectCountryMenu").val(String(this.id));
    $("#selectCountryMenu").trigger("change");

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
  curr_zoomScale = 1;

var zoom = d3
  .zoom()
  .scaleExtent([1, max_zoom])
  .on("zoom", (event) => {
    curr_zoomScale = event.transform.k;

    if (curr_zoomScale != 1) {
      initial_view = false;
    } else {
      initial_view = event.transform.x + event.transform.y == 0;
    }
    console.log(initial_view);
    update_middle_zoomBtn();

    //map_container.attr("transform", event.transform);
    map_container.selectAll("path").attr("transform", event.transform);

    // hide tooltip
    d3.select(".tooltip-map").style("display", "none");

    // change border width
    update_strokes(curr_zoomScale);
  })
  .on("end", function (event) {
    // show tooltip if hovering a country
    let cur_country = map_container.select(".highlighted_country");

    if (!cur_country.empty())
      d3.select(".tooltip-map").style("display", "block");
  });

function reset_zoom() {
  map_container
    .transition()
    .duration(1000)
    .call(function (selection) {
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
    scale = Math.max(
      1,
      Math.min(max_zoom, 0.9 / Math.max(dx / w_map, dy / h_map))
    ),
    translate = [w_map / 2 - scale * x, h_map / 2 - scale * y];

  map_container
    .transition()
    .duration(1000)
    .call(function (selection) {
      zoom.transform(
        selection,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
    });
}

function update_middle_zoomBtn(){
  if (!initial_view) {
    set_globe_icon();
  } else if (selected_country != null) {
    no_zoom();
  }
}

//                      END ZOOM SECTION                    //
// ******************************************************** //
// ******************************************************** //
//                    STRAT STROKE WIDTH                    //
var over_stroke = 3.0;
var selected_stroke = 4.0;

var borderCountryScale = d3
  .scaleLinear()
  .domain([1, max_zoom])
  .range([0.5, 0.2]);

var widthGridScale = d3.scaleLinear().domain([1, max_zoom]).range([0.3, 0.2]);

function update_strokes(new_val) {
  var new_strokeWidth = borderCountryScale(curr_zoomScale);
  //update country
  map_container
    .selectAll("path.country")
    .style("stroke-width", new_strokeWidth);

  //update gridline
  map_container.selectAll("path.grat_2").style("stroke-width", new_strokeWidth);

  //update over
  map_container
    .select(".highlighted_country")
    .style("stroke-width", new_strokeWidth * over_stroke);

  //update selected
  map_container
    .select(".selected_country")
    .style("stroke-width", new_strokeWidth * selected_stroke);
}

//                     END STROKE WIDTH                     //
// ******************************************************** //
// ******************************************************** //
//                START FUNCTION MAP OVERLAY                //
var initial_view = true;

function init_map_controls() {
  init_zoomBtns();
  init_animationBtn();
  init_yearSpace();
}

function changeView() {
  if (!initial_view) {
    debug_log("RESET_ZOOM");
    reset_zoom();
  } else if (selected_country != null) {
    debug_log("ZOOM COUNTRY");
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

function init_animationBtn() {
  d3.select("#animation")
    .select("path")
    .on("click", function (event, b) {
      debug_log("ANIMATION");
      control_animation();
    });

  play();
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

//                 END FUNCTION MAP OVERLAY                 //
// ******************************************************** //
// ******************************************************** //
//                   START DROP_DOWN MENU                   //

function init_DropDownMenu_slect2() {
  d3.csv(countries_file)
    .then(function (countries) {
      data = [];

      countries.forEach((d) => {
        data.push(d.Temp);
      });

      $("#selectCountryMenu")
        .select2({
          placeholder: "Select an option",
          data: data,
          theme: "classic",
          allowClear: true,
        })
        .on("select2:unselecting", function () {
          $(this).data("unselecting", true);
        })
        .on("select2:opening", function (e) {
          if ($(this).data("unselecting")) {
            $(this).removeData("unselecting");
            e.preventDefault();
          }
        })
        .on("select2:select", function (e) {
          var data = e.params.data;
          console.log(data.text);
          changeCountry(data.text);
          changeAllData(data.text, false);
        });
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });
}

// UPDATE COUNTRY
function changeCountry(name) {
  console.log("SELECTED COUNTRY: " + name);

  // find path
  country = document.getElementById(name);

  // fake click()
  var evObj = document.createEvent("Events");
  evObj.initEvent("click", true, false);
  country.dispatchEvent(evObj);
}

//                    END DROP_DOWN MENU                    //
// ******************************************************** //
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
      map_data = world;

      let topology = world;
      topology = topojson.presimplify(topology);
      topology = topojson.simplify(topology, 0.05);

      drawMap(topology);
      load_tempYear(
        tmp_file_prefix + "2020" + tmp_file_suffix,
        default_transition
      );

      //init_dropdown_menu();
      //init_DropDownMenu_slect2();
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

/*
function init_page() {
  // load map
  load_map();

  // set colorscale and  legend
  set_colorScale();
  draw_legend();

  // trovare modo automatico per trovare min e max
  init_slider(1743, 2020, 1);
  init_DropDownMenu_slect2();

  init_map_controls();
}
*/
