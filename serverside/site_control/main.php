<?php
include "../libraries.php";
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");

class products{
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

    public function loadMainPage(){
        $data = $this->db->query("SELECT * FROM products_main_data ORDER BY product_id DESC");
        $result['complete'] = 1;
        if($data->rowCount()==0){
            //not found any product
            $result['complete_code'] = 0;
            $result['data']='';
        }else{
            if($data->rowCount()==1){
                $csvObject = new ReadCsv();
                $csvData = $csvObject->takeDataFromCsv(($data->fetchAll())[0]['product_highlight_path']);
                $result['complete_code'] = 1;
                $result['data'][0]['name']=($data->fetchAll())[0]['product_name'];
                $result['data'][0]['main_picture']=($data->fetchAll())[0]['product_main_pic'];
                for($i=0;$i<sizeof($csvData);$i++){
                    $result['data'][0]['highlight'][$i]=$csvData[$i];
                }
                unset($csvObject);
            }else{
                $result['complete_code'] = 1;
                $dataAfterFetch = $data->fetchAll();
                //writeLog($this->dumpf['name'], "name first:  ". $dataAfterFetch[0]['product_name']);
                //writeLog($this->dumpf['name'], "data from db ". ($data->fetchAll())[0]);
                $counter =0;
                for($i=$data->rowCount()-1; $i>$data->rowCount()-3;$i--){
                    //writeLog($this->dumpf['name'], "i :  ". $i);
                    //writeLog($this->dumpf['name'], "name :  ". $dataAfterFetch[$i]['product_name']);
                    $result['data'][$counter]['name'] = $dataAfterFetch[$i]['product_name'];
                    $result['data'][$counter]['main_picture']=$dataAfterFetch[$i]['product_main_pic'];
                    $result['data'][$counter]['product_link']=$dataAfterFetch[$i]['product_link'];
                    $csvObject = new ReadCsv();
                    $csvData = $csvObject->takeDataFromCsv($dataAfterFetch[$i]['product_highlight_path']);
                    for($y=0;$y<sizeof($csvData);$y++){
                        $result['data'][$counter]['highlight'][$y]=$csvData[$y];
                    }
                    unset($csvObject);
                    $counter++;
                }
                
            }
        }
        $data = $this->db->query("SELECT * FROM contact_phone");
        $dataCount= $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        for($i = 0; $i< $dataCount; $i++){
            $result['phone'][$i]['id'] = $dataAfterFetch[$i]['id'];
            $result['phone'][$i]['number'] = $dataAfterFetch[$i]['phone_number'];
        }

        $data = $this->db->query("SELECT * FROM contact_address");
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount() == 0){
            $result['address']['id'] ='';
            $result['address']['name'] = '';
        }else{
            $result['address']['id'] = $dataAfterFetch[0]['id'];
            $result['address']['name'] = $dataAfterFetch[0]['address'];
        }

        $data = $this->db->query("SELECT * FROM service");
        $dataSize = $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        for($i=0; $i<$dataSize; $i++){
            $result['service'][$i]['id']  = $dataAfterFetch[$i]['id'];
            $result['service'][$i]['info']  = $dataAfterFetch[$i]['info'];
        }

        $data = $this->db->query("SELECT * FROM main_slogan");
        $dataSize = $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        for($i=0; $i<$dataSize; $i++){
            $result['slogan']['id']  = $dataAfterFetch[$i]['id'];
            $result['slogan']['info']  = $dataAfterFetch[$i]['text'];
        }

        $data = $this->db->query("SELECT * FROM contact_map_link");
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount() == 0){
            $result['link']['id'] ='';
            $result['link']['name'] = '';
        }else{
            $result['link']['id'] = $dataAfterFetch[0]['id'];
            $result['link']['name'] = $dataAfterFetch[0]['link'];
        }
        $result['complete_code'] = 1;
        sendToClient($result);
    }

    public function loadFilter(){
        //table product_name_controller
        $data = $this->db->query("SELECT * FROM controllers");
        $result['complete'] = 1;
        if($data->rowCount()==0){
            //not found any controller
            $result['complete_code'] = 0;
            $result['data']['controller']='';
        }else{
            $result['complete_code'] = 1;
            $dataAfterFetch = $data->fetchAll();
            for($i=0;$i<$data->rowCount();$i++){
                $result['data']['controller'][$i]['name'] = $dataAfterFetch[$i]['name'];
                $result['data']['controller'][$i]['controller_value']=$dataAfterFetch[$i]['id'];
            }
        }
        writeLog($this->dumpf['name'], $this->dumpf['date']." data name :  ". $result['data']['controller'][0]['name'] );

        //table product_type
        $data = $this->db->query("SELECT * FROM types");
        if($data->rowCount()==0){
            //not found type
            $result['complete_code'] = 0;
            $result['data']['type']='';
        }else{
            $result['complete_code'] = 1;
            $dataAfterFetch = $data->fetchAll();
            for($i=0;$i<$data->rowCount();$i++){
                $result['data']['type'][$i]['name'] = $dataAfterFetch[$i]['type_name'];
                $result['data']['type'][$i]['type_value']=$dataAfterFetch[$i]['type_id'];
            }
        }

        //bear type 
        $data = $this->db->query('SELECT * FROM bear_type');
        $dataAfterFetch = $data->fetchAll();
        for($i=0; $i<$data->rowCount();$i++){
            $result['data']['bear'][$i]['id'] = $dataAfterFetch[$i]['bear_id'];
            $result['data']['bear'][$i]['name'] = $dataAfterFetch[$i]['bear_name'];
        }

        //interface settings 
        $data = $this->db->query('SELECT * FROM productpage_filter_interface');
        $dataAfterFetch = $data->fetchAll();
        //$result['data']['page_interface']['bear'] = $dataAfterFetch[0]['bear'];
        $result['data']['page_interface']['type'] = $dataAfterFetch[0]['type'];
        $result['data']['page_interface']['controller'] = $dataAfterFetch[0]['controller'];
        $result['data']['page_interface']['sale'] = $dataAfterFetch[0]['sale'];
        $result['data']['page_interface']['instock'] = $dataAfterFetch[0]['instock'];
        //var_dump($result);
        sendToClient($result);
    }

    private function takeDataWithCondition($table, $condition, $conditionValue, $dataWantToTake){
        $result = array();
        $data = $this->db->query("SELECT * FROM $table WHERE $condition='$conditionValue'");   
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount() != 0){
            for($i=0;$i<$data->rowCount();$i++){
                array_push($result,$dataAfterFetch[$i][$dataWantToTake]);
            }
        }
        return $result;
    }

    private function checkDataInsideArray($array){
        for($i =0;$i < sizeof($array);$i++){
            writeLog($this->dumpf['name'], "array :  ".$array[$i]);
        }
    }

    private function findIntersection($arr1, $arr2, $arr3, $arr4, $arr5){
        $result = array();
        for($i=0;$i<5;$i++){
            $mainarr=array();
            switch($i){
                case 0: $mainarr = $arr1; break;
                case 1: $mainarr = $arr2; break;
                case 2: $mainarr = $arr3; break;
                case 3: $mainarr = $arr4; break;
                case 4: $mainarr = $arr5; break;
            }
            for($y=0; $y<sizeof($mainarr);$y++){
                $counter=0;
                if($i!=0){
                    if(in_array($mainarr[$y],$arr1)){
                        $counter++;
                    }
                }

                if($i!=1){
                    if(in_array($mainarr[$y],$arr2)){
                        $counter++;
                    }
                }

                if($i!=2){
                    if(in_array($mainarr[$y],$arr3)){
                        $counter++;
                    }
                }
                
                if($i!=3){
                    if(in_array($mainarr[$y],$arr4)){
                        $counter++;
                    }
                }
                
                if($i!=4){
                    if(in_array($mainarr[$y],$arr5)){
                        $counter++;
                    }
                }
                
                if($counter==4 && !in_array($mainarr[$y],$result)){
                    array_push($result,$mainarr[$y]);
                }
            }
        }
        return $result;
    }

    private function findSum($_2darr){
        $result = $_2darr[0];
        $this->checkDataInsideArray($result);
        for($i=1;$i<sizeof($_2darr);$i++){
            for($y=0; $y<sizeof($_2darr[$i]);$y++){
                if(!in_array($_2darr[$i][$y],$result)){
                    array_push($result,$_2darr[$i][$y]);
                }
            }
        }
        return $result;
        
    }

    public function loadProduct($input){
        $type = $input['type_product'];
        $name = $input['name_controller'];
        $sale = $input['sale'];
        $inStock = $input['in_stock'];
        //$bearPc = $input['bear-pc'];
        //$bear =bearMc = $input['bear-mc'];
        $bearData = $input['bear'];
        
        $dataWithType=array();
        $dataWithName=array();
        $dataWithSale = array();
        $dataWithStock = array();
        $dataWithBearPc=array();
        $dataWithBearMc=array();
        $dataFromDbWithBear=array();
        $dataSumBear=array();
        writeLog($this->dumpf['name'], "number of bear :  ". sizeof($bearData));
        for($i=0; $i<sizeof($bearData); $i++){
            $dataFromDbWithBear[$i] = array();
        }
        //search with type product 
        if($type != '0'){
            $dataWithType=$this->takeDataWithCondition('product_type','product_type_value',$type, 'product_id');
        }else{
            $data = $this->db->query("SELECT * FROM product_type");   
            $dataAfterFetch = $data->fetchAll();
            for($i=0;$i<$data->rowCount();$i++){
                array_push($dataWithType,$dataAfterFetch[$i]['product_id']);
            }
        }

        //search with name controller
        if($name != '0'){
            $dataWithName=$this->takeDataWithCondition('product_name_controller','product_name_controller_value',$name, 'product_id');
        }else{
            $data = $this->db->query("SELECT * FROM product_name_controller");   
            $dataAfterFetch = $data->fetchAll();
            for($i=0;$i<$data->rowCount();$i++){
                array_push($dataWithName,$dataAfterFetch[$i]['product_id']);
            }
        }

        //search with sale
        if($sale=='1'){
            $dataWithSale = $this->takeDataWithCondition('products_main_data','product_sale',$sale, 'product_id');
        }else{
            $data = $this->db->query("SELECT * FROM products_main_data");   
            $dataAfterFetch = $data->fetchAll();
            for($i=0;$i<$data->rowCount();$i++){
                array_push($dataWithSale,$dataAfterFetch[$i]['product_id']);
            }
        }
        
        //search with stock
        if($inStock=='1'){
            $dataWithStock =$this->takeDataWithCondition('products_main_data','product_in_stock',$inStock, 'product_id');
        }else{
            $data = $this->db->query("SELECT * FROM products_main_data");   
            $dataAfterFetch = $data->fetchAll();
            for($i=0;$i<$data->rowCount();$i++){
                array_push($dataWithStock,$dataAfterFetch[$i]['product_id']);
            }
        }
        
        /*
        if($bearPc=='0' && $bearMc=='0'){
            
        }else{
            //search with bear-pc
            $data = $this->db->query("SELECT * FROM products_main_data WHERE bear_pc='$bearPc'");   
            $dataAfterFetch = $data->fetchAll();
            for($i=0;$i<$data->rowCount();$i++){
                array_push($dataWithBearPc,$dataAfterFetch[$i]['product_id']);
            }
            
            //search with bear-mc
            $data = $this->db->query("SELECT * FROM products_main_data WHERE bear_mc='$bearMc'");   
            $dataAfterFetch = $data->fetchAll();
            for($i=0;$i<$data->rowCount();$i++){
                array_push($dataWithBearMc,$dataAfterFetch[$i]['product_id']);
            }
            $dataSumBear=$this->findSum($dataWithBearPc, $dataWithBearMc);
            
        }*/

        for($i = 0 ;$i < sizeof($bearData); $i++){
            if($bearData[$i]['active'] == '1'){
                $condition =$bearData[$i]['id'] ;
                $data = $this->db->query("SELECT products_main_data.*, bear_type.* FROM products_main_data INNER JOIN bear_type ON bear_type.bear_id=products_main_data.bear_type WHERE products_main_data.bear_type='$condition'");
                $dataAfterFetch = $data->fetchAll();
                for($y=0;$y<$data->rowCount();$y++){
                    array_push($dataFromDbWithBear[$i],$dataAfterFetch[$y]['product_id']);
                }
            }
        }
        /*
        writeLog($this->dumpf['name'], "array from bear :  ");
        for($i=0; $i<sizeof($dataFromDbWithBear);$i++){
            for($y=0;$y<sizeof($dataFromDbWithBear[$i]);$y++){
                writeLog($this->dumpf['name'], "product id [".$i."][".$y."] : ".$dataFromDbWithBear[$i][$y]);
            }
        }*/
        $dataSumBear=$this->findSum($dataFromDbWithBear);
        //writeLog($this->dumpf['name'], "sum bear :  ".sizeof($dataSumBear));
        //$this->checkDataInsideArray($dataSumBear);
        /*
        $data = $this->db->query("SELECT * FROM products_main_data WHERE product_sale='$sale' AND product_in_stock='$inStock' AND bear_pc='$bearPc' AND bear_mc='$bearMC'");   
        $dataAfterFetch = $data->fetchAll();
        for($i=0;$i<$data->rowCount();$i++){
            array_push($dataWithSaleStockBear,$dataAfterFetch[$i]['product_id']);
        }
        
        writeLog($this->dumpf['name'], "array type :  ");
        $this->checkDataInsideArray($dataWithType);
        writeLog($this->dumpf['name'], "array name :  ");
        $this->checkDataInsideArray($dataWithName);
        writeLog($this->dumpf['name'], "array sale :  ");
        $this->checkDataInsideArray($dataWithSale);
        writeLog($this->dumpf['name'], "array stock :  ");
        $this->checkDataInsideArray($dataWithStock);*/
        $intersection = $this->findIntersection($dataWithType,$dataWithName, $dataWithSale, $dataWithStock, $dataSumBear);
        $result['complete'] = 1;
        $result['complete_code'] = 1;
        //writeLog($this->dumpf['name'], "array intersection :  ");
        //writeLog($this->dumpf['name'], "number product found :  ".sizeof($intersection));
        //$this->checkDataInsideArray($intersection);
        for($i =0 ; $i <sizeof($intersection);$i++){
            $condition = $intersection[$i];
            $data = $this->db->query("SELECT * FROM products_main_data WHERE product_id='$condition'");   
            $dataAfterFetch = $data->fetchAll();
            $result['data'][$i]['name'] = $dataAfterFetch[0]['product_name'];
            $result['data'][$i]['main_pic'] = $dataAfterFetch[0]['product_main_pic'];
            $result['data'][$i]['product_link'] = $dataAfterFetch[0]['product_link'];
        }
        sendToClient($result);

    }

    public function loadProductDetail($input){
        $productId = $input['product_id'];
        //writeLog($this->dumpf['name'], "product id :  ".$productId);
        
        $data = $this->db->query("SELECT products_main_data.*, bear_type.* FROM products_main_data INNER JOIN bear_type ON bear_type.bear_id=products_main_data.bear_type WHERE products_main_data.product_id='$productId'");
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount()==0){
            $result['complete']= 1;
            $result['complete_code']=0;
            sendToClient($result);
        }else{
            //writeLog($this->dumpf['name'], "Found product, taking data");
            //take name and main pic
            $result['data']['id'] = $dataAfterFetch[0]['product_id'];
            $result['data']['name'] = $dataAfterFetch[0]['product_name'];
            $result['data']['main_pic'] = $dataAfterFetch[0]['product_main_pic'];

            //take bear type
            /*
            if($dataAfterFetch[0]['bear_pc']==1){
                $result['data']['bear_type'] = 'BEAR-PC';
            }else if($dataAfterFetch[0]['bear_mc']==1){
                $result['data']['bear_type'] = 'BEAR-MC';
            }*/

            $result['data']['bear_type'] = $dataAfterFetch[0]['bear_name'];
            //writeLog($this->dumpf['name'], "name : ".$result['data']['name']);
            //writeLog($this->dumpf['name'], "main pic : ".$result['data']['main_pic']);
            //take highlight
            $csvObject = new ReadCsv();
            $csvData = $csvObject->takeDataFromCsv($dataAfterFetch [0]['product_highlight_path']);
            //writeLog($this->dumpf['name'], "csv data :  ");
            $this->checkDataInsideArray($csvData);
            //writeLog($this->dumpf['name'], "csv data size :  ".sizeof($csvData));
            for($i=0; $i<sizeof($csvData); $i++){
                $result['data']['highlight'][$i] = $csvData[$i];
            }

            //take description
            $jsonObject = new ReadJson();
            $jsonData = $jsonObject->takeDataFromJson($dataAfterFetch [0]['product_description_path']);
            $result['data']['description'] = $jsonData;

            //take img 
            $data = $this->db->query("SELECT * FROM product_pictures WHERE product_id='$productId'");
            $dataAfterFetch = $data->fetchAll();
            for($i =0 ; $i < sizeof($dataAfterFetch);$i++){
                $result['data']['pics'][$i] = $dataAfterFetch[$i]['picture_path'];
            }

            //take file for download
            $data = $this -> db -> query("SELECT * FROM product_file_for_downloading WHERE product_id='$productId'");
            $dataAfterFetch = $data->fetchAll();
            for($i=0; $i < sizeof($dataAfterFetch); $i++){
                $result['data']['files'][$i]['name'] = $dataAfterFetch[$i]['file_name'];
                $result['data']['files'][$i]['path'] = $dataAfterFetch[$i]['file_path'];
            }

            //take recommend products
            $conditionValue = $result['data']['bear_type'];

            $data = $this -> db -> query("SELECT products_main_data.*, bear_type.* FROM products_main_data INNER JOIN bear_type ON bear_type.bear_id=products_main_data.bear_type WHERE bear_type.bear_name='$conditionValue'");
            $dataAfterFetch = $data->fetchAll();
            for($i=0; $i < sizeof($dataAfterFetch); $i++){
                $result['data']['recommend'][$i]['id'] = $dataAfterFetch[$i]['product_id'];
                $result['data']['recommend'][$i]['name'] = $dataAfterFetch[$i]['product_name'];
                $result['data']['recommend'][$i]['link'] = $dataAfterFetch[$i]['product_link'];
                $result['data']['recommend'][$i]['main_pic'] = $dataAfterFetch[$i]['product_main_pic'];
                
            }

            sendToClient($result);   
            unset($csvObject);
            unset($jsonObject);
        }
             
    }

    function loadFooterHeader(){
        $data = $this->db->query("SELECT * FROM bear_type");
        $result['complete']= 1;
        if($data->rowCount()>0){
            $result['complete_code']=1;
            $dataAfterFetch = $data->fetchAll();
            for($i=0 ; $i<$data->rowCount() ; $i++){
                $result['data'][$i]['id'] = $dataAfterFetch[$i]['bear_id'];
                $result['data'][$i]['name'] = $dataAfterFetch[$i]['bear_name'];
            }
        }else{
            $result['complete_code']=0;
        }

        $data = $this->db->query("SELECT * FROM contact_phone");
        $dataCount= $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        for($i = 0; $i< $dataCount; $i++){
            $result['phone'][$i]['id'] = $dataAfterFetch[$i]['id'];
            $result['phone'][$i]['number'] = $dataAfterFetch[$i]['phone_number'];
        }

        $data = $this->db->query("SELECT * FROM contact_address");
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount() == 0){
            $result['address']['id'] ='';
            $result['address']['name'] = '';
        }else{
            $result['address']['id'] = $dataAfterFetch[0]['id'];
            $result['address']['name'] = $dataAfterFetch[0]['address'];
        }

        $data = $this->db->query("SELECT * FROM contact_timework");
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount() == 0){
            $result['timework']['id'] ='';
            $result['timework']['info'] = '';
        }else{
            $result['timework']['id'] = $dataAfterFetch[0]['id'];
            $result['timework']['info'] = $dataAfterFetch[0]['timework'];
        }


        sendToClient($result);

    }

    public function loadAboutPage(){
        $data = $this->db->query("SELECT * FROM company_history");
        $dataCount = $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        for( $i=0; $i<$dataCount ; $i++){
            $result['data'][$i]['text'] = $dataAfterFetch[$i]['story_text'];
            $result['data'][$i]['title'] = $dataAfterFetch[$i]['story_title'];
            $result['data'][$i]['italic'] = $dataAfterFetch[$i]['story_italic'];
            $result['data'][$i]['fontsize'] = $dataAfterFetch[$i]['story_font_size'];

            $result['complete']= 1;
            $result['complete_code']=1;
        }
        sendToClient($result);
    }

    public function servicePageLoad(){
        $data = $this->db->query("SELECT * FROM service");
        $dataCount = $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        $result['complete']= 1;
        for( $i=0; $i<$dataCount ; $i++){
            $result['data']['service'][$i]['id'] = $dataAfterFetch[$i]['id'];
            $result['data']['service'][$i]['text'] = $dataAfterFetch[$i]['info'];
        }

        $data = $this->db->query("SELECT * FROM service_intro");
        $dataCount = $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        for( $i=0; $i<$dataCount ; $i++){
            $result['data']['intro'][$i]['id'] = $dataAfterFetch[$i]['id'];
            $result['data']['intro'][$i]['text'] = $dataAfterFetch[$i]['info'];
        }
        $result['complete_code']=1;
        sendToClient($result);
    }

    public function contactPageLoad(){
        //load phone
        $result['complete'] = 1;
        $data = $this->db->query("SELECT * FROM contact_phone");
        $dataCount= $data->rowCount();
        $dataAfterFetch = $data->fetchAll();
        for($i = 0; $i< $dataCount; $i++){
            $result['data']['phone'][$i]['id'] = $dataAfterFetch[$i]['id'];
            $result['data']['phone'][$i]['number'] = $dataAfterFetch[$i]['phone_number'];
        }

        //load email
        $data = $this->db->query("SELECT * FROM contact_email");
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount() == 0){
            $result['data']['email']['id'] = '';
            $result['data']['email']['name'] = '';
        }else{
            $result['data']['email']['id'] = $dataAfterFetch[0]['id'];
            $result['data']['email']['name'] = $dataAfterFetch[0]['email'];
        }
        

        //load address
        $data = $this->db->query("SELECT * FROM contact_address");
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount() == 0){
            $result['data']['address']['id'] ='';
            $result['data']['address']['name'] = '';
        }else{
            $result['data']['address']['id'] = $dataAfterFetch[0]['id'];
            $result['data']['address']['name'] = $dataAfterFetch[0]['address'];
        }
        

        //load map link
        $data = $this->db->query("SELECT * FROM contact_map_link");
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount() == 0){
            $result['data']['link']['id'] ='';
            $result['data']['link']['name'] = '';
        }else{
            $result['data']['link']['id'] = $dataAfterFetch[0]['id'];
            $result['data']['link']['name'] = $dataAfterFetch[0]['link'];
        }

        //map pic
        $data = $this->db->query("SELECT * FROM contact_mapimg");
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount() == 0){
            $result['data']['map_pic']['path'] ='';
        }else{
            $result['data']['map_pic']['path'] = $dataAfterFetch[0]['path'];
        }

        //load time work
        $data = $this->db->query("SELECT * FROM contact_timework");
        $dataAfterFetch = $data->fetchAll();
        if($data->rowCount() == 0){
            $result['data']['timework']['id'] ='';
            $result['data']['timework']['info'] = '';
        }else{
            $result['data']['timework']['id'] = $dataAfterFetch[0]['id'];
            $result['data']['timework']['info'] = $dataAfterFetch[0]['timework'];
        }


        sendToClient($result);
    }

    function __destruct(){
        $this->db=null;
        unset($this->dbconfigObj);
    }
}

?>