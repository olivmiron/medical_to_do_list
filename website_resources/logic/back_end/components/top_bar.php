<div id="top_bar" class="top_bottom_bar">
    <div id="top_bar_title">
        <span>Medical to do list</span>
    </div>
    <div id="top_bar_left"></div>
    <div id="top_bar_middle"></div>
    <div id="top_bar_right">
        <?php if($_SESSION["logged_in"]) { ?>
        <img id="top_bar_user_picture" src="content_resources/user_pictures/<?php echo $_SESSION["user_id"]; ?>.png"/>
        <?php } ?>
    </div>
</div>