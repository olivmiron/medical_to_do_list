<div id="add_to_do__bottom_sheet_action_template" class="bottom_sheet_component">
    <div class="bottom_sheet_title"><span>Add to do</span></div>
    <div class="spacer_large"></div>

    
    <div class="bottom_sheet_sub_title"><span>Title</span></div>
    <input id="add_to_do_title_input" type="text" oninput="remove_empty_input_class(this)"></input>
    
    <div class="spacer_xxl"></div>
    
    <div class="bottom_sheet_sub_title"><span>Description / details</span></div>
    <textarea id="add_to_do_description_input"></textarea>
    
    <div class="spacer_xxl"></div>

    <div class="big_bottom_sheet_action_button" onclick="add_to_do_to_db()"><span>Save to do</span></div>
</div>