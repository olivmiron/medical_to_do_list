<?php $initial_load = true; require $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/core/global_requirements.php"; ?>
<!DOCTYPE html>
<html>
    <head>

        <!-- design -->
        <link rel="stylesheet" href="/website_resources/design/stylesheets/global.css?v=<?php echo $current_time; ?>"></link>

        <!-- favicon -->
        <link rel="icon" href="website_resources/design/media/favicon.ico">
        <!-- mobile friendly resize -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="creator" content="Mironescu Olivier"/>

        <!-- logic -->
         <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/front_end/js_imports.php"; ?>
    </head>
    <body>        
        <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/core/sign_in_square.php"; ?>
        <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/core/pop_up_message.php"; ?>
        <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/components/join_group_qr_code.php"; ?>
        <?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/components/top_bar.php"; ?>


        <?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/website_pages/view_screen.php"; ?>

        
        <?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/components/bottom_bar.php"; ?>

        <?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/components/bottom_drag_sheet.php"; ?>
    </body>
</html>
<?php session_write_close(); ?>