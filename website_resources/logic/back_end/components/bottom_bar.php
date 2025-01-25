<div id="bottom_bar" class="top_bottom_bar">
    <?php 
        foreach($pages_array as $page_name) {
            $selected_class = ($page_name == $initial_page) ? "bottom_bar_button_active" : "";
            $icon_src = "/website_resources/design/media/icons/bottom_bar/" . $page_name . ".png";
    ?>
        <div id="bottom_bar_button__<?php echo $page_name; ?>" class="bottom_bar_button <?php echo $selected_class; ?>"  onclick="change_page('<?php echo $page_name; ?>')"><img src="<?php echo $icon_src; ?>"/></div>
    <?php } ?>
</div>