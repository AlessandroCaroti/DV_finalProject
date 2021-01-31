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
var country_list = []; //List of the name of the countries present in the map

var selected_country = null;

var zoom = d3
  .zoom()
  .on("zoom", (event) => {
    map_container.attr("transform", event.transform);
  })
  .scaleExtent([1, 8]);

// FILES & DIRECTORY PATH VARIABLE
map_file = "../../data/countries-50m.json";
tmp_file = "../../data/data_year/2019/Annual_mean.csv";

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
  //[-2.5168333333333335, 3.1985000000000006] [-2.5169, 0, +3.1986]

  var colorScale = d3
    .scaleLinear()
    //.domain([-5, 0, +5])
    .domain([-2.5169, 0, +3.1986])
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
  selected_country = country;

  zoom_in(selected_country);
  // update the button that manage the zoom
  global_view = false;
  changeImage_view();
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

function reset_zoom() {
  map_container
    .transition()
    .duration(1000)
    .call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1));
}

//                 END FUNCTION FOR THE MAP                 //
// ******************************************************** //
// ******************************************************** //
//                START FUNCTION MAP CONTROL                //

function init_map_controls() {
  over_viwe();
  click_viwe();
}

//CHANGE VIEW
var global_view = false; //if TRUE => the current view of the map is global (NO ZOOM)
const global_img = "../../data/images/globe_32px.ico";
const country_img = "../../data/images/country_32px.ico";

//EVENT OVER
function over_viwe() {
  d3.select("#change_view_img").on("mouseover", function (event, b) {
    d3.select("#change_view_btn").style("fill", "Gainsboro");
  });
  d3.select("#change_view_img").on("mouseleave", function (event, b) {
    d3.select("#change_view_btn").style("fill", "none");
  });
}

function changeImage_view() {
  if (selected_country == null) {
    global_view = !global_view;
    console.log("NESSUNO STATO SELEZIONARO");
    console.log("IMPOSSIBILE CAMBIARE LA VISTA");
  } else {
    if (global_view) {
      d3.select("#change_view_img").attr("xlink:href", country_img);
      console.log("RESET ZOOM");
      reset_zoom();
    } else {
      d3.select("#change_view_img").attr("xlink:href", global_img);
      console.log("ZOOM IN");
      zoom_in(selected_country);
    }
  }
}

//EVENT CLICK
function click_viwe() {
  d3.select("#change_view_img").on("click", function (event, b) {
    global_view = !global_view;
    changeImage_view();
  });
}

//                END FUNCTION MAP CONTROL                //
// ****************************************************** //

// UPDATE YEAR
function init_slider(min, max){

  var sliderAlternativeHandle = d3
    .sliderBottom()
    .min(min)
    .max(max)
    .step(1)
    .width(400)
    .tickFormat(d3.format('0'))
    .ticks(10)
    .default(0.015)
    .handle(
      d3
        .symbol()
        .type(d3.symbolCircle)
        .size(200)()
    )
    .on('onchange', val => {
      d3.select('p#sliderLabel').text("Year: " + d3.format('0')(val));
    });

  var g2 = d3
    .select('div#sliderYear')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  g2.call(sliderAlternativeHandle);

  d3.select('p#sliderLabel').text("Year: " + sliderAlternativeHandle.value());
  
  //d3.select("g#parameter-value").selectAll("text").attr("y", "-30");

}

// LOAD COUNTRIES MENU
function init_dropdown_menu(list_countries){

  var countries = d3.select("datalist#countryList")
                              .selectAll("option")
                              .data(list_countries);
  countries.enter()
            .append("option")
            .attr("value", (d) => d);

}

// select slider
/*var slider = document.getElementById("selectYear");
var output = document.getElementById("outputYear");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.innerHTML = this.value;

  // cosa deve fare se un anno è selezionato???
};*/

// UPDATE COUNTRY
function changeCountry() {
  console.log("bubi");
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
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
}

// **************************************************** //
//                  DOVE INIZIA TUTTO                  //

load_tempYear(tmp_file);

init_map_controls();

init_slider(1700, 2020);

console.log(country_list.length);
init_dropdown_menu(["Internet Explorer", "Firefox", "Chrome", "Opera", "Safari"]); // non riesco ad usare country_list mannaggia al clero, perchè cazzo dice che non ha elementi???!!!