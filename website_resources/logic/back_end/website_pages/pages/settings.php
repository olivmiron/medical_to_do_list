<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["settings"] = true; 
?>
<div id="view_screen_page__settings__content">

</div>
<?php }; ?>