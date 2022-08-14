<?php
include '../send_email.php';
include '../libraries.php';


$question=trim($_POST['data']['question']);
$userMail=trim($_POST['data']['user_email']);
if($question=="" || $userMail==""){
    $result['complete']= 1;
    $result['complete_code']=0;
    sendToClient($result);
}else{
    $sanitized_email = filter_var($userMail, FILTER_SANITIZE_EMAIL);
    if (filter_var($sanitized_email, FILTER_VALIDATE_EMAIL)){
        $emailObj = new MailerControl();
        $returnCode=$emailObj->sendEmailForConfirmationCode($question, $userMail);

        $result['complete']= 1;
        $result['complete_code']=$returnCode;
        sendToClient($result);
        unset($emailObj);
    }else{
        $result['complete']= 1;
        $result['complete_code']=0;
        sendToClient($result);
    }

    
}

?>