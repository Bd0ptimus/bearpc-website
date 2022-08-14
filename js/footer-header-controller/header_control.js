const sizeTransform = 1005;

$(window).resize(function() {
    if(document.documentElement.clientWidth >= sizeTransform){
        $(".dropdown-content").css("display",'none');
        $(".dropdown-content-v").css("display",'none');
        document.getElementById('header-product-text').setAttribute('onclick','passIndexToProductPage(-1)');

    }else{
        document.getElementById('header-product-text').setAttribute('onclick','');
    }
  });
  
  
function passIndexToProductPage(index){
    console.log("in prepare pass");
    var url=mainUrl+"/html/product/index.html?index="+encodeURIComponent(index);
    document.location.href = url;
    
}
/*
function setAttributes(el, attrs) {
    for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
    }
}*/

$(document).ready(function(){
    if(document.documentElement.clientWidth >= sizeTransform){ 
        document.getElementById('header-product-text').setAttribute('onclick','passIndexToProductPage(-1)');
    }else {
        document.getElementById('header-product-text').setAttribute('onclick','');
    }
    //dropdown-content
    $(".dropdown-content").css("color" , "white");
    $(".dropdown-content").css("background-color" , "#00335E");
    $(".dropdown-content").css("transition" , "0.5s");
    $(".dropdown-content").css("cursor" , "pointer");
    
    //dropdown-content-v
    $(".dropdown-content-v").css("color" , "white");
    $(".dropdown-content-v").css("background-color" , "#00335E");
    $(".dropdown-content-v").css("cursor" , "pointer");

    $(".dropdown-sec").mouseenter(function(){
        if(document.documentElement.clientWidth >= sizeTransform){ 
            console.log("mouse enter: ");      
            $(".dropdown-content").css("display",'block');
        }
        
    })

    $(".dropdown-sec").mouseleave(function(){
        if(document.documentElement.clientWidth >= sizeTransform){
            console.log("mouse leave: ");  
            $(".dropdown-content").css("display",'none');
        }
        
    });

    
    $(".dropdown-sec").click(function(){
        if(document.documentElement.clientWidth < sizeTransform){     
            if($('.dropdown-content-v').css('display') == 'none'){
                $(".dropdown-content-v").css("display",'block');
                
            }else{
                $(".dropdown-content-v").css("display",'none');
            }
            
            console.log("in set: " + $('.dropdown-content-v').css('display'));      
        }
        
    });
});