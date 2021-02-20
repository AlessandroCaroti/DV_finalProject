var continent, portion_continent, hemisphere;

function loadData_table() {
  //ciaovar dataset = "";
  d3.csv(countries).then((data) => {

    var i = 0;
    data.forEach((d) => {
      var dropdown = document.getElementById("dataset");
      var option = document.createElement("option");
      if(d.Temp != ""){
        option.setAttribute("value", d.Temp);
        option.innerHTML = d.Temp;
        dropdown.append(option)  
      }
      if (option.value == "Italy") {
        dropdown.selectedIndex = i;
        dropdown.options[i].selected = true;
        // set Italy default dataset
        dataset = option.value;
      }
      i++;
    });

    defaultDatasetTable(dataset);
  });
}


function readData(generalization, data_country,  update = false) {
  //reset data_table
  DATA_TABLE=[]
  
  table_data(data_country)
  generalization.forEach((gen_name) => {
    var csv_path =
      "/../data/regions/" + gen_name + "/" + gen_name + "_anomalyTable.csv";
    d3.csv(csv_path)
      .then((data) => {
        parseDataAttributes(data, gen_name);
        if(update){ updateRowsTable(data);}
        else addRowTable(data);
        
      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  
  });

}


function defaultDatasetTable(dataFile) {
  

  var dataFile = document.getElementById("dataset").value;

  var csv_country =
    "/../data/counties/" + dataFile+ "/" + dataFile + "_anomalyTable.csv";

  d3.csv(csv_country)
    .then((data_country) => {
      parseDataAttributes(data_country, dataFile);
      createEmptyTable(data_country)

      d3.json("/../data/counties/" + dataFile + "/" + dataFile + "_info.json")
        .then((info) => {
          var generalization_list = info["Generalization"];
          console.log(generalization_list);

          readData(generalization_list, data_country, update = false);

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

  var dataFile = document.getElementById("dataset").value;


  var csv_country =
    "/../data/counties/" + dataFile + "/" + dataFile + "_anomalyTable.csv";

  d3.csv(csv_country)
    .then((data_country) => {
 
      parseDataAttributes(data_country, dataFile);
      d3.json("/../data/counties/" + dataFile + "/" + dataFile + "_info.json")
        .then((info) => {
          
          var generalization_list = info["Generalization"];
          readData(generalization_list, data_country, true);

        })
        .catch((error) => {
          console.log(error);
          throw error;
        });
    })
    .catch((error) => {
      console.log(error);

      throw error;
    });
}
