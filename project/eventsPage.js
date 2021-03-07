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

function drawInfoTooltip(event) {
  
  var tooltip = d3.select("#data-averaged-title .tooltip");

  tooltip.transition();
  var tipText = String(
    "<p>Possibility to choose between data average in different periods. <br> </p>"
  );
  


  tooltip
    .style("left", String(event.clientX + 30) + "px")
    .style("top", String(event.clientY - 40) + "px")
    .style("display", "block")
    .style("width", "150px")
    .html(tipText);
}

function removeInfoTooltip() {
  var tooltip = d3.select("#data-averaged-title .tooltip");
  tooltip.style("display", "none");
}

d3.select("#info-btn-avg")
  .on("mouseover", drawInfoTooltip)
  .on("mouseleave", removeInfoTooltip);
