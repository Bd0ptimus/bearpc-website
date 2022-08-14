<?php
include 'main.php';
header('Content-Type: application/json', true);
header("Access-Control-Allow-Origin: *");		// CORS
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");
writeLog($dumpFile, "login file");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $onloadCommand=$_FILES;
    $adminObj=new admin();
    $adminObj->contactCenterSaveMapPic($onloadCommand);
    unset($adminObj);
}

?>