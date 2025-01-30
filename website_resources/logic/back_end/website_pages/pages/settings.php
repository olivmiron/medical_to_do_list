<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["settings"] = true; 
?>
<div id="view_screen_page__settings__content">

    <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/other/work_in_progress.html"; ?>
    
</div>
<?php } else {if($initial_load) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';}} ?>