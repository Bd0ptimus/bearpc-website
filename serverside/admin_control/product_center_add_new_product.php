<?php
include 'main.php';
header('Content-Type: application/json', true);
header("Access-Control-Allow-Origin: *");		// CORS
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");
writeLog($dumpFile, "add product file");

$onloadCommand=$_POST['data'];
$adminObj=new admin();
$adminObj->addNewProduct($onloadCommand);
unset($adminObj);
?>