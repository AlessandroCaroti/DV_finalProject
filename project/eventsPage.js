function NavBarDropDownEvt() {
  var drop_div = document.getElementById("contributors-div");

  if (drop_div.style.display == "" || drop_div.style.display == "none") {
    drop_div.style.display = "block";

    document.getElementById("bracket_drop_nav").style.transform =
      "rotate(180deg)";
  } else {
    drop_div.style.display = "none";
    document.getElementById("bracket_drop_nav").style.transform = "none";
  }
}

function scrollFunction() {
  var btn = document.getElementById("btn-back-top");
  var sideDiv = document.getElementById("selectionCountry_countainer");
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    btn.style.display = "block";
    sideDiv.style.paddingTop = "2px";
  } else {
    btn.style.display = "none";
    sideDiv.style.paddingTop = "75px";
  }

  sideDiv.style.transition = "0.3s ease-in-out";
}

function topFunction() {
  document.documentElement.scrollTop = 0;
}

function updateRangeData(value) {
  // update map
  tmp_file_suffix =
    value == "annual"
      ? "/Annual"
      : value == "five_years"
      ? "/5-year"
      : value == "ten_years"
      ? "/10-year"
      : "/20-year";
  tmp_file_suffix = tmp_file_suffix.concat("_mean.csv");
  load_tempYear(sliderAlternativeHandle.value(), default_transition);

  // update charts
  changeDataRangeYears();
}

function collapseMenuEvt() {
  var drop_div = document.getElementById("links-collapse-drop");

  if (drop_div.style.display == "" || drop_div.style.display == "none")
    drop_div.style.display = "block";
  else drop_div.style.display = "none";
}

function drawInfoTooltip(event, tipText, titleContainer, tableInfo=false) {
  var tooltip = d3.select("#"+titleContainer+" .tooltip");

  tooltip.transition();
  var yPos;
  if(!tableInfo) yPos= event.clientY;
  else  
      yPos = event.pageY;

  tooltip
    .style("left", (event.pageX+30)+"px" )
    .style("top", (yPos-50)+ "px" )
    .style("display", "block")
    .style("width", "150px")
    .html(tipText);
}

function removeInfoTooltip(titleContainer) {
  var tooltip = d3.select("#"+titleContainer+" .tooltip");
  tooltip.style("display", "none");
}


var tipTextSideBar = String(
    
  "<p style='text-align: left; padding-right: 5px; padding-left: 5px; font-size: 12px;' >" +
    "Choose data averaged on different intervals of years." +
    '<br> E.g. "5 Year" refers to the average of data of the previous 5 years.' +
    "</p>"
);

var tipTextTableInfo = String(
    
  "<p style='text-align: left; padding-right: 3px; padding-left: 3px; font-size: 12px;' >"   
  +"The light blue cells represent the first annual "
  +"available temperature. The others contain the annual temperature increasement of the previous years."
  +"</p>"
);


d3.select("#info-btn-avg")
  .on("mouseenter", (event, d)=>drawInfoTooltip(event, tipTextSideBar, "data-averaged-title" ))
  .on("mouseleave", ()=>removeInfoTooltip("data-averaged-title"));


d3.select("#info-btn-table")
  .on("mouseenter", (event, d)=>drawInfoTooltip(event, tipTextTableInfo, "table_container", true ))
  .on("mouseleave", ()=>removeInfoTooltip("table_container"));
