$(function(){
    $("#product-navbar-sec-load").load("../nav-bar/index.html");
});

async function aboutPageLoad(){
    console.log("in about page loading");
    if(sessionStorage.getItem("login")!='true'){
        accessUrl(mainUrl+'admin_control');
    }else{
        //sidebarFrontEndChange(0);
        await callServer(0,'about_center_load.php');
    }
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

function clearInterface(){
    document.getElementById('about-center-edit-sec-add').innerHTML = ''; 
    document.getElementById('add-textfield').value = '';
    document.getElementById('add-textfield-title').value = '';
    document.getElementById('fontsize-add').value = '16';
}

var indexSidbarChoose = 0;
/*
function sidebarFrontEndChange(sidebarSelection){
    indexSidbarChoose = sidebarSelection;
    var numberSelection = document.getElementById('about-main-sidebar-id').childElementCount;
    console.log("numberSelection : " + numberSelection);
    for(var i=0 ; i<numberSelection;i++){
        var id = '';
        switch(i){
            case 0:
                id='history-part';
                break;  
        }
        if( i == sidebarSelection){
            document.getElementById(id).style.backgroundColor = 'white';
        }else{
            document.getElementById(id).style.backgroundColor = 'gray';
        }
    }
}*/


function btnActive(active, id){
    if(active){
        document.getElementById(id).disabled= false;
    }else{
        document.getElementById(id).disabled = true;
    }
}


function editBtnControl(index){   
    var secondRoot='';
    switch(indexSidbarChoose){
        case 0:
            secondRoot='history-';
            break;  
    }
    var deleteBtnIdRoot='delete-'+secondRoot+index;
    var editBtnIdRoot='edit-'+secondRoot+index;
    var saveBtnIdRoot='save-'+secondRoot+index;
    var textfieldId = 'textfield-'+secondRoot+index;
    var titleId = 'textfield-title-'+index;
    var fontsizeTextfieldId = 'fontsize-'+index;
    btnActive(true,saveBtnIdRoot);
    btnActive(false,editBtnIdRoot);
    document.getElementById(textfieldId).readOnly= false;
    document.getElementById(titleId).readOnly= false;
    document.getElementById(fontsizeTextfieldId).readOnly= false;
}

function checkValueInputAccept(index){ //index = -1 : add new, >0 edit old
    var inputErrors=[];
    var titleInput = '';
    var mainTextInput = '';
    var fontSizeInput = '';
    if(index == -1){
        titleInput='add-textfield-title';
        mainTextInput = 'add-textfield';
        fontSizeInput = 'fontsize-add';
    }else{
        titleInput='textfield-title-' + index;
        mainTextInput = 'textfield-history-'+index;
        fontSizeInput = 'fontsize-'+index;
    }
    if(document.getElementById(titleInput).value==''){
        inputErrors.push('Текстовая метка не может быть пустой');
    }

    if(document.getElementById(mainTextInput).value==''){
        inputErrors.push('Текст не может быть пустым');
    }

    if(document.getElementById(fontSizeInput).value==''){
        inputErrors.push('Размер шрифта не может быть пустым');
    }
    console.log('error in edit : ' + inputErrors);
    return inputErrors;

    
}



async function saveBtnControl(index){
    var secondRoot='';
    switch(indexSidbarChoose){
        case 0:
            secondRoot='history-';
            break;  
    }
    var titleId = 'textfield-title-'+index;
    var fontSizeInputIndex = 'fontsize-'+index;
    var textfieldId = 'textfield-'+secondRoot+index;
    var warningInSaveId = 'warning-'+secondRoot+index;
    var italicSetName = 'italic-'+index;
    var italicStrForCheckValue  = 'input:radio[name=' + italicSetName+']:checked';

    var inputErrors=checkValueInputAccept(index);
    console.log("inputErr length : " + inputErrors.length);
    if(inputErrors.length!=0){
        console.log("save btn in have error");
        var warningStr='';
        for(var i = 0; i<inputErrors.length; i++){
            warningStr=warningStr+inputErrors[i]+"</br>";
        }
        console.log("warning str : " + warningStr);
        document.getElementById(warningInSaveId).innerHTML = warningStr;

    }else{
        console.log("save btn in no error");

        document.getElementById(warningInSaveId).innerHTML = "";
        var newTextChange = document.getElementById(textfieldId).value;
        var newTitleChange = document.getElementById(titleId).value;
        var newFontSizeChange = document.getElementById(fontSizeInputIndex).value;
        var inItalic='';
        $(italicStrForCheckValue).each(function(){
            inItalic =$(this).val();
        });
        jsonForServer = {
            table:indexSidbarChoose,
            id:index,
            title:newTitleChange,
            text:newTextChange,
            fontsize:newFontSizeChange,
            italic:inItalic,
        }
        console.log('json for edit : ' + JSON.stringify(jsonForServer));
        
        await callServer(jsonForServer, 'about_center_update.php');
        clearInterface();
        aboutPageLoad();
    }
    
}

async function addBtnControl(){
    var inputError = checkValueInputAccept(-1);

    if(inputError.length != 0){
        var warningStr='';
        for(var i = 0; i<inputErrors.length; i++){
            warningStr=warningStr+inputErrors[i]+"</br>";
        }
        console.log("warning str : " + warningStr);
        document.getElementById('add-warning').innerHTML = warningStr;
    }else{
        document.getElementById('add-warning').innerHTML = "";
        var newTextChange = document.getElementById('add-textfield').value;
        var newTitleChange = document.getElementById('add-textfield-title').value;
        var newFontSizeChange = document.getElementById('fontsize-add').value;
        var inItalic='';
        $('input:radio[name=italic-add]:checked').each(function(){
            inItalic =$(this).val();
        });
        jsonForServer = {
            title:newTitleChange,
            text:newTextChange,
            fontsize:newFontSizeChange,
            italic:inItalic,
        }
        await callServer(jsonForServer, 'about_center_add_new.php');
        clearInterface();
        aboutPageLoad();
    }
}

async function deleteBtnControl(index){
    jsonForServer = {
        table:indexSidbarChoose,
        id:index
    }
    await callServer(jsonForServer, 'about_center_delete.php');
    clearInterface();
    aboutPageLoad();
}

async function loadEditInterface(file_content){
    console.log("in load edit interface");
    var secondRoot='';
    switch(indexSidbarChoose){
        case 0:
            secondRoot='history-';
            break;  
    }
    var firstRootForEditRow = 'edit-sec-';
    var firstRootForTextfield = 'textfield-';
    var firstRootForDeleteBtn = 'delete-';
    var firstRootForEditBtn = 'edit-';
    var firstRootForSaveBtn = 'save-';
    var firstRootForWarning = 'warning-';
    try{
        for(var i =0; i<file_content.length;i++){
            //text area 
            var textFieldId = firstRootForTextfield+secondRoot+file_content[i]['story_id'];
            var textFieldCreate = document . createElement('textarea');
            setAttributes(textFieldCreate,{
                'class' : 'about-center-edit-textfield',
                'type' : 'text',
                'id' : textFieldId
            });
            textFieldCreate.value = file_content[i]['story_text'];
            textFieldCreate.readOnly = true;
            //text area label
            var textAreaLabelCreate = document . createElement('label');
            textAreaLabelCreate.innerText = 'Текст:';
            // text area : about-center-edit-smallest-sec
            var textAreaEditSmallestSec = document . createElement('div');
            setAttributes(textAreaEditSmallestSec,{
                'class' : 'about-center-edit-smallest-sec'
            });
            textAreaEditSmallestSec.appendChild(textAreaLabelCreate);
            textAreaEditSmallestSec.appendChild(textFieldCreate);

            //title area : 
            //label
            var titleAreaLabel = document . createElement('label');
            titleAreaLabel.innerText = 'Текстовая метка:';
            //title text textField
            var titleAreaText = document . createElement('input');
            setAttributes(titleAreaText,{
                'class' : 'about-center-title-edit-textfield',
                'type' : 'text',
                'id' : 'textfield-title-'+file_content[i]['story_id'],
            });
            titleAreaText.value = file_content[i]['story_title'];
            //title area : about-center-edit-smallest-sec
            var titleAreaEditSmallestSec = document.createElement('div');
            setAttributes(titleAreaEditSmallestSec,{
                'class' : 'about-center-edit-smallest-sec'
            });
            titleAreaEditSmallestSec.appendChild(titleAreaLabel);
            titleAreaEditSmallestSec.appendChild(titleAreaText);
            //about-center-edit-textfield-sec
            var textFieldSecCreate = document.createElement('div');
            setAttributes(textFieldSecCreate,{
                'class' : 'about-center-edit-textfield-sec',
                'style' : 'width:56%',
            });
            textFieldSecCreate.appendChild(titleAreaEditSmallestSec);
            textFieldSecCreate.appendChild(textAreaEditSmallestSec);


            //btn-sec
            //delete btn
            var deleteBtnId = firstRootForDeleteBtn+secondRoot+file_content[i]['story_id'];
            var deleteBtnCreate = document.createElement('button');
            setAttributes(deleteBtnCreate,{
                'class' : 'about-center-edit-functions-tbn',
                'onclick' : 'deleteBtnControl(' + file_content[i]['story_id'] + ')',
                'id' : deleteBtnId,
                'style' : 'color : red;'
            })
            deleteBtnCreate.innerText='Удалить';
    
            //edit btn
            var editBtnId = firstRootForEditBtn+secondRoot+file_content[i]['story_id'];
            var editBtnCreate = document.createElement('button');
            setAttributes(editBtnCreate,{
                'class' : 'about-center-edit-functions-tbn',
                'onclick' :'editBtnControl(' + file_content[i]['story_id'] + ')',
                'id' : editBtnId,
                'style' : 'color : green;'
            })
            editBtnCreate.innerText='Редактировать';
    
    
            //save btn
            var saveBtnId = firstRootForSaveBtn+secondRoot+file_content[i]['story_id'];
            var saveBtnCreate = document.createElement('button');
            setAttributes(saveBtnCreate,{
                'class' : 'about-center-edit-functions-tbn',
                'onclick' :'saveBtnControl(' + file_content[i]['story_id'] + ')',
                'id' : saveBtnId,
                'style' : 'color : black;'
            })
            saveBtnCreate.disabled = true;
            saveBtnCreate.innerText='Сохранить';
    
            //btns sec : about-center-edit-sec-func-btns
            var btnSecCreate = document.createElement('div');
            setAttributes(btnSecCreate,{
                'class' : 'about-center-edit-sec-func-btns',
            })
            btnSecCreate.appendChild(deleteBtnCreate);
            btnSecCreate.appendChild(editBtnCreate);
            btnSecCreate.appendChild(saveBtnCreate);


            //funcs edit sec
            //italic sec
            //italic label
            var italicLabel = document.createElement('label');
            setAttributes(italicLabel,{
                'class' : 'textfiled-title'
            });
            italicLabel.innerText = 'Курсив:';

            //true-false italic check
            var italicTrueInput = document.createElement('input');
            setAttributes(italicTrueInput,{
                'type' : 'radio',
                'name' : 'italic-' + file_content[i]['story_id'],
                'value' : 1
            });

            var italicFalseInput = document.createElement('input');
            setAttributes(italicFalseInput,{
                'type' : 'radio',
                'name' : 'italic-' + file_content[i]['story_id'],
                'value' : 0
            });

            if(file_content[i]['story_italic']=='1'){
                italicTrueInput.checked = true;
            }else{
                italicFalseInput.checked = true;
            }

            //labels 
            var italicTrueLabel = document.createElement('label');
            italicTrueLabel.innerText = 'Да';
            var italicFalseLabel = document.createElement('label');
            italicFalseLabel.innerText = 'Нет';

            //italic choocsing sec 
            var italicChoosingSec= document . createElement('div');
            italicChoosingSec.appendChild(italicTrueInput);
            italicChoosingSec.appendChild(italicTrueLabel);
            italicChoosingSec.appendChild(document.createElement('br'));
            italicChoosingSec.appendChild(italicFalseInput);
            italicChoosingSec.appendChild(italicFalseLabel);
            italicChoosingSec.appendChild(document.createElement('br'));

            //size :
            var sizeLabel = document.createElement('label');
            setAttributes(sizeLabel,{
                'class' : 'textfiled-title'
            });
            sizeLabel.innerText = 'Размер шрифта : ';

            var inputSize = document.createElement('input');
            var inputSizeId = 'fontsize-' + file_content[i]['story_id'];
            setAttributes(inputSize,{
                'type' : 'text',
                'id' : inputSizeId,
                'value' : file_content[i]['story_size'],
                'size' : 2,
                'maxlength' : 2,
                'onkeyup' : "correctFontsizeInput('"+inputSizeId+"')"
            });
            inputSize.readOnly = true;

            var pxLabel = document.createElement('label');
            setAttributes(pxLabel,{
                'class' : 'textfiled-title'
            });
            pxLabel.innerText = 'px';

            //func edit: about-center-edit-sec-func-btns
            var funcEditSecBtns = document.createElement('div');
            setAttributes(funcEditSecBtns,{
                'class' : 'about-center-edit-sec-func-btns'
            });
            funcEditSecBtns.appendChild(italicLabel);
            funcEditSecBtns.appendChild(italicChoosingSec);
            funcEditSecBtns.appendChild(sizeLabel);
            funcEditSecBtns.appendChild(inputSize);
            funcEditSecBtns.appendChild(pxLabel);

            //edit func sec - btns and funcs
            var editFuncsSecBtnsFunc = document.createElement('div');
            setAttributes(editFuncsSecBtnsFunc,{
                'class' : 'about-center-edit-functions-sec',
                'style' : 'width:36%'
            });

            editFuncsSecBtnsFunc.appendChild(funcEditSecBtns);
            editFuncsSecBtnsFunc.appendChild(btnSecCreate);

            //edit row container : about-center-edit-container
            var editContainerCreate = document.createElement('div');
            setAttributes(editContainerCreate,{
                'class' : 'about-center-edit-container'
            })
            editContainerCreate.appendChild(textFieldSecCreate);
            editContainerCreate.appendChild(editFuncsSecBtnsFunc);
    
            //warning text create 
            var warningId = firstRootForWarning+secondRoot+file_content[i]['story_id'];
            var warningTextCreate = document.createElement('p');
            setAttributes(warningTextCreate,{
                'style' : 'color : red; font-size : 10px',
                'id' : warningId
            });
    
            //about-center-edit-cell
            var editRowSecId = firstRootForEditRow+secondRoot+file_content[i]['story_id'];
            var editRowSecCreate = document.createElement('div');
            setAttributes(editRowSecCreate,{
                'class' : 'about-center-edit-cell',
                'id' : editRowSecId
            });
            editRowSecCreate.appendChild(editContainerCreate);
            editRowSecCreate.appendChild(warningTextCreate);
            document.getElementById('about-center-edit-sec-add').appendChild(editRowSecCreate);
            console.log("endin load edit interface");
        }
    }catch(err){
        console.log("Error in read data from db : "+ err);
    }
    
}

async function callServer(dataToserver, file){
    //data to server =0 : history page 
    //json data : for change history line
    const subUrl ='serverside/admin_control/';
    
    var result = await $.ajax({
        type: "POST",
        url: mainUrl+subUrl+file,
        dataType: 'json',
        data: {
            'data' :dataToserver,
        },
        success: function (file_content) {
            console.log("Data return : " + JSON.stringify(file_content));
            loadEditInterface(file_content['data']);
            
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
    return result;
}


