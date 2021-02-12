function create_legend(legend_group, labels, direction = "H") {
  labels.forEach(function (d) {
    //crete a new group for each lable
    var g = legend_group
      .append("g")
      .attr("id", d.name)
      .attr("enable", d.enable);
    
    // add the element to the new group (icon and text)
    create_label(g, d);

    //move the new group near the previus one
    g.attr(
      "transform",
      "translate(" + translation(g.node().getBBox(), direction) + ")"
    );
    
    //click to enable/diable the group
    g.selectAll("*").on("click", function () {
      change_status(g);
    });
  });
}

var pad = 10;
var last_pos = 0;

function translation(bBox, d) {
  var translation;
  if (d == "H") {
    translation = last_pos + " 0";
    last_pos = last_pos + pad + bBox.width;
  } else {
    translation = "0 " + last_pos;
    last_pos = last_pos + pad + bBox.height;
  }

  return translation;
}

function change_status(label_group) {
  if (label_group.attr("enable") == "y") {
    //change to not enable
    label_group.selectAll("*").transition().duration(300).style("opacity", 0.3);
    label_group.attr("enable", "n");
  } else {
    //otherwise set as enable
    label_group.selectAll("*").transition().duration(300).style("opacity", 1);
    label_group.attr("enable", "y");
  }
}

function create_label(group, label_info) {
  console.log(label_info);
  group
    .append("rect")
    .attr("x", 10)
    .attr("y", 10)
    .attr("width", 20)
    .attr("height", 15)
    .attr("fill", label_info.color)
    .classed("label", true);

  group
    .append("text")
    .attr("x", 35)
    .attr("y", 22)
    .text(label_info.name)
    .classed("label", true);
}

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", 960)
  .attr("height", 500);

var legend_section_1 = svg.append("g").attr("id", "legend_section");
var legend_section_2 = svg.append("g").attr("id", "legend_section");

/* 
Possible types are:
    -line
    -circle
    -full
*/
create_legend(legend_section_1, [
  { name: "Label_1", enable: "y", color: "red", type: "line", size: 5 },
  { name: "L_2", enable: "y", color: "green", type: "line" },
  { name: "Label_3", enable: "n", color: "blue", type: "circle", size: 2 },
]);

create_legend(
  legend_section_2,
  [
    { name: "Label_1", enable: "y", color: "red", type: "line", size: 5 },
    { name: "L_2", enable: "n", color: "green", type: "line" },
    { name: "Label_3", enable: "y", color: "blue", type: "circle", size: 2 },
  ],
  "V"
);
