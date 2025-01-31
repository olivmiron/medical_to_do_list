<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["settings"] = true; 
?>
<div class="page_title"><span>Your groups</span></div>
<div class="spacer_large"></div>
<div id="view_screen_page__settings__content">

    <?php $personal_to_dos = true;include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/load_groups.php"; ?>

</div>
<?php } else {if($initial_load) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';}} ?>