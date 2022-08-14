
function setInterface(file_content){
    console.log('in set interface');
    //phone
    for(var i=0 ; i<file_content['data']['phone'].length ; i++){
        //contactpage-main-phone-time-text
        var phoneNumber = file_content['data']['phone'][i]['number'];
        var phoneText='+7 ('+phoneNumber.substring(1,4)+') ' + phoneNumber.substring(4,7)+'-'+phoneNumber.substring(7,9)+'-'+phoneNumber.substring(9); 
        var phoneTextCreate= document.createElement('h1');
        setAttributes(phoneTextCreate,{
            'class' : 'contactpage-main-phone-time-text contactpage-main-phone-text'
        });
        phoneTextCreate.innerText=phoneText;
        document.getElementById('contactpage-phone-add').appendChild(phoneTextCreate);
    }
    //work time
    document.getElementById('contactpage-main-time-text').innerText = file_content['data']['timework']['info'];

    //email
    document.getElementById('contactpage-email-add').innerText = file_content['data']['email']['name'];

    //address
    document.getElementById('contactpage-address-add').innerText = file_content['data']['address']['name'];

    //map
    document.getElementById('contactpage-maplink-add').src = file_content['data']['link']['name'];

    //map picture
    document.getElementById('map-pic-add').setAttribute('onclick',"watchFile('"+file_content['data']['map_pic']['path']+"')") ;

}   

function watchFile(url){
    saveAs(url, 'map_picture.png');
    window.open(url,'_blank');
    
}


function loadPage(){
    $.ajax({
        type: "POST",
        url: mainUrl+"serverside/site_control/contact_page_load.php",
        dataType: 'json',
        data: {
            data: 1,
        },
        success: function (file_content) {
            console.log("Success response in contact : " + JSON.stringify(file_content));
            setInterface(file_content);
            endLoadingScreen();
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
            endLoadingScreen();

        }

    });
}