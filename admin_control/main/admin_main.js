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

async function saveBtnControl(){
    if(document.getElementById('textfield-main').value==''){//empty : error
        document.getElementById('warning-main').innerText = 'Этот раздел нельзя оставлять пустым';
    }else{
        document.getElementById('warning-main').innerText = '';
        var dataToServer ={
            text : document.getElementById('textfield-main').value
        }
        await callServer(1,dataToServer);
    }
}

function setInterface(file_content){
    document.getElementById('textfield-main').value ='';
    document.getElementById('textfield-main').value = file_content['slogan'];
}

async function callServer(index, data){
    //index : 0-load
    //index : 1-save
    var subUrl = '';
    switch(index){
        case 0:
            subUrl = 'serverside/admin_control/main_center_load.php';
            break;
        case 1: 
            subUrl = 'serverside/admin_control/main_center_save.php';
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