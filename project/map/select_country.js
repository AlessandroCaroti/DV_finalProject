const source = document.getElementById("input_countrySelection");

const inputHandler = function (e) {
  input_val = e.target.value.toLowerCase();
  metches = stringSimilarity.findBestMatch(input_val, country_list_low);
  best = metches.ratings.sort((a, b) => b.rating - a.rating).slice(0,10);
  best.forEach((el) => console.log(el.target, el.rating));
  console.log("------------------------------");
};

source.addEventListener("input", inputHandler);
