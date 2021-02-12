//Global Variables
var full_width = 900
var margin = {top: 40, right: 70, bottom: 30, left: 50};
var width = full_width - margin.left - margin.right;
var height = full_width*9/16 - margin.top - margin.bottom;

var parseMonth = d3.timeParse("%m");
var monthList = ["1","2","3","4","5","6","7","8","9","10","11","12"];


function loadData(){ 
    const countries = '../../remaining_data/data_new/Countries.csv';
    var dataset = "";
    d3.csv(countries)
      .then((data)=>{

          var i = 0;
          data.forEach( d => {

            var dropdown = document.getElementById("dataset");
            
            var option =  document.createElement("option");
            option.setAttribute("value", d.Country);
            option.innerHTML = d.Country;
            dropdown.append(option)
            if( option.value == "Italy"){
              dropdown.selectedIndex = i;
              dropdown.options[i].selected = true;
              // set Italy default dataset
              dataset = option.value;
              
            }
            i++;
          });

          defaultDataHottestColdest(dataset);
          
    })
}



function getLineGenerators(x, y){
    
    
    var valueline_annual = d3.line()
                              .x(function(d) { /*console.log(d.Year+"-"+d.month+":   ",x(parseMonth(d.month))); */return x(parseMonth(d.month))})
                              .y(function(d) {  return y(d.monthly_value); })
                              .defined( (d) => { return ( !isNaN(d.monthly_value) ) } );        
 
    return valueline_annual;

}


function getScales(data){
  
  var m =[];
    monthList.forEach((d)=>{
        m.push( parseMonth(d));
      })
    
    var x = d3.scaleTime()
              .domain(d3.extent(m, function(d) { return d }))
              .range([ 0, width ]);             

           // Add Y axis
    var y = d3.scaleLinear()
             .domain([d3.min(data, function(d) { return d.monthly_value }), 
                          d3.max(data, function(d) { return d.monthly_value })])
             .range([ height, 0 ]);
  
    return [x, y];

}


//TODO: DATA GROUPED BY YEAR
function getMonthlyData(data){
    
    var monthlyData =[];
    
    for(var i=0; i< data.length; i++){

        monthlyData[String(data[i].Year)]= [];
    }

    data.forEach((d)=>{

        var row = {};
        row["month"] = d.date.getMonth()+1;
        row["monthly_value"] = d.monthly_value;
        row["Year"] = d.Year;
    
        monthlyData[String(d.Year)].push(row);
    })

    return monthlyData;
}




function createHottestColdestLineChart(data){

    var dataMonthly = getMonthlyData(data);


  
    //var years= Object.keys(dataMonthly);

    var svg = d3.select("#hottest_coldest_container")
                .append("svg")
                .attr("class","graphics")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                
                
    var scales = getScales(data);
    var x = scales[0] 
    var y =  scales[1]


    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "x_axis")
      .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%b"))
            );


    svg.append("g")
      .attr("class", "y_axis")
      .call(d3.axisLeft(y));

    var valueline_annual = getLineGenerators(x,y);

  
      dataMonthly.forEach((d)=>{

      //console.log(d[0].Year, "\n -----------------------------------\n");

      // Draw the line the line
      var line = svg.append("g")
                    .attr("id", d[0].Year)
                    .data([d])
                    .append("path")
                    .attr("d", valueline_annual)
                    .attr("class","line_chart_hottest_coldest");


    })
    

  

  
   
 
}