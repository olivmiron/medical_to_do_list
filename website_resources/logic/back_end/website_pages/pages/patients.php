<?php if(!isset($_SESSION))  {session_start();};

if($_SESSION["logged_in"]) {
    $_SESSION["loaded_pages"]["patients"] = true; 
?>
<div id="view_screen_page__patients__content">

</div>
<?php }; ?>