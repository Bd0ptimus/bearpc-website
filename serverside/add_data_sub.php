<?php
include 'libraries.php';
writeLog($dumpFile, "In add data to db");

//Create PDO
$configObj = new dbConfig();
$db = new PDO("mysql:host=$configObj->HostName; dbname=$configObj->DatabaseName", $configObj->HostUser, $configObj->HostPass);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
writeLog($dumpFile, "Create PDO successfully");

/*
$productType= "Телематические системы";
$productId = array("12");
$productValueIn = "2";

for($i=0; $i<sizeof($productId); $i++){
    $productIdIn = $productId[$i];
    $query = $db -> prepare("INSERT INTO product_type(
        type_name,
        product_id,
        product_type_value
    )VALUES(
        :typeName,
        :productId,
        :productValue
    )");
    $query->bindParam(':typeName', $productType);
    $query->bindParam(':productId', $productIdIn);
    $query->bindParam(':productValue', $productValueIn);
    $query->execute();
}*/
$productId=12;
$productSaleIn=0;
$productStockIn=1;
$query = $db->prepare ("UPDATE products_main_data SET product_sale = :productSale AND product_in_stock = :productStock WHERE product_id='$productId'");
$query->bindParam(":productSale", $productSaleIn);
$query->bindParam(":productStock", $productStockIn);
$query->execute();
writeLog($dumpFile, "Add data to product_type complete ");

/*$productName = array("K1986BE1QI", "K1986BE92Q");
$productId = array("12", "13");
$productValue = array("1","2");
for($i=0;$i<2;$i++){
    $productNameIn=$productName[$i];
    $productIdIn = $productId[$i];
    $productValueIn = $productValue[$i];
    $query = $db -> prepare("INSERT INTO product_name_controller(
        name_controller,
        product_id,
        product_name_controller_value
    )VALUES(
        :nameController,
        :productId,
        :productNameValue
    )");
    $query->bindParam(':nameController', $productNameIn);
    $query->bindParam(':productId', $productIdIn);
    $query->bindParam(':productNameValue', $productValueIn);
    $query->execute();
}*/



$db=null;





?>