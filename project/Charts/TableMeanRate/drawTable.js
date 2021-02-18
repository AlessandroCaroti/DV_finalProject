var continent, portion_continent, hemisphere;

function loadData_table() {
  //ciaovar dataset = "";
  d3.csv(countries).then((data) => {
    var i = 0;
    data.forEach((d) => {
      var dropdown = document.getElementById("dataset");
      var option = document.createElement("option");
      option.setAttribute("value", d.Country);
      option.innerHTML = d.Country;
      dropdown.append(option);
      if (option.value == "Italy") {
        dropdown.selectedIndex = i;
        dropdown.options[i].selected = true;
        // set Italy default dataset
        dataset = option.value;
      }
      i++;
    });

    default_dataset(dataset);
  });
}







function default_dataset(dataFile = "") {
  if (dataFile == "") dataFile = "Afghanistan";

  var dataFile = document.getElementById("dataset").value;
  document.getElementById("table_country").innerHTML = dataFile;
  var folder;
  if (dataFile.charAt(dataFile.length - 1) == ".")
    folder = dataFile.slice(0, -1);
  else folder = dataFile;

  initBaselineAndInfo(dataFile);

 
  var csv_country =
    "/../data/counties/" + folder + "/" + dataFile + "_anomalyTable.csv";

  d3.csv(csv_country)
    .then((data_country) => {
      parseDataAttributes(data_country, dataFile);
      createEmptyTable(data_country)

      d3.json("/../data/counties/" + folder + "/" + dataFile + "_info.json")
        .then((info) => {
          var generalization_list = info["Generalization"];
          console.log(generalization_list);

          readData(generalization_list, update = false);

        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    })
    .catch((error) => {
      console.log(error);
      //alert("Unable To Load The Dataset!!");
      throw error;
    });
}

function changeDataTable() {
  // prendere dati da mappa selezionata o dropdown menu
  if (dataFile == "") dataFile = "Afghanistan";

  var dataFile = document.getElementById("dataset").value;
  document.getElementById("table_country").innerHTML = dataFile;
  var folder;
  if (dataFile.charAt(dataFile.length - 1) == ".")
    folder = dataFile.slice(0, -1);
  else folder = dataFile;

  initBaselineAndInfo(dataFile);

  d3.select(".table_mean_rate").selectAll("tr").remove();
  d3.select(".table_mean_rate").selectAll("td").remove();

  var csv_country =
    "/../data/counties/" + folder + "/" + dataFile + "_anomalyTable.csv";

  d3.csv(csv_country)
    .then((data_country) => {
   
      createEmptyTable(data_country)
      parseDataAttributes(data_country, dataFile);

      d3.json("/../data/counties/" + folder + "/" + dataFile + "_info.json")
        .then((info) => {
          var generalization_list = info["Generalization"];
          console.log(generalization_list);

          readData(generalization_list, true);

        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    })
    .catch((error) => {
      console.log(error);
      //alert("Unable To Load The Dataset!!");
      throw error;
    });
}
