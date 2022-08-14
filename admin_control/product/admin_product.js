const temporaryImgPath = mainUrl+'serverside/admin_control/img_uploaded_in_waiting/';
const temporaryFilePath = mainUrl+'serverside/admin_control/file_uploaded_in_waiting/';
$(function(){
    $("#product-navbar-sec-load").load("../nav-bar/index.html");
});

function accessUrl(url){
    location.href=url;
}
/*
function endLoadingScreen(){
    document.querySelector("#loader").style.display = "none";
    document.querySelector("body").style.visibility = "visible";
}

function startLoadingScreen(){
    document.querySelector("body").style.visibility = "hidden";
    document.querySelector("#loader").style.visibility = "visible";
}*/

function loadingIconControl(id, index){//index : 0: none, 1: loading, 2:green tick, 3: red tick
    var src = '';
    switch(index){
        case 0:
            src = '';
            break;
        case 1:
            src = mainUrl+'assets/page-img/loading/loading_gif.gif';
            break;
        case 2:
            src = mainUrl+'assets/page-img/loading/green_tick.png';
            break;
        case 3:
            src = mainUrl+'assets/page-img/loading/red_tick.png';
            break;
    }
    document.getElementById(id).src = src;
}



function checkLoginPage(){
    if(sessionStorage.getItem("login")!='true'){
        accessUrl(mainUrl+'admin_control');
    }else{
        onLoadPage();
    }
}


function setAttributes(el, attrs) {
    for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
    }
}


function setMainPic(src){
    document.getElementById('main-pic-choose').src = src;
}

async function deletePic(fileName, src){
    //document.getElementById(fileName).parentNode.removeChild(document.getElementById(fileName));
    document.getElementById(fileName).remove();
    console.log('main pic src : ' + document.getElementById('main-pic-choose').src);
    console.log('pic src : ' + src);
    if(document.getElementById('main-pic-choose').src==src){
        document.getElementById('main-pic-choose').src='';
    }
    if(idProductChoosing == 0){
        await deleteTemporaryPic(fileName);
    }
    
}

//page control



async function takeFile(index){ //index : 1-image, 2-file pdf
    //const files = document.querySelector('[type=file]').files
    var files = '';
    if(index == 1){
        files = document.getElementById('img-form').files;
        loadingIconControl('img-upload-icon',1)
    }else if(index==2){
        files = document.getElementById('file-form').files;
        loadingIconControl('file-upload-icon', 1);
    }
    
    const formData = new FormData();
  
    for (let i = 0; i < files.length; i++) {
      console.log('file length : ' + i);
      let file = files[i];
  
      formData.append('files[]', file);
    }
    if(index==1){
        await saveTemporaryPic(formData);
    }else if(index == 2){
        await saveTemporaryFile(formData);
    }
    

}

function watchFile(url){
    window.open(url,'_blank');
}

async function deleteFile(name){
    document.getElementById(name).remove();
    await deleteTemporaryFile(name);
}

async function deleteTemporaryFile(name){
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+'serverside/admin_control/delete_temporary_file.php',
        dataType: 'json',//
        data: {
            'data' : name,
        },
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));

        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}

function loadFileChooseInterface(src, name, value) {
    //create file list
                    //text field:
                    //label:
                    var filechoosingLabel = document.createElement('label');
                    filechoosingLabel.innerText = 'Метка файла : ';
                    //text field to change name
                    var nameTextFieldCreate = document.createElement('input');
                    setAttributes(nameTextFieldCreate,{
                        'type' : 'text',
                        'size' : 'auto',
                        'name' : name.split('.')[0],
                        'value': value
                    });
                    //name file in db 
                    var nameFileInDb = document.createElement('p');
                    setAttributes(nameFileInDb,{
                        'class' : 'filechoosing-temporary-name'
                    });
                    nameFileInDb.innerText = name;

                    //filechoosing-name-textfield sec
                    var fileChoosingNameSec = document.createElement('div');
                    setAttributes(fileChoosingNameSec,{
                        'class' : 'filechoosing-name-textfield'
                    });
                    fileChoosingNameSec.appendChild(filechoosingLabel);
                    fileChoosingNameSec.appendChild(nameTextFieldCreate);
                    fileChoosingNameSec.appendChild(nameFileInDb);

                    //choosing btns
                    //delete btn
                    var fileChoosingDeleteBtn = document.createElement('button');
                    setAttributes(fileChoosingDeleteBtn,{
                        'style' : 'color:red',
                        'onclick' : "deleteFile('"+name+"')"
                    })
                    fileChoosingDeleteBtn.innerText = 'Удалить';

                    //watch btn
                    var fileChoosingWatchBtn = document.createElement('button');
                    setAttributes(fileChoosingWatchBtn,{
                        'onclick' : "watchFile('"+src+"')"
                    });
                    fileChoosingWatchBtn.innerText = 'Посмотреть';
                    //filechoosing-delete-btn sec
                    var fileChoosingBtnSec=document.createElement('div');
                    setAttributes(fileChoosingBtnSec,{
                        'class' : 'filechoosing-delete-btn'
                    })
                    fileChoosingBtnSec.appendChild(fileChoosingDeleteBtn);
                    fileChoosingBtnSec.appendChild(fileChoosingWatchBtn);

                    //filechoosing-row sec
                    var fileChoosingRow = document.createElement('div');
                    setAttributes(fileChoosingRow,{
                        'class' : 'filechoosing-row',
                        'id' : name
                    });
                    fileChoosingRow.appendChild(fileChoosingNameSec);
                    fileChoosingRow.appendChild(fileChoosingBtnSec);

                    document.getElementById('filechoosing-sec').appendChild(fileChoosingRow);  

}

async function saveTemporaryFile(formData){
    console.log('url in send im server : ' +  mainUrl+'serverside/admin_control/save_waiting_img.php');
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+'serverside/admin_control/save_temporary_file.php',
        dataType: 'json',//
        data: formData,
        cache : false,
        processData: false,
        contentType : false,
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));
            if(file_content['complete_code'] == '0'){
                document.getElementById('filechoose-warning').innerText = file_content['data']['error'];
                loadingIconControl('file-upload-icon',3);
            }else{
                for(var i =0 ; i< file_content['data']['name'].length;i++){
                    loadFileChooseInterface(temporaryFilePath+file_content['data']['name'][i], file_content['data']['name'][i], '');
                    
                }
                loadingIconControl('file-upload-icon',2);
                
            }
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}

async function deleteTemporaryPic(name){
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+'serverside/admin_control/delete_temporary_img.php',
        dataType: 'json',//
        data: {
            'data' : name,
        },
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}

function loadImgChooseInterface(src, name){
    //create img loaded
    var imgCreate=document.createElement('img');
    setAttributes(imgCreate,{
        'class':'img-uploaded',
        'src' : src,
    });
    //var img cover 
    //set main pic btn
    var setMainBtn = document.createElement('button');
    setAttributes(setMainBtn,{
        'class' : 'img-main-text',
        'style' : 'color:blue;',
        'onclick' : "setMainPic('"+src+"')"
    });
    setMainBtn.innerText = 'Сделать главным фото';

    //set delete btn
    var deleteBtn = document.createElement('button');
    setAttributes(deleteBtn,{
        'class' : 'img-main-text',
        'style' : 'color:red;',
        'onclick' : "deletePic('"+name+"','"+src+"')"
    })
    deleteBtn.innerText = 'Удалить';

    //main text container
    var mainTextContainer = document.createElement('div');
    setAttributes(mainTextContainer,{
        'class' : 'img-main-text-container'
    });
    mainTextContainer.appendChild(setMainBtn);
    mainTextContainer.appendChild(deleteBtn);

    //uploaded cover
    var uploadedCover = document.createElement('div');
    setAttributes(uploadedCover,{
        'class' : 'img-uploaded-cover'
    });

    uploadedCover.appendChild(mainTextContainer);

    //img choice container
    var imgChoiceContainer = document.createElement('div');
    setAttributes(imgChoiceContainer,{
        'class' : 'imgchoosing-container',
        'id': name
    });

    imgChoiceContainer.appendChild(imgCreate);
    imgChoiceContainer.appendChild(uploadedCover);
    document.getElementById('imgchoosing-sec').appendChild(imgChoiceContainer);

}

async function saveTemporaryPic(formData){
    console.log('url in send im server : ' +  mainUrl+'serverside/admin_control/save_temporary_img.php');
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+'serverside/admin_control/save_temporary_img.php',
        dataType: 'json',//
        data: formData,
        cache : false,
        processData: false,
        contentType : false,
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));
            if(file_content['complete_code'] == '0'){
                document.getElementById('imgchoose-warning').innerText = file_content['data']['error'];
                loadingIconControl('img-upload-icon',3);
            }else{
                for(var i = 0; i< file_content['data']['name'].length;i++){
                    document.getElementById('imgchoose-warning').innerText = '';
                    loadImgChooseInterface(temporaryImgPath+file_content['data']['name'][i],file_content['data']['name'][i] )
                    
                }
                loadingIconControl('img-upload-icon',2);
                
            }
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}

function loadHighlightTableInterface (id, value){
    //add 
    //textfield
    var textFieldValueCreate = document.createElement('input');
    setAttributes(textFieldValueCreate,{
        'style' : 'width : 70%',
        'type' : 'text',
        'size' : '50',
        'value' : value
    })
    //delete btn
    var deleteBtnCreate = document.createElement('button');
    deleteBtnCreate.innerText = 'Удалить';
    var idBtnCreate  ='hightlight-value-'+id;
    setAttributes(deleteBtnCreate,{
        'class' : 'value-cell-btn-delete highlight-value',
        'id' : idBtnCreate,
        'onclick' : "deleteDataInHighlightTable('"+idBtnCreate+"')",
        'type' : 'button'
    });

    //hightlight-container
    var highlightContainerCreate = document.createElement('div');
    setAttributes(highlightContainerCreate,{
        'class' : 'hightlight-container'
    });
    highlightContainerCreate.appendChild(textFieldValueCreate);
    highlightContainerCreate.appendChild(deleteBtnCreate);

    document.getElementById('highligh-table-for-add').appendChild(highlightContainerCreate);
}

function addDataInHighlightTable(){
    var numberExistedValue =  document.getElementsByClassName('hightlight-container').length ;
    console.log('numberExistedValue : ' + numberExistedValue);
    var idOfHighestValue = document.getElementsByClassName('highlight-value')[numberExistedValue-1].id;
    console.log('Highest value : ' + idOfHighestValue);
    var idOfHighestValueSplit = idOfHighestValue.split('-');
    var idIndex = (parseInt(idOfHighestValueSplit[2])+1).toString();
    loadHighlightTableInterface(idIndex, '');
}

function deleteDataInHighlightTable(keyId){
    var numberExistedValue =  document.getElementsByClassName('hightlight-container').length ;
    if(numberExistedValue>1){
        document.getElementById(keyId).parentElement.remove();
    }
}


function loadDesKeyTableInterface(keyId,idForKey,key,valueArray){
    //value-cell-edit-sec
    var valueCellCreate = document.createElement('div');
    setAttributes(valueCellCreate,{
        'class' : 'value-cell-edit-sec',
    });
    //add key blank
    for(var i=0 ; i<valueArray.length;i++){
        //textfield for value
        var inputValueCreate = document.createElement('input');
        setAttributes(inputValueCreate,{
            'style' : 'width : 70%',
            'type' : 'text',
            'value' : valueArray[i],
            'size' : '50'
        });
        //delete button for value
        var deleteValueBtnCreate = document.createElement('button');
        deleteValueBtnCreate.innerText = 'Удалить';
        var idForDeleteValueBtn = 'des-key-'+idForKey+'-value-'+(i+1).toString();
        setAttributes(deleteValueBtnCreate,{
            'id' : idForDeleteValueBtn,
            'onclick' : "deleteDataInDesTable('" + idForDeleteValueBtn+"')",
            'class' : 'value-cell-btn-delete des-key-'+idForKey+'-value',
        });
 
        //value-cell-container
        var containerValueCreate = document.createElement('div');
        setAttributes(containerValueCreate,{
            'class' : 'value-cell-container'
        })
        containerValueCreate.appendChild(inputValueCreate);
        containerValueCreate.appendChild(deleteValueBtnCreate);
        valueCellCreate.appendChild(containerValueCreate);

    }

    

    //Add value Button
    var addValueBtnCreate = document.createElement('button');
    addValueBtnCreate.innerText = 'Добавить';
    var idAddValueBtn = 'add-value-key-'+idForKey;
    setAttributes(addValueBtnCreate,{
        'id' : idAddValueBtn,
        'onclick' : "addDataInDesTable('"+idAddValueBtn+"',2)",
        'type' : 'button'
    });

    //product-edit-value-cell
    var productEditValueCell = document.createElement('div');
    setAttributes(productEditValueCell,{
        'class' : 'product-edit-value-cell'
    });
    productEditValueCell.appendChild(valueCellCreate);
    productEditValueCell.appendChild(addValueBtnCreate);

    //textfield for key
    var inputKeyCreate = document.createElement('input');
    setAttributes(inputKeyCreate,{
        'style' : 'width : 70%',
        'type' : 'text',
        'value' : key,
        'size' : '50'
    });

    //product-edit-key-cell
    var productEditKeyCellCreate = document . createElement('div');
    setAttributes(productEditKeyCellCreate,{
        'class' : 'product-edit-key-cell'
    })
    productEditKeyCellCreate.appendChild(inputKeyCreate);
        
    //product-edit-info-row
    var productEditInfoRow = document.createElement('div');
    setAttributes(productEditInfoRow,{
        'class' : 'product-edit-info-row'
    });
    productEditInfoRow.appendChild(productEditKeyCellCreate);
    productEditInfoRow.appendChild(productEditValueCell);

    //delete key button :
    var deleteKeyBtn = document.createElement('button');
    deleteKeyBtn.innerText = 'Удалить';
    var idDeleteKeyBtn = 'des-key-' + idForKey;
    setAttributes(deleteKeyBtn,{
        'class' : 'info-row-delete-btn',
        'type' : 'button',
        'id' : idDeleteKeyBtn,
        'onclick' :"deleteDataInDesTable('"+idDeleteKeyBtn+"')"
    });

    //product-edit-info-sec
    var productEditInfoSec = document.createElement('div');
    setAttributes(productEditInfoSec,{
        'class' : 'product-edit-info-sec'
    })
    productEditInfoSec.appendChild(productEditInfoRow);
    productEditInfoSec.appendChild(deleteKeyBtn);
    document.getElementById(keyId).previousElementSibling.appendChild(productEditInfoSec);
}

function addDataInDesTable(keyId, addBtnType){ // addBtnType : 1 -add key, 2-add value
    var numkeys = document.getElementById(keyId).previousElementSibling.childElementCount;
    console.log('number keys : ' + numkeys);
    var classNameOfBtn='';
    if(addBtnType==1){
        classNameOfBtn = 'info-row-delete-btn';
        var idOfHighestKey = document.getElementsByClassName(classNameOfBtn)[numkeys-1].id;
        console.log('idOfHighestKey : ' + idOfHighestKey);
        var idOfhighestKeySplit = idOfHighestKey.split('-');
        var numberForIdCreate=(parseInt(idOfhighestKeySplit[2])+1).toString();
        loadDesKeyTableInterface(keyId, numberForIdCreate,'',['']);
        


    }else if(addBtnType==2){
        var idSplit = keyId.split('-');
        classNameOfBtn = 'des-'+idSplit[2]+'-'+idSplit[3]+'-value';
        var idOfHighestKey = document.getElementsByClassName(classNameOfBtn)[numkeys-1].id;
        console.log('idOfHighestKey : ' + idOfHighestKey);
        var idOfHighestKeySplit = idOfHighestKey.split('-');
        //add value blanks
        var deleteBtnCreate = document.createElement('button');
        deleteBtnCreate.innerText = 'Удалить';
        var idBtnCreate = 'des-'+idSplit[2]+'-'+idSplit[3]+'-value-'+(parseInt(idOfHighestKeySplit[4])+1).toString();
        setAttributes(deleteBtnCreate,{
            'id' : idBtnCreate,
            'onclick' : "deleteDataInDesTable('"+idBtnCreate+"')",
            'class' : 'value-cell-btn-delete '+classNameOfBtn,
        });

        var inputValueCreate = document.createElement('input');
        setAttributes(inputValueCreate,{
            'style' : 'width : 70%',
            'type' : 'text',
            'id' : 'name-edit',
            'value' : '',
            'size' : '50'
        });

        var containerValueCreate = document.createElement('div');
        setAttributes(containerValueCreate,{
            'class' : 'value-cell-container'
        })

        containerValueCreate.appendChild(inputValueCreate);
        containerValueCreate.appendChild(deleteBtnCreate);
        document.getElementById(keyId).previousElementSibling.appendChild(containerValueCreate);
    }




}

function deleteDataInDesTable(keyId){
    var numKey = (document.getElementById(keyId).parentElement).parentElement.childElementCount;
    if(numKey > 1){
        document.getElementById(keyId).parentElement.remove();
    }
}



async function onLoadPage(){
    modalOff();
    await loadProductExistedTable ();
    await loadInterfaceForAddNewProduct();
    addNewProductDeactivate();
    endLoadingScreen();
}

function addNewProductBtnActivate(nameProduct){
    document.getElementById('add-new-product-command-btn').style.visibility="visible";
    document.getElementById('add-new-product-label').innerText = "Вы меняете продукт '"+nameProduct+"'";
    document.getElementById('delete-confirm-btn').style.visibility="visible";
}

function addNewProductDeactivate(){
    document.getElementById('add-new-product-command-btn').style.visibility="hidden";
    document.getElementById('add-new-product-label').innerText = 'Вы добавляете новый продукт';
    document.getElementById('delete-confirm-btn').style.visibility="hidden";

}

async function productPageFilterControl(){
    var filterChoose = [];
    $('input:checkbox[name=productpage-filter]:checked').each(function(){
        filterChoose.push($(this).val());
    });

    var dataToServer = {
        bear:0,
        type:0,
        controller:0,
        sale:0,
        instock:0
    };

    for(var i=0; i< filterChoose.length;i++){
        if(filterChoose[i] == 'bear'){
            dataToServer.bear=1;
        }else if(filterChoose[i] == 'type'){
            dataToServer.type=1;
        }else if(filterChoose[i] == 'controller'){
            dataToServer.controller=1;
        }else if(filterChoose[i] == 'sale'){
            dataToServer.sale=1;
        }else if(filterChoose[i] == 'instock'){
            dataToServer.instock=1;
        }
    }

    var subUrl ='serverside/admin_control/product_center_page_filter_interface_change.php';

    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
        dataType: 'json',
        data: {
            'data' :dataToServer,
        },
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));
            if(file_content['conmplete'] == 1){
                location.reload();
            }
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }
    });
    return result;
}

//Modal
var modalOn = false;
function modalOff(){
    modalOn = false;
    modalControl('');
} 

function modalControl(text){
    console.log("Text in modal control: " + text);
    if(modalOn){
        document.getElementById('modal-control').style.display = 'block';
        document.body.classList.add("stop-scrolling");
        document.getElementById('modal-text').innerHTML = text;
    }else{
        document.getElementById('modal-control').style.display = 'none';
        document.body.classList.remove("stop-scrolling");

    }
}

var dataProductExisted = {};

async function loadProductExistedTable (){
    var subUrl = 'serverside/admin_control/product_center_load.php';
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
        dataType: 'json',
        data: {
            'data' :1,
        },
        success: function (file_content) {

            console.log("Success response : " + JSON.stringify(file_content));
            dataProductExisted = file_content;
            //Load existed table
            
            for(var i=0 ; i< file_content['data'].length ; i++) {
                //name:
                //name text
                var nameProductCreate = document.createElement('p');
                setAttributes(nameProductCreate,{
                    'class' : 'product-info-text'
                });
                nameProductCreate.innerText = file_content['data'][i]['name'];
                //name cell
                var nameCellCreate = document.createElement('div');
                setAttributes(nameCellCreate,{
                    'class' : 'product-table-name'
                });
                nameCellCreate.appendChild(nameProductCreate);


                //bear type
                //bear type text
                var bearTypeCreate = document.createElement('p');
                setAttributes(bearTypeCreate,{
                    'class' : 'product-info-text'
                });
                bearTypeCreate.innerText = file_content['data'][i]['bear_type'];
                //bear type cell
                var bearTypeCell = document.createElement('div');
                setAttributes(bearTypeCell,{
                    'class' : 'product-table-type-bear'
                });
                bearTypeCell.appendChild(bearTypeCreate);


                //type info texts
                //cell
                var typeCategoryCreate = document.createElement('div');
                setAttributes(typeCategoryCreate,{
                    'class' : 'product-table-type-category'
                });
                for(var y=0; y<file_content['data'][i]['type_product'].length; y++){
                    var typeTextCreate = document.createElement('p');
                    setAttributes(typeTextCreate,{
                        'class' : 'product-info-text'
                    })
                    typeTextCreate.innerText = file_content['data'][i]['type_product'][y]['name'];
                    typeCategoryCreate.appendChild(typeTextCreate);
                }


                //controller info texts
                var controllerCategoryCreate = document.createElement('div');
                setAttributes(controllerCategoryCreate,{
                    'class' : 'product-table-type-controller'
                })
                for(var y=0; y<file_content['data'][i]['controller_product'].length; y++){
                    var controllerTextCreate = document.createElement('p');
                    setAttributes(controllerTextCreate,{
                        'class' : 'product-info-text'
                    })
                    controllerTextCreate.innerText = file_content['data'][i]['controller_product'][y]['name'];
                    controllerCategoryCreate.appendChild(controllerTextCreate);
                }
                
                //info status
                var productTableStatus = document.createElement('div');
                setAttributes(productTableStatus,{
                    'class' : 'product-table-status'
                });
                if(file_content['data'][i]['sale'] == '1'){
                    var insaleText = document.createElement('p');
                    setAttributes(insaleText,{
                        'class' : 'product-info-text'
                    });
                    insaleText.innerText='Со скидкой';
                    productTableStatus.appendChild(insaleText);
                }

                if(file_content['data'][i]['stock'] == '1'){
                    var instockText = document.createElement('p');
                    setAttributes(instockText,{
                        'class' : 'product-info-text'
                    });
                    instockText.innerText='В наличие';
                    productTableStatus.appendChild(instockText);
                }

                //product-table-btn
                var editBtn = document.createElement('a');
                setAttributes(editBtn,{
                    'style':'color:blue;',
                    'onclick' : 'loadProductForEdit('+file_content['data'][i]['id']+")",
                    'class' :'product-info-btn'
                });
                editBtn.innerText ='Редактировать';

                var copyBtn=document.createElement('a');
                setAttributes(copyBtn,{
                    'style' : 'color:green;',
                    'class':'product-info-btn',
                    'onclick' : 'copyProduct('+file_content['data'][i]['id']+")",

                });
                copyBtn.innerText ='Копировать';
                var productTableBtn = document.createElement('div');
                productTableBtn.appendChild(editBtn);
                productTableBtn.appendChild(document.createElement('br'));
                productTableBtn.appendChild(copyBtn);

                //table rows
                var productRowCreate = document.createElement('div');
                setAttributes(productRowCreate,{
                    'class' : 'product-table-row',
                    //'onclick' : "loadProductForEdit("+file_content['data'][i]['id']+")"
                })
                productRowCreate.appendChild(nameCellCreate);
                productRowCreate.appendChild(bearTypeCell);
                productRowCreate.appendChild(typeCategoryCreate);
                productRowCreate.appendChild(controllerCategoryCreate);
                productRowCreate.appendChild(productTableStatus);
                productRowCreate.appendChild(productTableBtn);
                document.getElementById('product-table-container-foradd').appendChild(productRowCreate);
            } 
            
            
            //load page interface 
            for (var i=0 ; i<Object.keys(file_content['page_interface']).length;i++){
                var keyCell = Object.keys(file_content['page_interface'])[i];
                if(file_content['page_interface'][keyCell] == '1'){
                    var idCheckBox = 'productpage-filter-'+keyCell;
                    document.getElementById(idCheckBox).checked = true;
                }

            }
            
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }
    });
    return result;
}

//edit interface
function reloadInterFaceForEdit(){
    document.getElementById('name-edit-textfield').value = '';

    //type product
    var typeMenu = document.getElementById('types-menu').children;
    for(var i =0 ; i<typeMenu.length;i++){
        typeMenu[i].checked = false;
    }

    //controller menu
    var controllerMenu = document.getElementById('controller-menu').children;
    for(var i =0 ; i<controllerMenu.length;i++){
        controllerMenu[i].checked = false;
    }

    //img clear 
    document.getElementById("imgchoosing-sec").innerHTML='';

    //files clear
    document.getElementById('filechoosing-sec').innerHTML = '';

    //highlight clear
    document.getElementById('highligh-table-for-add').innerHTML='';

    //des clear
    document.getElementById('product-des-row-sec').innerHTML='';

    //warning clear
    document.getElementById('save-warning').innerHTML='';
}


var idProductChoosing = 0;
function loadProductForEdit(id){
    deleteProductAccept = false;
    reloadInterFaceForEdit();
    for(var i=0; i<dataProductExisted['data'].length;i++){
        if(id == dataProductExisted['data'][i]['id']){
            console.log('choosing product have id : ' +dataProductExisted['data'][i]['id'] );
            idProductChoosing = id;

            //name text field 
            try{
                document.getElementById('name-edit-textfield').value = dataProductExisted['data'][i]['name'];

            }catch(err){}
            //show name of product on label
            addNewProductBtnActivate(dataProductExisted['data'][i]['name']);
            //in stock
            try{
                var idForStockCheck = 'stock-'+dataProductExisted['data'][i]['stock'];
                document.getElementById(idForStockCheck).checked = true;
            }catch(err){}


            //in sale
            try{
                var idForSaleCheck = 'sale-'+dataProductExisted['data'][i]['sale'];
                document.getElementById(idForSaleCheck).checked = true;
            }catch(err){}


            //bear type
            try{
                var idForBearCheck = 'bear-type-'+dataProductExisted['data'][i]['bear_id'];
                document.getElementById(idForBearCheck).checked = true;
            }catch(err){}


            //type product
            try{
                for(var y=0 ; y<dataProductExisted['data'][i]['type_product'].length;y++ ){
                    var idForTypeCheck = 'type-product-'+dataProductExisted['data'][i]['type_product'][y]['id'];
                    document.getElementById(idForTypeCheck).checked = true;
                }
            }catch(err){}

            
            //controllers
            try{
                for(var y=0 ; y<dataProductExisted['data'][i]['controller_product'].length;y++ ){
                    var idForControllerCheck = 'type-controller-'+dataProductExisted['data'][i]['controller_product'][y]['id'];
                    document.getElementById(idForControllerCheck).checked = true;
                }
            }catch(err){}


            //images
            try{
                console.log('i : ' + i+' dataProductExisted : ' + dataProductExisted['data'].length);
                for(var y=0; y<dataProductExisted['data'][i]['images'].length;y++){
                    var nameImg = dataProductExisted['data'][i]['images'][y].split('/')[5];
                    loadImgChooseInterface(dataProductExisted['data'][i]['images'][y], nameImg);
                }
            }catch(err){}



            //main img
            try{
                document.getElementById('main-pic-choose').src =  dataProductExisted['data'][i]['main_image'];

            }catch(err){}
            
            //file
            try{
                for(var y=0; y < dataProductExisted['data'][i]['files'].length;y++){
                    var nameFileInStore = dataProductExisted['data'][i]['files'][y]['path'].split('/')[6];
                    loadFileChooseInterface(dataProductExisted['data'][i]['files'][y]['path'], nameFileInStore, dataProductExisted['data'][i]['files'][y]['name']);
                }
            }catch(err){}
            

            //highlight
            try{
                for(var y= 0 ; y< dataProductExisted['data'][i]['highlight'].length;y++){
                    loadHighlightTableInterface(y+1,dataProductExisted['data'][i]['highlight'][y]);
                }
            }catch(err){}
            

            //main description
            try{
                var keyInDes = Object.keys(dataProductExisted['data'][i]['description']);
                for(var y=0; y< keyInDes.length;y++){
                    //loadDesKeyTableInterface(keyId,idForKey,key,valueArray);
                    loadDesKeyTableInterface('add-key',(y+1).toString(),keyInDes[y], dataProductExisted['data'][i]['description'][keyInDes[y]]);
                }   
            }catch(err){}
            
            

        }
    }
}

async function copyProduct(id){
    addNewProductDeactivate();
    reloadInterFaceForEdit();
    idProductChoosing = 0;
    for(var i=0; i<dataProductExisted['data'].length;i++){
        if(id == dataProductExisted['data'][i]['id']){
            var filesInfoToserver = {
                images : dataProductExisted['data'][i]['images'],
                files : dataProductExisted['data'][i]['files'],
                main_image:dataProductExisted['data'][i]['main_image']
            }
            console.log('file to server : ' + JSON.stringify(filesInfoToserver));
            var dataAfterCopyFiles = await copyFiles(filesInfoToserver);


            //in stock
            try{
                var idForStockCheck = 'stock-'+dataProductExisted['data'][i]['stock'];
                document.getElementById(idForStockCheck).checked = true;
            }catch(err){}


            //in sale
            try{
                var idForSaleCheck = 'sale-'+dataProductExisted['data'][i]['sale'];
                document.getElementById(idForSaleCheck).checked = true;
            }catch(err){}


            //bear type
            try{
                var idForBearCheck = 'bear-type-'+dataProductExisted['data'][i]['bear_id'];
                document.getElementById(idForBearCheck).checked = true;
            }catch(err){}


            //type product
            try{
                for(var y=0 ; y<dataProductExisted['data'][i]['type_product'].length;y++ ){
                    var idForTypeCheck = 'type-product-'+dataProductExisted['data'][i]['type_product'][y]['id'];
                    document.getElementById(idForTypeCheck).checked = true;
                }
            }catch(err){}

            
            //controllers
            try{
                for(var y=0 ; y<dataProductExisted['data'][i]['controller_product'].length;y++ ){
                    var idForControllerCheck = 'type-controller-'+dataProductExisted['data'][i]['controller_product'][y]['id'];
                    document.getElementById(idForControllerCheck).checked = true;
                }
            }catch(err){}


            //images
            try{
                for(var y=0; y<dataAfterCopyFiles['data']['images'].length;y++){
                    var nameImg = dataAfterCopyFiles['data']['images'][y].split('/')[dataAfterCopyFiles['data']['images'][y].split('/').length-1];
                    loadImgChooseInterface(dataAfterCopyFiles['data']['images'][y], nameImg);
                }
            }catch(err){}



            //main img
            try{
                document.getElementById('main-pic-choose').src =  dataAfterCopyFiles['data']['main_image'];

            }catch(err){}
            
            //file
            try{
                for(var y=0; y < dataAfterCopyFiles['data']['files'].length;y++){
                    var nameFileInStore = dataAfterCopyFiles['data']['files'][y]['path'].split('/')[dataAfterCopyFiles['data']['files'][y]['path'].split('/').length-1];
                    loadFileChooseInterface(dataAfterCopyFiles['data']['files'][y]['path'], nameFileInStore, dataAfterCopyFiles['data']['files'][y]['name']);
                }
            }catch(err){}
            

            //highlight
            try{
                for(var y= 0 ; y< dataProductExisted['data'][i]['highlight'].length;y++){
                    loadHighlightTableInterface(y+1,dataProductExisted['data'][i]['highlight'][y]);
                }
            }catch(err){}
            

            //main description
            try{
                var keyInDes = Object.keys(dataProductExisted['data'][i]['description']);
                for(var y=0; y< keyInDes.length;y++){
                    //loadDesKeyTableInterface(keyId,idForKey,key,valueArray);
                    loadDesKeyTableInterface('add-key',(y+1).toString(),keyInDes[y], dataProductExisted['data'][i]['description'][keyInDes[y]]);
                }   
            }catch(err){}
        }
    }
}


async function changeRadioAndCheckboxInterface(file_content){
    //bear-menu
    for(var i = 0; i < file_content['data']['bear_type'].length;i++){
        //input tag
        var inputTag = document.createElement('input');
        var bearTypeId = file_content['data']['bear_type'][i]['id'];
        setAttributes(inputTag,{
            'type' : 'radio',
            'name' : 'bear-type',
            'value' : bearTypeId,
            'id' : 'bear-type-'+bearTypeId
        });
        if(i==0){
            inputTag.checked = true;
        }
        
        //label 
        var labelTag = document.createElement('label');
        labelTag.innerText = file_content['data']['bear_type'][i]['name'];
        document.getElementById('bear-type-menu').appendChild(inputTag);
        document.getElementById('bear-type-menu').appendChild(labelTag);
        document.getElementById('bear-type-menu').appendChild(document.createElement('br'));
    }

    //types menu
    for(var i = 0; i < file_content['data']['types'].length;i++){
        //input tag
        var inputTag = document.createElement('input');
        var typeProductId = file_content['data']['types'][i]['id'];
        setAttributes(inputTag,{
            'type' : 'checkbox',
            'name' : 'type-product',
            'value' : typeProductId,
            'id' : 'type-product-'+typeProductId
        });        
        //label 
        var labelTag = document.createElement('label');
        labelTag.innerText = file_content['data']['types'][i]['name'];
        document.getElementById('types-menu').appendChild(inputTag);
        document.getElementById('types-menu').appendChild(labelTag);
        document.getElementById('types-menu').appendChild(document.createElement('br'));
    }

    //controller menu
    for(var i = 0; i < file_content['data']['controllers'].length;i++){
        //input tag
        var inputTag = document.createElement('input');
        var controllerId=file_content['data']['controllers'][i]['id'];
        setAttributes(inputTag,{
            'type' : 'checkbox',
            'name' : 'type-controller',
            'value' : controllerId,
            'id' : 'type-controller-'+controllerId
        });        
        //label 
        var labelTag = document.createElement('label');
        labelTag.innerText = file_content['data']['controllers'][i]['name'];
        document.getElementById('controller-menu').appendChild(inputTag);
        document.getElementById('controller-menu').appendChild(labelTag);
        document.getElementById('controller-menu').appendChild(document.createElement('br'));
    }
}
//load from server
async function loadInterfaceForAddNewProduct(){
    var subUrl = 'serverside/admin_control/product_center_load_add_interface.php';
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
        dataType: 'json',
        data: {
            'data' :1,
        },
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));
            changeRadioAndCheckboxInterface(file_content);
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }
    });
    return result;
}



//save data 
function saveOrEditConfirm(name){
    var confirmText = "Вы уверены, что хотите сохранить или изменить свойства товара '"+name+"' ?";
    modalOn = true;
    modalControl(confirmText);
}


var jsonDataForAddNewProduct = {};
async function saveEvent(){
    
    var error=[];
    console.log("---->in save event");
    //name
    var nameChoose = '';
    $("input:text[name=name-edit]").each(function () {
        nameChoose = ($(this).val());
    });
    console.log('name : '+nameChoose);

    //in stock
    var instock='';
    $('input:radio[name=stock]:checked').each(function(){
        instock =$(this).val();
    });
    console.log('in stock : ' + instock);

    //in sale
    var insale = '';
    $('input:radio[name=sale]:checked').each(function(){
        insale =$(this).val();
    });
    console.log('in sale : ' + insale);

    //bear type
    var bearTypeChoose='';
    $('input:radio[name=bear-type]:checked').each(function(){
        bearTypeChoose =$(this).val();
    });
    console.log('bear type : ' + bearTypeChoose);

    //types product
    var typesChoose = [];
    $('input:checkbox[name=type-product]:checked').each(function(){
        typesChoose.push($(this).val());
    });
    console.log('types : ' + typesChoose);

    //name controllers
    var controllerChoose = [];
    $('input:checkbox[name=type-controller]:checked').each(function(){
        controllerChoose.push($(this).val());
    });
    console.log('controllers : ' + controllerChoose);

    //image
    var listImage=[];
    var mainImage='';
    var imgNode = document.getElementById('imgchoosing-sec').children;
    for(var i=0 ; i< imgNode.length;i++){
        listImage.push(imgNode[i].id);
    }
    console.log('list img : ' + listImage + ' - length : '+listImage.length);
    //main img
    var mainPicSrc = document.getElementById('main-pic-sec').children[0].src;
    var mainPicSplit = mainPicSrc.split('/');
    mainImage = mainPicSplit[mainPicSplit.length-1];
    console.log('main pic : ' + mainImage);

    //file
    var listFileAndName = [];
    var fileNode = document.getElementById('filechoosing-sec').children;
    for(var i =0 ;i<fileNode.length;i++){
        var siteName = '';
        var id = fileNode[i].id;
        var textFieldFindCondition = "input:text[name=" + id.split('.')[0]+"]";
        $(textFieldFindCondition).each(function () {
            siteName = ($(this).val());
        });
        var fileObj = {
            tem_name : id,
            site_name : siteName
        };
        listFileAndName.push(fileObj);
    }
    console.log("list files : " +JSON.stringify(listFileAndName));

    //short description
    var listShortDes = [];
    var highlightContainer = document.getElementsByClassName('hightlight-container');
    for(var i=0 ; i< highlightContainer.length;i++){
        listShortDes.push((highlightContainer[i].children)[0].value);
    }
    console.log("listShortDes: "+listShortDes);


    //main description
    var listDes = [];
    var desRowSec = document.getElementById('product-des-row-sec').children;
    for(var i=0 ; i<desRowSec.length;i++){
        var keyTake = ((desRowSec[i].children)[0].children)[0].children[0].value;
        console.log('index : '+i+' key : ' +keyTake);
        var keyObj={
            key:keyTake,
            value :[]
        }
        var desValueSec = ((desRowSec[i].children)[0].children)[1].children[0].children;
        var valueList = [];
        for(var y=0; y<desValueSec.length;y++){
            valueList.push(desValueSec[y].children[0].value);
        }
        keyObj.value = valueList;
        listDes.push(keyObj);
    }
    //console.log("main desValueSec : " +JSON.stringify(listDes));

    
    //check data 
    var nameChooseAllow = true;
    var typeChooseAllow = true;
    var controllerChooseAllow = true;
    var imageAllow = true;
    var mainImageAllow = true;
    var fileAllow = true;
    var shortDesAllow = true;
    var mainDesAllow = true;
    //check name
    if(nameChoose==''){
        nameChooseAllow = false;
        error.push('Название продукта не может быть пустым');
    }else{
        var nameExistedProduct=[];
        for(var i=0; i<dataProductExisted['data'].length;i++){
            nameExistedProduct.push(dataProductExisted['data'][i]['name']);
        }
        if(nameExistedProduct.includes(nameChoose)){
            if(idProductChoosing == 0){
                nameChooseAllow = false;
                error.push('Название продукта, которое вы хотите добавить, уже существует в системе.');
            }
            
        }
    }
    //check type value
    if(typesChoose.length == 0){
        typeChooseAllow=false;
        error.push('Необходимо выбрать типы продукции');
    }
    //check name controller
    if(controllerChoose.length == 0){
        controllerChooseAllow=false;
        error.push('Необходимо выбрать название контроллера');
    }
    //image
    if(listImage.length == 0){
        imageAllow=false;
        error.push('Необходимо загрузить фотографии для продуктов');
    }
    //main image
    if(mainImage==undefined || !mainImage.includes('.')){
        mainImageAllow=false;
        error.push('Нужно выбрать фото, которое будет главным');
    }
    //file 
    if(listFileAndName.length==0){
        fileAllow=false;
        error.push('Нужно загрузить документы для продуктов');
    }
    //short description
    for(var i=0 ; i< listShortDes.length;i++){
        if(listShortDes[i] == ''){
            shortDesAllow=false;
            if(!error.includes('Краткое описание нельзя оставить пустым')){
                error.push('Краткое описание нельзя оставить пустым');
            }
        }
    }
    //main description
    for(var j = 0; j<listDes.length;j++){
        if(listDes[j].key == ''){
            mainDesAllow = false;
            if(!error.includes('Описание нельзя оставить пустым')){
                error.push('Описание нельзя оставить пустым');
            }
        }else{
            for(var i = 0; i< listDes[j].value.length;i++){
                if(listDes[j].value[i] == ''){
                    mainDesAllow = false;
                    var errorText = 'В описании данные части ' + listDes[j].key + " не могут быть пустыми";
                    error.push(errorText);
                }
            }
        }
    }
    console.log('Error : '+ error);

    if(error.length == 0){//No error
        try{
            document.getElementById('save-warning-sec').remove();
        }catch(e){}
        jsonDataForAddNewProduct = {
            id:idProductChoosing,
            name:nameChoose,
            in_stock:instock,
            in_sale:insale,
            bear_type:bearTypeChoose,
            type_product :typesChoose,
            controller:controllerChoose,
            main_image:mainImage,
            images:listImage,
            files:listFileAndName,
            short_description:listShortDes,
            main_description:listDes
        };

        //await addNewProduct();
        modalOn=true;
        
        console.log('data of new product : ' + JSON.stringify(jsonDataForAddNewProduct));
        if(!deleteProductAccept){//add or edit
            saveOrEditConfirm(nameChoose);
        }else{//delete
            var confirmText = "Вы уверены, что хотите удалить '"+nameChoose+"' ?";
            modalControl(confirmText);
        }

    }else{//have error
        try{
            document.getElementById('save-warning-sec').remove();
        }catch(e){}
        
        var saveWarningSec = document.createElement('div');
        setAttributes(saveWarningSec,{
            'id' : 'save-warning-sec'
        });
        for(var i = 0; i< error.length; i++){
            var warningText = document.createElement('p');
            setAttributes(warningText,{
                'style' : 'color:red;'
            })
            warningText.innerText = '*)'+error[i];
            saveWarningSec.appendChild(warningText);
        }
        document.getElementById('save-warning').appendChild(saveWarningSec);
    }
}

async function addNewProduct(){
    var subUrl ='';
    if(idProductChoosing == 0){//add new product
        subUrl = 'serverside/admin_control/product_center_add_new_product.php';
    }else{//edit existed
        if(!deleteProductAccept){
            subUrl = 'serverside/admin_control/product_center_edit_product.php';
        }else{
            subUrl = 'serverside/admin_control/product_center_delete_product.php';
        }
    }
    console.log('in add new product : ' +subUrl );
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
        dataType: 'json',
        data: {
            'data' :jsonDataForAddNewProduct,
        },
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));
            if(file_content['complete_code'] == 1){
                location.reload();
                //onLoadPage();
            }
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }
    });
    return result;
}

var deleteProductAccept = false;
//deleteData
function deleteProduct(){
    deleteProductAccept = true;
    saveEvent();
    
}

async function copyFiles(dataToServer){
    var subUrl ='serverside/admin_control/product_center_copy_files.php';
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
        dataType: 'json',
        data: {
            'data' :dataToServer,
        },
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));

        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }
    });
    return result;
}