<div id="top_bar" class="top_bottom_bar">
    <div id="top_bar_title">
        <span><?php echo $top_bar_title; ?></span>
    </div>
    <div id="top_bar_left">
            <img 
                id="top_bar_action_button" 
                src="<?php if(isset($pages_top_bar_action_buttons[$initial_page][0])) {echo $pages_top_bar_action_buttons[$initial_page][1];}; ?>" 
                onclick="<?php if(isset($pages_top_bar_action_buttons[$initial_page][0])) {echo $pages_top_bar_action_buttons[$initial_page][0];}; ?>" 
                <?php if(!$_SESSION["logged_in"]) {echo "style='display: none;'";} ?>
            />
    </div>
    <div id="top_bar_middle"></div>
    <div id="top_bar_right">
            <img 
                id="top_bar_user_picture" 
                src="<?php if($_SESSION["logged_in"]) {echo "/content_resources/user_pictures/" . $_SESSION["user_id"] . ".png";} ?>" 
                <?php if(!$_SESSION["logged_in"]) {echo "style='display: none;'";} ?>
                onclick="toggle_top_bar_floater('top_bar_user_options_floater');" 
            />
            <div id="top_bar_user_options_floater" class="top_bar_floater floater_right floater_hidden">
                <div class="floater_option" onclick="log_out();">
                    <img src="website_resources/design/media/icons/top_bar/log_out.png" /><span>Log out</span>
                </div>    
            </div>
    </div>
</div>