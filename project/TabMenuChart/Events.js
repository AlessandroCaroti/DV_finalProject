
//------------EVENTS HTML ELEMENTS----------------------------------

const countries = '../../data/Countries.csv';


function click_tab(evt, graphic_name) {
  

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(graphic_name).style.display = "block";
    evt.currentTarget.className += " active";
  
  }
  
  function loadData(){ 
    
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
          default_dataset(dataset);
    })
}