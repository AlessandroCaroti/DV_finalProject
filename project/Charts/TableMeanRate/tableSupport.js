// function support for the table
var DATA_TABLE = [];

//Global variables
var years_table = ["1750", "1800", "1850", "1900", "1950", "2000", "2020"];
var columns_head = ["Region"].concat(years_table);

var full_width = 900;
var margin_table = { top: 10, right: 10, bottom: 10, left: 20 };
var width_table = full_width - margin_table.left - margin_table.right;
var height_table =
  (full_width * 9) / 16 - margin_table.top - margin_table.bottom;



function readDataTableFinal(data_country, dataFile, baseline, update = false, global = false) {

  DATA_TABLE = [];

  if (!update){
    createEmptyTable(data_country);
    return;
  }
     
  var folder = "counties";

  if (global)
    folder = "regions";

  var path = "/../data/" + folder + "/" + dataFile + "/" + dataFile + "_info.json"

  if (!global)
    table_data(data_country);

  d3.json(path).then(
    (info) => {
      var generalization = info["Generalization"];

      generalization.forEach((gen_name) => {
        var csv_path =
          "/../data/regions/" + gen_name + "/" + gen_name + "_anomalyTable.csv";

        d3.csv(csv_path)
          .then((data) => {
            parseDataAttributes(data, baseline, gen_name);

            if (update) {
              updateRowsTable(data);
            } else addRowTable(data);
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      });
    }
  );

}


//Get data every 50 years_table with also the 2019 at the end
function dataEvery50Years(data) {
  var annual_data = getAnnualData(data);

  var data_2 = [];

  years_table.forEach((year) => {
    annual_data.forEach((d) => {
      if (d.Year == year) data_2.push(d);
    });

    if (!existYear(annual_data, year)) {
      // handle missing year
      data_2.push({
        Year: year,
        annual_value: NaN,
        region: annual_data[0].region,
        annual_unc: NaN,
      });
    }
  });
  return data_2;
}

function addRowData(data50, dataTable) {
  var row = {};

  regionName = data50[0].region;


  row["Region"] = regionName;

  data50.forEach(
    (d) => {
      row[String(d.Year)] = {
        temp: d.annual_value.toFixed(2),
        mean_rate: NaN,
        annual_unc: d.annual_unc.toFixed(2),
        starting_value: false,
      }
    }
  );

  dataTable.push(row);
}

// Return a table in which the keys are the Region and all the years_table
// Each row contains the name of the country (or cointient, or emisphere or global) and the annual average temperature
// Each row correspond to a csv (specific countri, emisphere, continet, global)
function table_data(data) {
  var data50 = dataEvery50Years(data);


  var dataTable = [];
  //GLOBAL DATA
  addRowData(data50, dataTable);


  dataTable = dataTable[0];

  //get list of temperature to calculate the mean rate of change
  var temperatures = getYearTemperatures(dataTable);
  var year_list = Object.keys(temperatures);

  var index_year = 0;
  var year_1 = year_list[index_year];
  var year_2 = year_list[index_year + 1];

  for (var j = 0; j < Object.keys(dataTable).length - 2; j++) {
    // set starting temperature in the first non null cell of the row
    if (isNaN(dataTable[year_1].mean_rate)) {
      dataTable[year_1].mean_rate = temperatures[year_1];
      if (!isNaN(temperatures[year_1])) dataTable[year_1].starting_value = true;
    }

    //for each year is saved the mean rate of change and the correspondive temperature of that year
    dataTable[year_2].temp = String(temperatures[year_2]);
    //comuputing mean rate of change

    var meanRate = String(
      getMeanRateOfChange(
        temperatures[year_1],
        temperatures[year_2],
        year_1,
        year_2
      ).toFixed(3)
    );
    //Adding + for the positive mean rate
    dataTable[year_2].mean_rate =
      meanRate > 0 ? String("+" + meanRate) : meanRate;

    //update years_table
    index_year++;
    year_1 = year_list[index_year];
    year_2 = year_list[index_year + 1];
  }
  //ad data to global variable: for the update
  DATA_TABLE.push(dataTable);

  dataTable = [dataTable];
  return dataTable;
}

function createEmptyTable(dataCountry) {
  var svg = d3
    .select("#table_container")
    .attr("width", width_table + margin_table.left + margin_table.right)
    .attr("height", height_table + margin_table.top + margin_table.bottom)
    .append("g")
    .attr("class", "table_mean_rate")
    .attr(
      "transform",
      "translate(" + margin_table.left + "," + margin_table.top + ")"
    );

  var table = svg.append("table").attr("class", "mean_rate"),
    thead = table.append("thead").attr("class", "thead_table"),
    tbody = table.append("tbody").attr("class", "tbody_table");


  thead
    .append("tr")
    .selectAll("th")
    .data(columns_head)
    .enter()
    .append("th")
    .attr("class", "header_table")
    .text((d) => d);

  addRowTable(dataCountry);
}

function addRowTable(data) {

  var tableData = table_data(data);
  var tbody = d3.select(".tbody_table");
  var rows = tbody.data(tableData);

  rows.enter().merge(rows).append("tr").attr("class", "rows_table");


  //bind the data to columns in each row
  var columns = tbody
    .selectAll("tr")
    .selectAll("td")
    .data(function (row) {
      return columns_head.map(function (d) {
        if (d == columns_head[0]) return { i: d, region: row[d] };

        return {
          i: d,
          mean_rate: row[d].mean_rate,
          temp: row[d].temp,
          annual_unc: row[d].annual_unc,
          starting_value: row[d].starting_value,
        };
      });
    });

  columns.enter().append("td").merge(columns);

  var count_nan = 0;
  var idx_year = 0;
  var previous_idx;

  tbody
    .selectAll("td")
    .attr("class", function (d, i) {
      //find cells with regions name
      if (d.i == columns_head[0]) return "region_cell";

      //first available values: case fisrt year non null
      if (d.i == years_table[0] && !isNaN(d.mean_rate))
        return "start_value_table";

      // first available values: case first year null
      //need to calculate where is the fisrt non NaN value
      if (d.i == years_table[idx_year] && isNaN(d.mean_rate)) {
        count_nan++;
        idx_year++;
        previous_idx = i;
      }

      if (
        d.i == years_table[idx_year] &&
        !isNaN(d.mean_rate) &&
        d.mean_rate != columns_head[0]
      )
        if (previous_idx == i - 1) {
          count_nan = 0;
          idx_year = 0;
          return "start_value_table";
        }
    })
    .attr("id", "cell")
    .html(function (d) {
      if (d.i == columns_head[0]) return d.region;
      if (String(d.mean_rate) == "NaN") return "-";
      else return d.mean_rate;
    })
    .on("mouseover", function (event, d) {
      tableCellEnter(this, event, d);
    })
    .on("mouseout", function () {
      tableCellLeave(this);
    });
}


function updateRowsTable(data) {

  table_data(data);

  var tbody = d3.select(".tbody_table");
  var rows = tbody.selectAll("tr").data(DATA_TABLE);

  //exit data and remove
  rows.exit().remove();
  rows.enter().append("tr").merge(rows).attr("class", "rows_table");

  //bind the data to columns in each row
  var columns = tbody
    .selectAll("tr")
    .selectAll("td")
    .data(function (row) {
      return columns_head.map(function (d) {
        if (d == columns_head[0]) return { i: d, region: row[d] };
        return {
          i: d,
          mean_rate: row[d].mean_rate,
          temp: row[d].temp,
          annual_unc: row[d].annual_unc,
          starting_value: row[d].starting_value,
        };
      });
    });

  columns.exit().remove();
  columns.enter().append("td").merge(columns);

  //variables to find the first values available
  var count_nan = 0;
  var idx_year = 0;
  var previous_idx;
  //update the columns
  tbody
    .selectAll("td")
    .attr("class", function (d, i) {
      if (d.i == columns_head[0]) return "region_cell";

      if (
        d.i == years_table[0] &&
        !isNaN(d.mean_rate) &&
        d.mean_rate != columns_head[0]
      )
        return "start_value_table";

      if (
        d.i == years_table[idx_year] &&
        isNaN(d.mean_rate) &&
        d.mean_rate != columns_head[0]
      ) {
        count_nan++;
        idx_year++;
        previous_idx = i;
      }

      if (
        d.i == years_table[idx_year] &&
        !isNaN(d.mean_rate) &&
        d.mean_rate != columns_head[0]
      )
        if (previous_idx == i - 1) {
          count_nan = 0;
          idx_year = 0;
          return "start_value_table";
        }
    })
    .attr("id", "cell")
    .html(function (d) {
      if (d.i == columns_head[0]) return d.region;
      if (String(d.mean_rate) == "NaN") return "-";
      else return d.mean_rate;
    })
    .on("mouseover", function (event, d) {
      tableCellEnter(this, event, d);
    })
    .on("mouseout", function () {
      tableCellLeave(this);
    });



}

