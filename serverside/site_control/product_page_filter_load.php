<?php
include 'main.php';
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");		// CORS
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");
writeLog($dumpFile, "product filter file");

$onloadCommand=$_POST['data'];
$productObj=new products();
$productObj->loadFilter();
unset($productObj);
?>