const url = 'process.php'
//const form = document.querySelector('form')

/*
form.addEventListener('submit', (e) => {
  e.preventDefault()

  const files = document.querySelector('[type=file]').files
  const formData = new FormData()

  var readUrlIn = document.querySelector('[type=file]');
  //readURL(readUrlIn);
  for (let i = 0; i < files.length; i++) {
    console.log('file length : ' + i);
    let file = files[i]

    formData.append('files[]', file)
  }

  for (const value of formData.values()) {
    console.log('form data' + value);
  }

  callServer(formData);
  /*
  fetch(url, {
    method: 'POST',
    body: formData,
  }).then((response) => {
    console.log('Response : ' +JSON.stringify(response['data']));
  })

    
})*/

function takeFile(){
    //const files = document.querySelector('[type=file]').files
    const files = document.getElementById('file-form').files;
    const formData = new FormData();
  
    //var readUrlIn = document.querySelector('[type=file]');
    //readURL(document.getElementById('file-form'));
    for (let i = 0; i < files.length; i++) {
      console.log('file length : ' + i);
      let file = files[i];
  
      formData.append('files[]', file);
    }
  
   console.log('form data ' + formData[files][type]);
    for (const value of formData) {
      console.log('form data ' + JSON.stringify(value['files']));
    }

    /*
    fetch(url, {
        method: 'POST',
        body: formData,
      }).then((response) => {
        console.log('Response : ' +JSON.stringify(response['data']));
      })*/
  
    callServer(formData);
    readURL(document.getElementById('file-form'));
}

function callServer(formData){
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',//
        data: formData,
        cache : false,
        processData: false,
        contentType : false,
        success: function (file_content) {
            console.log("Success response : " + JSON.stringify(file_content));
        },
        error: function (error_text) {
            console.log("Error response : " + JSON.stringify(error_text));
            //showLog('Error in calling file python : ' + JSON.stringify(error_text));// need for use with python
        }

    });
}

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        $('#blah').attr('src', e.target.result).width(150).height(200);
      };
  
      reader.readAsDataURL(input.files[0]);
    }
  }