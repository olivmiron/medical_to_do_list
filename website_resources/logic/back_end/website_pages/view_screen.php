<div id="app_view_screen">
    <?php 
        foreach($pages_array as $page_name) {
            $page_uri = $pages_uris[$page_name];
    ?>

        <div id="view_screen_page__<?php echo $page_name; ?>" class="app_view_screen_page <?php echo $pages_arrangement[$page_name][1]; ?>">
            <?php include $_SERVER["DOCUMENT_ROOT"] . "/" . $page_uri; ?>
        </div>

    <?php } ?>
</div>