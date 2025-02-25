<?php $initial_load = true; require $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/core/global_requirements.php"; ?>
<!DOCTYPE html>
<html>
    <head>

        <!-- design -->
        <?php $version = time(); ?>
        <link rel="stylesheet" href="/website_resources/design/stylesheets/global.css?v=<?php echo $version; ?>"></link>
        <link rel="stylesheet" href="/website_resources/design/stylesheets/index.css?v=<?php echo $version; ?>"></link>

        <!-- favicon -->
        <link rel="icon" href="website_resources/design/media/favicon.ico">
        <!-- mobile friendly resize -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="creator" content="Mironescu Olivier"/>

        <!-- logic -->
        <script src="/website_resources/logic/front_end/global.js?v=<?php echo $version; ?>" async defer></script>
        <script src="/website_resources/logic/front_end/index.js?v=<?php echo $version; ?>" async defer></script>
        <script>
            const pages_array = <?php echo json_encode($pages_array); ?>;
            const pages_names_array = <?php echo json_encode($pages_names_array); ?>;
            const pages_top_bar_action_buttons = <?php echo json_encode($pages_top_bar_action_buttons); ?>;

            const pages_drag_sheet_templates = <?php echo json_encode($pages_drag_sheet_templates); ?>;

            const loaded_pages = <?php echo json_encode($_SESSION["loaded_pages"]); ?>; // const cannot be changed, but its object properties can, so here, you can modify it later
            let current_page = "<?php echo $initial_page; ?>";

            let quick_join_group_message = "<?php echo $quick_join_group_message; ?>";
        </script>
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