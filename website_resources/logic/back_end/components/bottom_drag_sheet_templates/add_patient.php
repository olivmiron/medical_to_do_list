<div id="add_patient__bottom_sheet_action_template" class="bottom_sheet_component">
    <div class="bottom_sheet_title"><span>Add patient</span></div>
    <div class="spacer_large"></div>


    <div class="bottom_sheet_sub_title"><span>Name</span><span class="required_field_star">*</span></div>
    <input id="add_patient_name_input" type="text" oninput="remove_empty_input_class(this)"></input>
    
    <div class="spacer_xxl"></div>


    <div class="bottom_sheet_sub_title"><span>Age</span><span class="required_field_star">*</span></div>
    <input id="add_patient_age_input" type="number" oninput="remove_empty_input_class(this)"></input>

    <div class="spacer_xxl"></div>


    <div class="bottom_sheet_sub_title"><span>Location</span></div>
    <input id="add_patient_location_input" type="text" oninput="remove_empty_input_class(this)"></input>

    <div class="spacer_xxl"></div>  


    <div class="bottom_sheet_sub_title"><span>Description</span></div>
    <textarea id="add_patient_description_input"></textarea>

    <div class="spacer_xxl"></div> 

    <div class="big_bottom_sheet_action_button" onclick="add_patient_to_db()"><span>Save to do</span></div>
</div>