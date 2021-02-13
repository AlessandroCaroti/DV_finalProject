
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
    .default(2019)
    .handle(d3.symbol().type(d3.symbolCircle).size(200)())
    .on("end", (val) => {
      d3.select("#sliderLabel").text("Year: " + d3.format("0")(val));
      load_tempYear(tmp_file_prefix + val + tmp_file_suffix, default_transition);
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

  
  // setting an id to the slider
  d3.select("g.parameter-value").select("path")
                                .attr("id", id_slider);

}

function control_animation(){


  // function is running and can be STOPPED
  if(typeof animation_func != "undefined" ){
    stop_animation();
    // make visible play buttom 
    play();
  }
  else{
    // no function is instanciated so START
    start_animation();
    // make visible stop button
    stop();
  }
  
}

function start_animation(){
  var total_milliseconds = animation_duration * 60000; // 60000 milliseconds in one minute
  var time_wait = total_milliseconds / ((max_slider - min_slider) / step_slider); //  total time / (N° years) 
  cur_year = min_slider;

  // disable possibility to use the slider
  disable_slider();

  // start animation
  animation_func = setInterval(animation_years, time_wait, time_wait);
}

function stop_animation(){

  // stop animation
  clearInterval(animation_func);
  animation_func = undefined;

  // enable possibility to use the slider
  enable_slider();

  // reset position slider
  load_tempYear(tmp_file_prefix + sliderAlternativeHandle.value() + tmp_file_suffix, default_transition);
  d3.select("#sliderLabel").text("Year: " + sliderAlternativeHandle.value());
}


function increment_step_slider(transition_time){

  // set new value
  d3.select("#sliderLabel").text("Year: " + cur_year);
  // load temperatures
  load_tempYear(tmp_file_prefix + cur_year + tmp_file_suffix, transition_time);

  cur_year = cur_year + step_slider;
  return cur_year;
}


async function animation_years(trasition_time){
  
  let year = await increment_step_slider(trasition_time);

  // at the end of the animation
  if (year == max_slider + step_slider)
    stop_animation();
  
}

function disable_slider(){
   
  d3.select("#svg-slider").style("pointer-events", "none");
  // change opacity 
  d3.select("#svg-slider").style("opacity", "0.5");
}

function enable_slider(){
  d3.select("#" + id_slider).style("pointer-events", "auto");
  d3.select("#svg-slider").style("opacity", "1.0");
}