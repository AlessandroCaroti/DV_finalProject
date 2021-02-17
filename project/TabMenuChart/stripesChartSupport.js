var margin_stripes = {'top': 30, 'right': 70, 'bottom': 40, 'left': 70};
var width_stripe = full_width - margin_stripes.left - margin_stripes.right;
var height_stripe = full_width*9/31 - margin_stripes.top - margin_stripes.bottom;

//the annual average from January to December 1950 is reported at June 1950. 
function getAnnualData(data){

    var data_annnual = [];

    data.forEach((d) => {
        
        if( d.Month == 6  ) data_annnual.push(d)
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


    var tooltip = d3.select("#stripechart .tooltip-map");
    tooltip.transition();
    var tipText =  String(
        "<b> Year: " + d.date.getFullYear()+"<br/>" +"<br/>" +
        "Annual Avg.  Anomaly: "+d.annual_anomaly.toFixed(2) +" &deg;C " +
        " &plusmn; " +  d.annual_unc.toFixed(2) + " </b>"
      )
    
    tooltip.style('left', String( (event.pageX) + 20) + "px" )
           .style('top', String( (event.pageY) - 20) + "px" )
           .style("display", "block")
           .html(tipText)

}

function stripesLeave(){
    var tooltip = d3.select("#stripechart .tooltip-map");
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
                .attr("width", width_stripe + margin_stripes.left + margin_stripes.right)
                .attr("height", height_stripe + margin_stripes.top + margin_stripes.bottom)
                .append("g")
                .attr("transform", "translate(" + margin_stripes.left + "," + margin_stripes.top + ")")
    
    var stripe_width = (width_stripe / data_annnual.length)+2;
    

    var stripes = svg.selectAll('rect')
                     .data(data_annnual)
                     .enter().append("rect")
                     .attr("class", "stripes")
                     .attr("x", (d) => {return  x(d.date.getFullYear())})
                     .attr("width",  stripe_width)
                     .attr("y",  y(0))
                     .attr("height", y(0.8))
                     .attr("fill", (d)  => colorStripes(data_annnual, d) ) 

    //Events Tooltip
    stripes.on("mouseover", stripesEnter)
           .on("mouseout", stripesLeave)
 
}


function colorStripes(data_annnual, d){

    var range_year =  document.getElementById('rage-year').value; 
    var colorScale = d3.scaleLinear()
                       .domain(d3.extent(data_annnual, (d) => d[range_year+"_anomaly"]))
                       .range([1,0])

    if( isNaN(d[range_year+"_anomaly"] ) ) return "rgb(153,153,153)";
    else
        return d3.interpolateRdBu( colorScale(d[range_year+"_anomaly"]))
}


function updateStripesChart(data){

    var data_annnual = getAnnualData(data);

    //Scales
    var scales = getStripesScales(data_annnual);
    var x = scales[0];
    var y = scales[1];

             
    
    var stripe_width = (width_stripe / data_annnual.length)+2;
    
    
    
    var svg = d3.select("#stripechart");

    
    var stripes= svg.selectAll('.stripes')
                     .data(data_annnual)

    stripes.exit().remove();
    
    stripes.attr("x", (d) => {return  x(d.date.getFullYear())})
            .attr("width",  stripe_width)
            .attr("y",  y(0))
            .attr("height", y(0.8))
            .attr("fill", (d) => colorStripes(data_annnual, d) )
            .merge(stripes)
            .on("mouseover", stripesEnter)
            .on("mouseout", stripesLeave)
                    
}