<?php
print_r($_FILES);

header('Content-Type: application/json', true);
header("Access-Control-Allow-Origin: *");		// CORS
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");


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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    writeLog($dumpFile, 'In check post receive');
    if (isset($_FILES['files'])) { //if (isset($_FILES['files'])) {
        writeLog($dumpFile, 'In start saving');
        $errors = [];
        $path = 'uploads/';
        $extensions = ['jpg', 'jpeg', 'png', 'gif'];

        $all_files = count($_FILES['files']['tmp_name']);

        for ($i = 0; $i < $all_files; $i++) {
            $file_name = $_FILES['files']['name'][$i];
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $file_type = $_FILES['files']['type'][$i];
            $file_size = $_FILES['files']['size'][$i];
            $file_ext = strtolower(end(explode('.', $_FILES['files']['name'][$i])));

            $file = $path . $file_name;

            if (!in_array($file_ext, $extensions)) {
                $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
            }

            if ($file_size > 2097152) {
                $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
            }

            if (empty($errors)) {
                move_uploaded_file($file_tmp, $file);
            }
        }

        if ($errors) print_r($errors);
    }
    $data['data']['index'] = 1;
    echo json_encode($data);
}
?>