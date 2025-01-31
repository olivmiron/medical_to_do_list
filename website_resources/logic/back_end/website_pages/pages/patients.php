<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["patients"] = true; 

    // include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/website_pages/pages/dependencies/groups/get_group_name.php";
    // $group_data = json_decode($group_name, true);
?>
<div class="page_title"><span>
    <?php // echo htmlspecialchars($group_data['group_name'] ?? 'Group'); ?>
    <span>'s Patients</span>
</div>
<div class="spacer_large"></div>
<div id="view_screen_page__patients__content">

    <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/other/work_in_progress.html"; ?>

</div>
<?php } else {if($initial_load) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';}} ?>