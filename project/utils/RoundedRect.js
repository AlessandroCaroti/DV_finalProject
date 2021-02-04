// Returns path data for a rectangle with rounded right corners.
// The top-left corner is ⟨x,y⟩.
function rightRoundedRect(x, y, width, height, radius) {
  return "M" + x + "," + y
       + "h" + (width - radius)
       + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
       + "v" + (height - 2 * radius)
       + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
       + "h" + (radius - width)
       + "z";
}

// Returns path data for a rectangle with rounded bottom corners.
// The top-left corner is ⟨x,y⟩.
function bottomRoundedRect(x, y, width, height, radius) {
    return "M" + x + "," + y
            + "h" + (width)
            + "v" + (height-radius)
            + "a" + radius + "," + radius + " 0 0 1 " + (-radius) + "," + radius
            + "h" + (2* radius - width)
            + "a" + radius + "," + radius + " 0 0 1 " + (-radius) + "," + (-radius)
            + "Z";
}

// Returns path data for a rectangle with rounded top corners.
// The top-left corner is ⟨x,y⟩.
function topRoundedRect(x, y, width, height, radius) {
    y = y + radius;

    return "M" + x + "," + y
            + "a" + radius + "," + radius + " 0 0 1 " + (radius) + "," + (-radius)
            + "h" + (width - 2* radius)
            + "a" + radius + "," + radius + " 0 0 1 " + (radius) + "," + radius
            + "v" + (height - radius)
            + "h" + (-width)
            + "Z";            
}

// Returns path data for a rectangle with rounded left corners.
// The top-left corner is ⟨x,y⟩.
function leftRoundedRect(x, y, width, height, radius) {
    return "M" + x + "," + (y + radius)
            + "a" + radius + "," + radius + " 0 0 1 " + (radius) + "," + (-radius)
            + "h" + (width - radius)
            + "v" + height
            + "h" + (radius - width)
            + "a" + radius + "," + radius + " 0 0 1 " + (-radius) + "," + (-radius)
            + "Z";            
}

// Returns path data for a rectangle with all rounded corners.
// The top-left corner is ⟨x,y⟩.
function roundedRect(x, y, width, height, radius) {
    return "M" + x + "," + (y + radius)
            + "a" + radius + "," + radius + " 0 0 1 " + (radius) + "," + (-radius)
            + "h" + (width - 2*radius)
            + "a" + radius + "," + radius + " 0 0 1 " + (radius) + "," + (radius)
            + "v" + (height - 2*radius)
            + "a" + radius + "," + radius + " 0 0 1 " + (-radius) + "," + (radius)
            + "h" + (2*radius - width)
            + "a" + radius + "," + radius + " 0 0 1 " + (-radius) + "," + (-radius)
            + "Z";            
}



/*
// DECOMMENTARE QUESTA PARTE DI CODICE PER VEDERE IL RISULTATO SU roundedRect.html

var svg = d3.select("body").append("svg")
    .attr("width", 960)
    .attr("height", 500)
  .append("g")
    .attr("transform", "translate(230,230)");

var rect_1 = svg.append("path").attr("d", bottomRoundedRect(-200, -200, 40, 70, 15));
var rect_2 = svg.append("path").attr("d", rightRoundedRect(-140, -200, 70, 40, 15));
var rect_3 = svg.append("path").attr("d", topRoundedRect(-50, -200, 40, 70, 15));
var rect_4 = svg.append("path").attr("d", leftRoundedRect(0, -200, 70, 40, 15));
var rect_5 = svg.append("path").attr("d", roundedRect(-130, -100, 130, 60, 20));

*/ 