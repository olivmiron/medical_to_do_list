<!-- core -->
<script src="/website_resources/logic/front_end/core/core.js?v=<?php echo $current_time; ?>" async defer></script>
<script src="/website_resources/logic/front_end/core/user_logging.js?v=<?php echo $current_time; ?>" async defer></script>

<!-- website_parts -->
<script src="/website_resources/logic/front_end/website_parts/top_bottom_bars.js?v=<?php echo $current_time; ?>" async defer></script>
<script src="/website_resources/logic/front_end/website_parts/app_view_screen.js?v=<?php echo $current_time; ?>" async defer></script>
<script src="/website_resources/logic/front_end/website_parts/pages.js?v=<?php echo $current_time; ?>" async defer></script>

<!-- components -->
<script src="/website_resources/logic/front_end/components/bottom_drag_sheet.js?v=<?php echo $current_time; ?>" async defer></script>

<!-- other -->
<script>
    const pages_array = <?php echo json_encode($pages_array); ?>;
    const pages_names_array = <?php echo json_encode($pages_names_array); ?>;
    // const pages_top_bar_action_buttons = <?php echo json_encode($pages_top_bar_action_buttons); ?>;

    const pages_drag_sheet_templates = <?php echo json_encode($pages_drag_sheet_templates); ?>;

    const loaded_pages = <?php echo json_encode($_SESSION["loaded_pages"]); ?>; // const cannot be changed, but its object properties can, so here, you can modify it later
    let current_page = "<?php echo $initial_page; ?>";

    let quick_join_group_message = "<?php echo $quick_join_group_message; ?>";
</script>