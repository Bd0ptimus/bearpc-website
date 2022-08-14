<?php
include 'libraries.php';
writeLog($dumpFile, "In add data to db");

//Create PDO
$db = new PDO("mysql:host=$HostName; dbname=$DatabaseName", $HostUser, $HostPass);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
writeLog($dumpFile, "Create PDO successfully");

$productNameIn = "MC 92QI-16";
$productMainPicIn = "http://localhost/product_data/image/13_main.png";
$productHighLightPathIn = "http://localhost/product_data/data_file/highlight/13_high.csv";
$productDescriptionPathIn = "http://localhost/product_data/data_file/description/13_des.json";

$query = $db -> prepare("INSERT INTO products_main_data (
    product_name,
    product_main_pic,
    product_description_path,
    product_highlight_path
)VALUES(
    :productName,
    :productMainPic,
    :productDescriptionPath,
    :productHighLightPath
)");
$query->bindParam(':productName', $productNameIn);
$query->bindParam(':productMainPic', $productMainPicIn);
$query->bindParam(':productDescriptionPath', $productDescriptionPathIn);
$query->bindParam(':productHighLightPath', $productHighLightPathIn);

$query->execute();
writeLog($dumpFile, "Add data to product_main_data complete ");

$dataInProductMain = $db->query("SELECT * FROM products_main_data WHERE product_name='$productNameIn'")->fetchAll();
$idProduct = $dataInProductMain[0]['product_id'];

$picPath = array("http://localhost/product_data/image/13_main.png", "http://localhost/product_data/image/13_sub_1.png");
for($i=0; $i<sizeof($picPath); $i++){
    $picPathIn = $picPath[$i];
    $query = $db -> prepare("INSERT INTO product_pictures(
        product_id,
        picture_path
    )VALUES(
        :productId,
        :picturePath
    )");
    $query->bindParam(':productId', $idProduct);
    $query->bindParam(':picturePath', $picPathIn);
    
    $query->execute();
}

writeLog($dumpFile, "Add data to product_pictures complete ");

$db=null;





?>