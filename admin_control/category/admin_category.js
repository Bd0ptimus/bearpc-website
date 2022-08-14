
$(function(){
    $("#product-navbar-sec-load").load("../nav-bar/index.html");
});

/*
window.onload = function(){
    if(sessionStorage.getItem("login")!='true'){
        accessUrl(mainUrl+'admin_control');
    }else{
        sidebarFrontEndChange();
    }
}*/

function loadPage(){
    if(sessionStorage.getItem("login")!='true'){
        accessUrl(mainUrl+'admin_control');
    }else{
        sidebarFrontEndChange();
        sidebarControl(0);
    }
    
}

function accessUrl(url){
    location.href=url;
}

//Control side bar front-end

var sidebarSelection = 0;

async function sidebarControl(index){ // index: 0-bear, 1- type, 2-controller
    sidebarSelection = index;
    sidebarFrontEndChange();
    await takeExistedData(index+1);
}

function sidebarFrontEndChange(){
    //var numberSidebarElement = document.getElementById('product-main-sidebar-id').childElementCount;
    for(var i=0 ; i<3;i++){
        var id = '';
        switch(i){
            case 0:
                id='bear-part';
                break;  
            case 1:
                id='type-product-part';
                break;
            case 2:
                id='name-controller-part';
                break;
        }
        if( i == sidebarSelection){
            document.getElementById(id).style.backgroundColor = 'white';
        }else{
            document.getElementById(id).style.backgroundColor = 'gray';
        }
    }
}

var modalOn = false;

var idChoose = 0;

var jsonInStore;

function btnActive(active, id){
    if(active){
        document.getElementById(id).disabled= false;
    }else{
        document.getElementById(id).disabled = true;
    }
}

function textFieldActive(active, id){
    if(active){
        document.getElementById(id).readOnly= false;
    }else{
        document.getElementById(id).readOnly= true;
    }
}

function deleteBtnControl(id){
    modalOn = true;
    takeProductReference(id);
}

function takeIdBaseOnSidebarSelection(){
    var i =sidebarSelection;
    var result ='';
    switch(i){
        case 0:
            result='bear';
            break;  
        case 1:
            result='type';
            break;
        case 2:
            result='controller';
            break;
        case 3:
            result='products';
            break;
    }
    return result;
}

async function saveBtnControl(id){
    var idForWarning = 'warning-'+takeIdBaseOnSidebarSelection()+'-'+id;
    var idForTextField = 'textfield-'+takeIdBaseOnSidebarSelection()+'-'+id;
    var idForEditBtn='edit-'+takeIdBaseOnSidebarSelection()+'-'+id;
    var idForSaveBtn = 'save-'+takeIdBaseOnSidebarSelection()+'-'+id;
    if(document.getElementById(idForTextField).value == ''){
        document.getElementById(idForWarning).innerText = 'Вы не можете сохранить, когда данные не заполнены. Если вы хотите удалить, нажмите кнопку "Удалить"';
    }else{
        document.getElementById(idForWarning).innerText = '';
        btnActive(true, idForEditBtn);
        btnActive(false, idForSaveBtn);
        textFieldActive(false, idForTextField );
        await saveData(sidebarSelection+1, id, document.getElementById(idForTextField).value);
    }
   
}

function editBtnControl(id){
    var idForTextField = 'textfield-'+takeIdBaseOnSidebarSelection()+'-'+id;
    var idForEditBtn='edit-'+takeIdBaseOnSidebarSelection()+'-'+id;
    var idForSaveBtn = 'save-'+takeIdBaseOnSidebarSelection()+'-'+id;
    console.log("id : " + idForSaveBtn);
    btnActive(true, idForSaveBtn);
    btnActive(false, idForEditBtn);
    textFieldActive(true, idForTextField );

}

function takeProductReference(id){
    idChoose = id;
    var textOut = 'Вы удаляете категорию ';
    var productReference = [];
    console.log("Json in store: " + JSON.stringify(jsonInStore));
    var idFound=0;
    for(var i=0; i< jsonInStore['data'].length;i++){
        if(jsonInStore['data'][i]['id'] == id){
            idFound=i;
        }
    }

    textOut = textOut+jsonInStore['data'][idFound]['name']+", товары ";

    for(var i=0; i<jsonInStore['data'][idFound]['product'].length;i++){
        console.log("Found products: " + jsonInStore['data'][idFound]['product'][i]['name']);
        textOut = textOut +' * '+ jsonInStore['data'][idFound]['product'][i]['name'] +'';
        productReference.push(jsonInStore['data'][idFound]['product'][i]['name']);
    }
    textOut = textOut + ' этой категории отключатся от нее, вы хотите продолжить?';
    console.log("Text out: " + textOut);

    modalControl(textOut);
}

async function startDelete(){
    await deleteData(sidebarSelection+1, idChoose);
    modalOff();
}

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

async function addBtnControl(){
    if(document.getElementById('add-textfield').value==''){
        document.getElementById('add-warning').innerText = 'Заполните данные в текстовом поле';
    }else{
        document.getElementById('add-warning').innerText = '';
        await addData(sidebarSelection+1, document.getElementById('add-textfield').value);
        document.getElementById('add-textfield').value = '';
    }
    
}


function setAttributes(el, attrs) {
    for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
    }
}

function removeTags(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

async function addData(selection, value){
    var subUrl ='serverside/admin_control/category_center_add.php';
    //selection :   0-bear type 
    //              1-type product
    //              2-controller
    //              3-product 

    //id : id of type 
    var jsonStr = {
        'type' : selection,
        'value' : value
    };
    var result =await  $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
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
            //     }
            //}
            console.log("Success response : " + JSON.stringify(file_content));
            if(file_content['complete_code'] == 1){
                takeExistedData(selection);
            }
            
            
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}

async function saveData(selection, id, value){
    var subUrl ='serverside/admin_control/category_center_save.php';
    //selection :   0-bear type 
    //              1-type product
    //              2-controller
    //              3-product 

    //id : id of type 
    var jsonStr = {
        'type' : selection,
        'id' : id,
        'value' : value
    };
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
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
            //     }
            //}
            console.log("Success response : " + JSON.stringify(file_content));
            if(file_content['complete_code'] == 1){
                takeExistedData(selection);
            }
            
            
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}

async function deleteData(selection, id){
    var subUrl ='serverside/admin_control/category_center_delete.php';
    //selection :   0-bear type 
    //              1-type product
    //              2-controller
    //              3-product 

    //id : id of type 
    var jsonStr = {
        'type' : selection,
        'id' : id,
    };
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
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
            //     }
            //}
            console.log("Success response : " + JSON.stringify(file_content));
            if(file_content['complete_code'] == 1){
                takeExistedData(selection);
            }
            
            
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}

//bear type panel
async function takeExistedData(index) {
    var subUrl ='serverside/admin_control/category_center_load.php';
    
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
        dataType: 'json',
        data: {
            'data' :index,
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
            //     }
            //}
            console.log("Success response : " + JSON.stringify(file_content));
            jsonInStore = file_content;
            removeTags('product-center-cell');
            removeTags('product-center-edit-cell');
            var tableHeader = '';
            switch(parseInt(file_content['page_index'])){
                case 1:
                    tableHeader = 'BEAR- Товары';
                    break;
                case 2:
                        tableHeader = 'Тип продукции - Товары';
                        break;
                case 3:
                    tableHeader = 'Название контроллера - Товары';
                    break;
            }
            document.getElementById("product-table-header").innerText =tableHeader;

            var overviewTable = document.getElementById('product-center-overview-table-add');
            for(var i=0;i<file_content['data'].length;i++){
                // create overview table
                if(file_content['data'][i]['product'].length==1){
                    var keyCellCreate = document.createElement('td');
                    setAttributes(keyCellCreate,{
                        'class' : 'product-center-cell'
                    });
                    keyCellCreate.innerText = file_content['data'][i]['name'];

                    var valueCellCreate = document.createElement('td');
                    setAttributes(valueCellCreate,{
                        'class' : 'product-center-cell'
                    });
                    valueCellCreate.innerText = file_content['data'][i]['product'][0]['name'];

                    var rowCreate = document.createElement('tr');
                    rowCreate.appendChild(keyCellCreate);
                    rowCreate.appendChild(valueCellCreate);
                    overviewTable .appendChild(rowCreate);
                }else{
                    //First row
                    var keyCellCreate = document.createElement('td');
                    setAttributes(keyCellCreate,{
                        'class' : 'product-center-cell',
                        'rowspan' : file_content['data'][i]['product'].length
                    });
                    keyCellCreate.innerText = file_content['data'][i]['name'];

                    var firstValueCell = document.createElement('td');
                    setAttributes(firstValueCell,{
                        'class' : 'product-center-cell'
                    });
                    firstValueCell .innerText = file_content['data'][i]['product'][0]['name'];
                    var rowCreate = document.createElement('tr');
                    rowCreate.appendChild(keyCellCreate);
                    rowCreate.appendChild(firstValueCell);
                    overviewTable .appendChild(rowCreate);

                    //these next rows
                    for(var y=1; y<file_content['data'][i]['product'].length;y++){
                        var nextValueCell = document.createElement('td');
                        setAttributes( nextValueCell,{
                            'class' : 'product-center-cell'
                        });
                        nextValueCell.innerText = file_content['data'][i]['product'][y]['name'];
                        rowCreate = document.createElement('tr');
                        rowCreate.appendChild(nextValueCell);
                        overviewTable .appendChild(rowCreate);
                    }
                }

                //create edit section
                
                var textfieldCreate = document.createElement('input');
                setAttributes( textfieldCreate,{
                    'class' : 'product-center-edit-textfield',
                    'type' : 'text',
                    'id' : 'textfield-'+takeIdBaseOnSidebarSelection()+'-'+file_content['data'][i]['id'],
                    'size' : '50',
                    'value' : file_content['data'][i]['name']
                });
                textfieldCreate.readOnly=true;

                var textfieldSec = document.createElement('div');
                setAttributes(textfieldSec,{
                    'class' : 'product-center-edit-textfield-sec'
                });
                textfieldSec.appendChild(textfieldCreate);

                //delete btn
                var deleteBtnCreate =document.createElement('button');
                setAttributes(deleteBtnCreate,{
                    'class' : 'product-center-edit-functions-tbn',
                    'id' : 'delete-'+takeIdBaseOnSidebarSelection()+'-'+file_content['data'][i]['id'],
                    'onclick' : 'deleteBtnControl('+file_content['data'][i]['id']+')',
                    'style' : 'color:red;',
                });
                deleteBtnCreate.innerText = 'Удалить';
                //edit btn
                var editBtnCreate = document.createElement('button');
                setAttributes(editBtnCreate,{
                    "class" : 'product-center-edit-functions-tbn',
                    'id' : 'edit-'+takeIdBaseOnSidebarSelection()+'-'+file_content['data'][i]['id'],
                    'onclick' : 'editBtnControl('+file_content['data'][i]['id']+')',
                    'style' : 'color:green;',
                });
                editBtnCreate.innerText = 'Редактировать';
                //save btn
                var saveBtnCreate = document.createElement('button');
                setAttributes(saveBtnCreate,{
                    "class" : 'product-center-edit-functions-tbn',
                    'id' : 'save-'+takeIdBaseOnSidebarSelection()+'-'+file_content['data'][i]['id'],
                    'onclick' : 'saveBtnControl('+file_content['data'][i]['id']+')',
                    'style' : 'color:blue;',
                });
                saveBtnCreate.innerText = 'Сохранить';
                saveBtnCreate.disabled = true;
                //edit sec 
                var editFuncSec = document.createElement('div');
                setAttributes(editFuncSec,{
                    'class' : 'product-center-edit-functions-sec',
                });
                editFuncSec .appendChild(deleteBtnCreate);
                editFuncSec .appendChild(editBtnCreate);
                editFuncSec .appendChild(saveBtnCreate);

                //edit container
                var editContainer = document.createElement('div');
                setAttributes(editContainer,{
                    'class' : 'product-center-edit-container'
                });
                editContainer.appendChild(textfieldSec);
                editContainer .appendChild(editFuncSec);


                //warning text 
                var warningTextCreate = document.createElement('p');
                setAttributes(warningTextCreate,{
                    'style' : "color : red; font-size : 10px" ,
                    'id' : 'warning-'+takeIdBaseOnSidebarSelection()+'-'+file_content['data'][i]['id']
                });

                //edit cell
                var editCellCreate = document.createElement('product-center-edit-cell');
                setAttributes(editCellCreate,{
                    'class' : "product-center-edit-cell"
                });
                editCellCreate.appendChild(editContainer);
                editCellCreate.appendChild(warningTextCreate);

                document.getElementById('product-center-edit-sec-add').appendChild(editCellCreate);
            }
            
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}



