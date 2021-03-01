function init_page() {
  init_DropDownMenu_slect2();

  // load map
  load_map();

  // trovare modo automatico per trovare min e max
  init_slider(1743, 2020, 1);

  init_map_controls();
  allDeafaultDataset();
}