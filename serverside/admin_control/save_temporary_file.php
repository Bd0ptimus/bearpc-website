<?php

header('Content-Type: application/json', true);
header("Access-Control-Allow-Origin: *");		// CORS
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");


include 'main.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    writeLog($dumpFile, 'In check post receive');
    $obj = new FileControl();
    $result=$obj->saveTemporaryFile($_FILES['files'], 'file_uploaded_in_waiting/',20971520,'pdf',['pdf']);
    echo json_encode($result);

    
    
}
?>