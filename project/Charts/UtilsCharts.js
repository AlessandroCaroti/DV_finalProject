/** @format */

//UTILS FOR THE CHARTS:

function isInfoNaN(json_field) {
  return json_field == "NaN";
}

function existYear(data, year) {
  var x = false;
  data.forEach((d) => {
    if (d.Year == year) x = true;
  });

  return x;
}

function fisrtLetterUpperCase(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getMonthName(month) {
  var monthName = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthName[month - 1];
}

function getFullMonthName(month) {
  var monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return monthName[month - 1];
}

function isInList(el, list) {
  for (var i = 0; i < list.length; i++) {
    if (el == list[i].Year) return true;
  }

  return false;
}

function getUniqueValue(value, index, self) {
  return self.indexOf(value) === index;
}

function getIdxList(el, list) {
  for (var i = 0; i < list.length; i++) {
    if (el == list[i].Year) return i;
  }

  return -1;
}

//-----------------------------------------------------------------------------------------
