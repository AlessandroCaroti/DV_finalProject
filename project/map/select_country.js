const input_source = document.getElementById("input_countrySelection");
const selectionCountry_list = d3.select("#country_list");
var curr_over = null;
var prev_country = null;
var k = 0;

// EVENT HANDLERS
const inputHandler = function (e) {
  metches = find_matches(e.target.value, country_list);
  update_otionsCountry(metches);
};

const blurHandler = async function () {
  await new Promise((r) => setTimeout(r, 400));
  curr_over = null;
  selectionCountry_list.selectAll("li").remove();
};

const keydownHandlwe = function (event) {
  if (event.key === "Enter") {
    input_source.value = curr_over.id;

    hide_options();
    input_source.blur();

    update_mainPage(input_source.value);
  } else if (event.key === "ArrowDown") {
    if (curr_over.nextElementSibling != null) {
      d3.select(curr_over).classed("country_option_over", false);
      curr_over = curr_over.nextElementSibling;
      d3.select(curr_over).classed("country_option_over", true);

      //scroll if outside the view box
      if (curr_over.getBoundingClientRect().y > 285) {
        k += curr_over.getBoundingClientRect().y - 285;
        document.getElementById("country_list_conteiner").scroll(0, k);
      }
    }
  } else if (event.key === "ArrowUp") {
    if (curr_over.previousElementSibling != null) {
      d3.select(curr_over).classed("country_option_over", false);
      curr_over = curr_over.previousElementSibling;
      d3.select(curr_over).classed("country_option_over", true);

      //scroll if outside the view box
      if (curr_over.getBoundingClientRect().y < 163) {
        k += curr_over.getBoundingClientRect().y - 163;
        document.getElementById("country_list_conteiner").scroll(0, k);
      }
    }
  } else if (event.key === "Escape") {
    hide_options();
  }
};

input_source.addEventListener("input", inputHandler);
input_source.addEventListener("blur", blurHandler);
input_source.addEventListener("keydown", keydownHandlwe);

function hide_options() {
  selectionCountry_list.selectAll("li").remove();
  curr_over = null;
  input_source.blur();
}

function showAllData() {
  update_otionsCountry(country_list);
}

function reset_and_hide() {
  hide_options();
  input_source.value = "";

  changeAllData("Global Land");

  //deselect the previus country
  d3.select(".selected_country").style(
    "stroke-width",
    borderCountryScale(curr_zoomScale)
  );

  set_globe_icon();
  d3.select(".selected_country").classed("selected_country", false);
  selected_country = null;
}

function update_otionsCountry(options) {
  var list = selectionCountry_list.selectAll("li").data(options);

  //exit
  list.exit().remove();
  //update
  list.html((d) => d).attr("id", (d) => d);
  //enter
  list
    .enter()
    .append("li")
    .classed("country_option", true)
    .attr("id", (d) => d)
    .on("click", function () {
      input_source.value = this.id;

      hide_options();
      input_source.blur();

      update_mainPage(input_source.value);
    })
    .on("mouseenter", function () {
      d3.select(curr_over).classed("country_option_over", false);
      curr_over = this;
      d3.select(curr_over).classed("country_option_over", true);
    })
    .html((d) => d);

  //Set the selected to the 1° one
  if (curr_over != null) {
    d3.select(curr_over).classed("country_option_over", false);
  }
  selectionCountry_list
    .select("#" + options[0])
    .classed("country_option_over", true);
  curr_over = document.getElementById(options[0]);
}

function find_matches(string, list_of_sting) {
  let d = [];
  string = string.toLowerCase();
  list_of_sting.forEach((el) => {
    if (el.toLowerCase().includes(string)) {
      d.push(el);
    }
  });
  return d;
}

function update_mainPage(new_country) {
  if (new_country != prev_country) {
    prev_country = new_country;
    // update charts
    console.log(new_country);
    changeCountry(new_country);
    changeAllData(new_country);
  }
}
