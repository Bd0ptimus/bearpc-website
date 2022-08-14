<?php
include 'main.php';
header('Content-Type: application/json', true);
header("Access-Control-Allow-Origin: *");		// CORS
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");
writeLog($dumpFile, "main_page_load file");

$onloadCommand=$_POST['data'];
$productObj=new products();
$productObj->loadFooterHeader();
unset($productObj);
?>