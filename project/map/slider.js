
var sliderAlternativeHandle;
var step_slider; 
var min_slider;
var max_slider;
var id_slider = "draggable";

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


function control_animation(action){

  if(action == "START"){
    
    // disable possibility to use the slider
    disable_slider();
  }

  if(action == "STOP"){

    // enable possibility to use the slider
    enable_slider();
  }

}


function increment_step_slider(value, transition_time){
  // set new value
  sliderAlternativeHandle.value(value);
  // load temperatures
  load_tempYear(tmp_file_prefix + value + tmp_file_suffix, transition_time);
}


async function animation_years(){

  var time_wait = 1000;  
  for( var i = min_slider; i <= max_slider; i += step_slider ){

    increment_step_slider(i, time_wait);
    // wait to update colors
    sleep(time_wait);
  }

}
  
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

 //  id="start" onclick="animation_years()"

function disable_slider(){
   
  d3.select("#" + id_slider).attr("pointer-events", "none");
}

function enable_slider(){
  d3.select("#" + id_slider).attr("pointer-events", "auto");
}