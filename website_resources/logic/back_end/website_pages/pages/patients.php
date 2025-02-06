<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["patients"] = true; 
?>
<div class="page_title">
    <span><?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/website_pages/pages/dependencies/groups/get_group_name.php"; ?></span><span>'s Patients</span>
</div>
<div class="spacer_large"></div>
<div id="view_screen_page__patients__content">

    <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/other/work_in_progress.html"; ?>

    <br/>

    <?php 
    $patient_template = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/pages/dependencies/patients/patient.html');
    $patient_template_populated = str_replace(
        [
            '{{patient_id}}',
            '{{admission_date}}',
            '{{caregiver_name}}',
            '{{delete_option_available_or_not}}',
            '{{patient_identification}}',
            '{{patient_age}}',
            '{{patient_location}}',
            '{{patient_description}}'
        ], 
        [
            rand(1, 1000),
            date('Y-m-d'),
            'Mironescu Olivier', 
            '', 
            'Mary J.', 
            rand(1, 100), 
            'P4S2',
            'A brief description of the patient.'
        ], 
        $patient_template
    );
    echo $patient_template_populated;
    ?>

</div>
<?php } else {if($initial_load) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/not_logged_in.html';}} ?>