<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["settings"] = true; 
?>
<div class="page_title"><span>Your groups</span></div>
<div class="spacer_large"></div>
<div id="view_screen_page__settings__content">

    <?php $_GET["groups_offset"] = 0;include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/website_pages/pages/dependencies/groups/load_groups.php"; ?>

</div>
<div id="view_screen_page__settings__load_more_button" class="load_more_button_container" <?php if($loaded_group_rows < 10) {echo "style='display:none;'";} ?>>
    <div class="middle_load_more_button" onclick="load_more_groups(this)"><span>Load more</span></div>
</div>
<?php } else {if($initial_load) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';}} ?>

<div class="settings_misc_info">
    <span>App version:</span>
    <span><b><?php echo $app_version; ?></b></span>
    
    <div class="spacer_medium"></div>

    <span>2025 © Mironescu Olivier</span>
    
    <div class="spacer_medium"></div>
    
    <span>support@medkronos.com</span>
</div>