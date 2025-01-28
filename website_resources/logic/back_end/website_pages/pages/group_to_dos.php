<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["group_to_dos"] = true; 
?>
<div id="view_screen_page__group_to_dos__content">

</div>
<?php }; ?>