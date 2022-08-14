<?php
include 'main.php';
header('Content-Type: application/json', true);
header("Access-Control-Allow-Origin: *");		// CORS
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");

$onloadCommand=$_POST['data'];
$obj = new FileControl();
$obj->deleteTemporaryFile($onloadCommand,'file_uploaded_in_waiting/');
$data['complete'] = 1;
$data['complete_code'] = 1;
echo json_encode($data);
/*
$path = "file_uploaded_in_waiting/$onloadCommand";
$data['complete'] = 1;
if(!unlink($path))
{
    //echo "Not Working";
    $data['complete_code'] = 0;
}
else {
    $data['complete_code'] = 1;
}

echo json_encode($data);*/

?>