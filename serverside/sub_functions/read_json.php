<?php
class ReadJson{
    public function takeDataFromJson($path){
        $strJsonFileContents = file_get_contents($path);
        // Convert to array 
        $array = json_decode($strJsonFileContents, true);
        return $array;
    }
}

?>
