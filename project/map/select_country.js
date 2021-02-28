const input_source = document.getElementById("input_countrySelection");
const selectionCountry_list = d3.select("#country_list");

const inputHandler = function (e) {
  input_val = e.target.value.toLowerCase();
  metches = stringSimilarity.findBestMatch(input_val, country_list);
  best = metches.ratings.sort((a, b) => b.rating - a.rating).slice(0, 10);

  update_otionsCountry(best.map((x) => x.target));
};

input_source.addEventListener("input", inputHandler);

function hide_options() {
  selectionCountry_list.selectAll("li").data([]).exit().remove();
  input_source.blur();
  console.log(input_source);
}

function showAllData() {
  update_otionsCountry(country_list);
}

function reset_and_hide() {
  hide_options();
  input_source.value = "";
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
      console.log(this.id);
      input_source.value = this.id;
      hide_options();
      input_source.blur();
    })
    .html((d) => d);
}
