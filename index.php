<?php if(isset($_SESSION)) {session_start();} ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/initial_state_checker.php" ;?>
<!DOCTYPE html>
<html>
    <head>

        <!-- design -->
        <link rel="/website_resources/design/stylehseets/global.css"></link>
        <link rel="/website_resources/design/stylehseets/index.css"></link>

        // link to the favicon
        <link rel="icon" href="/website_resources/design/media/favicon.ico" type="image/x-icon">

        <!-- logic -->
        <script src="/website_resources/logic/front_end/global.js"></script>
        <script src="/website_resources/logic/front_end/index.js"></script>
    </head>
    <body>
    </body>
</html>