<?php // include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

if(!isset($conn)) {
    if(in_array($_SERVER['REMOTE_ADDR'], array("localhost", "::1", "127.0.0.1", "192.168.1.30"))) {$conn = new mysqli("localhost", "root", "", "medical_to_do_list");}
    else {$conn = new mysqli("localhost:3306", "medical_to_do_user", "l3rH58!z3", "medical_to_do_list");}
    // Check connection
    $db_connect_ok = ($conn->connect_error ? false : true);
}
?>