


function setAttributes(el, attrs) {
    for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
    }
}

var numberBearType=0;
var bearValue =[];
var bearName =[];
var jsonInStore = [];
var jsonPrepare = [];


function takeIdOfBear(index){
    console.log("bear in store : " + JSON.stringify(jsonInStore));
    var result = jsonInStore[index]['id'];  
    return result
}

function setBearValue(index){
    jsonPrepare = jsonInStore;
    for(var i=0 ; i< jsonInStore.length; i++){
        jsonPrepare[i]['active'] = 0;
    }
    console.log("-------Number bear : " + numberBearType);
        if(index == '-1'){
            console.log("In index -1");
            for(var i=0; i<numberBearType; i++){
                bearValue[i] = 1;
                jsonPrepare[i]["id"] = takeIdOfBear(i);
                jsonPrepare[i]["active"] = 1;
            }
        }else{
            var indexToId = parseInt(index)+1;
            for(var i=0; i<numberBearType; i++){
                console.log("in set value - jsonInStore[i][id] : " + parseInt(jsonInStore[i]['id'])+' - index : '+indexToId);
                if(parseInt(jsonInStore[i]['id']) == indexToId){
                    bearValue[i] = 1;
                    jsonPrepare[i]['id'] = takeIdOfBear(i);
                    jsonPrepare[i]['active'] = 1;
                }else{
                    bearValue[i] = 0;
                    jsonPrepare[i]['id'] = takeIdOfBear(i);
                    jsonPrepare[i]['active'] = 0;
                }
                
            }
        }
    
        console.log("Check bearValue arr");
        for(var i=0; i<bearValue.length; i++){
            console.log("["+i+"] : " +bearValue[i] );
        }
}

/*

function filterOrder(){
    console.log("--- in loadFilter");
    Promise.resolve(
        //await loadFilter()
    )
}

function setBearOrder(index){
    console.log("--- in setBEar");
    Promise.resolve(
        setBearValue(index)
    )
}

function bearInterfaceOrder(){
    console.log("--- in Interface");
    Promise.resolve(
        bearMCPCInterface()
    )
}

function loadProductOrder(){
    Promise.resolve(
        loadProducts()
    )
}*/


async function loadPage(){
    console.log("in take index");
    var url = document.location.href,
                params = url.split('?')[1].split('&'),
                data = {}, tmp;
    for (var i = 0, l = params.length; i < l; i++) {
                tmp = params[i].split('=');
                data[tmp[0]] = tmp[1];
    }
    console.log("index taken : " +data.index );
    indexBear = data.index;
    console.log("--loadFilter");
    await loadFilter();
    console.log("--setBEar");
    await setBearValue(indexBear);
    console.log("--Interface");
    await  bearMCPCInterface();
    console.log("--laod product");
    await loadProducts();

    /*
    loadFilter(function(){
        console.log("-------Number bear : " + numberBearType);
        if(index == -1){
            console.log("In index -1");
            for(var i=0; i<numberBearType; i++){
                bearValue[i] = 1;
            }
        }else{
            bearValue[index] = 1;
        }
    
        console.log("Check bearValue arr");
        for(var i=0; i<bearValue.length; i++){
            console.log("["+i+"] : " +bearValue[i] );
        }
    
        bearMCPCInterface(function(){
            console.log("Go to load products");
            loadProducts();
        });
    });*/
    /*
    setTimeout(function(){
        loadFilter();
    }, 400);
    
    setTimeout(function(){
        console.log("-------Number bear : " + numberBearType);
        if(index == -1){
            console.log("In index -1");
            for(var i=0; i<numberBearType; i++){
                bearValue[i] = 1;
            }
        }else{
            bearValue[index] = 1;
        }
    
        console.log("Check bearValue arr");
        for(var i=0; i<bearValue.length; i++){
            console.log("["+i+"] : " +bearValue[i] );
        }
    
        bearMCPCInterface();
    }, 600);
    

    setTimeout(function(){
        loadProducts();
    }, 1000);*/
}

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
}
*/
//sale button value
var saleButtonOn = 0;
//stock button value
var stockButtonOn =0;




function prepareBearForCalling(){
    /*
    var bearjson = [];
    for(var i=0;i<bearName.length;i++){
        console.log("-->Bear name -> : " + bearName[i]);
        var jsonCell = '{'+
           + bearName[i].toString()+':' + bearValue[i]+
        '}';
        bearjson[i] = jsonCell;
        console.log('bear json : ' + bearjson[i] + " - ");
    }*/
    jsonStr['bear'] = jsonPrepare;
    console.log("->bear ready : " + JSON.stringify(jsonStr));
}

async function bearControl(index){
    console.log("in bear control");
    if(bearValue[index] == 0){
        bearValue[index] = 1;
        jsonPrepare[index]['id'] = takeIdOfBear(index);
        jsonPrepare[index]['active'] = 1;
    }else{
        bearValue[index] = 0;
        jsonPrepare[index]['id'] = takeIdOfBear(index);
        jsonPrepare[index]['active'] = 0;
    }

    
    bearMCPCInterface();
    
    await loadProducts();

}

function bearMCPCInterface(){
    console.log("in bear interface");
    var typeBear="";
    for(var i=0;i<bearValue.length;i++){
        typeBear = bearName[i];
        if(bearValue[i] == 1){
            console.log("bearValue["+i+"] : 1");
            console.log('check product page id : ' + "productpage-"+typeBear);
            document.getElementById("productpage-"+typeBear).style.backgroundColor="#bfbfbf";
        }else{
            console.log("bearValue["+i+"] : 0");
            console.log('check product page id : ' + "productpage-"+typeBear);
            document.getElementById("productpage-"+typeBear).style.backgroundColor="white";
        }
    }
    prepareBearForCalling();


}

var jsonStr = {
    'bear':[],
    'type_product' : '0',
    'name_controller' : '0',
    'sale' : '0',
    'in_stock' : '0',
};

async function filterControl(input){
    console.log("in type control");
    try{
        console.log("In change by js");
        document.getElementById(input).checked=true;
    }catch(e){
        console.log("error : " + e);
    }finally{
        if(input.includes('type')){
            input = input.toString().replaceAll('type', '');
            jsonStr['type_product']=input;
        }else{
            input = input.toString().replaceAll('name', '');
            jsonStr['name_controller']=input;
        }
        
    }
    await loadProducts();
    
}



async function saleButton(){
    console.log("in sale ");
    var saleButtonChange = document.getElementById('sale-icon');
    if(saleButtonOn == 0) {
        saleButtonOn = 1;
        saleButtonChange.setAttribute("src","../../assets/page-img/product-page/sale-icon-red.png");
    }else{
        saleButtonOn = 0;
        saleButtonChange.setAttribute("src","../../assets/page-img/product-page/sale-icon-black.png");
    }

    if(saleButtonOn == 0){
        jsonStr['sale'] = '0';
    }else{
        jsonStr['sale'] ='1';
    }
    await loadProducts();
}

async function instockButton(){
    console.log("in stock ");
    var stockButtonChange = document.getElementById('stock-icon');
    if(stockButtonOn == 0) {
        stockButtonOn = 1;
        stockButtonChange.setAttribute("src","../../assets/page-img/product-page/shopping-cart-icon-red.png");
    }else{
        stockButtonOn = 0;
        stockButtonChange.setAttribute("src","../../assets/page-img/product-page/shopping-cart-icon-black.png");
    }

    if(stockButtonOn == 0){
        jsonStr['in_stock'] = '0';
    }else{
        jsonStr['in_stock'] = '1';
    }
    await loadProducts();
}

function removeTags(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function accessProductDetail(url){
    //window.open(url);
    location.href = url;

}

async function loadProducts(){
    console.log("json ready : " + JSON.stringify(jsonStr));
    removeTags("productpage-showing-sec");
    var result= await $.ajax({
        type: "POST",
        url: mainUrl+"serverside/site_control/product_page_product_load.php",
        dataType: 'json',
        data: {
            'data' :jsonStr,
        },
        success: function (file_content) {
            //Output formatted JSON
            //response - {
            //      'complete' : ,
            //      'complete_code' :,
            //      'data' : {
            //          'controller' : {
            //                  [0] : {
            //                          'name':,
            //                          "controller_value"  ; ,
            //                      }
            //              }
            //          'type' : {
            //              [0] : {
            //                          'name':,
            //                          "controller_value"  ; ,
            //                      }
            //              }        
            //              
            //          }
            //     }
            //}
            console.log("Success response : " + JSON.stringify(file_content));
            if(file_content['data']!=undefined){
                //create result products
                for(var i=0;i<file_content['data'].length;i++){
                    //main pic container
                    var imgCreated = document.createElement("img");
                    setAttributes(imgCreated,{
                        "class" : "productpage-showing-img",
                        "src" : file_content['data'][i]['main_pic']
                    });
                    var imgContainerCreated = document.createElement("div");
                    setAttributes(imgContainerCreated,{
                        "class" : "productpage-showing-img-sec"
                    });
                    imgContainerCreated.appendChild(imgCreated);
                    //name
                    var mainNameCreated = document.createElement("h2");
                    mainNameCreated.innerText = file_content['data'][i]['name'];
                    setAttributes(mainNameCreated,{
                        "class" : "productpage-showing-title"
                    });
                    //button 
                    var textButtonCreated = document.createElement("p");
                    textButtonCreated.innerText="Подробнее";
                    setAttributes(textButtonCreated,{
                        "class" : "productpage-showing-button-text"
                    });
                    var buttonCreated = document.createElement("div");
                    var createEvent = "accessProductDetail('"+file_content['data'][i]['product_link']+"')";
                    setAttributes(buttonCreated,{
                        "class" : "productpage-showing-button",
                        "onclick" : createEvent,
                    });
                    buttonCreated.appendChild(textButtonCreated );
                    //Through in biggest div
                    var productContainerCreated = document.createElement("div");
                    setAttributes(productContainerCreated,{
                        "class" : "productpage-showing-sec"
                    });
                    productContainerCreated.appendChild(imgContainerCreated);
                    productContainerCreated.appendChild(mainNameCreated);
                    productContainerCreated.appendChild(buttonCreated);
                    var productShowingSecDetected = document.getElementById("productpage-product-showing-sec-add");
                    productShowingSecDetected.appendChild(productContainerCreated);
                }
                
            }
            
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    endLoadingScreen();
    return result;
}
    

async function loadFilter() {
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+"serverside/site_control/product_page_filter_load.php",
        dataType: 'json',
        data: {
            'data': 1,
        },
        success: function (file_content) {
            //Output formatted JSON
            //response - {
            //      'complete' : ,
            //      'complete_code' :,
            //      'data' : {
            //          'controller' : {
            //                  [0] : {
            //                          'name':,
            //                          "controller_value"  ; ,
            //                      }
            //              }
            //          'type' : {
            //              [0] : {
            //                          'name':,
            //                          "controller_value"  ; ,
            //                      }
            //              }        
            //              
            //          }
            //     }
            //}
            console.log("Success response : " + JSON.stringify(file_content));
            jsonInStore = file_content['data']['bear'];
            
            //Start add filter element 
            //setting interface
            //Load bear filter
            numberBearType =  file_content['data']['bear'].length;
            console.log(" number bear type in load filter : " + numberBearType);
            for(var i=0 ; i<file_content['data']['bear'].length ; i++) {
                        console.log('bear : '+i+'step 1');
                        bearName[i] = file_content['data']['bear'][i]['name'].toString();
                        //h1
                        console.log('bear : '+i+'step 2');
                        var hBearText = document.createElement('h1');
                        hBearText.innerText = file_content['data']['bear'][i]['name'];
                        console.log('bear : '+i+'step 3');
                        //bear choice container
                        var bearChoiceContainer = document.createElement('div');
                        console.log('bear : '+i+'step 4');
                        setAttributes(bearChoiceContainer,{
                            'class' : 'productpage-product-bear-choice',
                            'id' : 'productpage-' +file_content['data']['bear'][i]['name'],
                            'onclick' : 'bearControl('+i+')'
                        });
                        console.log('bear : '+i+'step 5');
                        bearChoiceContainer.appendChild(hBearText);
                        //through into section
                        document.getElementById('productpage-bear-type-filter-foradd').appendChild(bearChoiceContainer);
            }

            
            if(file_content['data']['page_interface']['type'] == '1'){
                //type product
                for(var i=0;i<Object.keys(file_content['data']['type']).length;i++){
                    var type_product_created = document.createElement("input");
                    var id = file_content['data']['type'][i]['type_value'] ;
                    var functionCallPrepare = "filterControl('type" + id + "')";
                    setAttributes(type_product_created, {"type" : "radio",
                                                        "id" : 'type'+id,
                                                        "name" : "type_product",
                                                        "value" :  file_content['data']['type'][i]['type_value']},
                                                        );
                    var type_product_text_created = document.createElement("label");
                    setAttributes(type_product_text_created,{"for" : 'type'+id});
                    type_product_text_created.innerText = file_content['data']['type'][i]['name']
                    var type_name_filter_sec = document.createElement('div');
                    setAttributes(type_name_filter_sec, {"class" : "filter-choice-sec",
                                                        "onchange": functionCallPrepare});
                    type_name_filter_sec .appendChild(type_product_created);
                    type_name_filter_sec .appendChild(type_product_text_created);
                    var type_product_container = document.getElementById("product-half-filter-type-product-add");
                    type_product_container.appendChild(type_name_filter_sec);
                }
            }else{
                document.getElementById("productpage-half-filter-type-product").innerHTML ='';
            }  

            

            if(file_content['data']['page_interface']['controller'] == '1'){
                //name_controller
                for(var i=0;i<Object.keys(file_content['data']['controller']).length;i++){
                    var controller_name_created = document.createElement("input");
                    var id = file_content['data']['controller'][i]['controller_value'] ;
                    var functionCallPrepare = "filterControl('name" + id + "')";
                    setAttributes(controller_name_created, {"type" : "radio",
                                                        "id" : 'name'+id,
                                                        "name" : "name_controller",
                                                        "value" :  (file_content['data']['controller'][i]['controller_value'])});
                    var controller_name_text_created = document.createElement("label");
                    setAttributes(controller_name_text_created,{"for" : 'name'+id});
                    controller_name_text_created.innerText = file_content['data']['controller'][i]['name'];
                    var controller_name_filter_sec = document.createElement('div');
                    setAttributes(controller_name_filter_sec, {"class" : "filter-choice-sec",
                                                        "onchange": functionCallPrepare});
                    controller_name_filter_sec.appendChild(controller_name_created);
                    controller_name_filter_sec.appendChild(controller_name_text_created);
                    var controller_name_container = document.getElementById("product-half-filter-name-controller-add");
                    controller_name_container.appendChild(controller_name_filter_sec);
                }
            }else{
                document.getElementById("productpage-half-filter-name-processor").innerHTML ='';

            }

            if(file_content['data']['page_interface']['sale'] == '1'){
                var text = document.createElement('h3');
                text.innerText = 'Показывать только товары со скидкой';
                
                var img = document.createElement('img');
                setAttributes(img,{
                    'id' : 'sale-icon',
                    'src' : '../../assets/page-img/product-page/sale-icon-black.png',
                    'width' : '16',
                    'height' : '16'
                });

                //productpage-half-filter-sale-stock
                var halfFilterSale = document.createElement('div');
                setAttributes(halfFilterSale,{
                    'class' : 'productpage-half-filter-sale-stock',
                    'onclick' : "saleButton()"
                });

                halfFilterSale.appendChild(img);
                halfFilterSale.appendChild(text);

                document.getElementById('productpage-half-filter-sale').innerHTML='';

                document.getElementById('productpage-half-filter-sale').appendChild(halfFilterSale);
            }


            if(file_content['data']['page_interface']['instock'] == '1'){
                var text = document.createElement('h3');
                text.innerText = 'Только в наличии';
                
                var img = document.createElement('img');
                setAttributes(img,{
                    'id' : 'stock-icon',
                    'src' : '../../assets/page-img/product-page/shopping-cart-icon-black.png',
                    'width' : '16',
                    'height' : '16'
                });

                //productpage-half-filter-sale-stock
                var halfFilterSale = document.createElement('div');
                setAttributes(halfFilterSale,{
                    'class' : 'productpage-half-filter-sale-stock',
                    'onclick' : "instockButton()"
                });

                halfFilterSale.appendChild(img);
                halfFilterSale.appendChild(text);
                document.getElementById('product-half-filter-instock').innerHTML='';
                document.getElementById('product-half-filter-instock').appendChild(halfFilterSale);
            }

            
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}