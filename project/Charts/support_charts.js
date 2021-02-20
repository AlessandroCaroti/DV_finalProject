//Support Functions for  All charts

//Global Variables
var full_width = 900
var margin = {top: 40, right: 70, bottom: 30, left: 50};
var width = full_width - margin.left - margin.right;
var height = full_width*9/16 - margin.top - margin.bottom;

var parseMonth = d3.timeParse("%m");
var monthList = ["1","2","3","4","5","6","7","8","9","10","11","12"];

var parseTime = d3.timeParse("%Y-%m");
var baseline;





function allDeafaultCharts(dataFile){

  var csv =  "/../data/counties/" + dataFile+ "/" + dataFile + "_anomalyTable.csv";
  initBaselineAndInfo(dataFile);
  
  d3.csv(csv)
    .then( function(data){

      parseDataAttributes(data);
      createDefaultLineChart(data);
      createDefaultStripesChart(data);

    
    })


}



function loadAllData(){

  var dataset = "";
  d3.csv(countries)
    .then((data)=>{
        var i = 0;
        data.forEach( d => {

          var dropdown = document.getElementById("dataset");
          var option =  document.createElement("option");
          if(d.Temp != ""){
            option.setAttribute("value", d.Temp);
            option.innerHTML = d.Temp;
            dropdown.append(option)  
          }
         
          if( option.value == "Italy"){
            dropdown.selectedIndex = i;
            dropdown.options[i].selected = true;
            // set Italy default dataset
            dataset = option.value;
            
          }
          i++;
        });

        initBaselineAndInfo(dataset);
        //defaultLineChartDataset(dataset);
        allDeafaultCharts(dataset)
       
  })

}



function changeAllData(){
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

  changeDataHottestColdest();
  changeDataTabMenu();
  changeDataTable();

}


//Load the baseline of the corresponding country from the nameCountry_info.json file
function initBaselineAndInfo(dataFile){

    var json = "/../data/counties/" + dataFile + "/" + dataFile + "_info.json";
    console.log(json);
    d3.json(json)
      .then( (data =>{   baseline = +data["absolute_temp(C)"]; }))
  
}

//the annual average from January to December 1950 is reported at June 1950. 
function getAnnualData(data){   
  return data.filter((d) => d.Month==6);
}


//-------------------------- GRIDLINES CHARTS --------------------------------------
  
function make_x_gridlines(x, n_tick=8) {

  return d3.axisBottom(x)
    .ticks(n_tick)
}

function make_y_gridlines(y, n_tick=8) {
  return d3.axisLeft(y)
    .ticks(n_tick)
}


function createGridLine(x, y, svg, nameChart, n_tickX=8, n_tickY=8){

    svg.append("g")
        .attr("class","grid")
        .attr("id", "x-grid-"+nameChart)
        .attr("transform","translate(0," + height + ")")
        .style("stroke-dasharray",("3,3"))
        .call(make_x_gridlines(x, n_tickX)
              .tickSize(-height)
              .tickFormat("")
          )
    
    svg.append("g")
        .attr("class","grid")
        .attr("id", "y-grid-"+nameChart)
        .style("stroke-dasharray",("3,3"))
        .call(make_y_gridlines(y, n_tickY)
              .tickSize(-width)
              .tickFormat("")
          )
  
  }
  
  
  function updateGrid(idChart,x,y, svg, n_tickX=8, n_tickY=8){
  
    d3.selectAll( idChart+" .grid").remove()
    createGridLine(x, y, svg, "seasonal", n_tickX=8, n_tickY=8);
  
  }

// parse the attribitues useful for the chart and add the baseline
// to the annual_value and ten_years_value
function parseDataAttributes(data, region="NaN"){
    data.forEach(d => {
        
      d.date = parseTime(d.Year+"-"+d.Month);
      d.annual_anomaly = parseFloat(d["Annual Anomaly"])
      d.annual_unc = parseFloat(d["Annual Unc."]);
      d.annual_value = baseline + parseFloat(d["Annual Anomaly"]);
      
      d.five_years_value =  baseline + parseFloat(d["Five-year Anomaly"]);
      d.five_years_anomaly =   parseFloat(d["Five-year Anomaly"]);
      d.five_years_unc =  parseFloat(d["Five-year Unc."]);
      
      d.ten_years_value =  baseline + parseFloat(d["Ten-year Anomaly"]);
      d.ten_years_anomaly =  parseFloat(d["Ten-year Anomaly"]);
      d.ten_years_unc =  parseFloat(d["Ten-year Unc."]);
      
      
      d.twenty_years_value =  baseline + parseFloat(d["Twenty-year Anomaly"]);
      d.twenty_years_anomaly =  parseFloat(d["Twenty-year Anomaly"]);
      d.twenty_years_unc =  parseFloat(d["Twenty-year Unc."]);

      

      d.monthly_value =  parseFloat(d["Monthly Anomaly"]);
      d.monthly_temp =  baseline + parseFloat(d["Monthly Anomaly"]);
      d.monthly_unc = parseFloat(d["Monthly Unc."]);

  
      d.baseline = baseline;
      d["region"] = region;
      
    
    })



  }
  


