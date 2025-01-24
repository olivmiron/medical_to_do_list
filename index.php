<?php if(isset($_SESSION)) {session_start();} ?>
<?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/initial_state_checker.php" ;?>
<!DOCTYPE html>
<html>
    <head>

        <!-- design -->
        <link rel="/website_resources/design/stylehseets/global.css"></link>
        <link rel="/website_resources/design/stylehseets/index.css"></link>

        <!-- favicon -->
        <link rel="icon" href="website_resources/design/media/favicon.ico">
        <!-- mobile friendly resize -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- logic -->
        <script src="/website_resources/logic/front_end/global.js"></script>
        <script src="/website_resources/logic/front_end/index.js"></script>
    </head>
    <body>
        <?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/initial_state_checker.php" ; ?>
        Mironescu Olivier
        <br/>
        <?php echo var_export($_SESSION["logged_in"]); ?>
        <?php if(!$_SESSION["logged_in"]) { ?>
            <script src="https://accounts.google.com/gsi/client" async defer></script>
            <div id="g_id_onload"
                data-client_id="64629051096-v5i6qsdt1mccdd8qimne5v1496o839tj.apps.googleusercontent.com"
                data-ux_mode="redirect"
                data-login_uri="<?php echo $_SERVER['DOCUMENT_ROOT'];?>">
            </div>
            <div class="g_id_signin" data-type="standard"></div>
        <?php } ?>
    </body>
</html>