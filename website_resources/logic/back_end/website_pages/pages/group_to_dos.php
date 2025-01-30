<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["group_to_dos"] = true; 
?>
<div id="view_screen_page__group_to_dos__content">
    Group to dos
</div>
<?php } else {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/pages/not_logged_in.php';} ?>