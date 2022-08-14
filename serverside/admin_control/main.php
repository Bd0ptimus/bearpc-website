<?php
include "../libraries.php";
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");
use URLServerConfig\UrlServerConfig;
require('../url_config.php');

class admin{
    protected $db;
    protected $dbconfigObj;
    protected $dumpf;

    function __construct(){
        //Take information to connect with db
        $this->dbconfigObj = new dbconfig();
        $HostName = $this->dbconfigObj->HostName;
        $DatabaseName = $this->dbconfigObj->DatabaseName;
        $HostUser = $this->dbconfigObj->HostUser;
        $HostPass = $this->dbconfigObj->HostPass;

        //Connect with db
        $this->db = new PDO("mysql:host=$HostName; dbname=$DatabaseName; charset=utf8", $HostUser, $HostPass,  array(
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        //make dump file
        global $GLOBALS;
        $this->dumpf =& $GLOBALS;
    }


    //---- Start Category page
    function login($input) {
        $adminCode = $input['admin'];
        $password = $input['password'];
        $data = $this->db->query("SELECT * FROM admin_data WHERE admin_code='$adminCode'");
        if($data->rowCount() == 0){
            $result['complete'] = 1;
            $result['complete_code'] = 0;
            $result['data']['comment']='код администратора неверный';
            sendToClient($result);
        }else{
            $dataAfterFetch = $data->fetchAll();
            if($password == $dataAfterFetch[0]['password']){
                $result['complete'] = 1;
                $result['complete_code'] = 1;
                $result['data']['comment']='Вы успешно вошли в систему';
            }else{
                $result['complete'] = 1;
                $result['complete_code'] = 0;
                $result['data']['comment']='пароль неверный';
            }
            sendToClient($result);
        }
    }

    function addDataCategory($input){
        $table='';
        $rowAdd='';
        $value = $input['value'];
        switch($input['type']){
            case 1 :
                $table = 'bear_type';
                $rowAdd = 'bear_name';
                break;
            case 2 :
                    $table = 'types';
                    $rowAdd = 'type_name';
                    break;
            case 3 :
                    $table = 'controllers';
                    $rowAdd = 'name';
                    break;
        }
        try{
            $insertNewData = $this->db->prepare("INSERT INTO $table($rowAdd) 
            VALUES(:name)");
            $insertNewData ->bindParam(":name",$value);
            $insertNewData->execute();
            $result['complete'] = 1;
            $result['complete_code'] = 1;
        }catch(PDOException $e){
            $result['complete'] = 1;
            $result['complete_code'] = 0;
        }
        sendToClient($result);
    }

    function saveDataCategory($input){
        $table='';
        $rowCompare='';
        $rowChange ='';
        $condition = $input['id'];
        $value = $input['value'];
        switch($input['type']){
            case 1 :
                $table = 'bear_type';
                $rowCompare = 'bear_id';
                $rowChange ='bear_name';
                break;
            case 2 :
                $table = 'types';
                $rowCompare = 'type_id';
                $rowChange ='type_name';
                break;
            case 3 :
                $table = 'controllers';
                $rowCompare = 'id';
                $rowChange ='name';
                break;
        }
        try{
            $data = [
                'name' => $value,
                'condition' =>$condition
            ];
            $insertNewData = $this->db->prepare("UPDATE $table SET $rowChange=:name 
            WHERE $rowCompare=:condition");
            $insertNewData->execute($data);
            $result['complete'] = 1;
            $result['complete_code'] = 1;
        }catch(PDOException $e){
            
            $result['complete'] = 1;
            $result['complete_code'] = 0;
        }
        sendToClient($result);
    }

    function deleteDataCategory($input){
        //For delete in main category table
        $table='';
        $row='';
        $condition = $input['id'];

        //For handle reference tables
        $tableReference = '';
        $rowReference = '';
        switch($input['type']){
            case 1 :
                $table = 'bear_type';
                $row = 'bear_id';
                break;
            case 2 :
                $table = 'types';
                $row = 'type_id';
                $tableReference = 'product_type';
                $rowReference = 'product_type_value';
                break;
            case 3 :
                $table = 'controllers';
                $row = 'id';
                $tableReference = 'product_name_controller';
                $rowReference = 'product_name_controller_value';
                break;
        }
        try{
            
            if($input['type']==1){//bear category
                $data = [
                    'name' => 0,
                    'condition' =>$condition
                ];
                $updateNewData = $this->db->prepare("UPDATE products_main_data SET bear_type=:name 
                WHERE bear_type=:condition");
                $updateNewData->execute($data);
            }else{//others category
                $updateNewData = $this->db->prepare("DELETE FROM $tableReference
                WHERE $rowReference=:condition");
                $updateNewData->execute([':condition' => $condition]);
            }
            $sql = "DELETE FROM $table WHERE $row=:condition";
            $dbcall = $this->db->prepare($sql);
            $dbcall->execute([':condition' => $condition]);
            $result['complete'] = 1;
            $result['complete_code'] = 1;
        }catch(PDOException $e){
            writeLog($this->dumpf['name'], "In delete data:  ". $e);
            $result['complete'] = 1;
            $result['complete_code'] = 0;
        }
        sendToClient($result);
    }

    function categoryCenterLoad($input){
        $tableRealtive = ''; //main category table
        $rowRelative = ''; // row take data from main category table
        //$rowAbsolute = ''; 
        $rowNameReturn=''; //row for take name of elements in category 

        $tableMiddle = '';// table for connect products_main_data with main category table
        $rowMiddle = '';//row for take data before pass into products_main_data
        
        switch($input){
            case 1:
                $tableRealtive = 'bear_type';
                $rowRelative = 'bear_id';
                //$rowAbsolute='bear_type';
                $rowNameReturn='bear_name';
                $tableMiddle = 'products_main_data';
                $rowMiddle = 'bear_type';
                break;
            case 2:
                $tableRealtive = 'types';
                $rowRelative = 'type_id';
                //$rowAbsolute='bear_type';
                $rowNameReturn='type_name';
                $tableMiddle = 'product_type';
                $rowMiddle = 'product_type_value';
                break;
            case 3:
                $tableRealtive = 'controllers';
                $rowRelative = 'id';
                //$rowAbsolute='bear_type';
                $rowNameReturn='name';
                $tableMiddle = 'product_name_controller';
                $rowMiddle = 'product_name_controller_value';
                break;

        }

        $result['page_index'] = $input;
        $data = $this->db->query("SELECT * FROM $tableRealtive");
        $counter = $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        for($i=0; $i<$counter;$i++){
            $conditionMiddle = $dataAfterFetch[$i][$rowRelative];
            $dataFromMiddle = $this->db->query("SELECT * FROM $tableMiddle WHERE $rowMiddle='$conditionMiddle' ORDER BY $rowMiddle");
            $counterFromMiddle = $dataFromMiddle->rowCount();
            $dataMiddleFetch =$dataFromMiddle->fetchAll();
            $result['data'][$i]['name']=$dataAfterFetch[$i][$rowNameReturn];
            $result['data'][$i]['id']=$dataAfterFetch[$i][$rowRelative];
            if($counterFromMiddle == 0){
                $result['data'][$i]['product'][0]['name']='';
                $result['data'][$i]['product'][0]['id']='';
            }else{
                //writeLog($this->dumpf['name'], "Counter from middle:  ". $counterFromMiddle);
                for($z=0; $z<$counterFromMiddle; $z++){
                    $conditionRelative = $dataMiddleFetch[$z]['product_id'];
                    //writeLog($this->dumpf['name'], "Product id In last take :  ". $conditionRelative);
                    $dataFromMainTable = $this->db->query("SELECT * FROM products_main_data WHERE product_id='$conditionRelative'");
                    $counterFromMain =  $dataFromMainTable->rowCount();
                    $dataFromMainAfterFetch = $dataFromMainTable->fetchAll();
                    $result['data'][$i]['product'][$z]['name']=$dataFromMainAfterFetch[0]['product_name'];
                    $result['data'][$i]['product'][$z]['id']=$dataFromMainAfterFetch[0]['product_id'];
                    
                }
            }
            
        }
        
        sendToClient($result);
    }

    //---End category page



    //----start product page----
    function loadProductExisted(){
        //take product name, id, and bear type
        $data = $this ->db->query("SELECT products_main_data.*, bear_type.* FROM products_main_data LEFT JOIN bear_type ON bear_type.bear_id = products_main_data.bear_type");
        $counter = $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        for($i=0; $i<$counter; $i++){
            $result['data'][$i]['name'] = $dataAfterFetch[$i]['product_name'];
            $result['data'][$i]['id'] = $dataAfterFetch[$i]['product_id'];
            $result['data'][$i]['bear_type'] = $dataAfterFetch[$i]['bear_name'];
            $result['data'][$i]['bear_id'] = $dataAfterFetch[$i]['bear_id'];
            $result['data'][$i]['main_image'] = $dataAfterFetch[$i]['product_main_pic'];
            $result['data'][$i]['stock'] = $dataAfterFetch[$i]['product_in_stock'];
            $result['data'][$i]['sale'] = $dataAfterFetch[$i]['product_sale'];
            //take type category
            $condition = $dataAfterFetch[$i]['product_id'];
            $dataIn = $this->db->query("SELECT types.*, product_type.* FROM types INNER JOIN product_type ON product_type.product_type_value = types.type_id WHERE product_type.product_id='$condition'");
            $counterIn = $dataIn->rowCount();
            $dataAfterFetchIn = $dataIn->fetchAll();
            if($counterIn == 0){
                $result['data'][$i]['type_product']=[];
            }else{
                for($y=0; $y<$counterIn; $y++){
                    $result['data'][$i]['type_product'][$y]['name'] =  $dataAfterFetchIn[$y]['type_name'];
                    $result['data'][$i]['type_product'][$y]['id'] =  $dataAfterFetchIn[$y]['product_type_value'];
                }
            }
            
            

            //take controller category
            $dataIn = $this->db->query("SELECT controllers.*, product_name_controller.* FROM controllers INNER JOIN product_name_controller ON product_name_controller.product_name_controller_value = controllers.id WHERE product_name_controller.product_id='$condition'");
            $counterIn = $dataIn->rowCount();
            $dataAfterFetchIn = $dataIn->fetchAll();
            if($counterIn == 0){
                $result['data'][$i]['controller_product']=[];
            }else{
                for($y=0; $y<$counterIn; $y++){
                    $result['data'][$i]['controller_product'][$y]['name'] =  $dataAfterFetchIn[$y]['name'];
                    $result['data'][$i]['controller_product'][$y]['id'] =  $dataAfterFetchIn[$y]['id'];
                }
            }


            //take images
            $dataIn = $this->db->query("SELECT * FROM product_pictures WHERE product_id='$condition'");
            $counterIn = $dataIn->rowCount();
            $dataAfterFetchIn = $dataIn->fetchAll();
            for($y=0; $y<$counterIn; $y++){
                $result['data'][$i]['images'][$y] =  $dataAfterFetchIn[$y]['picture_path'];
            }

            //files
            $dataIn = $this->db->query("SELECT * FROM product_file_for_downloading WHERE product_id='$condition'");
            $counterIn = $dataIn->rowCount();
            $dataAfterFetchIn = $dataIn->fetchAll();
            for($y=0; $y<$counterIn; $y++){
                $result['data'][$i]['files'][$y]['path'] =  $dataAfterFetchIn[$y]['file_path'];
                $result['data'][$i]['files'][$y]['name'] =  $dataAfterFetchIn[$y]['file_name'];
            }

            //highlight
            $obj = new FileControl();
            $highlightCsvPath = '../../product_data/data_file/highlight/'.$condition.'_high.csv';
            $result['data'][$i]['highlight']=$obj->takeDataFromCsv($highlightCsvPath);

            //description 
            $desJsonPath = '../../product_data/data_file/description/'.$condition.'_des.json';
            $result['data'][$i]['description']=$obj->takeDataFromJson($desJsonPath);
        }

        $data=$this->db->query("SELECT * FROM productpage_filter_interface");
        $dataAfterFetch = $data->fetchAll();
        //$result['data']['page_interface']['bear'] = $dataAfterFetch[0]['bear'];
        $result['page_interface']['type'] = $dataAfterFetch[0]['type'];
        $result['page_interface']['controller'] = $dataAfterFetch[0]['controller'];
        $result['page_interface']['sale'] = $dataAfterFetch[0]['sale'];
        $result['page_interface']['instock'] = $dataAfterFetch[0]['instock'];
        sendToClient($result);
    }

    public function productCenterPageFilterInterfaceChange($data){
        $dataInDb = $this->db->query("SELECT * FROM productpage_filter_interface");
        $dataAfterFetch = $dataInDb->fetchAll();
        $id = $dataAfterFetch[0]['id'];

        $typeValue = $data['type'];
        $controllerValue = $data['controller'];
        $saleValue = $data['sale'];
        $instockValue = $data['instock'];
        $dataUpdate = [
            'type' => $typeValue,
            'controller' => $controllerValue,
            'sale' => $saleValue,
            'instock' => $instockValue,
            'condition' =>$id
        ];
        $updateNewData = $this->db->prepare("UPDATE productpage_filter_interface SET 
        type=:type,
        controller=:controller,
        sale=:sale,
        instock=:instock
        WHERE id=:condition");
        $updateNewData->execute($dataUpdate);

        $result['complete'] = 1;
        sendToClient($result);


    } 

    function loadInterfaceForAddNew(){
        try{
            $data = $this->db->query("SELECT * FROM bear_type");
            $counter = $data->rowCount();
            $dataAfterFetch = $data->fetchAll();
            for($i=0; $i<$counter; $i++){
                $result['data']['bear_type'][$i]['name'] = $dataAfterFetch[$i]['bear_name'];
                $result['data']['bear_type'][$i]['id'] = $dataAfterFetch[$i]['bear_id'];
            }
            $data = $this->db->query("SELECT * FROM types");
            $counter = $data->rowCount();
            $dataAfterFetch = $data->fetchAll();
            for($i=0; $i<$counter; $i++){
                $result['data']['types'][$i]['name'] = $dataAfterFetch[$i]['type_name'];
                $result['data']['types'][$i]['id'] = $dataAfterFetch[$i]['type_id'];
            }
            $data = $this->db->query("SELECT * FROM controllers");
            $counter = $data->rowCount();
            $dataAfterFetch = $data->fetchAll();
            for($i=0; $i<$counter; $i++){
                $result['data']['controllers'][$i]['name'] = $dataAfterFetch[$i]['name'];
                $result['data']['controllers'][$i]['id'] = $dataAfterFetch[$i]['id'];
            }


            $result['complete']=1;
            $result['complete_code'] = 1;
        }catch(PDOException $e){
            writeLog($this->dumpf['name'], "In load add interface data:  ". $e);
            $result['complete'] = 1;
            $result['complete_code'] = 0;
        }
        sendToClient($result);
    }

    function addNewProduct($data){
        $obj = new FileControl();
        $nameProductIn = $data['name'];
        $stockIn = $data['in_stock'];
        $saleIn = $data['in_sale'];
        $bearTypeIn = $data['bear_type'];
        $imagesList = $data['images'];
        $docList = $data['files'];
        $typeChooseList = $data['type_product'];
        $controllerChooseList = $data['controller'];
        $mainPicIn = $data['main_image'];
        //store data to database
        try{
            //store raw data into products_main_data
            $insertNewData = $this->db->prepare("INSERT INTO products_main_data(product_name,product_sale,product_in_stock,bear_type) 
            VALUES(:name,:productInSale, :productInStock, :bearType)");
            $insertNewData ->bindParam(":name",$nameProductIn);
            $insertNewData ->bindParam(":productInSale",$stockIn);
            $insertNewData ->bindParam(":productInStock",$saleIn);
            $insertNewData ->bindParam(":bearType",$bearTypeIn);
            $insertNewData->execute();
            $dataForTakeId = $this->db->query("SELECT * FROM products_main_data WHERE product_name='$nameProductIn'");
            $productId = $dataForTakeId->fetchAll()[0]['product_id'];
            //move files, images, create folder detail
            //move images 
            foreach($imagesList as $img){
                $obj->moveFile($img,'img_uploaded_in_waiting/','../../product_data/image/' );
                $imgPathForDb = UrlServerConfig::MAIN_URL.'product_data/image/'.$img;
                $insertNewData = $this->db->prepare("INSERT INTO product_pictures(product_id,picture_path) 
                VALUES(:productId, :picturePath)");
                $insertNewData ->bindParam(":productId",$productId);
                $insertNewData ->bindParam(":picturePath",$imgPathForDb);
                $insertNewData->execute();
            }
            $obj->deleteAllFileInside('img_uploaded_in_waiting/');
            //move file pdf
            foreach($docList as $doc){
                $fileNameIn = $doc['site_name'];
                $obj->moveFile($doc['tem_name'],'file_uploaded_in_waiting/','../../product_data/data_file/file_download/' );
                $filePathForDb = UrlServerConfig::MAIN_URL.'product_data/data_file/file_download/'.$doc['tem_name'];
                $insertNewData = $this->db->prepare("INSERT INTO product_file_for_downloading(file_name, product_id,file_path) 
                VALUES(:fileName, :productId, :filePath)");
                $insertNewData ->bindParam(":fileName",$fileNameIn);
                $insertNewData ->bindParam(":productId",$productId);
                $insertNewData ->bindParam(":filePath",$filePathForDb);
                $insertNewData->execute();
            }
            $obj->deleteAllFileInside('file_uploaded_in_waiting/');
            //create detail folder
            $obj->createDetailHtmlFile($productId);
            //description file
            $nameForDesFile = $productId.'_des.json';
            $obj->writeJsonDataToFile($data['main_description'], $nameForDesFile,'../../product_data/data_file/description/');
            //csv file
            $nameForCsvFile = $productId.'_high.csv';
            $obj->writeCsvDataToFile($data['short_description'], $nameForCsvFile, '../../product_data/data_file/highlight/');
            //save in product_type and product_name_controller
            //product_type;
            foreach ($typeChooseList as $type){
                $insertNewData = $this->db->prepare("INSERT INTO product_type(product_id,product_type_value) 
                VALUES(:productId, :typeValue)");
                $insertNewData ->bindParam(":productId",$productId);
                $insertNewData ->bindParam(":typeValue",$type);
                $insertNewData->execute();
            }

            //product_name_controller
            foreach ($controllerChooseList as $controller){
                $insertNewData = $this->db->prepare("INSERT INTO product_name_controller(product_id,product_name_controller_value) 
                VALUES(:productId, :controllerValue)");
                $insertNewData ->bindParam(":productId",$productId);
                $insertNewData ->bindParam(":controllerValue",$controller);
                $insertNewData->execute();
            }
            
            //complete products_main_data table
            $mainPic=UrlServerConfig::MAIN_URL.'product_data/image/'.$mainPicIn;
            $desPath = UrlServerConfig::MAIN_URL.'product_data/data_file/description/'.$nameForDesFile;
            $highlightPath = UrlServerConfig::MAIN_URL.'product_data/data_file/highlight/'.$nameForCsvFile;
            $detailFoler = UrlServerConfig::MAIN_URL.'html/'.$productId.'detail/';
            $dataInUpdate = [
                'mainPic' => $mainPic,
                'desPath'=>$desPath,
                'highlightPath'=>$highlightPath,
                'productLink'=>$detailFoler,
                'condition' =>$productId
            ];
            $updateNewData = $this->db->prepare("UPDATE products_main_data SET 
            product_main_pic=:mainPic,
            product_description_path=:desPath, 
            product_highlight_path=:highlightPath, 
            product_link=:productLink 
            WHERE product_id=:condition");
            $updateNewData->execute($dataInUpdate);

            $result['complete'] = 1;
            $result['complete_code'] = 1;
        }catch(PDOException $e){
            $result['complete'] = 1;
            $result['complete_code'] = 0;
        }

        sendToClient($result);
        unset($obj);
    }

    function updateProduct($data){
        $productId = $data['id'];
        $imagesIn = $data['images'];
        $maimImageIn = $data['main_image'];
        $filesIn = $data['files'];
        $desJsonArrIn = $data['main_description'];
        $highlightArrIn = $data['short_description'];
        $nameProductIn = $data['name'];
        $saleIn = $data['in_sale'];
        $stockIn = $data['in_stock'];
        $bearIn = $data['bear_type'];
        $typeProductList = $data['type_product'];
        $controllerList = $data['controller'];
        $obj = new FileControl();
        //images process
        //main pic
        $data = [
            'mainpic' => UrlServerConfig::MAIN_URL.'product_data/image/'.$maimImageIn,
            'condition' =>$productId
        ];
        $updateNewData = $this->db->prepare("UPDATE products_main_data SET product_main_pic=:mainpic 
        WHERE product_id=:condition");
        $updateNewData->execute($data);
        //take existed img
        $imgExistedArr = array();
        $data = $this->db->query("SELECT * FROM product_pictures WHERE product_id='$productId'");
        $dataAfterFetch = $data->fetchAll();
        foreach ($dataAfterFetch as $queryTake){
            $imgPathSplit = explode('/',$queryTake['picture_path']);
            $namePic = $imgPathSplit[sizeof($imgPathSplit)-1];
            array_push($imgExistedArr, $namePic );
        }
        //insert new pics
        foreach($imagesIn as $img){
            if(!in_array($img, $imgExistedArr)){
                $obj->moveFile($img,'img_uploaded_in_waiting/','../../product_data/image/' );
                $imgPathForDb = UrlServerConfig::MAIN_URL.'product_data/image/'.$img;
                $insertNewData = $this->db->prepare("INSERT INTO product_pictures(product_id,picture_path) 
                VALUES(:productId, :picturePath)");
                $insertNewData ->bindParam(":productId",$productId);
                $insertNewData ->bindParam(":picturePath",$imgPathForDb);
                $insertNewData->execute();
            }
        }
        $obj->deleteAllFileInside('img_uploaded_in_waiting/');
        //delete old pics
        foreach ($imgExistedArr as $img){
            if(!in_array($img, $imagesIn )){
                $imgPathForDb = UrlServerConfig::MAIN_URL.'product_data/image/'.$img;
                $sql = "DELETE FROM product_pictures WHERE picture_path=:condition";
                $dbcall = $this->db->prepare($sql);
                $dbcall->execute([':condition' => $imgPathForDb]);
            }
        }


        //file process
        $fileExistedArr = array();
        $nameFileIn = array();
        foreach($filesIn as $nameIn){
            array_push($nameFileIn, $nameIn['tem_name']);
        }
        $data = $this->db->query("SELECT * FROM product_file_for_downloading WHERE product_id='$productId'");
        $dataAfterFetch = $data->fetchAll();
        
        foreach ($dataAfterFetch as $queryTake){
            $filePathSplit = explode('/',$queryTake['file_path']);
            $nameFile = $filePathSplit[sizeof($filePathSplit)-1];
            //writeLog($this->dumpf['name'], "name file in existed:  ". $nameFile);
            array_push($fileExistedArr, $nameFile );
        }
        writeLog($this->dumpf['name'], "in take file existed:  ");
        foreach ($fileExistedArr as $fileExisted){
            writeLog($this->dumpf['name'], "name file in existed:  ". $fileExisted);
        }
        //insert new files
        foreach($filesIn as $file){
            if(!in_array($file['tem_name'], $fileExistedArr)){
                writeLog($this->dumpf['name'], " file in:  ". $file['tem_name'].' - ');
                $fileSiteName = $file['site_name'];
                
                $obj->moveFile($file['tem_name'],'file_uploaded_in_waiting/','../../product_data/data_file/file_download/' );
                //writeLog($this->dumpf['name'], "root:  ". 'file_uploaded_in_waiting/'.);
                $filePathForDb = UrlServerConfig::MAIN_URL.'product_data/data_file/file_download/'.$file['tem_name'];
                $insertNewData = $this->db->prepare("INSERT INTO product_file_for_downloading(file_name,product_id,file_path) 
                VALUES(:fileName,:productId, :picturePath)");
                $insertNewData ->bindParam(":fileName",$fileSiteName);
                $insertNewData ->bindParam(":productId",$productId);
                $insertNewData ->bindParam(":picturePath",$filePathForDb);
                $insertNewData->execute();
            }
        }
        $obj->deleteAllFileInside('file_uploaded_in_waiting/');
        //delete old files
        foreach ($fileExistedArr as $file){
            if(!in_array($file, $nameFileIn )){
                $filePathForDb = UrlServerConfig::MAIN_URL.'product_data/data_file/file_download/'.$file;
                $sql = "DELETE FROM product_file_for_downloading WHERE file_path=:condition";
                $dbcall = $this->db->prepare($sql);
                $dbcall->execute([':condition' => $filePathForDb]);
            }
        }
        //delete useless files 
        /*
        $allFileExisted = array();
        $data = $this->db->query('SELECT * FROM product_file_for_downloading');
        $dataAfterFetch = $data->fetchAll();
        foreach($dataAfterFetch as $dataCell){
            $dataCellSplit = explode("/", $dataCell['file_path']);
            $nameFileExisted = $dataCellSplit[sizeof($dataCellSplit)-1];
            writeLog($this->dumpf['name'], " file od all product in db:  ". $nameFileExisted.' - ');
            array_push($allFileExisted , $nameFileExisted);
        }
        $obj->deleteAllFileInsideExcept('../../product_data/data_file/file_download/',$allFileExisted); 
        */

        
        //description file
        $nameForDesFile = $productId.'_des.json';
        $obj->writeJsonDataToFile($desJsonArrIn, $nameForDesFile,'../../product_data/data_file/description/');
        //csv file
        $nameForCsvFile = $productId.'_high.csv';
        $obj->writeCsvDataToFile($highlightArrIn, $nameForCsvFile, '../../product_data/data_file/highlight/');
        
        //name, bear_type, sale, stock
        $data = [
            'name' => $nameProductIn,
            'sale' => $saleIn,
            'stock' => $stockIn,
            'bearType' => $bearIn,
            'condition' =>$productId
        ];
        $updateNewData = $this->db->prepare("UPDATE products_main_data SET product_name=:name,
        product_sale=:sale,
        product_in_stock=:stock,
        bear_type=:bearType
        WHERE product_id=:condition");
        $updateNewData->execute($data);
        
        //type product
        $sql = "DELETE FROM product_type WHERE product_id=:condition";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute([':condition' => $productId]);

        foreach ($typeProductList as $typeId){
            $insertNewData = $this->db->prepare("INSERT INTO product_type(product_id,product_type_value) 
            VALUES(:productId, :typeValue)");
            $insertNewData ->bindParam(":productId",$productId);
            $insertNewData ->bindParam(":typeValue",$typeId);
            $insertNewData->execute();
        }

        //controller
        $sql = "DELETE FROM product_name_controller WHERE product_id=:condition";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute([':condition' => $productId]);

        foreach ($controllerList as $controllerId){
            $insertNewData = $this->db->prepare("INSERT INTO product_name_controller(product_id,product_name_controller_value) 
            VALUES(:productId, :controllerValue)");
            $insertNewData ->bindParam(":productId",$productId);
            $insertNewData ->bindParam(":controllerValue",$controllerId);
            $insertNewData->execute();
        }
        

        $result['complete'] = 1;
        $result['complete_code'] = 1;
        sendToClient($result);
        unset($obj);
    }

    function deleteProduct($data){
        $productId = $data['id'];
        $imagesIn = $data['images'];
        $maimImageIn = $data['main_image'];
        $filesIn = $data['files'];
        $desJsonArrIn = $data['main_description'];
        $highlightArrIn = $data['short_description'];
        $nameProductIn = $data['name'];
        $saleIn = $data['in_sale'];
        $stockIn = $data['in_stock'];
        $bearIn = $data['bear_type'];
        $typeProductList = $data['type_product'];
        $controllerList = $data['controller'];
        $obj = new FileControl();

        //delete img
        foreach ($imagesIn as $img){
            $obj->deleteTemporaryFile($img,'../../product_data/image/');
        }
        $sql = "DELETE FROM product_pictures WHERE product_id=:condition";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute([':condition' => $productId]);

        //delete des file
        $nameForDesFile = $productId.'_des.json';
        $obj->deleteTemporaryFile($nameForDesFile,'../../product_data/data_file/description/');

        //delete highlight file
        $nameForCsvFile = $productId.'_high.csv';
        $obj->deleteTemporaryFile($nameForCsvFile,'../../product_data/data_file/highlight/');

        //files
        for($i=0 ; $i < sizeof($filesIn);$i++){
            $obj->deleteTemporaryFile($filesIn[$i]['tem_name'],'../../product_data/data_file/file_download/');
        }
        $sql = "DELETE FROM product_file_for_downloading WHERE product_id=:condition";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute([':condition' => $productId]);

        //detail page
        $nameForDetailPage ='../../html/'. $productId.'detail/';
        $obj->removeWholeFolder($nameForDetailPage);

        //product_type and controller
        $sql = "DELETE FROM product_type WHERE product_id=:condition";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute([':condition' => $productId]);

        $sql = "DELETE FROM product_name_controller WHERE product_id=:condition";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute([':condition' => $productId]);

        //main data
        $sql = "DELETE FROM products_main_data WHERE product_id=:condition";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute([':condition' => $productId]);
        $result['complete'] = 1;
        $result['complete_code'] = 1;
        sendToClient($result);
        unset($obj);
    }

    public function productCenterCopyFiles($data){
        $obj = new FileControl();

        //main image
        $mainImgPath = $data['main_image'];
        $mainImgSplit=explode("/",$mainImgPath);
        $mainImgName = $mainImgSplit[sizeof($mainImgSplit)-1];

        //images
        $images = $data['images'];
        for($i =0 ; $i<sizeof($images); $i++){
            $imgSplit=explode("/",$images[$i]);
            $imgName = $imgSplit[sizeof($imgSplit)-1];
            $imgRealPath =  '../../product_data/image/'.$imgName;
            $now = DateTime::createFromFormat('U.u', number_format(microtime(true), 6, '.', ''), new \DateTimeZone('UTC'));
            $format = strtolower(end(explode('.', $imgName)));
            $desImgName = ((int)$now->format("Uu")).'.'.$format;
            $desImgpath = 'img_uploaded_in_waiting/'.$desImgName;
            $obj->copyFiles($imgRealPath,$desImgpath);
            $result['data']['images'][$i] = UrlServerConfig::MAIN_URL.'serverside/admin_control/img_uploaded_in_waiting/'.$desImgName;
            
            if($imgName == $mainImgName){
                $result['data']['main_image'] = UrlServerConfig::MAIN_URL.'serverside/admin_control/img_uploaded_in_waiting/'.$desImgName;
            }
        }

        //files
        $files = $data['files'];
        for($i =0 ; $i<sizeof($files); $i++){
            $fileSplit=explode("/",$files[$i]['path']);
            $fileName = $fileSplit[sizeof($fileSplit)-1];
            $fileRealPath =  '../../product_data/data_file/file_download/'.$fileName;
            $now = DateTime::createFromFormat('U.u', number_format(microtime(true), 6, '.', ''), new \DateTimeZone('UTC'));
            $format = strtolower(end(explode('.', $fileName)));
            $desFileName = ((int)$now->format("Uu")).'.'.$format;
            $desFilepath = 'file_uploaded_in_waiting/'.$desFileName;
            $obj->copyFiles($fileRealPath,$desFilepath);
            $result['data']['files'][$i]['path'] = UrlServerConfig::MAIN_URL.'serverside/admin_control/file_uploaded_in_waiting/'.$desFileName;
            $result['data']['files'][$i]['name'] = $files[$i]['name'];
        }
        sendToClient($result);
        unset($obj);
    }


    /* ABOUT Center */
     /* ABOUT Center */
    function aboutCenterLoad($data) {
        $table = '';

        switch ($data){
            case 0: 
                $table = 'company_history';
                
                break;
        }
        
        $dataFromDb  = $this->db->query("SELECT * FROM $table");
        $dataCount = $dataFromDb->rowCount();
        $dataAfterFetch = $dataFromDb->fetchAll();
        $result['complete'] = 1;
        $result['complete_code'] = 1;
        for ($i =0 ; $i <$dataCount ; $i++){
            $result ['data'][$i]['story_id'] = $dataAfterFetch[$i]['story_id'];
            $result ['data'][$i]['story_text'] = $dataAfterFetch[$i]['story_text'];
            $result ['data'][$i]['story_title'] = $dataAfterFetch[$i]['story_title'];
            $result ['data'][$i]['story_italic'] = $dataAfterFetch[$i]['story_italic'];
            $result ['data'][$i]['story_size'] = $dataAfterFetch[$i]['story_font_size'];     
        }
        sendToClient($result);

    }

    public function aboutCenterUpdate($data){
        $textValue = $data['text'];
        $condition = $data['id'];
        $textTitle = $data['title'];
        $fontSize = $data['fontsize'];
        $italicSet = $data['italic'];
        
        $data = [
            'text' => $textValue,
            'title' =>$textTitle,
            'italic' => $italicSet,
            'fontsize'=>$fontSize,
            'condition' =>$condition
        ];
        $updateNewData = $this->db->prepare("UPDATE company_history SET story_text=:text,
        story_title=:title,
        story_italic=:italic,
        story_font_size=:fontsize
        WHERE story_id=:condition");
        $updateNewData->execute($data);
        $result['complete'] = 1;
        $result['complete_code'] = 1;
        sendToClient($result);

    }

    public function aboutCenterAddNew($data){
        $newText = $data['text'];
        $newTitle = $data['title'];
        $italicSet = $data['italic'];
        $fontSizeSet = $data['fontsize'];
        
        $insertNewData = $this->db->prepare("INSERT INTO company_history(story_text, story_title, story_italic, story_font_size) 
        VALUES(:newText,:newTitle,:italic,:fontsize)");
        $insertNewData ->bindParam(":newText",$newText);
        $insertNewData ->bindParam(":newTitle",$newTitle);
        $insertNewData ->bindParam(":italic",$italicSet);
        $insertNewData ->bindParam(":fontsize",$fontSizeSet);
        $insertNewData->execute();
        $result['complete'] = 1;
        $result['complete_code'] = 1;
        sendToClient($result);

    }

    public function aboutCenterDelete($data){
        $table = '';
        $compareRow = '';
        $tableId = $data['table'];
        $condition = $data['id'];
        switch ($tableId){
            case 0: 
                $table = 'company_history';
                $compareRow = 'story_id';
                break;
        }
        $sql = "DELETE FROM $table WHERE $compareRow=:condition";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute([':condition' => $condition]);
        $result['complete'] = 1;
        $result['complete_code'] = 1;
        sendToClient($result);

    }

    //MAIN center
    public function mainCenterLoad(){
        $data = $this->db->query("SELECT * FROM main_slogan");
        $dataAfterFetch = $data->fetchAll();
        $result['complete']= 1;
        $result['data']['slogan'] = $dataAfterFetch[0]['text'];
        $result['complete_code'] = 0;
        sendToClient($result);
    }

    public function mainCenterSave($data){
        $value = $data['text'];
        $sql = "DELETE FROM  main_slogan";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute();

        $insertNewData = $this->db->prepare("INSERT INTO main_slogan(text) 
        VALUES(:newText)");
        $insertNewData ->bindParam(":newText",$value);
        $insertNewData->execute();

        $this->mainCenterLoad();
    }

    //SERVICE center
    public function serviceCenterLoad(){
        $result['complete']= 1;

        $data = $this->db->query("SELECT * FROM service_intro");
        $dataCount= $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        for($i = 0; $i<$dataCount;$i++){
            $result['data']['intro'][$i]['id'] = $dataAfterFetch[$i]['id'];
            $result['data']['intro'][$i]['info'] = $dataAfterFetch[$i]['info'];

        }

        $data = $this->db->query("SELECT * FROM service");
        $dataCount= $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        
        for($i = 0; $i<$dataCount;$i++){
            $result['data']['service'][$i]['id'] = $dataAfterFetch[$i]['id'];
            $result['data']['service'][$i]['info'] = $dataAfterFetch[$i]['info'];

        }
        $result['complete_code'] = 0;
        sendToClient($result);
    }

    public function serviceCenterSave($data){
        $table ='';
        $type = $data['type'];
        switch($type){
            case 1:
                $table = 'service_intro';
                break;
            case 2:
                $table = 'service';
                break;
        }
        $newValue = $data['info'];
        $id = $data['id'];
        $data = [
            'text' => $newValue,
            'condition' =>$id
        ];
        $updateNewData = $this->db->prepare("UPDATE $table SET info=:text
        WHERE id=:condition");
        $updateNewData->execute($data);

        $this->serviceCenterLoad();
    }

    public function serviceCenterDelete($data){
        $table ='';
        $type = $data['type'];
        switch($type){
            case 1:
                $table = 'service_intro';
                break;
            case 2:
                $table = 'service';
                break;
        }
        
        $condition = $data['id']; 
        $sql = "DELETE FROM $table WHERE id=:condition";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute([':condition' => $condition]);
        $this->serviceCenterLoad();

    }

    public function serviceCenterAddNew($data){
        $type = $data['type'];
        $table = '';
        switch($type){
            case 1:
                $table = 'service_intro';
                break;
            case 2:
                $table = 'service';
                break;
        }
        $value = $data['text'];
        $insertNewData = $this->db->prepare("INSERT INTO $table(info) 
        VALUES(:newText)");
        $insertNewData ->bindParam(":newText",$value);
        $insertNewData->execute();
        $this->serviceCenterLoad();

    }

    //CONTACT center 
    public function contactCenterLoad(){
        //phone
        $data = $this->db->query("SELECT * FROM contact_phone");
        $dataCount= $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        $result['complete']= 1;
        for($i = 0; $i<$dataCount;$i++){
            $result['data']['phone'][$i]['id'] = $dataAfterFetch[$i]['id'];
            $result['data']['phone'][$i]['number'] = $dataAfterFetch[$i]['phone_number'];

        }

        //email
        $data = $this->db->query("SELECT * FROM contact_email");
        $dataAfterFetch = $data->fetchAll();
        $result['data']['email'] = $dataAfterFetch[0]['email'];

        //address
        $data = $this->db->query("SELECT * FROM contact_address");
        $dataAfterFetch = $data->fetchAll();
        $result['data']['address'] = $dataAfterFetch[0]['address'];

        //timework
        $data = $this->db->query("SELECT * FROM contact_timework");
        $dataAfterFetch = $data->fetchAll();
        $result['data']['timework'] = $dataAfterFetch[0]['timework'];

        //map link
        $data = $this->db->query("SELECT * FROM contact_map_link");
        $dataAfterFetch = $data->fetchAll();
        $result['data']['maplink'] = $dataAfterFetch[0]['link'];

        //mappic
        $data = $this->db->query("SELECT * FROM contact_mapimg");
        $dataCount = $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        if($dataCount>0){
            $result['data']['map_pic'] = $dataAfterFetch[0]['path'];
        }else{
            $result['data']['map_pic'] ='';
        }
        
        sendToClient($result);
    }

    public function contactCenterSave($data){
        $id = $data['id'];
        $newValue = $data['info'];
        if($id>0){
            $data = [
                'value' => $newValue,
                'condition' =>$id
            ];
            $updateNewData = $this->db->prepare("UPDATE contact_phone SET phone_number=:value
            WHERE id=:condition");
            $updateNewData->execute($data);
        }else{
            $table = '';
            $rowAdd='';
            switch($id){
                case -1:
                    $table = 'contact_email';
                    $rowAdd='email';
                    break;
                case -2:
                    $table = 'contact_address';
                    $rowAdd='address';
                    break;
                case -3:
                    $table = 'contact_timework';
                    $rowAdd='timework';
                    break;
                case -4:
                    $table = 'contact_map_link';
                    $rowAdd='link';
                    break;
            }
            $sql = "DELETE FROM $table";
            $dbcall = $this->db->prepare($sql);
            $dbcall->execute();

            $insertNewData = $this->db->prepare("INSERT INTO $table($rowAdd) 
            VALUES(:newText)");
            $insertNewData ->bindParam(":newText",$newValue);
            $insertNewData->execute();
        }
        $this->contactCenterLoad();
    }

    public function contactCenterAddNew($data){
        $value = $data['info'];
        $insertNewData = $this->db->prepare("INSERT INTO contact_phone(phone_number) 
        VALUES(:newText)");
        $insertNewData ->bindParam(":newText",$value);
        $insertNewData->execute();
        $this->contactCenterLoad();

    }

    public function contactCenterDelete($data){
        $condition = $data['id'];
        $sql = "DELETE FROM contact_phone WHERE id=:condition";
        $dbcall = $this->db->prepare($sql);
        $dbcall->execute([':condition' => $condition]);
        $this->contactCenterLoad();

    }

    public function contactCenterSaveMapPic($data){
        $obj = new FileControl();
        

        $dataFromSv = $this->db->query("SELECT * FROM contact_mapimg");
        $dataCount = $dataFromSv->rowCount();
        if($dataCount>0){
            $sql = "DELETE FROM contact_mapimg";
            $dbcall = $this->db->prepare($sql);
            $dbcall->execute();
            $obj->deleteAllFileInside('../../assets/page-img/contact-page/');
        }

        $result = $obj->saveTemporaryFile($data['files'], '../../assets/page-img/contact-page/',20971520,'png', ['jpg', 'jpeg', 'png','bmp']);
        
        $namePic = $result['data']['name'][0];
        $picPath = UrlServerConfig::MAIN_URL.'assets/page-img/contact-page/'.$namePic;

        $insertNewData = $this->db->prepare("INSERT INTO contact_mapimg(path) 
        VALUES(:newText)");
        $insertNewData ->bindParam(":newText",$picPath);
        $insertNewData->execute();
        $dataReturn['data']['map_pic'] =  $picPath;
        sendToClient($dataReturn);
        unset($dataReturn);
    }

    function __destruct(){
        $this->db=null;
        unset($this->dbconfigObj);
    }
}

?>