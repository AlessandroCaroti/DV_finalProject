function init_page() {
  // load map

  load_map();

  // set colorscale and  legend
  set_colorScale();
  draw_legend();

  // trovare modo automatico per trovare min e max
  init_slider(1743, 2020, 1);
  init_DropDownMenu_slect2();

  init_map_controls();
  allDeafaultDataset("Global Land");
  /*
  setTimeout(function () {
    page_ready()
  }, 10);
  */
}

function page_ready() {
    //mappa, slider, dropdownMenù, 
  $("body").addClass("loaded");
}
