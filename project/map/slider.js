
var sliderAlternativeHandle;
var step_slider;
var min_slider;
var max_slider;
var id_slider = "draggable";

// variable useful for the animation
var animation_func;
var cur_year;
var animation_duration = 2.4 // in minutes

// LOAD SLIDER YEAR
function init_slider(min, max, step) {

  step_slider = step;
  min_slider = min;
  max_slider = max;

  sliderAlternativeHandle = d3
    .sliderBottom()
    .min(min)
    .max(max)
    .step(step)
    .width(500)
    .tickFormat(d3.format("0"))
    .ticks(7)
    .default(2020)
    .handle(d3.symbol().type(d3.symbolCircle).size(200)())
    .on("end", (val) => {
      d3.select("#sliderLabel").text("Year: " + d3.format("0")(val));
      load_tempYear(val , default_transition);
    });

  var g2 = d3
    .select("div#sliderYear")
    .append("svg")
    .attr("width", "100%")
    .attr("height", 100)
    .append("g")
    .attr("transform", "translate(40, 70)");

  g2.call(sliderAlternativeHandle);

  d3.select("#sliderLabel").text("Year: " + sliderAlternativeHandle.value());

  d3.select("div#sliderYear")
    .select("g .parameter-value")
    .select("text")
    .attr("y", -35)
    .classed("hover", false)
    .classed("not-hover", true);

  // aesthetic adjustment
  d3.select(".axis")
    .selectAll("text")
    .attr("y", "10");

  d3.select("#svg-slider")
    .style("width", "600px");

  // setting an id to the slider
  d3.select("g.parameter-value").select("path")
    .attr("id", id_slider)
    .style("outline", "none");

  // scroll wheel event
  d3.select("#sliderYear")
    .on("mousewheel", function (event) {

      // da gestire in modo diverso, col mouse si muove di due in due
      let val = sliderAlternativeHandle.value();
      let move_step = wheelDistance(event);
      let next_val = parseInt(val + move_step);

      if (next_val == val)
        return;


      if (next_val > max_slider)
        next_val = max_slider;

      if (next_val < min_slider)
        next_val = min_slider;

      // change position slider
      sliderAlternativeHandle.value(next_val);
      load_tempYear(next_val , default_transition);
      d3.select("#sliderLabel").text("Year: " + next_val);

    })
    .on("mouseenter", function () {
      d3.select("div#sliderYear")
        .select("g .parameter-value")
        .select("text")
        .attr("y", -35)
        .classed("hover", true)
        .classed("not-hover", false);
    })
    .on("mouseleave", function(){
      d3.select("div#sliderYear")
        .select("g .parameter-value")
        .select("text")
        .attr("y", -35)
        .classed("hover", false)
        .classed("not-hover", true);
    });

}

function control_animation() {


  // function is running and can be STOPPED
  if (typeof animation_func != "undefined") {
    stop_animation();
    // make visible play buttom 
    play();
  }
  else {
    // no function is instanciated so START
    start_animation();
    // make visible stop button
    stop();
  }

}

function start_animation() {

  // get speed
  let speed = speed_options[selected_opt_idx];
  
  var total_milliseconds = (animation_duration * 60000) / speed; // 60000 milliseconds in one minute
  var time_wait = total_milliseconds / ((endYear_selected - startYear_selected) / step_slider); //  total time / (N° years) 
  cur_year = startYear_selected;

  // disable possibility to use the slider
  disable_menu();

  // start animation
  animation_func = setInterval(animation_years, time_wait, time_wait);
}

function stop_animation() {

  // stop animation
  clearInterval(animation_func);
  animation_func = undefined;

  // enable possibility to use the slider
  enable_menu();

  // reset position slider
  load_tempYear(sliderAlternativeHandle.value() , default_transition);
  d3.select("#sliderLabel").text("Year: " + sliderAlternativeHandle.value());
}


function increment_step_slider(transition_time) {

  // set new value
  d3.select("#sliderLabel").text("Year: " + cur_year);
  // load temperatures
  load_tempYear( cur_year , transition_time);

  cur_year = cur_year + step_slider;
  return cur_year;
}


async function animation_years(trasition_time) {

  let year = await increment_step_slider(trasition_time);

  // at the end of the animation
  if (year == max_slider + step_slider)
    stop_animation();

}

function disable_menu() {

  // disable slider
  d3.select("#svg-slider").style("pointer-events", "none");
  // change opacity 
  d3.select("#svg-slider").style("opacity", "0.5");

  // disable animation menu
  d3.select("#setting_btn_open").style("pointer-events", "none");
  // change opacity 
  d3.select("#setting_btn_open").style("opacity", "0.5");
}

function enable_menu() {
  d3.select("#svg-slider").style("pointer-events", "auto");
  d3.select("#svg-slider").style("opacity", "1.0");

  d3.select("#setting_btn_open").style("pointer-events", "auto");
  d3.select("#setting_btn_open").style("opacity", "1.0");
}


function wheelDistance(e) {
  //console.log(e); 
  if (!e) {
    e = window.event;
  }
  var w = e.wheelDeltaY,
    d = e.detail;
  if (d) {
    return -d / 3; // Firefox; 
  }
  //console.log(w);

  /*if(w > 0){
    w = w * 50
  }*/

  // IE, Safari, Chrome & other browsers 
  return w / 120;
} 