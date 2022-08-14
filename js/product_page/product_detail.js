/*
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
}*/

    
    
    function loadPage(id){
        startLoadingScreen();
        console.log("load page");
        loadFrontEnd();
        loadBackEnd(id);
        
    }

    function loadBackEnd(id){
        requestServer(id);
    }

    /*
    function setAttributes(el, attrs) {
        for(var key in attrs) {
        el.setAttribute(key, attrs[key]);
        }
    }*/

    function accessUrl(url){
        location.href=url;
    }

    function requestServer(id){
        jsonStr={
            'product_id' : id
        }
        console.log("in request server");
        $.ajax({
            type: "POST",
            url: mainUrl+"serverside/site_control/product_detail_load.php",
            dataType: 'json',
            data: {
                'data' :jsonStr,
            },
            success: function (file_content) {
                console.log("Success response : " + JSON.stringify(file_content['data']));
                if(file_content['data']!=undefined){
                    //start create tags
                    //left part
                    //main pic
                    var mainPicCreated = document.createElement("img");
                    setAttributes(mainPicCreated,{
                        "class" : "productdetail-main-pic",
                        "id" : "main-pic",
                        "src" : file_content['data']['main_pic']
                    });
                    var mainPicSecDetected = document.getElementById("productdetail-main-pic-sec-id");
                    mainPicSecDetected.appendChild(mainPicCreated);

                    //sub pics
                    for(var i=0 ; i< Object.keys(file_content['data']['pics']).length;i++){
                        var subPicCreated = document.createElement("img");
                        var eventCreated = "mainPicControl('" + file_content['data']['pics'][i]+"')";
                        setAttributes(subPicCreated,{
                            "class" : "productdetail-sub-pic",
                            "onclick" : eventCreated,
                            "src" : file_content['data']['pics'][i]
                        });
                        var subPicContainerCreated = document.createElement("div");
                        setAttributes(subPicContainerCreated,{
                            "class" : "productdetail-sub-pics-sec"
                        });
                        //through pic into container
                        subPicContainerCreated.appendChild(subPicCreated);
                        var productPicSecDetected = document.getElementById("product-pics-container-add");
                        productPicSecDetected.appendChild(subPicContainerCreated);
                    }

                    //highlight texts
                    var highlightTextContainer = document.getElementById("product-highlight-text-sec-add");
                    for(var i=0 ; i< Object.keys(file_content['data']['highlight']).length;i++){
                        var highlightTextCreated = document.createElement("p");
                        setAttributes(highlightTextCreated,{
                            "class" : "productdetail-highlight-text"
                        });
                        highlightTextCreated.innerText = file_content['data']['highlight'][i];
                        highlightTextContainer.appendChild(highlightTextCreated);
                    }


                    //right part 
                    //bear type
                    document.getElementById("bear-type").innerText = file_content['data']['bear_type'];
                    //name
                    var mainNameCreated = document.getElementById("productdetail-name-add");
                    mainNameCreated.innerText = file_content['data']['name'];
                    //description table
                    var keysInDes = Object.keys(file_content['data']['description']);
                    var tableContainer = document.getElementById("table-des-add");
                    console.log("key in des : "+ keysInDes);
                    for(var i =0 ;i < keysInDes.length;i++){
                        var elementsInKey = (file_content['data']['description'][keysInDes[i]]);
                        if(elementsInKey.length == 1){
                            if(file_content['data']['description'][keysInDes[i]][0]!=0){
                                var titleCreated = document.createElement("td");
                                setAttributes(titleCreated,{
                                    "class" : "productdetail-cell" 
                                });
                                titleCreated.innerText = keysInDes[i];
                                var valueCreated = document.createElement("td");
                                setAttributes(valueCreated,{
                                    "class" : "productdetail-cell" 
                                });
                                valueCreated.innerText = file_content['data']['description'][keysInDes[i]][0];
                                var rowCreated = document.createElement("tr");
                                rowCreated.appendChild(titleCreated);
                                rowCreated.appendChild(valueCreated);
                                tableContainer.appendChild(rowCreated);
                            }
                            
                        }else{
                            var rowCreated = document.createElement("tr");
                                var titleCreated = document.createElement("td");
                                titleCreated.innerText = keysInDes[i];
                                setAttributes(titleCreated,{
                                    "rowspan" :elementsInKey.length,
                                    "class" : "productdetail-cell" 
                                });
                                rowCreated.appendChild(titleCreated);
                                var firstValueCell = document.createElement("td");
                                setAttributes(firstValueCell,{
                                    "class" : "productdetail-cell" 
                                });
                                firstValueCell.innerText =elementsInKey[0];
                                rowCreated.appendChild(firstValueCell);
                                tableContainer.appendChild(rowCreated);
                                for(y=1;y<elementsInKey.length;y++){
                                    var rowNextCreated = document.createElement("tr");
                                    var valueNextCreated = document.createElement("td");
                                    setAttributes(valueNextCreated,{
                                        "class" : "productdetail-cell" 
                                    });
                                    valueNextCreated.innerText = elementsInKey[y];
                                    rowNextCreated.appendChild(valueNextCreated);
                                    tableContainer.appendChild(rowNextCreated);
                                }

                        }
                    }

                    //download file 
                    for(var y=0;y<2;y++){
                        var id="";
                        if(y ==0){
                            id="productdetail-docs-sec-m-v";
                        }else{
                            id="productdetail-docs-sec-pc-v";
                        }
                        var fileSecDetected = document.getElementById(id);
                        //var fileSecDetectedM= document.getElementById("productdetail-docs-sec-m-v");
                        //var fileSecDetectedPc= document.getElementById("productdetail-docs-sec-pc-v");    
                        for(var i=0; i<file_content['data']['files'].length;i++){
                            var fileContainerCreated = document.createElement("div");
                            fileContainerCreated.setAttribute("class" , "productdetail-single-doc-sec");
                            var fileTextCreated = document.createElement("a");
                            setAttributes(fileTextCreated,{
                                "target" : "_blank",
                                "href" : file_content['data']['files'][i]['path']
                            });
                            fileTextCreated.innerText ='  ' +file_content['data']['files'][i]['name'];
                            var iconCreated = document.createElement("i");
                            setAttributes(iconCreated,{
                                "class" : "fa fa-file",
                                "aria-hidden" : "true"
                            });
                            fileContainerCreated.appendChild(iconCreated);
                            fileContainerCreated.appendChild(fileTextCreated);
                            fileSecDetected.appendChild(fileContainerCreated);
                            //fileSecDetectedPc.appendChild(fileContainerCreated);
                        }
                    }

                    //recommend products
                    for(var i=0;i<file_content['data']['recommend'].length;i++){
                        console.log("In load recommend products");
                        if(file_content['data']['recommend'][i]['id'] !=file_content['data']['id']){
                            console.log("found one : " + file_content['data']['id']);
                            //main img
                            var recommendImg = document.createElement('img');
                            setAttributes(recommendImg,{
                                "class" : "productdetail-recommend-img",
                                "src" : file_content['data']['recommend'][i]['main_pic']
                            });

                            //title section

                            //title text
                            var recommendTitle = document.createElement('p');
                            setAttributes(recommendTitle,{
                                "class" : "productdetail-recommend-title",
                            });
                            recommendTitle.innerText = file_content['data']['recommend'][i]['name'];

                            //title container
                            var recommendTitleContainer = document.createElement("div");
                            setAttributes(recommendTitleContainer,{
                                "class" : "productdetail-recommend-float-container"
                            })
                            recommendTitleContainer.appendChild(recommendTitle);

                            //title section
                            var recomendTitleSec = document.createElement("div");
                            setAttributes(recomendTitleSec,{
                                "class" : "productdetail-recommend-title-sec"
                            });
                            recomendTitleSec.appendChild(recommendTitleContainer);

                            //recommend biggest sec
                            var recommendProductBiggest = document.createElement("div");
                            setAttributes(recommendProductBiggest,{
                                "class" : "productdetail-recommend-product",
                                "onclick" : "accessUrl('"+file_content['data']['recommend'][i]['link']+"')"
                            });

                            recommendProductBiggest.appendChild(recommendImg);
                            recommendProductBiggest.appendChild(recomendTitleSec);

                            //through into container
                            document.getElementById("productdetail-recommend-sec-add").appendChild(recommendProductBiggest);
                        }
                    }
                    
                     
                }
                endLoadingScreen();
            },
            error: function (error_text) {
                console.log("Error response : " + JSON.stringify(error_text));
                //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
            }

        });
        
    }

    function downloadSecControl(){
        if(document.documentElement.clientWidth <= 750){
            $("#productdetail-des-btn-m-v").css("display",'block');
            $("#productdetail-docs-sec-m-v").css("display",'block');
            $("#productdetail-des-btn-pc-v").css("display",'none');
            $("#productdetail-docs-sec-pc-v").css("display",'none');
        }else{
            $("#productdetail-des-btn-m-v").css("display",'none');
            $("#productdetail-docs-sec-m-v").css("display",'none');
            $("#productdetail-des-btn-pc-v").css("display",'block');
            $("#productdetail-docs-sec-pc-v").css("display",'block');
        }
    }

    function loadFrontEnd(){
        //loadBtnStyle();
        downloadSecControl();
        loadDesDocView();
    }

    $(window).resize(function() {
        downloadSecControl();
    });
    // load btn style 
    function loadBtnStyle(){
        var btn = document.getElementById("description-btn");
        btn.setAttribute("style", "border-top : 3px solid #00335E");
    }
    // load description doc for product
    function loadDesDocView(){
        document.getElementById("des-table").style.display="flex";
        //document.getElementById("docs-sec").style.display="none";
    }

    function buttonControl(input){
        if(input == 0){
            document.getElementById("des-table").style.display="flex";
            document.getElementById("docs-sec").style.display="none";
            document.getElementById("description-btn").setAttribute("style", "border-top : 3px solid #00335E");
            document.getElementById("docs-btn").setAttribute("style", "border-top : 0px solid #00335E");
        }else{
            document.getElementById("des-table").style.display="none";
            document.getElementById("docs-sec").style.display="flex";
            document.getElementById("description-btn").setAttribute("style", "border-top : 0px solid #00335E");
            document.getElementById("docs-btn").setAttribute("style", "border-top : 3px solid #00335E");
        }
    }

    function mainPicControl(src){
        document.getElementById("main-pic").setAttribute("src", src);
    }