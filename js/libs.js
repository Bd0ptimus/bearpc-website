const mainUrl = "http://localhost/";

function setAttributes(el, attrs) {
    for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
    }
}


function endLoadingScreen(){
    document.querySelector(
        "#loader").style.display = "none";
      document.querySelector(
        "body").style.visibility = "visible";
}

function startLoadingScreen(){
    document.querySelector(
        "body").style.visibility = "hidden";
      document.querySelector(
        "#loader").style.visibility = "visible";
}


function correctFontsizeInput(id){
  document.getElementById(id).addEventListener('keyup', function () {
      this.value = (this.value.toUpperCase().replace(/[^\d|0-9]/g, ''))
  });
}