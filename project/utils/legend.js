function create_legend(legend_group, labels, direction = "H", pad = 20) {
  labels.forEach(function (d) {
    //crete a new group for each lable
    var g = legend_group
      .append("g")
      .attr("id", d.name)
      .attr("enable", d.enable);

    // add the element to the new group (icon and text)
    create_label(g, d);
    update_status(g);
    //move the new group near the previus one
    g.attr(
      "transform",
      "translate(" + translation(g.node().getBBox(), direction, pad) + ")"
    );

    //click to enable/diable the group
    g.selectAll("*").on("click", function () {
      change_status(g);
    });
  });
}

var last_pos = 0;

function translation(bBox, d, pad) {
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

/*
  Change the statis of a grup.
  If is enamble flip it to disable, and viceversa
*/
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

function update_status(label_group) {
  if (label_group.attr("enable") != "y") {
    label_group.selectAll("*").transition().duration(300).style("opacity", 0.3);
  }
}

function create_label(group, label_info) {
  let icon_type = label_info.type;

  if (icon_type == "rect") {
    group
      .append("rect")
      .attr("x", 10)
      .attr("y", 10)
      .attr("width", 20)
      .attr("height", 15)
      .style("fill", label_info.color)
      .classed("label", true)
      .classed(label_info.class, true);

  } else if (icon_type == "circle") {
    group
      .append("circle")
      .attr("cx", 20)
      .attr("cy", 17.5)
      .attr("r", 1 * label_info.size)
      .attr("height", 15)
      .style("fill", label_info.color)
      .classed("label", true)
      .classed(label_info.class, true);

  } else if (icon_type == "line") {
    group
      .append("rect")
      .attr("x", 10)
      .attr("y", 17.5)
      .attr("width", 20)
      .attr("height", 1)
      .style("fill", label_info.color)
      .classed("label", true)
      .classed(label_info.class, true);
  }

  group
    .append("text")
    .attr("x", 35)
    .attr("y", 22)
    .text(label_info.name)
    .classed("label", true);
}

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

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
  { name: "Label_1", enable: "y", color: "red", type: "rect", size: 5 },
  { name: "L_2", enable: "y", color: "green", type: "rect" },
  { name: "Label_3", enable: "n", color: "blue", type: "circle", size: 10 },
  { name: "Label_4", enable: "y", type: "line", size: 1, class:"gold_line" },
]);

create_legend(
  legend_section_2,
  [
    { name: "Label_1", enable: "y", color: "red", type: "rect", size: 5 },
    { name: "L_2", enable: "n", color: "green", type: "rect" },
    { name: "Label_3", enable: "y", color: "blue", type: "circle", size: 7 },
    { name: "Label_4", enable: "y", type: "circle", size: 7, class:"red_circle" },
  ],
  "V"
);
