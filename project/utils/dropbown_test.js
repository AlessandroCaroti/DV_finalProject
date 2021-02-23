x = -8;
y = +6;

w1 = 27;
h1 = 37;
p = 2;

w2=250
h2=370

//STYLE OPEN
d3.select("#setting_btn_open").attr("d", roundedRect(x, y, w1, h1, 3));
d3.select("#setting_icon_open")
  .attr("xlink:href", "/project/images/angular bracket.svg")
  .attr("pointer-events", "none")
  .attr("width", w1 - p * 2)
  .attr("height", h1 - p * 2)
  .attr("x", x + p)
  .attr("y", y + p);

//STYLE CLOSE
d3.select("#setting_btn_close")
  .attr("d", roundedRect(-w2 - x + w1, y, w1, h1, 3))
  .attr("visibility", "hidden");
d3.select("#setting_icon_close")
  .attr("xlink:href", "/project/images/angular bracket close.svg")
  .attr("pointer-events", "none")
  .attr("width", w1 - p * 2)
  .attr("height", h1 - p * 2)
  .attr("x", -w2 - x + w1 + p)
  .attr("y", y + p)
  .attr("visibility", "hidden");

//STYLE MENU'
d3.select("#menu")
  .attr("d", roundedRect(x, y, w1, h1, 3))
  .style("fill", "rgba(255,255,255,0.8)")
  .style("stroke", "black")
  .style("stroke-width", "2px");

d3.select("#text_setting").attr("x", -w2/2).attr("y", y+(h1/2)+5);
d3.select("#text_animation").attr("x", -w2+w1+10).attr("y", 70);
d3.select("#text_speed").attr("x", -w2+w1+20).attr("y", 83);

//ANIMATION SPEED
d3.select("#text_animation").attr("x", -w2+w1+10).attr("y", 70);
d3.select("#text_speed").attr("x", -w2+w1+10).attr("y", 83);
const p_l = 42
const y_l = 94
const start_line = (-w2+w1+p_l)
const end_line = (w1-p_l)
d3.select("#speed_line").attr("x1",start_line).attr("y1",y_l).attr("x2",end_line).attr("y2",y_l);
const speed_options = [0.5, 1, 2, 4, 8];
var selected_opt_idx = 1;
const step = ((end_line-start_line)/(speed_options.length-1));
for(var i = 0; i<speed_options.length; i++){
  k = start_line + step*i;
  d3.select("#animation_speed_group")
    .append("line")
    .attr("x1",k)
    .attr("y1",y_l-1)
    .attr("x2",k)
    .attr("y2",y_l+8)
    .style("stroke", "black")
    .style("stroke-width", 1.5)
    .attr("visibility", "hidden");

  d3.select("#animation_speed_group")
    .append("text")
    .attr("x", k-5)
    .attr("y", y_l+17)
    .attr("font-size", 10)
    .attr("font-family","Courier New")
    .text("x"+(speed_options[i]))
    .attr("visibility", "hidden");
}
d3.select("#slider_ball").attr("cx",((start_line) + step*1)).attr("cy",y_l).attr("visibility", "hidden").raise();

d3.select("#decrease_speed").attr("d", "M "+(start_line-22)+" "+y_l+"h "+9)
  .style("stroke-width", 2).attr("visibility", "hidden").attr("pointer-events", "none");
d3.select("#decrease_back").attr("cx",(start_line-22)+4.5).attr("cy",y_l).attr("r",8).attr("visibility", "hidden")
  .on("click", function(){
    if (selected_opt_idx > 0)
      selected_opt_idx--;
      d3.select("#slider_ball").attr("cx", (start_line + step*selected_opt_idx));
  });

d3.select("#increase_speed").attr("d", "M "+(end_line+22)+" "+y_l+"h "+(-9)+"h "+4.5+"v "+4.5+"v "+(-9))
  .style("stroke-width", 2).attr("visibility", "hidden").attr("pointer-events", "none");
d3.select("#increase_back").attr("cx",(end_line+22)-4.5).attr("cy",y_l).attr("r",8).attr("visibility", "hidden")
  .on("click", function(){
    if (selected_opt_idx < speed_options.length-1)
      selected_opt_idx++;
      d3.select("#slider_ball").attr("cx", (start_line + step*selected_opt_idx));
  });

// EVENTS OPEN
d3.select("#setting_btn_open").on("click", function () {
  console.log("CLICK");
  d3.select("#menu")
    .transition()
    .attr("visibility", "visible")
    .attr("d", roundedRect(-w2 + w1, 0, w2, h2, 10))
    .on("end", function () {
      d3.select("#munu_parts").selectAll("*").attr("visibility", "visible");
    });

  d3.select("#setting_icon_open").attr("visibility", "hidden");
  d3.select(this).attr("visibility", "hidden");
});

// EVENTS CLOSE
d3.select("#setting_btn_close").on("click", function () {
  console.log("CLICK");
  d3.select("#menu")
    .transition()
    .attr("visibility", "visible")
    .attr("d", roundedRect(x, y, w1, h1, 3))
    .on("end", function () {
      d3.select("#setting_btn_open").attr("visibility", "visible");
      d3.select("#setting_icon_open").attr("visibility", "visible");
    });
  d3.select("#munu_parts").selectAll("*").attr("visibility", "hidden");
});
