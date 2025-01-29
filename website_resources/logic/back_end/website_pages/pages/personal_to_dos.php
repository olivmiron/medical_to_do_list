<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["personal_to_dos"] = true; 
?>
<div id="view_screen_page__personal_to_dos__content">

<?php $personal_or_group_id = 0;include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/website_pages/pages/dependencies/load_to_dos.php"; ?>
    
</div>
<?php }; ?>