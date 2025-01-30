<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["patients"] = true; 
?>
<div id="view_screen_page__patients__content">
    Patients
</div>
<?php } else {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';} ?>