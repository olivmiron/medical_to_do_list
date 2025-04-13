<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["patients"] = true; 
?>
<div class="page_title">
    <span><?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/website_pages/pages/dependencies/groups/get_group_name.php"; ?></span>
    <span style="display: none;">'s Patients</span>

<div class="flex_spacer"></div>

<div class="page_title_button" onclick="load_or_open_bottom_sheet('patients', 'create_or_edit_patient')">
    <img src="/website_resources/design/media/icons/top_bar/add_patient.png"/>
    <span>Add patient</span>
</div>
</div>
<div class="spacer_large"></div>
<div id="view_screen_page__patients__content">

    <?php $_GET["patients_offset"] = 0;include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/website_pages/pages/dependencies/patients/load_patients.php"; ?>

</div>
<div id="view_screen_page__patients__load_more_button" class="load_more_button_container" <?php if(!isset($loaded_patients) or $loaded_patients < 10) {echo "style='display:none;'";} ?>>
    <div class="middle_load_more_button" onclick="load_more_patients(this)"><span>Load more</span></div>
</div>
<?php } else {if($initial_load) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';}} ?>