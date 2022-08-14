function user_request_handler(pageId){
    console.log("in handle user request");
    var pageName="";
    //pageId : 1 : contact page
    //pageId : 2 : about page
    if(pageId == 1){
        pageName = "contactpage";
    }else if(pageId == 2){
        pageName = "aboutpage";
    }

    document.getElementById(pageName+'-loading-icon').style.display = 'block';
    document.getElementById(pageName+"-loading-icon").setAttribute("src", "../../assets/page-img/loading/loading_gif.gif");

    var question = document.getElementById(pageName+"-question-field").value;
    var userEmail = document.getElementById(pageName+"-email-field").value;


    var jsonStr = {
        'question' : question,
        'user_email' : userEmail,
    };

    $.ajax({
        type: "POST",
        url: "http://bear-pc.ru/serverside/user_request/contact_request.php",
        dataType: 'json',
        data: {
            'data' :jsonStr,
        },
        success: function (file_content) {
            //Output formatted JSON
            //response - {
            //      'complete' : ,
            //      'complete_code' :,
            //      
            //}
            console.log("Success response : " + JSON.stringify(file_content));
            //document.getElementById(pageName+"-loading-icon").setAttribute("src", "../../assets/page-img/loading/green_tick.png");
            if(file_content['complete_code'] == 1){
                document.getElementById(pageName+"-loading-icon").setAttribute("src", "../../assets/page-img/loading/green_tick.png");
                document.getElementById(pageName+'-loading-warning').style.display = 'none';
                console.log("send Success");
            }else{
                document.getElementById(pageName+"-loading-icon").setAttribute("src", "../../assets/page-img/loading/red_tick.png");
                document.getElementById(pageName+'-loading-warning').style.display = 'block';
                console.log("send Unsuccess");
            }
        
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
            document.getElementById(pageName+"-loading-icon").setAttribute("src", "../../assets/page-img/loading/red_tick.png");
            document.getElementById(pageName+'-loading-warning').style.display = 'block';
            console.log("send Unsuccess");
        }

    });

}