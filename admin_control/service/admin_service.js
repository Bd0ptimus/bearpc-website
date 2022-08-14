$(function(){
    $("#product-navbar-sec-load").load("../nav-bar/index.html");
});


async function loadPage(){
    if(sessionStorage.getItem("login")!='true'){
        accessUrl(mainUrl+'admin_control');
    }else{
        await callServer(0,1);
    }
}

function accessUrl(url){
    location.href=url;
}

async function addBtnControl(index){
    //index : 1-intro
    //index : 2-service
    var textFieldId = '';
    var warningId = '';
    if(index == 1){
        textFieldId='add-intro-textfield';
        warningId = 'add-intro-warning';
    }else if(index == 2){
        textFieldId='add-textfield';
        warningId = 'add-warning';
    }
    var addValue = document.getElementById(textFieldId).value;
    if(addValue == ''){
        document.getElementById(warningId).innerText = 'Этот раздел нельзя оставлять пустым';

    }else{
        document.getElementById(warningId).innerText = '';
        var dataToServer={
            type:index,
            text:addValue
        };

        await callServer(3, dataToServer);

    }
}

async function deleteBtnControl(id, index){
    //index : 1-intro
    //index : 2-service
    var containerId = '';
    if(index == 1){
        containerId='service-center-edit-sec-add-intro';
    }else if(index == 2){
        containerId='service-center-edit-sec-add';
    }
    if(document.getElementById(containerId).childElementCount>1){
        var dataTosServer = {
            type: index,
            id:id
        }
        await callServer(2, dataTosServer);

    }
}

async function saveBtnControl(id, index){
    var textfieldId = '';
    var warningId ='';
    if(index == 1){
        textfieldId = 'textfield-intro-'+id;
        warningId ='warning-intro-'+id;
    }else if(index == 2){
        textfieldId = 'textfield-service-'+id;
        warningId ='warning-service-'+id;
    }
    if(document.getElementById(textfieldId).value == ''){
        
        document.getElementById(warningId).innerText = 'Этот раздел нельзя оставлять пустым';
    }else{
        document.getElementById(warningId).innerText = '';

        var dataTosServer = {
            type:index,
            id:id,
            info:document.getElementById(textfieldId).value
        }

        await callServer(1, dataTosServer);

    }
}

function clearInterface(){
    document.getElementById('service-center-edit-sec-add-intro').innerHTML ='';
    document.getElementById('add-intro-textfield').value ='';
    document.getElementById('service-center-edit-sec-add').innerHTML ='';
    document.getElementById('add-textfield').value ='';

}

function setInterface(file_content){
    clearInterface();
    //intro part
    for(var i =0 ; i<file_content['intro'].length ; i++){
        //service-center-edit-textfield
        var editTextField = document.createElement('textarea');
        setAttributes(editTextField,{
            'class' : 'service-center-edit-textfield',
            'type' : 'text',
            'id' : 'textfield-intro-'+file_content['intro'][i]['id']
        });
        editTextField.value = file_content['intro'][i]['info'];

        //service-center-edit-textfield-sec
        var editTextfieldSec = document.createElement('div');
        setAttributes(editTextfieldSec,{
            'class' : 'service-center-edit-textfield-sec'
        });
        editTextfieldSec.appendChild(editTextField);

        //btns sec
        //delete btns
        var deleteBtn = document.createElement('button');
        setAttributes(deleteBtn,{
            'class' : 'service-center-edit-functions-tbn',
            'onclick' : 'deleteBtnControl('+file_content['intro'][i]['id']+',1)',
            'style' : 'color:red;'
        })
        deleteBtn.innerText = 'Удалить';

        //save btn
        var saveBtn = document.createElement('button');
        setAttributes(saveBtn,{
            'class' : 'service-center-edit-functions-tbn',
            'onclick' : 'saveBtnControl('+file_content['intro'][i]['id']+',1)',
            'style' : 'color:black;'
        })
        saveBtn.innerText = 'Сохранить';

        // /service-center-edit-functions-sec
        var editFunctionSec = document.createElement('div');
        setAttributes(editFunctionSec,{
            'class' : 'service-center-edit-functions-sec'
        });
        editFunctionSec.appendChild(deleteBtn);
        editFunctionSec.appendChild(saveBtn);

        //service-center-edit-container
        var editContainer = document.createElement('div');
        setAttributes(editContainer,{
            'class' : 'service-center-edit-container'
        });
        editContainer.appendChild(editTextfieldSec);
        editContainer.appendChild(editFunctionSec);

        //warning
        var warningText = document.createElement('p');
        setAttributes(warningText,{
            'style' : 'color : red; font-size : 10px',
            'id' : 'warning-intro-'+file_content['intro'][i]['id']
        });

        //service-center-edit-cell
        var editCell = document.createElement('div');
        setAttributes(editCell,{
            'class' : 'service-center-edit-cell'
        });
        editCell.appendChild(editContainer);
        editCell.appendChild(warningText);
        document.getElementById('service-center-edit-sec-add-intro').appendChild(editCell);
    }

    //service texts
    for(var i =0 ; i<file_content['service'].length ; i++){
        //service-center-edit-textfield
        var editTextField = document.createElement('textarea');
        setAttributes(editTextField,{
            'class' : 'service-center-edit-textfield',
            'type' : 'text',
            'id' : 'textfield-service-'+file_content['service'][i]['id']
        });
        editTextField.value = file_content['service'][i]['info'];

        //service-center-edit-textfield-sec
        var editTextfieldSec = document.createElement('div');
        setAttributes(editTextfieldSec,{
            'class' : 'service-center-edit-textfield-sec'
        });
        editTextfieldSec.appendChild(editTextField);

        //btns sec
        //delete btns
        var deleteBtn = document.createElement('button');
        setAttributes(deleteBtn,{
            'class' : 'service-center-edit-functions-tbn',
            'onclick' : 'deleteBtnControl('+file_content['service'][i]['id']+',2)',
            'style' : 'color:red;'
        })
        deleteBtn.innerText = 'Удалить';

        //save btn
        var saveBtn = document.createElement('button');
        setAttributes(saveBtn,{
            'class' : 'service-center-edit-functions-tbn',
            'onclick' : 'saveBtnControl('+file_content['service'][i]['id']+',2)',
            'style' : 'color:black;'
        })
        saveBtn.innerText = 'Сохранить';

        // /service-center-edit-functions-sec
        var editFunctionSec = document.createElement('div');
        setAttributes(editFunctionSec,{
            'class' : 'service-center-edit-functions-sec'
        });
        editFunctionSec.appendChild(deleteBtn);
        editFunctionSec.appendChild(saveBtn);

        //service-center-edit-container
        var editContainer = document.createElement('div');
        setAttributes(editContainer,{
            'class' : 'service-center-edit-container'
        });
        editContainer.appendChild(editTextfieldSec);
        editContainer.appendChild(editFunctionSec);

        //warning
        var warningText = document.createElement('p');
        setAttributes(warningText,{
            'style' : 'color : red; font-size : 10px',
            'id' : 'warning-service-'+file_content['service'][i]['id']
        });

        //service-center-edit-cell
        var editCell = document.createElement('div');
        setAttributes(editCell,{
            'class' : 'service-center-edit-cell'
        });
        editCell.appendChild(editContainer);
        editCell.appendChild(warningText);
        document.getElementById('service-center-edit-sec-add').appendChild(editCell);
    }
}

async function callServer(index, data){
    //index : 0-load
    //index : 1-save
    //      : 2-delete
    //      : 3-add new
    var subUrl = '';
    switch(index){
        case 0:
            subUrl = 'serverside/admin_control/service_center_load.php';
            break;
        case 1: 
            subUrl = 'serverside/admin_control/service_center_save.php';
            break;
        case 2: 
            subUrl = 'serverside/admin_control/service_center_delete.php';
            break;
        case 3: 
            subUrl = 'serverside/admin_control/service_center_add_new.php';
            break;
    }
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
        dataType: 'json',
        data: {
            'data' :data,
        },
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));
            setInterface(file_content['data']);
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}