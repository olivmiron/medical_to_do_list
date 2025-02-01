<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["personal_to_dos"] = true; 
?>
<div class="page_title"><span>Your To Dos</span></div>
<div class="spacer_large"></div>
<div id="view_screen_page__personal_to_dos__content">

    <?php $_GET["personal_to_dos"] = true;$_GET["to_dos_offset"] = 0;include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/load_to_dos.php"; ?>
    
</div>
<?php } else {if($initial_load) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';}} ?>