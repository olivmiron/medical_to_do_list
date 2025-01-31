<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["settings"] = true; 
?>
<div class="page_title"><span>Your groups</span></div>
<div class="spacer_large"></div>
<div id="view_screen_page__settings__content">
    <div class="settings_group_row">
        <div class="checkbox_box"><img src="/website_resources/design/media/icons/global/check_mark.png"></div>
        <span>Some group</span>
    </div>
    <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/other/work_in_progress.html"; ?>

</div>
<?php } else {if($initial_load) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';}} ?>