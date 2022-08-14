<?php

header('Content-Type: application/json', true);
header("Access-Control-Allow-Origin: *");		// CORS
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");


include 'main.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    writeLog($dumpFile, 'In check post receive');
    $obj = new FileControl();
    $result = $obj->saveTemporaryFile($_FILES['files'], 'img_uploaded_in_waiting/',2097152,'png', ['jpg', 'jpeg', 'png']);
    echo json_encode($result);
    
}
?>