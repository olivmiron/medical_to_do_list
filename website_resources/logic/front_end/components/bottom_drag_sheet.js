



// bottom sheet_functions

function open_bottom_sheet() {
    var bottom_sheet = document.getElementById("bottom_drag_sheet_container");
    bottom_sheet.style.display = "block";
    setTimeout(() => {bottom_sheet.classList.add("bottom_drag_sheet_active");}, 10);
    

}

function close_bottom_sheet() {
    var bottom_sheet = document.getElementById("bottom_drag_sheet_container");
    bottom_sheet.classList.remove("bottom_drag_sheet_active");

    var timeout_for_display_none = parseFloat(
        window.getComputedStyle(
            bottom_sheet.querySelector("#bottom_drag_sheet_underlay")
        ).getPropertyValue('transition-duration').replace('s','')
    )
    * 1000
    + 10;

    setTimeout(() => {bottom_sheet.style.display = "none";}, timeout_for_display_none);


    reset_create_or_edit_obj();
}



// Add touch/mouse handling for bottom sheet drag
let startY = 0;
let startHeight = 0;

var handle, sheet;

function initBottomSheetDrag() {
    handle = document.getElementById('bottom_drag_sheet_action_handle');
    sheet = document.getElementById('bottom_drag_sheet');

    if (handle && sheet) {
        handle.addEventListener('touchstart', startDragging, { passive: false });
        handle.addEventListener('mousedown', startDragging, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('mousemove', drag, { passive: false });
        document.addEventListener('touchend', stopDragging);
        document.addEventListener('mouseup', stopDragging);
    } else {
        console.error('Bottom sheet handle or sheet not found');
    }
}

function startDragging(e) {
    e.preventDefault();
    sheet.style.transition = 'none';
    startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    startHeight = parseInt(window.getComputedStyle(sheet).height);
    // Prevent default behavior for touch events
    if (e.type === 'touchstart') {
        e.preventDefault();
    }
}

function drag(e) {
    // e.preventDefault();
    if (startY === 0) return;
    
    const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    const diff = currentY - startY;
    
    const newHeight = Math.min(startHeight - diff, window.innerHeight - 100);
    
    sheet.style.height = `${newHeight}px`;
    // Prevent default behavior for touch events
    if (e.type === 'touchmove') {
        e.preventDefault();
    }
}

function stopDragging() {
    sheet.style.transition = '';
    startY = 0;

    if(parseInt(window.getComputedStyle(sheet).height) < 200) {
        close_bottom_sheet();
        sheet.style.height = "";
    }
}

// Initialize dragging when DOM is loaded
// document.addEventListener('DOMContentLoaded', initBottomSheetDrag); // probably it has already fired by the time it is called


initBottomSheetDrag();





// add content bottom sheet function

function add_media_bottom_sheet_add_media_button() {
    // this function opens the device's media picker and when media is picked, it is added to the add_content_obj.media array



const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*,video/*';
input.multiple = true;

input.onchange = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/') && file.size > 8 * 1024 * 1024) {
            show_pop_up_message('Image file size should not exceed 8MB', true);
            continue;
        }
        if (file.type.startsWith('video/') && file.size > 25 * 1024 * 1024) {
            show_pop_up_message('Video file size should not exceed 25MB', true);
            continue;
        }
        add_content_obj.media.push(file);
        displaySelectedMedia(file);
    }
};

input.click();
}

function displaySelectedMedia(file) {
const mediaContainer = document.querySelector('.add_media_bottom_sheet_added_media_container');
const template = document.getElementById('add_content_media_element_template').content.cloneNode(true);
const mediaElement = template.querySelector('.add_media_bottom_sheet_added_media_element');

//image or video
const imgOrVideo = mediaElement.querySelector('.add_media_bottom_sheet_added_media_element_image_video');

if (file.type.startsWith('image/')) {
    imgOrVideo.src = URL.createObjectURL(file);
} else if (file.type.startsWith('video/')) {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    video.controls = true;
    imgOrVideo.replaceWith(video);
}

//title
const title = mediaElement.querySelector('.add_media_bottom_sheet_added_media_element_title');

const filename = file.name;
const truncatedName = filename.length > 15 ? 
    filename.substr(0, 12) + '...' : 
    filename;
const fileFormat = filename.split('.').pop();
title.innerText = (add_content_obj.media.length) + '. ' + truncatedName + ' .' + fileFormat;


// if <2 elements remaining in the media array, change column count to 1
if(add_content_obj.media.length > 1) {
    document.querySelector('.add_media_bottom_sheet_added_media_container').style.columnCount = '2';
}

// add it to the DOM
mediaElement.setAttribute('data-added_media_element_id', add_content_obj.media.length - 1);
mediaContainer.appendChild(mediaElement);

}



function add_media_bottom_sheet_added_media_element_remove(button) {
const mediaElement = button.closest('.add_media_bottom_sheet_added_media_element');
const mediaElementId = mediaElement.getAttribute('data-added_media_element_id');

add_content_obj.media.splice(mediaElementId, 1);
mediaElement.remove();


// if <2 elements remaining in the media array, change column count to 1
if(add_content_obj.media.length < 2) {
    document.querySelector('.add_media_bottom_sheet_added_media_container').style.columnCount = '1';
}
}







// bottom sheet functions


function reset_create_or_edit_obj() {
    create_or_edit_to_do_obj = {
        create_or_edit: "create", 
        edit_id: null
    };

    create_or_edit_patient_obj = {
        create_or_edit: "create", 
        edit_id: null
    };
}


// patient sheet functions

let create_or_edit_patient_obj = {
    create_or_edit: "create", 
    edit_id: null
}

function create_or_edit_patient() {
    if(create_or_edit_patient_obj.create_or_edit == "create") {create_patient();}
    else {update_patient();}
}


function create_patient() {
    var patient_name = document.getElementById("add_patient_name_input").value;
    var patient_age = document.getElementById("add_patient_age_input").value;
    var patient_location = document.getElementById("add_patient_location_input").value;
    var patient_description = document.getElementById("add_patient_description_input").value;

    var patient_admission_day = document.getElementById("add_patient_admission_day_input").value;
    var patient_admission_month = document.getElementById("add_patient_admission_month_input").value;
    var patient_admission_year = document.getElementById("add_patient_admission_year_input").value;

    
    if(patient_name == "") {document.getElementById("add_patient_name_input").classList.add("empty_input");return;}
    if(patient_age == "" || isNaN(patient_age)) {document.getElementById("add_patient_age_input").classList.add("empty_input");return;}
    
    if(patient_admission_day == "" || isNaN(patient_admission_day)) {document.getElementById("add_patient_admission_day_input").classList.add("empty_input");return;}
    if(patient_admission_month == "" || isNaN(patient_admission_month)) {document.getElementById("add_patient_admission_month_input").classList.add("empty_input");return;}
    if(patient_admission_year == "" || isNaN(patient_admission_year)) {document.getElementById("add_patient_admission_year_input").classList.add("empty_input");return;}

    // Validate date
    let isValidDate = new Date(patient_admission_year, patient_admission_month - 1, patient_admission_day).getDate() == patient_admission_day;
    if (!isValidDate) {
        show_pop_up_message('Please enter a valid date', true);
        return;
    }


    var data_in = {patient_name: patient_name, patient_age: patient_age, patient_location: patient_location, patient_description: patient_description, patient_admission_day: patient_admission_day, patient_admission_month: patient_admission_month, patient_admission_year: patient_admission_year};
    fetch('/website_resources/logic/back_end/components/bottom_drag_sheet_templates/dependencies/add_patient_script.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_in)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "success") {
            let patients_content_container = document.getElementById("view_screen_page__patients__content");
            if(patients_content_container.querySelectorAll(".patient_card").length > 0) {
                patients_content_container.innerHTML = atob(data.patient_html) + patients_content_container.innerHTML;
            }
            else {
                patients_content_container.innerHTML = atob(data.patient_html);
            }

            close_bottom_sheet();
        } else {
            show_pop_up_message('Adding patient failed:', data.message, true);
            close_bottom_sheet();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        show_pop_up_message('Please try again later', true);
        close_bottom_sheet();
    });
}

// global to dos sheet functions



// STEPS: (middle of pointer) // left value of pointer
// none: var(--due_date_picker_reference_size) / 2     //     0
// 1d: var(--due_date_picker_reference_size) * (3/2) + var(--border_radius_medium)     //   var(--due_date_picker_reference_size) + var(--border_radius_medium)
// 10d: document.querySelector('.due_date_picker_container').clientWidth - document.querySelector('.due_date_picker_pointer').clientWidth - var(--due_date_picker_reference_size) / 2       //        document.querySelector('.due_date_picker_container').clientWidth - var(--due_date_picker_reference_size)

var isDragging = false;
var dragStartX = 0;
var pointerStartX = 0;

var main_steps = {
    initialized: false, 
    // no_due_date: 0,
    // due_date_today: parseInt(get_calc_css_value_of_variable("--due_date_picker_reference_size")) + parseInt(get_calc_css_value_of_variable("--spacing_medium")), /* border sizes */ 
    // one_day: (parseInt(get_calc_css_value_of_variable("--due_date_picker_reference_size")) + parseInt(get_calc_css_value_of_variable("--spacing_medium"))) * 2, /* border sizes */
    // ten_days: parseInt(due_date_container.clientWidth) - parseInt(get_calc_css_value_of_variable("--due_date_picker_reference_size"))
}

function initialize_main_steps() {
    var due_date_container = document.querySelector('.due_date_picker_container');
    if(!main_steps.initialized) {
        main_steps = {
            initialized: true,
            no_due_date: 0,
            due_date_today: parseInt(get_calc_css_value_of_variable("--due_date_picker_reference_size")) + parseInt(get_calc_css_value_of_variable("--spacing_medium")), /* border sizes */ 
            one_day: (parseInt(get_calc_css_value_of_variable("--due_date_picker_reference_size")) + parseInt(get_calc_css_value_of_variable("--spacing_medium"))) * 2, /* border sizes */
            ten_days: parseInt(due_date_container.clientWidth) - parseInt(get_calc_css_value_of_variable("--due_date_picker_reference_size"))
        };
    }
}

function due_date_picker_startDrag(event) {
    initialize_main_steps();

    isDragging = true;
    dragStartX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
    const pointer = event.target;

    pointer.style.transition = "none";

    pointerStartX = parseInt(pointer.style.left, 10);
    document.addEventListener('mousemove', due_date_picker_onDrag);
    document.addEventListener('touchmove', due_date_picker_onDrag);
    document.addEventListener('mouseup', due_date_picker_stopDrag);
    document.addEventListener('touchend', due_date_picker_stopDrag);
}



function due_date_picker_onDrag(event) {
    if (!isDragging) return;
    const pointer = document.querySelector('.due_date_picker_pointer');
    const container = document.querySelector('.due_date_picker_container');
    const clientX = event.type === 'touchmove' ? event.touches[0].clientX : event.clientX;
    const deltaX = clientX - dragStartX;
    let newLeft = pointerStartX + deltaX;

    if (newLeft < 0) newLeft = 0;
    if (newLeft > main_steps.ten_days) newLeft = main_steps.ten_days;
    console.log(main_steps.ten_days);
    pointer.style.left = `${newLeft}px`;

    due_date_calculate(false);
}

function due_date_picker_stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', due_date_picker_onDrag);
    document.removeEventListener('touchmove', due_date_picker_onDrag);
    document.removeEventListener('mouseup', due_date_picker_stopDrag);
    document.removeEventListener('touchend', due_date_picker_stopDrag);


    document.querySelector('.due_date_picker_pointer').style.transition = "";

    due_date_calculate(true);

}


function due_date_calculate(re_position) {
    let due_date_picker = document.querySelector('.due_date_picker_pointer');
    let due_date_container = document.getElementById("create_or_edit_to_do_due_date_picker");

    let picker_left = parseInt(due_date_picker.offsetLeft);

    let due_days = 0, due_or_not = 0;

    if(picker_left < (main_steps.no_due_date + main_steps.due_date_today) / 2) {due_days = 0;due_or_not = 0;}
    else if(picker_left < (main_steps.due_date_today + (main_steps.one_day - main_steps.due_date_today) / 2)) {due_days = 0; due_or_not = 1;}
    else if(picker_left < main_steps.one_day) {due_days = 1;due_or_not = 1;}
    else {
        due_days = 
            Math.floor( 
                (picker_left - main_steps.one_day) 
                / ((main_steps.ten_days - main_steps.one_day) / 9)
                + 0.5
                + 1 
            ); //CHECK
            console.log("(" + picker_left + " - " + (main_steps.no_due_date + main_steps.one_day) / 2 + ") / " + (main_steps.ten_days - main_steps.one_day) + " + 0.5 + 1 = " + due_days);

            due_or_not = 1;
    }
    
    due_date_container.setAttribute("data-due_date", due_days);
    due_date_container.setAttribute("data-due_or_not", due_or_not);
 
  
//
due_date_selector_show_due(due_days, due_or_not);
    
    if(re_position) {due_date_picker_re_position();}
}

function due_date_picker_re_position() {
    initialize_main_steps();
    let snap_position = parseInt(document.getElementById("create_or_edit_to_do_due_date_picker").getAttribute("data-due_date"));
    let due_or_not = parseInt(document.getElementById("create_or_edit_to_do_due_date_picker").getAttribute("data-due_or_not"));
    console.log(snap_position + " " + due_or_not);
    let due_date_picker = document.querySelector('.due_date_picker_pointer');
    due_date_selector_show_due(snap_position, due_or_not);

    if(snap_position == 0 && due_or_not == 0) {
        due_date_picker.style.left = main_steps.no_due_date + "px";
    }
    else if(snap_position == 0 && due_or_not == 1) {
        due_date_picker.style.left = main_steps.due_date_today + "px";
    }
    else{
        due_date_picker.style.left = (main_steps.one_day + (snap_position - 1) * (main_steps.ten_days - main_steps.one_day) / 9) + "px";
    } 
}

function due_date_selector_show_due(due_days, due_or_not) {
    if(due_days == 0 && due_or_not == 0) {document.querySelector(".create_or_edit_to_do_due_date_span").innerText = "";}
    else if(due_days == 0 && due_or_not == 1) {document.querySelector(".create_or_edit_to_do_due_date_span").innerText = " - Today";}
    else if(due_days == 1 && due_or_not == 1) {document.querySelector(".create_or_edit_to_do_due_date_span").innerText = " - tomorrow";}
    else if(due_days > 1 && due_or_not == 1) {document.querySelector(".create_or_edit_to_do_due_date_span").innerText = " - " + due_days + " days";}

}



function update_to_do(/* to_do_id */) {

    // Get the title and description values from the to-do
    var to_do_title = document.getElementById("add_to_do_title_input").value;
    var to_do_description = document.getElementById("add_to_do_description_input").value;
    var due_date = parseInt(document.getElementById("create_or_edit_to_do_due_date_picker").getAttribute("data-due_date"));
    var due_or_not = parseInt(document.getElementById("create_or_edit_to_do_due_date_picker").getAttribute("data-due_or_not"));

    if(to_do_title.length < 1) {document.getElementById("add_to_do_title_input").classList.add("empty_input");return;}


    var respective_to_do_element = document.getElementById("to_do__" + create_or_edit_to_do_obj.edit_id);

    respective_to_do_element.querySelector(".to_do_item_title").innerText = to_do_title;
    respective_to_do_element.querySelector(".to_do_item_description_span").innerText = to_do_description;

    if(to_do_description.length < 1) {respective_to_do_element.querySelector(".to_do_item_description").classList.add("description_empty");}
    else {respective_to_do_element.querySelector(".to_do_item_description").classList.remove("description_empty");}

    // hide/unhide due_date and display how many days
    respective_to_do_element.querySelector(".to_do_due_row").setAttribute("data-due_date", due_date);
    respective_to_do_element.querySelector(".to_do_due_row").setAttribute("data-due_or_not", due_or_not);

    if(due_or_not == 0) {
        respective_to_do_element.querySelector(".to_do_due_row").classList.add = "to_do_due_row_not_due";
    }
    else {
        respective_to_do_element.querySelector(".to_do_due_row").classList.remove = "to_do_due_row_not_due";
        if(due_date == 0) {
            respective_to_do_element.querySelector(".due_line_div").classList = "due_line_div due_today";
            respective_to_do_element.querySelector(".due_line_div").innerText = "Due today";
        }
        else if(due_date == 1) {
            respective_to_do_element.querySelector(".due_line_div").classList = "due_line_div not_due";
            respective_to_do_element.querySelector(".due_line_div").innerText = "Due tomorrow";
        }
        else {
            respective_to_do_element.querySelector(".due_line_div").classList = "due_line_div not_due";
            respective_to_do_element.querySelector(".due_line_div").innerText = "Due in " + due_date + " days";
        }
    }

    // Send the data to the server
    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/update_to_do.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'to_do_id': create_or_edit_to_do_obj.edit_id, 
            'to_do_title': to_do_title, 
            'to_do_description': to_do_description, 
            'due_or_not': due_or_not, 
            'due_date': due_date
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            show_pop_up_message('To-do updated successfully', false);
        } else {
            show_pop_up_message('Error: ' + data.message, true);
        }
    })
    .catch(error => console.error('Error:', error));

    close_bottom_sheet();

    reset_create_or_edit_obj();

    // // OLD:
    // var respective_to_do_element = document.getElementById("to_do__" + to_do_id);
    // respective_to_do_element.querySelector(".to_do_item_title").contentEditable = "false";
    // respective_to_do_element.querySelector(".to_do_item_description_span").contentEditable = "false";
    
    // // hide the edit_done button
    // var edit_to_do_done_button = respective_to_do_element.querySelector(".to_do_edit_done_button");
    // edit_to_do_done_button.style.width = "0px";
    
    // // Get the title and description values from the to-do
    // var to_do_title = respective_to_do_element.querySelector(".to_do_item_title").innerText;
    // var to_do_description = respective_to_do_element.querySelector(".to_do_item_description_span").innerText;

    // if(to_do_description == "Some description") {
    //     respective_to_do_element.querySelector(".to_do_item_description").classList.add("description_empty");
    // }

    // // Send the data to the server
    // fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/update_to_do.php', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     body: new URLSearchParams({
    //         'to_do_id': to_do_id,
    //         'to_do_title': to_do_title,
    //         'to_do_description': to_do_description
    //     })
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.status === 'success') {
    //         show_pop_up_message('To-do updated successfully', false);
    //     } else {
    //         show_pop_up_message('Error: ' + data.message, true);
    //     }
    // })
    // .catch(error => console.error('Error:', error));
}



 


let create_or_edit_to_do_obj = {
    create_or_edit: "create", 
    edit_id: null
};

function create_or_edit_to_do() {
    if(create_or_edit_to_do_obj.create_or_edit == "create") {create_to_do();}
    else {update_to_do();}
}


function create_to_do() {
     
    var to_do_text = document.getElementById("add_to_do_title_input").value;
    var to_do_description = document.getElementById("add_to_do_description_input").value;
    var to_do_due_or_not = parseInt(document.getElementById("create_or_edit_to_do_due_date_picker").getAttribute("data-due_or_not"));
    var to_do_due_date = parseInt(document.getElementById("create_or_edit_to_do_due_date_picker").getAttribute("data-due_date"));
    var group_or_personal = (current_page == "group_to_dos" ? "group" : "personal");
    if(to_do_text == "") {document.getElementById("add_to_do_title_input").classList.add("empty_input");return;}

    var data_in = {to_do_text: to_do_text, to_do_description: to_do_description, due_or_not: to_do_due_or_not, due_date: to_do_due_date, group_or_personal: group_or_personal};
    fetch('/website_resources/logic/back_end/components/bottom_drag_sheet_templates/dependencies/add_to_do_script.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_in)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "success") {
            let to_dos_content_container;
            if(current_page == "group_to_dos") {to_dos_content_container = document.getElementById("view_screen_page__group_to_dos__content");}
            else {to_dos_content_container = document.getElementById("view_screen_page__personal_to_dos__content");}

            if(to_dos_content_container.querySelectorAll(".to_do_item").length > 0) {
                to_dos_content_container.innerHTML = atob(data.to_do_html) + to_dos_content_container.innerHTML;
            }
            else {
                to_dos_content_container.innerHTML = atob(data.to_do_html);
            }

                

            close_bottom_sheet();
        } else {
            show_pop_up_message('Adding to do failed:', data.message, true);
            close_bottom_sheet();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        show_pop_up_message('Please try again later', true);
        close_bottom_sheet();
    });
}
