<div id="add_content__bottom_sheet_action_template" class="bottom_sheet_component">
    <div class="bottom_sheet_title"><span>Add content</span></div>
    <div class="spacer_large"></div>

    
    <div class="bottom_sheet_sub_title"><span>Title</span></div>
    <input id="add_content_title_input" type="text" oninput="remove_empty_input_class(this)"></input>
    
    <div class="spacer_xxl"></div>
    
    <div class="bottom_sheet_sub_title"><span>Add media</span><span class="add_media_due_date_span"></span></div>

    <div>
        <div class="add_media_bottom_sheet_added_media_container">

        </div>
        <div class="button" onclick="add_media_bottom_sheet_add_media_button()">Add media</div>
    </div>
    
    <div class="spacer_xxl"></div>
    
    <div class="bottom_sheet_sub_title"><span>Description / details</span></div>
    <textarea id="add_content_description_input"></textarea>
    
    <div class="spacer_xxl"></div>

    <div class="big_bottom_sheet_action_button" onclick="add_content_to_db()"><span>Add Content</span></div>
</div>

<template id="add_content_media_element_template">
    <div class="add_media_bottom_sheet_added_media_element" data-added_media_element_id="0" >
        <img class="add_media_bottom_sheet_added_media_element_image_video" src="/content_resources/media_content/images/1.jpg" />
        <div class="flex_div flex_div_justify_space_between">
            <span class="add_media_bottom_sheet_added_media_element_title">Image_01......jpg</span>
            <img src="/website_resources/design/media/icons/global/close.png" alt="Delete" onclick="add_media_bottom_sheet_added_media_element_remove(this)"/>
        </div>
    </div>
</template>