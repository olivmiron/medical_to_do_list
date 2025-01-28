<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["personal_to_dos"] = true; 
?>
<div id="view_screen_page__personal_to_dos__content">

<?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/website_pages/pages/dependencies/to_do.html"; ?>
<?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/website_pages/pages/dependencies/to_do.html"; ?>
<?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/website_pages/pages/dependencies/to_do.html"; ?>
    
</div>
<?php }; ?>