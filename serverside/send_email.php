<?php

//Include packages for PHPMailer and SMTP 
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\OAuth;
use PHPMailer\PHPMailer\OAuthTokenProvider;
use PHPMailerConfig\PhpMailerConfig;

//Alias the League Google OAuth2 provider class
use League\OAuth2\Client\Provider\Google;

require 'vendor/autoload.php';
require 'phpmailer_config.php';
//require "db_config.php";


include_once $_SERVER['DOCUMENT_ROOT'].'/serverside/APIs/PHPMailer-master/PHPMailer-master/src/Exception.php';
include_once $_SERVER['DOCUMENT_ROOT'].'/serverside/APIs/PHPMailer-master/PHPMailer-master/src/PHPMailer.php';
include_once $_SERVER['DOCUMENT_ROOT'].'/serverside/APIs/PHPMailer-master/PHPMailer-master/src/SMTP.php';


class MailerControl{
    private $mail;
    private $content;
    function __construct(){
        //db
        $this->dbconfigObj = new dbconfig();
        $HostName = $this->dbconfigObj->HostName;
        $DatabaseName = $this->dbconfigObj->DatabaseName;
        $HostUser = $this->dbconfigObj->HostUser;
        $HostPass = $this->dbconfigObj->HostPass;
        $this->db = new PDO("mysql:host=$HostName; dbname=$DatabaseName; charset=utf8", $HostUser, $HostPass,  array(
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        //Initial PHPMailer and set up SMTP
        $this->mail = new PHPMailer(true);
        $this->mail->IsSMTP();
        $this->mail->Mailer = "smtp";
        //Set up for SMTP connection
        //$this->mail->SMTPDebug  = 1;  
        $this->mail->SMTPDebug = SMTP::DEBUG_OFF;
        $this->mail->SMTPAuth   = TRUE;
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mail->Port       = 587;
        $this->mail->AuthType = "XOAUTH2";
        $this->mail->Host       = "smtp.gmail.com";

        $provider = new Google(
            [
                'clientId' => PhpMailerConfig::CLIENT_ID,
                'clientSecret' =>  PhpMailerConfig::CLIENT_SECRETE,
            ]
        );
        $this->mail->setOAuth(
            new OAuth(
                [
                    'provider' => $provider,
                    'clientId' => PhpMailerConfig::CLIENT_ID,
                    'clientSecret' => PhpMailerConfig::CLIENT_SECRETE,
                    'refreshToken' => PhpMailerConfig::REFRESH_TOKEN,
                    'userName' =>  PhpMailerConfig::EMAIL_FROM, 
                ],
                
            ),
        );
        
    }

    function sendEmailForConfirmationCode($question, $email){
        //take email from db
        $data = $this->db->query("SELECT * FROM contact_email");
        $dataAfterFetch = $data->fetchAll();
        $emailTo = $dataAfterFetch[0]['email'];
        //Set Parameters for email
        $this->mail->IsHTML(true);
        //$this->mail->AddAddress(PhpMailerConfig::EMAIL_TO, PhpMailerConfig::NAME_RECIPIENT);
        $this->mail->AddAddress($emailTo, PhpMailerConfig::NAME_RECIPIENT);
        $this->mail->SetFrom(PhpMailerConfig::EMAIL_FROM, "Bear-pc site");
        $this->mail->AddReplyTo(PhpMailerConfig::EMAIL_FROM, "Bear-pc site");
        //$mail->AddCC("cc-recipient-email@domain", "cc-recipient-name");
        $this->mail->Subject = "Запрос с сайту bear-pc ! ";
        $makingContent = "<b?>Запрос от : ".strval($email)."!</b><br><br>Деталь :<br>".strval($question).".";
        $this->content = $makingContent;
        $this->mail->CharSet = PHPMailer::CHARSET_UTF8;
        $output=$this->sendEmail();
        return $output;
    }

    private function sendEmail(){
        //Send email
        $this->mail->MsgHTML($this->content); 
        if(!$this->mail->Send()) {
            //echo "Error while sending Email.";
            //var_dump($this->mail);
            return 0;
        } else {
            //echo "Email sent successfully";
            return 1;
        }
        
    }

    function __destruct()
    {
        $this->db=null;
        unset($mail);
    }
}


?>