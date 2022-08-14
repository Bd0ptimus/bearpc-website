<?php
class ReadCsv{
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
}

?>
