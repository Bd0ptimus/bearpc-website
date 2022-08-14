const sizeTransformFooter = 1005;

$(window).resize(function() {
    if(document.documentElement.clientWidth >= sizeTransformFooter){
        $(".footer-main-dropdown-content").css("display",'none');
        $(".footer-main-dropdown-content-v").css("display",'none');
        document.getElementById('footer-product-text').setAttribute('onclick','passIndexToProductPage(-1)');

    
    }else{
        document.getElementById('footer-product-text').setAttribute('onclick','');
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
    
    if(document.documentElement.clientWidth >= sizeTransformFooter){ 
        document.getElementById('footer-product-text').setAttribute('onclick','passIndexToProductPage(-1)');
    }else{
        document.getElementById('footer-product-text').setAttribute('onclick','');
    }
    $(".footer-main-dropdown-sec").hover(function(){
        if(document.documentElement.clientWidth >= sizeTransformFooter){     
            if($('.footer-main-dropdown-content').css('display') == 'none'){
                $(".footer-main-dropdown-content").css("display",'block');
            }else{
                $(".footer-main-dropdown-content").css("display",'none');
            }  
        }
        
    });
    $(".footer-main-dropdown-sec").click(function(){
        if(document.documentElement.clientWidth < sizeTransformFooter){     
            if($('.footer-main-dropdown-content-v').css('display') == 'none'){
                $(".footer-main-dropdown-content-v").css("display",'block');

            }else{
                $(".footer-main-dropdown-content-v").css("display",'none');
            }    
        }
        
    });

});
