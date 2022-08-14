<?php
/*
include 'send_email.php';

$email = new MailerControl();
$email->sendEmailForConfirmationCode('thedung.1292@gmail.com', 'Bui The Dung', 123123);
*/

include 'libraries.php';
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");

$dbconfig = new dbconfig();
$HostName = $dbconfig->HostName;
$DatabaseName = $dbconfig->DatabaseName;
$HostUser = $dbconfig->HostUser;
$HostPass = $dbconfig->HostPass;

$in = $_POST['data'];

$db = new PDO("mysql:host=$HostName; dbname=$DatabaseName;charset=utf8mb4", $HostUser, $HostPass,  array(
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
//$db->exec("SET NAMES 'utf8';");

$data = $db->query(" SELECT * FROM test");


$dataAfterFetch = $data->fetchAll();
for($i=0; $i<$data->rowCount();$i++){
    //$result['data'][$i]['name'] =utf8_encode($dataAfterFetch[$i]['type_name']);
    
    $string = mb_convert_encoding($dataAfterFetch[$i]['type_name'], 'UTF-8', 'ISO-8859-1');
    $result['data'][$i]['name'] =$dataAfterFetch[$i]['type_name'];
    writeLog($dumpFile, "data[".$i.'] : '.$string);
}
//var_dump($result);
//var_dump(mysql_fetch_assoc($data));
sendToClient($result);
unset($dbconfig);
$db = null;
?>