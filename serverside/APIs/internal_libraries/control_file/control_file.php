<?php
header('Content-Type: application/json', true);
header("Access-Control-Allow-Origin: *");		// CORS
header("Access-Control-Allow-Headers: Access-Control-Allow-Origin, Accept");



//namespace FileControl;
class FileControl{
    public function deleteTemporaryFile($name, $rootPath){
        $path = $rootPath.$name;
        $data['complete'] = 1;
        unlink($path);
        
    }

    public function saveTemporaryFile($data, $rootPath, $size, $format, $formatAllow){//size : bytes unit
        if (isset($data)) { 
            $errors = '';
            //$path = 'file_uploaded_in_waiting/';
            //$extensions = ['pdf'];
    
            $all_files = count($data['tmp_name']);
    
            for ($i = 0; $i < $all_files; $i++) {
                //$file_name = $_FILES['files']['name'][$i];
                $file_tmp = $data['tmp_name'][$i];
                $file_type = $data['type'][$i];
                $file_size = $data['size'][$i];
                $fileNameIn=$data['name'][$i];
                $file_ext = strtolower(end(explode('.', $fileNameIn)));
    
                $now = DateTime::createFromFormat('U.u', number_format(microtime(true), 6, '.', ''), new \DateTimeZone('UTC'));
                $file_name = ((int)$now->format("Uu")).'.'.$format;
                $file = $rootPath . $file_name;
    
                if (!in_array($file_ext, $formatAllow)) {
                    $errors = 'Принимать фоты только в формате '.$format;
                }
    
                if ($file_size > $size) { //bytes
                    $sizeMb = $size / 1048576;
                    $errors= 'Загружайте только фото размером не более '.$sizeMb.'Мб';
                }
    
                $data['complete'] = 1;
                if (empty($errors)) {
                    move_uploaded_file($file_tmp, $file);
                    $data['complete_code'] = 1;
                    $data['data']['name'][$i] = $file_name;
                }else{
                    $data['complete_code'] = 0;
                    $data['data']['error'] = $errors;
                }
            }
            
        }else{
            $data['complete'] = 1;
            $data['complete_code'] = 0;
            $data['data']['error']='файл не найден';
        }
        
        return $data;
        //echo json_encode($data);
    }

    public function deleteAllFileInside($root){
        $files = glob($root.'*');
        foreach($files as $file) {
            if(is_file($file)) 
                // Delete the given file
                unlink($file); 
        }
    }

    public function deleteAllFileInsideExcept($root, $fileArrKeep){
        $files = glob($root.'*');
        foreach($files as $file) {
            if(is_file($file)) 
                // Delete the given file
                if(!in_array($file,$fileArrKeep)){
                    unlink($file); 

                }
        }
    }

    public function writeJsonDataToFile($data, $nameFile, $path){
        $jsonConvertedFormData = new stdClass();
        for($i = 0; $i< sizeof($data); $i++){
            $key = $data[$i]['key'];
            $jsonConvertedFormData ->$key = array();
            for($y=0; $y<sizeof($data[$i]['value']);$y++){
                array_push($jsonConvertedFormData ->$key, $data[$i]['value'][$y]);
            }
        }
        $json = json_encode($jsonConvertedFormData);
        $storePath = $path.$nameFile;
        //write json to file
        if (file_put_contents($storePath, $json))
            return 1;
        else 
            return 0;
        unset($jsonConvertedFormData);
    }

    public function takeDataFromJson($path){
        $strJsonFileContents = file_get_contents($path);
        // Convert to array 
        $array = json_decode($strJsonFileContents, true);
        return $array;
    }

    public function writeCsvDataToFile($data, $nameFile, $path){
        $storePath = $path.$nameFile;
        $fp = fopen($storePath, 'wb');
        fputcsv($fp, $data);
        /*
        foreach ( $data as $line ) {
            $val = explode(",", $line);
            fputcsv($fp, $val);
        }*/
        fclose($fp);
    }

    public function takeDataFromCsv($path){
        $row = 1;
        $areturn = array();
        if (($handle = fopen($path, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $num = count($data);
                $row++;
                for ($c=0; $c < $num; $c++) {
                    //echo $data[$c] . "<br />\n";
                    array_push($areturn, $data[$c]);
                }
            }
            fclose($handle);
        }
        return $areturn;
    }

    public function moveFile($name, $rootPath, $destinationPath){
        $destination=$destinationPath.$name;
        $root = $rootPath.$name;
        rename($root, $destination);
    }

    public function copyFiles($sourcefile, $destination){
        copy($sourcefile, $destination);
        
    }

    public function removeWholeFolder($path){
        $this->deleteAllFileInside($path);
        rmdir($path);
    }

    public function createDetailHtmlFile($productId){
        $script1 = '<!DOCTYPE html>
        <html>
        
        <head>
            <link rel="stylesheet" type="text/css" href="../../css/product_style/product_detail_style.css" media="screen" />
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <script src="../../js/libs.js"></script>
            <script >
                
                $(function(){
                    $("#productdetail-header-navbar-load").load("../footer-header/header.html");
                });
                $(function(){
                    $("#productdetail-footer-load").load("../footer-header/footer.html");
                });
            </script>
            <style>
                #loader {
                    border: 12px solid #f3f3f3;
                    border-radius: 50%;
                    border-top: 12px solid #444444;
                    width: 70px;
                    height: 70px;
                    animation: spin 1s linear infinite;
                }
                  
                @keyframes spin {
                    100% {
                        transform: rotate(360deg);
                    }
                }
                  
                .center {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    margin: auto;
                }
            </style>
        </head>
        <body>
                <div id="loader" class="center"></div>
                    <section class = "productdetail-sec">
                    <div class = "productdetail-header-sec">
                        <!--Navbar section-->
                        <div class = "productdetail-navbar-sec" style="width:100%; padding: 0; position: relative;">
                            <div id = "productdetail-header-navbar-load">
                            </div>
                        </div>
                    </div>
                    <!--Middle section-->
                    <div class = "productdetail-main-sec">
                        <div class = "productdetail-recommend-sec" id="productdetail-recommend-sec-add">
                        </div>
                        <div class="productdetail-main-showing-sec" >
                            <div class = "productdetail-main-half" >
                                <div class = "productdetail-main-pic-sec" id = "productdetail-main-pic-sec-id">
                                </div>
                                <div class = "product-pics-sec" id="product-pics-container-add">
                                </div>
                                <br><br><br>
                
                                <div class = "productdetail-description-button" id ="productdetail-des-btn-pc-v">
                                    <p class = "productdetail-button-text" id="description-btn">Скачать</p>
                                </div>
                
                                <div class = "productdetail-docs-sec" id ="productdetail-docs-sec-pc-v">
                                    <!--
                                    <div class = "productdetail-single-doc-sec" >
                                        <i class="fa fa-file" aria-hidden="true"></i> <a target="_blank" href="http://localhost/product_data/data_file/file_download/MC-92QI-16.pdf"> Характеристика. MC 92QI-16</a>
                                    </div>
                                    -->
                                </div>
                                
                            </div>
                
                            <div class = "productdetail-main-half" >
                                <div class = "productdetail-name-sec">
                                    <h1 class="productdetail-main-name" id="productdetail-name-add"></h1>
                                    <div class = "productdetail-main-bear-type">
                                        <h1 class = "productdetail-bear-type-text" id="bear-type"> 
                                            BEAR-PC
                                        </h1>

                                    </div>
                                </div>
                                <div class="productdetail-control-btn-sec">
                                    <div class = "productdetail-description-button">
                                        <p class = "productdetail-button-text" id="description-btn">Описание</p>
                                    </div>
                                </div>
                
                                <div class = "product-highlight-sec">
                                    <div class = "productdetail-highlight-text-sec" id = "product-highlight-text-sec-add">
                                        <!--
                                        <p class = "productdetail-highlight-text">Cortex M-3, 80 МГц</p>
                                        <p class = "productdetail-highlight-text">Flash 128 Кбайт + 16 Мбайт, ОЗУ 32 Кбайт</p>
                                        <p class = "productdetail-highlight-text">ADC, USB, DAC</p>
                                        -->
                                    </div>
                                </div>
                
                                <div class = "productdetail-details-sec" id="des-table">
                                    <table class = "productdetail-des-sec" id="table-des-add"  style = "border-collapse: collapse;"> 
                                        <!--
                                        <tr>
                                            <td class = "productdetail-cell" rowspan = "2">Тип:</td>
                                            <td class = "productdetail-cell">Модульная система SoM</td>  
                                        </tr>
                                        <tr>
                                            <td class = "productdetail-cell">Модульная система SoM</td>  
                                        </tr>
                                        <tr>
                                            <td class = "productdetail-cell">Тип:</td>
                                            <td class = "productdetail-cell">Тип:</td>
                                        </tr>
                                    -->
                                    </table>
                                </div>
                
                                <div class = "productdetail-description-button" id ="productdetail-des-btn-m-v">
                                    <p class = "productdetail-button-text" id="description-btn">Скачать</p>
                                </div>
                
                                <div class = "productdetail-docs-sec" id ="productdetail-docs-sec-m-v">
                                    <!--
                                    <div class = "productdetail-single-doc-sec" >
                                        <i class="fa fa-file" aria-hidden="true"></i> <a target="_blank" href="http://localhost/product_data/data_file/file_download/MC-92QI-16.pdf"> Характеристика. MC 92QI-16</a>
                                    </div>
                                    -->
                                </div>
                                
                            </div>
                        </div>
                        
                    </div>

                    
                    <div class = "productdetail-footer-sec">
                        <div class = "productdetail-footer-navbar-sec" style="width:100%; padding: 0; position:relative;">
                            <div id = "productdetail-footer-load">
                            </div>
                        </div>
                    </div>
                </section>
                
            </body>
            <script src="../../js/product_page/product_detail.js">
                
            </script>
            <script>
                $(document).ready(function(){
                    // your code
                    startLoadingScreen();';

        $includeId = 'loadPage('.$productId.');';
        $script2 = '});
        </script>
        </html>';

        $name = $productId.'detail';
        $storePath = '../../html/'.$name;
        if (!file_exists($storePath )) {
            mkdir($storePath , 0777, true);
        }
        $storePath = $storePath .'/index.html';
        $script = $script1.$includeId.$script2;
        if (file_put_contents($storePath, $script))
            return 1;
        else 
            return 0;
    }
}
?>