<?php
$dumpFile = "dump.txt";
$date = date("Y-m-d H:i:s");
$GLOBALS = array(
    'name' => 'dump.txt',
    'date'=> $date
);
fopen($dumpFile,'a+');
//unlink($dumpFile);

function writeLog($dumpFile , $text){
    $h=fopen($dumpFile,'a+');
    fwrite($h,"\n->".$text);
    fclose($h);
}
?>