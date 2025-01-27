<?php $initial_load = true; require $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/core/global_requirements.php"; ?>
<!DOCTYPE html>
<html>
    <head>

        <!-- design -->
        <link rel="stylesheet" href="/website_resources/design/stylesheets/global.css"></link>
        <link rel="stylesheet" href="/website_resources/design/stylesheets/index.css"></link>

        <!-- favicon -->
        <link rel="icon" href="website_resources/design/media/favicon.ico">
        <!-- mobile friendly resize -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <!-- logic -->
        <script src="/website_resources/logic/front_end/global.js"></script>
        <script src="/website_resources/logic/front_end/index.js"></script>
        <script>
            const pages_array = <?php echo json_encode($pages_array); ?>;
        </script>
    </head>
    <body>        
        <?php include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/core/sign_in_square.php"; ?>
        <?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/components/top_bar.php"; ?>


        <?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/website_pages/view_screen.php"; ?>
        Mironescu Olivier
        <br/>
        <?php echo var_export($_SESSION["logged_in"]); ?>

        
        <?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/components/bottom_bar.php"; ?>

        <?php include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/components/bottom_drag_sheet.php"; ?>
    </body>
</html>