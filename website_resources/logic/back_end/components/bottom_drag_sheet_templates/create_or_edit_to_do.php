<div id="create_or_edit_to_do__bottom_sheet_action_template" class="bottom_sheet_component">
    <div class="bottom_sheet_title"><span>Add to do</span></div>
    <div class="spacer_large"></div>

    
    <div class="bottom_sheet_sub_title"><span>Title</span><span class="required_field_star">*</span></div>
    <input id="add_to_do_title_input" type="text" oninput="remove_empty_input_class(this)"></input>
    
    <div class="spacer_xxl"></div>
    
    <div class="bottom_sheet_sub_title"><span>Description / details</span></div>
    <textarea id="add_to_do_description_input"></textarea>
    
    <div class="spacer_xxl"></div>
    
    <div class="bottom_sheet_sub_title"><span>Due in</span></div>

    <!-- <div id="create_or_edit_to_do_due_date_picker" data-due_date="0">
        <div class="due_date_picker_container">
            <div class="due_date_picker_bar">
                <div class="due_date_picker_bar_none"></div>
                <div class="due_date_picker_bar_rest"></div>
            </div>
            <div class="due_date_picker_pointer"></div>
            <div class="due_date_picker_dates">
                <span>|<br/>none</span>
                <span>|<br/>1 day</span>
                <span>|<br/>10 days</span>
            </div>
        </div>
    </div> -->

    <?php include $_SERVER["DOCUMENT_ROOT"] . "/developer_resources/website_elements/due_date_picker.html"; ?>
    
    <div class="spacer_xxl"></div>

    <div class="big_bottom_sheet_action_button" onclick="create_or_edit_to_do()"><span>Save to do</span></div>
</div>