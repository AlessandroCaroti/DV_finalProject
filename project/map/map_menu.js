x = -8;
y = +6;

w1 = 27;
h1 = 37;
p = 2;

w2=250;
h2=240;

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
  .attr("d", roundedRect(-w2 - x + w1, y, w1, h1, 3));
d3.select("#setting_icon_close")
  .attr("xlink:href", "/project/images/angular bracket close.svg")
  .attr("pointer-events", "none")
  .attr("width", w1 - p * 2)
  .attr("height", h1 - p * 2)
  .attr("x", -w2 - x + w1 + p)
  .attr("y", y + p);

//STYLE MENU'
d3.select("#menu_map")
  .attr("d", roundedRect(x, y, w1, h1, 3))
  .style("fill", "rgba(255,255,255,0.9)")
  .style("stroke", "black")
  .style("stroke-width", "2px");

d3.select("#text_setting").attr("x", -w2/2).attr("y", y+(h1/2)+5);
d3.select("#text_animation").attr("x", -w2+w1+10).attr("y", 70);
d3.select("#text_speed").attr("x", -w2+w1+20).attr("y", 83);

//ANIMATION SPEED
const p_l = 42
const y_l = 94
const start_line = (-w2+w1+p_l)
const end_line = (w1-p_l)

const speed_options = [0.5, 1, 2, 4, 8];
var selected_opt_idx = 1;
const step = ((end_line-start_line)/(speed_options.length-1));

d3.select("#text_animation").attr("x", -w2+w1+10).attr("y", y_l - 24);
d3.select("#speed_line").attr("x1",start_line).attr("y1",y_l).attr("x2",end_line).attr("y2",y_l);
for(var i = 0; i<speed_options.length; i++){
  k = start_line + step*i;
  d3.select("#animation_speed_group")
    .append("line")
    .attr("x1",k)
    .attr("y1",y_l-1)
    .attr("x2",k)
    .attr("y2",y_l+8)
    .style("stroke", "black")
    .style("stroke-width", 1.5);

  d3.select("#animation_speed_group")
    .append("text")
    .attr("x", k-6)
    .attr("y", y_l+21)
    .attr("font-size", 12)
    .attr("font-family","Courier New")
    .text("x"+(speed_options[i]));
}
d3.select("#slider_ball").attr("cx",((start_line) + step*1)).attr("cy",y_l).raise();

d3.select("#decrease_speed").attr("d", "M "+(start_line-24)+" "+y_l+"h "+10)
  .style("stroke-width", 2).attr("pointer-events", "none");
d3.select("#decrease_back").attr("cx",(start_line-24)+5).attr("cy",y_l)
  .on("click", function(){
    if (selected_opt_idx > 0)
      selected_opt_idx--;
      d3.select("#slider_ball").attr("cx", (start_line + step*selected_opt_idx));
  });

d3.select("#increase_speed").attr("d", "M "+(end_line+24)+" "+y_l+"h "+(-10)+"h "+5+"v "+5+"v "+(-9))
  .style("stroke-width", 2).attr("pointer-events", "none");
d3.select("#increase_back").attr("cx",(end_line+24)-5).attr("cy",y_l)
  .on("click", function(){
    if (selected_opt_idx < speed_options.length-1)
      selected_opt_idx++;
      d3.select("#slider_ball").attr("cx", (start_line + step*selected_opt_idx));
  });

// YEAR RANGE
const p_l_2 = 20
const y_l_2 = 190
const first_years = 1743
const last_year = 2020
const year_scale = d3.scaleLinear().domain([first_years, last_year]).range([(-w2+w1+p_l_2), (w1-p_l_2)]);
const start_line_2 = year_scale(first_years)
const end_line_2 = year_scale(last_year)
var startYear_selected = 1750
var startYear_pos = year_scale(startYear_selected)
var endYear_selected = 2020
var endYear_pos = year_scale(endYear_selected)
const twenty_year_gap = year_scale(first_years+20) - year_scale(first_years)

d3.select("#text_range").attr("x", -w2+w1+10).attr("y", y_l_2 - 30);
d3.select("#range_line").attr("d", roundedRect(start_line_2, y_l_2, end_line_2-start_line_2, 4, 2));
d3.select("#slider_ball_year_start").attr("cx",year_scale(startYear_selected)).attr("cy",y_l_2+2).raise();
d3.select("#selected_range").attr("x",startYear_pos).attr("y",y_l_2+0.1).attr("width",endYear_pos-startYear_pos).attr("height",3.8)
d3.select("#start_year").attr("x", startYear_pos-12).attr("y", y_l_2-10).text(startYear_selected)
d3.select("#end_year").attr("x", endYear_pos-8).attr("y", y_l_2-10).text(endYear_selected)
d3.select("#slider_ball_year_start").call(d3.drag()
                                      .on("start", () => {d3.select("#slider_ball_year_start").attr("r", 6);
                                                          d3.select("#start_year").style("font-weight","bold");})
                                      .on("drag", (event) => {

                                        let first_year = years_division[getCheckedValue("btn-range-year").value].first_year;

                                        if(event.x >= start_line_2 && event.x < (endYear_pos-twenty_year_gap) && event.x >= year_scale(parseInt(first_year))){
                                          startYear_pos = event.x
                                          startYear_selected = Math.floor(year_scale.invert(startYear_pos));
                                          d3.select("#slider_ball_year_start").attr("cx",startYear_pos)
                                          d3.select("#selected_range").attr("x",startYear_pos).attr("width",endYear_pos-startYear_pos)
                                          d3.select("#start_year").attr("x", startYear_pos-12).text(startYear_selected)
                                        }
                                      })
                                      .on("end", () => {
                                                        d3.select("#slider_ball_year_start").raise().attr("r", 5);
                                                        d3.select("#start_year").style("font-weight","normal");}))

d3.select("#slider_ball_year_end").attr("cx",year_scale(endYear_selected)).attr("cy",y_l_2+2).raise();
d3.select("#slider_ball_year_end").call(d3.drag()
                                      .on("start", () => {d3.select("#slider_ball_year_end").attr("r", 6);
                                                          d3.select("#end_year").style("font-weight","bold");})
                                      .on("drag", (event) => {

                                        let last_year = years_division[getCheckedValue("btn-range-year").value].last_year;

                                        if(event.x > (startYear_pos+twenty_year_gap) && event.x <= end_line_2 && event.x <= year_scale(parseInt(last_year) + 1 )){
                                          endYear_pos = event.x
                                          endYear_selected = Math.ceil((year_scale.invert(endYear_pos)));
                                          d3.select("#slider_ball_year_end").attr("cx",endYear_pos)
                                          d3.select("#selected_range").attr("width",endYear_pos-startYear_pos)
                                          d3.select("#end_year").attr("x", endYear_pos-8).text(endYear_selected)
                                        }
                                      })
                                      .on("end", () => {
                                                        d3.select("#slider_ball_year_end").attr("r", 5);
                                                        d3.select("#end_year").style("font-weight","normal");}))
var curr_year_k = 1750
while(curr_year_k<last_year){
  d3.select("#range_slider_group")
    .append("line")
    .attr("x1",year_scale(curr_year_k))
    .attr("y1",y_l_2+8)
    .attr("x2",year_scale(curr_year_k))
    .attr("y2",y_l_2+11)
    .style("stroke", "black")
    .style("stroke-width", 0.8)
    .attr("visibility", "hidden");

  d3.select("#range_slider_group")
    .append("text")
    .attr("x", year_scale(curr_year_k)-9)
    .attr("y", y_l_2+22)
    .attr("font-size", 10)
    .attr("font-family","Courier New")
    .text(curr_year_k)
    .attr("visibility", "hidden");

  curr_year_k += 50;
}                                      


// EVENTS OPEN
d3.select("#setting_btn_open").on("click", function () {
  d3.select("#menu_map")
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
  d3.select("#menu_map")
    .transition()
    .attr("visibility", "visible")
    .attr("d", roundedRect(x, y, w1, h1, 3))
    .on("end", function () {
      d3.select("#setting_btn_open").attr("visibility", "visible");
      d3.select("#setting_icon_open").attr("visibility", "visible");
    });
  d3.select("#munu_parts").selectAll("*").attr("visibility", "hidden");
});


// EVENT RANGE SELECTED
function updateSliderBalls(){

  let first_year = years_division[getCheckedValue("btn-range-year").value].first_year;
  let last_year = years_division[getCheckedValue("btn-range-year").value].last_year;

  // update slider ball start year
  d3.select("#slider_ball_year_start").attr("cx",year_scale(first_year)).attr("cy",y_l_2+2).raise();
  d3.select("#start_year").text(first_year);


  // update slider ball end year
  d3.select("#slider_ball_year_end").attr("cx",year_scale(last_year)).attr("cy",y_l_2+2).raise();
  d3.select("#end_year").text(last_year);


  d3.select("#selected_range").attr("x",year_scale(first_year)).attr("width",year_scale(last_year)-year_scale(first_year));

  // update variable
  startYear_pos = year_scale(first_year);
  startYear_selected = first_year;

  endYear_pos = year_scale(last_year)
  endYear_selected = last_year;
}

// INITIALIZATION YEAR DIVISION 
function init_yearDivision(){

  d3.csv("../../data/14.4_info_yearsDivision.csv")
    .then(function(data){

      data.forEach(function(row){
        years_division[row.Average] = {first_year : parseInt(row.First_year), last_year : parseInt(row.Last_year)}
      })

      console.log(years_division)
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });
}