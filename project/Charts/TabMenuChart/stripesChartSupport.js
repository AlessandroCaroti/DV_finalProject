var margin_stripes = {'top': 30, 'right': 70, 'bottom': 40, 'left': 70};
var width_stripe = full_width - margin_stripes.left - margin_stripes.right;
var height_stripe = full_width*9/31 - margin_stripes.top - margin_stripes.bottom;
var years_stripes;

function getYearsStripes(){

    var years = [];

    for(i=1750; i<= 2020; i++) years.push(i);

    return years;
}



//get x and Y scales of the Linechart
function getStripesScales(){

    var x = d3.scaleTime()
              .domain(d3.extent(years_stripes, function(d) { return d; }))
              .range([ 0, width ]);
              
    // Add Y axis
    var y = d3.scaleLinear()
             .domain([0,1])
             .range([ 0, height ]);
    
    return [x, y];

}


function dataStripes(data_annnual){
    
    var range_year = getCheckedValue("btn-range-year").value;
    var data2=[];
    var i = 0;
    years_stripes.forEach(yr => {

        if( isInList(yr, data_annnual) ){

            var idx = getIdxList(yr, data_annnual);
            data2.push(data_annnual[idx])
        }
            
        else{
            data2[i]={}
            data2[i]["Year"]= yr;
            data2[i][range_year+"_anomaly"] = +("NaN");
        }  

        i++;
    });

    return data2;
}


function createDefaultStripesChart(data){
   
    years_stripes= getYearsStripes();
   
    var data_annnual = getAnnualData(data);
    data_annnual = dataStripes(data_annnual);
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
                     .attr("x", (d) => {return  x(d.Year)})
                     .attr("width",  stripe_width)
                     .attr("y",  y(0))
                     .attr("height", y(0.8))
                     .attr("fill", (d)  => colorStripes(data_annnual, d) ) 

    //Events Tooltip
    stripes.on("mouseover", stripesEnter)
           .on("mouseout", stripesLeave)
 
}


function colorStripes(data_annnual, d){

    var range_year = getCheckedValue("btn-range-year").value;
    var colorScale = d3.scaleLinear()
                       .domain(d3.extent(data_annnual, (d) => d[range_year+"_anomaly"]))
                       .range([1,0])

    if( isNaN(d[range_year+"_anomaly"] ) ) return "rgb(153,153,153)";
    else
        return d3.interpolateRdBu( colorScale(d[range_year+"_anomaly"]))
}


function updateStripesChart(data){

    var data_annnual = getAnnualData(data);
    data_annnual = dataStripes(data_annnual);

    //Scales
    var scales = getStripesScales(data_annnual);
    var x = scales[0];
    var y = scales[1];

             
    
    var stripe_width = (width_stripe / data_annnual.length)+2;
    
    
    
    var svg = d3.select("#stripechart");

    
    var stripes= svg.selectAll('.stripes')
                     .data(data_annnual)

    stripes.exit().remove();
    
    stripes.attr("x", (d) => { return  x(d.Year)})
            .attr("width",  stripe_width)
            .attr("y",  y(0))
            .attr("height", y(0.8))
            .attr("fill", (d) => colorStripes(data_annnual, d) )
            .merge(stripes)
            .on("mouseover", stripesEnter)
            .on("mouseout", stripesLeave)
                    
}