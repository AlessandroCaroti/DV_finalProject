
//the annual average from January to December 1950 is reported at June 1950. 
function getAnnualData(data){

    var data_annnual = [];

    data.forEach((d) => {
        
        if( d.Month == 5 && !isNaN(d.annual_anomaly) ) data_annnual.push(d)
    });
    
    return data_annnual;
}

//get x and Y scales of the Linechart
function getStripesScales(data_annnual){

    var x = d3.scaleTime()
              .domain(d3.extent(data_annnual, function(d) { return d.date.getFullYear(); }))
              .range([ 0, width ]);
                        
    // Add Y axis
    var y = d3.scaleLinear()
             .domain([0,1])
             .range([ 0, height ]);
    
    return [x, y];

}


function stripesEnter(event, d){


    var tooltip = d3.select("#stripechart .tooltip");
    tooltip.transition();
    var tipText =  String(
        "<b> Year: " + d.date.getFullYear()+"<br/>" +"<br/>" +
        "Annual Average Temperature: "+d.annual_anomaly.toFixed(2) +" &deg;C " +
        " &plusmn; " +  d.annual_unc.toFixed(2) + " </b>"
      )
    
    tooltip.style('left', String( (event.pageX) + 20) + "px" )
           .style('top', String( (event.pageY) - 20) + "px" )
           .style("display", "block")
           .html(tipText)

}

function stripesLeave(){
    var tooltip = d3.select("#stripechart .tooltip");
    if (tooltip) tooltip.style('display', 'none');
}


function createDefaultStripesChart(data){

    var data_annnual = getAnnualData(data);


    //Scales
    var scales = getStripesScales(data_annnual);
    var x = scales[0];
    var y = scales[1];

    
    var svg = d3.select("#stripechart")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
    var stripe_width = x(data_annnual[1].date.getFullYear()) - x(data_annnual[0].date.getFullYear());
    
    var colorScale = d3.scaleLinear()
                       .domain(d3.extent(data_annnual, (d) => d.annual_anomaly))
                       .range([1,0])
                       

    var stripes = svg.selectAll('rect')
                     .data(data_annnual)
                     .enter().append("rect")
                     .attr("class", "stripes")
                     .attr("x", (d) => {return  x(d.date.getFullYear())})
                     .attr("width",  stripe_width)
                     .attr("y",  y(0))
                     .attr("height", y(0.8))
                     .attr("fill", (d) => d3.interpolateRdBu( colorScale(d.annual_anomaly) ) )

    
    //Events Tooltip
    stripes.on("mouseover", stripesEnter)
           .on("mouseout", stripesLeave)

  
}



function updateStripesChart(data){

    var data_annnual = getAnnualData(data);

    //Scales
    var scales = getStripesScales(data_annnual);
    var x = scales[0];
    var y = scales[1];

             
    
    var stripe_width = width / data_annnual.length;
    
    var colorScale = d3.scaleLinear()
                       .domain(d3.extent(data_annnual, (d) => d.annual_anomaly))
                       .range([1,0])
    
    var svg = d3.select("#stripechart");

                svg.selectAll('.stripes')
                     .data(data_annnual)
                     .attr("x", (d) => {return  x(d.date.getFullYear())})
                     .attr("width",  stripe_width)
                     .attr("y",  y(0))
                     .attr("height", y(0.8))
                     .attr("fill", (d) => d3.interpolateRdBu( colorScale(d.annual_anomaly) ) )
                     .on("mouseover", stripesEnter)
                     .on("mouseout", stripesLeave)
                    

    //Events Tooltip
    

  
}