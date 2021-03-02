const input_source = document.getElementById("input_countrySelection");
const selectionCountry_list = d3.select("#country_list");
var curr_over = null;
var k = 0;

const inputHandler = function (e) {
  console.log(e.key);
  /*
  metches = stringSimilarity.findBestMatch(e.target.value, country_list);
  best = metches.ratings.sort((a, b) => b.rating - a.rating).slice(0, 10);

  update_otionsCountry(best.map((x) => x.target));
  */
  metches = find_matches(e.target.value, country_list);
  update_otionsCountry(metches);
};

input_source.addEventListener("input", inputHandler);
input_source.addEventListener("blur", async function () {
  await new Promise((r) => setTimeout(r, 500));
  //selectionCountry_list.selectAll("li").remove();
});
input_source.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    console.log("ENTER");
  } else if (event.key === "ArrowDown") {
    if (curr_over.nextElementSibling != null) {
      d3.select(curr_over).classed("country_option_over", false);
      curr_over = curr_over.nextElementSibling;
      console.log(curr_over.getBoundingClientRect())
      d3.select(curr_over).classed("country_option_over", true);
      if(curr_over.getBoundingClientRect().y > 285){
        k += curr_over.getBoundingClientRect().y - 285
        document.getElementById("country_list_conteiner").scroll(0, k);
      }
    }
  } else if (event.key === "ArrowUp") {
    if (curr_over.previousElementSibling != null) {
      d3.select(curr_over).classed("country_option_over", false);
      curr_over = curr_over.previousElementSibling;
      d3.select(curr_over).classed("country_option_over", true);
      if(curr_over.getBoundingClientRect().y < 163){
        k += curr_over.getBoundingClientRect().y - 163
        document.getElementById("country_list_conteiner").scroll(0, k);
      }
    }
  } else {
    console.log(event.key);
  }
});

function hide_options() {
  selectionCountry_list.selectAll("li").remove();
  input_source.blur();
}

function showAllData() {
  //selectionCountry_list.classed("hide", false);
  update_otionsCountry(country_list);
}

function reset_and_hide() {
  hide_options();
  input_source.value = "";

  changeAllData("Global Land");

  reset_zoom();
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

      // update charts
      console.log(this.id);
      changeCountry(this.id);
      changeAllData(this.id);
    })
    .on("mouseenter", function () {
      d3.select(curr_over).classed("country_option_over", false);
      curr_over = this;
      d3.select(curr_over).classed("country_option_over", true);
    })
    .html((d) => d);

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
