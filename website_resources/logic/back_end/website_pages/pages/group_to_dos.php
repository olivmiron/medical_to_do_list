<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["group_to_dos"] = true; 
?>
<div class="page_title">
    <span><?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/website_pages/pages/dependencies/groups/get_group_name.php"; ?></span><span>'s To dos</span>
</div>
<div class="spacer_large"></div>
<div id="view_screen_page__group_to_dos__content">
    
    <?php $_GET["personal_to_dos"] = false;$_GET["to_dos_offset"] = 0;include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/load_to_dos.php"; ?>

</div>
<div id="view_screen_page__group_to_dos__load_more_button" class="load_more_button_container" <?php if(!isset($loaded_to_dos) or $loaded_to_dos < 10) {echo "style='display:none;'";} ?>>
    <div class="middle_load_more_button" onclick="load_more_to_dos('group', this)"><span>Load more</span></div>
</div>
<?php } else {if($initial_load) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';}} ?>