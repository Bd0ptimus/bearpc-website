$(function(){
    $("#product-navbar-sec-load").load("../nav-bar/index.html");
});


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

async function takeImg(){ 
    //const files = document.querySelector('[type=file]').files
    var files = '';
    files = document.getElementById('img-form').files;
    loadingIconControl('img-upload-icon',1)
    
    const formData = new FormData();
  
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
    
        formData.append('files[]', file);
    }
    console.log('ready call server');
    var result = await saveMapPic(formData);
    document.getElementById('map-pic').src = result['data']['map_pic'];

}

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

async function addBtnControl(){
    var dataToServer = {
        info:''
    }
    var warningId = '';
    var error = '';
    warningId='add-phone-warning';
    for(var i =1 ; i<5;i++){
        var textfieldId = 'phone-add-'+i;
        if(document.getElementById(textfieldId).value == ''){
            error = 'Заполните номер телефона в каждом поле'
        }
    }

    if(error == ''){
        var fullPhoneNumber='8';
        for(var i =1; i<5;i++){
            var textfieldId = 'phone-add-'+i;
            fullPhoneNumber = fullPhoneNumber+document.getElementById(textfieldId).value;
        }

        if(fullPhoneNumber.length !=11){
            error = 'Введите номер телефона в правильном формате';
        }else{
            dataToServer.info = fullPhoneNumber;
        }
    }

    if(error == ''){
        document.getElementById(warningId).innerText = '';
        await callServer(3,dataToServer);
    }else{
        document.getElementById(warningId).innerText = error;
    }
}

async function deleteBtnControl(id){
    if(document.getElementById('contact-center-edit-sec-add').childElementCount >1){
        var dataToServer = {
            id:id
        };  
        await callServer(2,dataToServer);
    }
   
}

async function saveBtnControl(id){
    //id : >0 - phone number
    //      -1 - email 
    //      -2 - address
    //      -3 - timework
    //      -4 - maplink

    var error = '';
    var warningId = '';
    var dataToServer = {
        id:id,
        info:''
    }
    if(id > 0){
        warningId='warning-phone-'+id;
        for(var i =1 ; i<5;i++){
            var textfieldId = 'phone-'+id+'-'+i;
            if(document.getElementById(textfieldId).value == ''){
                error = 'Заполните номер телефона в каждом поле'
            }
        }

        if(error == ''){
            var fullPhoneNumber='8';
            for(var i =1; i<5;i++){
                var textfieldId = 'phone-'+id+'-'+i;
                fullPhoneNumber = fullPhoneNumber+document.getElementById(textfieldId).value;
            }

            if(fullPhoneNumber.length !=11){
                error = 'Введите номер телефона в правильном формате';
            }else{
                dataToServer.info = fullPhoneNumber;
            }
        }
    }else{
        var textFieldId ='';
        switch(id){
            case -1:
                warningId='warning-email';
                textFieldId='textfield-email';
                break;
            case -2:
                warningId='warning-address';
                textFieldId='textfield-address';
                break;
            case -3:
                warningId='warning-timework';
                textFieldId='textfield-timework';
                break;
            case -4:
                warningId='warning-maplink';
                textFieldId='textfield-maplink';
                break;
        }
        if(document.getElementById(textFieldId).value == ''){
            error = 'Этот раздел нельзя оставлять пустым';
        }else{
            console.log('not error');
            dataToServer.info=document.getElementById(textFieldId).value;
        }

    }

    if(error == ''){
        document.getElementById(warningId).innerText = '';
        await callServer(1,dataToServer);
    }else{
        document.getElementById(warningId).innerText = error;
    }
}

function clearInterface(){
    loadingIconControl('img-upload-icon',0);
    for(i=1;i<5;i++){
        var textFieldId = 'phone-add-' +i;
        document.getElementById(textFieldId).value ='';
    }

    document.getElementById('contact-center-edit-sec-add').innerHTML = '';
    document.getElementById('textfield-email').value = '';
    document.getElementById('textfield-address').value = '';
    document.getElementById('textfield-timework').value = '';
    document.getElementById('textfield-maplink').value = '';


}

function setInterface(file_content){
    clearInterface();
    for(var i =0 ; i< file_content['phone'].length;i++){
        //text 
        var phone1Label = document.createElement('label');
        phone1Label.innerText= '+7 (';
        var phone1Text = document.createElement('input');
        setAttributes(phone1Text,{
            'class' : 'service-center-edit-textfield',
            'type' : 'text',
            'id' : 'phone-'+file_content['phone'][i]['id']+'-1',
            'maxlength' : 3,
            'size' : 3,
            'onkeyup' : "correctFontsizeInput('"+'phone-'+file_content['phone'][i]['id']+'-1'+"')"
        });
        phone1Text.value =file_content['phone'][i]['number'].substring(1,4);


        var phone2Label = document.createElement('label');
        phone2Label.innerText= ') ';
        var phone2Text = document.createElement('input');
        setAttributes(phone2Text,{
            'class' : 'service-center-edit-textfield',
            'type' : 'text',
            'id' : 'phone-'+file_content['phone'][i]['id']+'-2',
            'maxlength' : 3,
            'size' : 3,
            'onkeyup' : "correctFontsizeInput('"+'phone-'+file_content['phone'][i]['id']+'-2'+"')"

        });
        phone2Text.value =file_content['phone'][i]['number'].substring(4,7);


        var phone3Label = document.createElement('label');
        phone3Label.innerText= '-';
        var phone3Text = document.createElement('input');
        setAttributes(phone3Text,{
            'class' : 'service-center-edit-textfield',
            'type' : 'text',
            'id' : 'phone-'+file_content['phone'][i]['id']+'-3',
            'maxlength' : 2,
            'size' : 2,
            'onkeyup' : "correctFontsizeInput('"+'phone-'+file_content['phone'][i]['id']+'-3'+"')"

        });
        phone3Text.value =file_content['phone'][i]['number'].substring(7,9);


        var phone4Label = document.createElement('label');
        phone4Label.innerText= '-';
        var phone4Text = document.createElement('input');
        setAttributes(phone4Text,{
            'class' : 'service-center-edit-textfield',
            'type' : 'text',
            'id' : 'phone-'+file_content['phone'][i]['id']+'-4',
            'maxlength' : 2,
            'size' : 2,
            'onkeyup' : "correctFontsizeInput('"+'phone-'+file_content['phone'][i]['id']+'-4'+"')"

        });
        phone4Text.value =file_content['phone'][i]['number'].substring(9);

        //service-center-edit-textfield-sec
        var textfieldSec= document.createElement('div');
        setAttributes(textfieldSec,{
            'class' : 'service-center-edit-textfield-sec'
        });
        textfieldSec.appendChild(phone1Label);
        textfieldSec.appendChild(phone1Text);
        textfieldSec.appendChild(phone2Label);
        textfieldSec.appendChild(phone2Text);
        textfieldSec.appendChild(phone3Label);
        textfieldSec.appendChild(phone3Text);
        textfieldSec.appendChild(phone4Label);
        textfieldSec.appendChild(phone4Text);

        //delete btn
        var phoneDeleteBtn = document.createElement('button');
        setAttributes(phoneDeleteBtn,{
            'class' : 'service-center-edit-functions-tbn',
            'onclick' : 'deleteBtnControl('+file_content['phone'][i]['id']+')',
            'style' : 'color:red;'
        });
        phoneDeleteBtn.innerText='Удалить';

        //save btn
        var phoneSaveBtn = document.createElement('button');
        setAttributes(phoneSaveBtn,{
            'class' : 'service-center-edit-functions-tbn',
            'onclick' : 'saveBtnControl('+file_content['phone'][i]['id']+')',
            'style' : 'color:black;'
        });
        phoneSaveBtn.innerText='Сохранить';

        //service-center-edit-functions-sec
        var editFunctionSec = document.createElement('div');
        setAttributes(editFunctionSec,{
            'class' : 'service-center-edit-functions-sec'
        });
        editFunctionSec.appendChild(phoneDeleteBtn);
        editFunctionSec.appendChild(phoneSaveBtn);

        //service-center-edit-container
        var editContainer = document.createElement('div');
        setAttributes(editContainer,{
            'class' : 'service-center-edit-container'
        });
        editContainer.appendChild(textfieldSec);
        editContainer.appendChild(editFunctionSec);

        //warning text
        var warningPhone = document.createElement('p');
        setAttributes(warningPhone,{
            'style' : 'color : red; font-size : 10px',
            'id' : 'warning-phone-'+file_content['phone'][i]['id']
        });

        //service-center-edit-cell
        var editCell = document.createElement('div');
        setAttributes(editCell,{
            'class' : 'service-center-edit-cell',
            'id' : 'phone-'+file_content['phone'][i]['id']
        });
        editCell.appendChild(editContainer);
        editCell.appendChild(warningPhone);

        document.getElementById('contact-center-edit-sec-add').appendChild(editCell);
    }

    //email 
    document.getElementById('textfield-email').value = file_content['email'];
     //address
     document.getElementById('textfield-address').value = file_content['address'];
      //worktime
    document.getElementById('textfield-timework').value = file_content['timework'];
     //map link
     document.getElementById('textfield-maplink').value = file_content['maplink'];

    //map picture
    document.getElementById('map-pic').src = file_content['map_pic'];

}

async function callServer(index, data){
    //index : 0-load
    //index : 1-save
    //      : 2-delete
    //      : 3-add new
    console.log('data to server : ' + JSON.stringify(data));
    var subUrl = '';
    switch(index){
        case 0:
            subUrl = 'serverside/admin_control/contact_center_load.php';
            break;
        case 1: 
            subUrl = 'serverside/admin_control/contact_center_save.php';
            break;
        case 2: 
            subUrl = 'serverside/admin_control/contact_center_delete.php';
            break;
        case 3: 
            subUrl = 'serverside/admin_control/contact_center_add_new.php';
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

async function saveMapPic(data){
    var subUrl = 'serverside/admin_control/contact_center_save_map_pic.php';
    
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl,
        dataType: 'json',
        data: data,
        cache : false,
        processData: false,
        contentType : false,
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));
            //setInterface(file_content['data']);
            loadingIconControl('img-upload-icon',2)
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
            loadingIconControl('img-upload-icon',3)
        }

    });
    return result;
}

function watchFile(url){
    window.open(url,'_blank');
    
}