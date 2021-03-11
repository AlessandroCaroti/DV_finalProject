sub_title = d3.select("#selected_year_info").select(".sub_title");
temp_value = d3.select("#selected_year_info").select(".change_value");
image_containerUp = d3.select("#img_yearSelected_up");
image_containerDown = d3.select("#img_yearSelected_down");

path_arrowUp = "/project/images/up-arrow-svgrepo-com.svg";
path_arrowDown = "/project/images/down-arrow-svgrepo-com.svg";

function update_year(year) {
  sub_title.html("SELECTED YEAR ANNUAL AVERAGE ANOMALY:<br> " + String(year));
  annual_tempFile = "../../data/years/" + year + "/Annual_mean.csv";

  d3.csv(annual_tempFile)
    .then(function (data) {
      global_anomaly = parseFloat(data[data.length - 1].Anomaly).toFixed(2);
      console.log(global_anomaly)
      temp_value.html(global_anomaly+" °C");
      console.log(temp_value)

      if (global_anomaly < 0) {
        image_containerUp.style("display", "none");
        image_containerDown.style("display", "inline");

      } else {
        image_containerUp.style("display", "inline");
        image_containerDown.style("display", "none");
      }
    })
    .catch(function (error) {
      console.log(error);
      throw error;
    });
}


/***********************************************************/
//  SLIDER
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  //var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  //for (i = 0; i < dots.length; i++) {
  //    dots[i].className = dots[i].className.replace(" active", "");
  //}
  slides[slideIndex-1].style.display = "block";
  //dots[slideIndex-1].className += " active";
} 
