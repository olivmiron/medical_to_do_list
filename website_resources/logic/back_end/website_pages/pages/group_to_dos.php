<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["group_to_dos"] = true; 
?>
<div class="page_title">
    <span>
        <?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/website_pages/pages/dependencies/groups/get_group_name.php"; ?>
    </span>
    <span>'s To dos</span>
</div>
<div class="spacer_large"></div>
<div id="view_screen_page__group_to_dos__content">
    
    <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/other/work_in_progress.html"; ?>
    <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/load_to_dos.php?personal_to_dos=false&to_dos_offset=0"; ?>

</div>
<?php } else {if($initial_load) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';}} ?>