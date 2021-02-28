const source = document.getElementById("input_countrySelection");
const selectionCountry_list = d3.select("#country_list");

const inputHandler = function (e) {
  input_val = e.target.value.toLowerCase();
  metches = stringSimilarity.findBestMatch(input_val, country_list_low);
  best = metches.ratings.sort((a, b) => b.rating - a.rating).slice(0, 10);
  console.log("------------------------------");

  var list = selectionCountry_list.selectAll("li").data(best);

  //exit
  list.exit().remove();
  //update
  list.html((d) => d.target);
  //enter
  list
    .enter()
    .append("li")
    .html((d) => d.target);
};

source.addEventListener("input", inputHandler);

function resetInput(){
    selectionCountry_list.selectAll("li").data([]).exit().remove();
}