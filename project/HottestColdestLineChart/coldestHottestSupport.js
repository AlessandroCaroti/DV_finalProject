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
                              .x(function(d) { return x(parseMonth(d.month))})
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



// data grouped by year
function getMonthlyData(data, hottestYears, coldestYears){
    
    var monthlyData =[];
    
    for(var i=0; i< data.length; i++){

        monthlyData[String(data[i].Year)]= [];
    }

    data.forEach((d)=>{

        var row = {};
        row["month"] = d.Month;
        row["monthly_value"] = d.monthly_value;
        row["Year"] = d.Year;
    
        monthlyData[String(d.Year)].push(row);
    })

   
    var years = Object.keys(monthlyData);
    var years_every10=[];
    var data_every10=[];

    //data every 10 years
    for( var i=0; i < years.length; i+=10) years_every10.push(years[i])
    
    // add hootest coldest years
    for(var i=0; i< hottestYears.length; i++){

       if(!isInList( hottestYears[i].Year, years_every10))
          years_every10.push(hottestYears[i].Year);
        
        if(!isInList( coldestYears[i].Year, years_every10)) 
            years_every10.push(coldestYears[i].Year)
    }


    years_every10.forEach( (y)=>{

      data_every10.push( monthlyData[y])

    })



   return data_every10;
    //return monthlyData;
}


function getAverageTemperature(data){

  var data_annual = [];

    data.forEach((d) => {
        
        if( d.Month == 5  ) data_annual.push({ Year:d.Year, annual_value: d.annual_value});
    });

  return data_annual;

}


function getHottestYears(data){

  var temperatures = getAverageTemperature(data).sort( (x, y) => x.annual_value - y.annual_value);
  var hottest_year = [];
  
  for(var i= temperatures.length-1 ; i > temperatures.length-6; i--){

    hottest_year.push(temperatures[i]);
    
  }

  console.log("Hottest: ", hottest_year);

  return hottest_year;

}


function getColdestYears(data){

  var temperatures = getAverageTemperature(data).sort( (x, y) => x.annual_value - y.annual_value)
 

  var coldest_year = [];
  
  for(var i=0; i < 5; i++){

    coldest_year.push(temperatures[i]);
  }

  console.log("Coldest: ", coldest_year)
  return coldest_year;

}


function isInList(el, list){

  for(var i=0; i< list.length; i++){
    if( el == list[i]) return true;
  }

  return false;
}




function createHottestColdestLineChart(data){

   
    
    
    var hottest_temp =  getHottestYears(data);
    var coldest_temp =  getColdestYears(data);

    var dataMonthly = getMonthlyData(data, hottest_temp, coldest_temp);

  
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
      .attr("class", "x_axis_hc")
      .call(d3.axisBottom(x)
              .tickFormat(d3.timeFormat("%b"))
            );


    svg.append("g")
      .attr("class", "y_axis_hc")
      .call(d3.axisLeft(y));

    var valueline_annual = getLineGenerators(x,y);

  
      dataMonthly.forEach((d)=>{

      //console.log(d[0].Year, "\n -----------------------------------\n");

      // Draw the line the line
      var line = svg.append("g")
                    .selectAll("path")
                    .data([d])
                    .enter()
                      .append("path")
                      .attr("d", valueline_annual)
                      .attr("id", String("path-"+d[0].Year))
                      .attr("class","line_chart_hottest_coldest")
      
      
      line.exit().remove();

    })


    var colorScale = d3.scaleLinear()
                      .domain(d3.extent(data, (x) => x.annual_value))
                      .range([1,0])

    for( var i=0; i<hottest_temp.length; i++){

        d3.select("#path-"+hottest_temp[i].Year)
          .style("stroke", d3.interpolateReds(colorScale(coldest_temp[i].annual_value)))
          .style("stroke-opacity", "100%")
          .style("stroke-width", "2")

        
        d3.select("#path-"+coldest_temp[i].Year)
          .style("stroke",  d3.interpolateBlues(colorScale(coldest_temp[i].annual_value)))
          .style("stroke-opacity", "100%")
          .style("stroke-width", "2")
      
          

    }
    

  

  
   
 
}




function UpdateHottestColdestLineChart(data){

   
  var hottest_temp =  getHottestYears(data);
  var coldest_temp =  getColdestYears(data);

  var dataMonthly = getMonthlyData(data, hottest_temp, coldest_temp);


  //var years= Object.keys(dataMonthly);

  var svg = d3.select("#hottest_coldest_container .graphics")
             
              
  var scales = getScales(data);
  var x = scales[0] 
  var y =  scales[1]


  //update y axis
  d3.select(".y_axis_hc")
    .transition().duration(500)
    .call(d3.axisLeft(y));  

  var valueline_annual = getLineGenerators(x,y);

  dataMonthly.forEach((d)=>{

    //console.log(d[0].Year, "\n -----------------------------------\n");

    // Draw the line the line
  var line = svg.select(".line_chart_hottest_coldest").selectAll("path").data([d]);
  
  line.exit().remove();
              
  line.enter().append("path")
                  .attr("d", valueline_annual)
                  .attr("id", String("path-"+d[0].Year))
              

  })


  var colorScale = d3.scaleLinear()
                    .domain(d3.extent(data, (x) => x.annual_value))
                    .range([1,0])

  for( var i=0; i<hottest_temp.length; i++){

      d3.select("#path-"+hottest_temp[i].Year)
        .style("stroke", d3.interpolateReds(colorScale(coldest_temp[i].annual_value)))
        .style("stroke-opacity", "100%")
        .style("stroke-width", "2")

      
      d3.select("#path-"+coldest_temp[i].Year)
        .style("stroke",  d3.interpolateBlues(colorScale(coldest_temp[i].annual_value)))
        .style("stroke-opacity", "100%")
        .style("stroke-width", "2")
    
        

  }
  




 

}