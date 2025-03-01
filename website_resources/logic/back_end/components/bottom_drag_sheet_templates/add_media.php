<div id="add_media__bottom_sheet_action_template" class="bottom_sheet_component">
    <div class="bottom_sheet_title"><span>Add content</span></div>
    <div class="spacer_large"></div>

    
    <div class="bottom_sheet_sub_title"><span>Title</span></div>
    <input id="add_to_do_title_input" type="text" oninput="remove_empty_input_class(this)"></input>
    
    <div class="spacer_xxl"></div>
    
    <div class="bottom_sheet_sub_title"><span>Description / details</span></div>
    <textarea id="add_to_do_description_input"></textarea>
    
    <div class="spacer_xxl"></div>
    
    <div class="bottom_sheet_sub_title"><span>Add media</span><span class="add_media_due_date_span"></span></div>

    <div>
        <div class="button">Add media</div>
    </div>
    
    <div class="spacer_xxl"></div>

    <div class="big_bottom_sheet_action_button" onclick="add_media()"><span>Add media</span></div>
</div>