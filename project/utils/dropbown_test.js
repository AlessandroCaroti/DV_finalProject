csv_path = "../../data/15_countries_list.csv";

d3.csv(csv_path)
  .then(function (countries) {
    data = [];
    for (var i = 0; i < countries.length; i++) {
      data.push({ id: i, text: countries[i].Map });
    }
    console.log(data);
    $("#id_label_single").select2({
      placeholder: "Select an option",
      width: "resolve",
      data: data,
      theme: "classic",
      allowClear: true,
    });

    $("#id_label_single").on("select2:select", function (e) {
      var data = e.params.data;
      console.log(data.text);
    });
  })
  .catch((error) => {
    console.log(error);
    throw error;
  });
