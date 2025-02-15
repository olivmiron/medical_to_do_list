<?php
if(!isset($initial_load)) {$initial_load = false;}
if(!$initial_load) {require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";}
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

require  $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/other/libraries/qr_code_generator/phpqrcode.php";


    // Generate a random quick join code
    $quick_join_code = strtoupper(bin2hex(random_bytes(8))); // 6-character code

    QRcode::png( "https://todo.medkronos.com/index.php?group_" .  $quick_join_code, $_SERVER['DOCUMENT_ROOT'] . '/content_resources/quick_join_qr_codes/' . 5 . ".png");

    // Store the quick join code in the session
    $_SESSION["quick_join_code"] = $quick_join_code;
    $_SESSION["qr_code_url"] = $qr_code_url;
    
    echo json_encode([
        "quick_join_code" => $quick_join_code,
        "qr_code_url" => $qr_code_url
    ]);
    
?>
