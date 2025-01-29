<?php
if(!isset($_SESSION))  {session_start();};

// destroy the session and delete the cookie and redirect to the home page
session_destroy();
setcookie("log_in_cookie", "", time() - 3600, "/");
header("Location: /");
exit();

?>