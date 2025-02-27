<div id="add_group__bottom_sheet_action_template" class="bottom_sheet_component">
    <div class="bottom_sheet_title"><span>Join group</span></div>
    <div class="spacer_large"></div>
    
    <div class="bottom_sheet_sub_title"><span>Name</span><span class="required_field_star">*</span></div>
    <input id="add_group_name_input" type="text" oninput="remove_empty_input_class(this)"></input>

    <div class="spacer_xxl"></div>
    
    <div class="bottom_sheet_sub_title"><span>Password</span><span class="required_field_star">*</span></div>
    <div class="flex_div flex_div_center_center flex_gap_medium">
        <input id="add_group_password_input" type="password" oninput="remove_empty_input_class(this)"></input>
        <div class="image_button" onclick="toggle_password_visibility('add_group_password_input', this)"><img src="/website_resources/design/media/icons/bottom_sheets/open_eye.png"/></div>
    </div>
    
    <div class="spacer_xxl"></div>

    <div class="big_bottom_sheet_action_button" onclick="join_group()"><span>Add group</span></div>

    <div class="spacer_xxl"></div>

    <div class="bottom_sheet_title"><span>or</span></div>

    <div class="spacer_xxl"></div><!-- -->

    <div class="bottom_sheet_title"><span>Create group</span></div>
    <div class="spacer_large"></div>
    
    <div class="bottom_sheet_sub_title"><span>Name</span><span class="required_field_star">*</span></div>
    <input id="create_group_name_input" type="text" oninput="remove_empty_input_class(this)"></input>

    <div class="spacer_xxl"></div>
    
    <div class="bottom_sheet_sub_title"><span>Password</span><span class="required_field_star">* &#40;min. 6 characters&#41;</span></div>
    <div class="flex_div flex_div_center_center flex_gap_medium">
        <input id="create_group_password_input" type="password" oninput="remove_empty_input_class(this)"></input>
        <div id="create_group_toggle_password_visibility_button" class="image_button" onclick="toggle_password_visibility('create_group_password_input', this)"><img src="/website_resources/design/media/icons/bottom_sheets/open_eye.png"/></div>
        <div class="image_button" onclick="generate_password_for_group()"><img src="/website_resources/design/media/icons/bottom_sheets/generate_password.png"/></div>
    </div>
    
    <div class="spacer_xxl"></div>

    <div class="big_bottom_sheet_action_button" onclick="create_group_in_db()"><span>Create group</span></div>
    
    
</div>