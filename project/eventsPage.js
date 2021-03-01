function NavBarDropDownEvt() {
  
    var drop_div = document.getElementById("contributors-div");
    var ul = document.getElementById("contributors-elem");
  
    if (
      (drop_div.style.display == "" || drop_div.style.display == "none") &&
      (ul.style.display == "" || ul.style.display == "none")
    ) {
      drop_div.style.display = "block";
      ul.style.display = "block";
    
      document.getElementById("bracket_drop_nav").style.transform="rotate(180deg)";
  
    } else {
      drop_div.style.display = "none";
      ul.style.display = "none";
      document.getElementById("bracket_drop_nav").style.transform="none";
    }
  }
  
  
  
  function scrollFunction() {
  
    var btn= document.getElementById("btn-back-top");
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
     btn.style.display = "block";
    } else {
     btn.style.display = "none";
    }
  }
  
  
  function topFunction() {
    document.documentElement.scrollTop = 0; 
  }