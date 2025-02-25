// global variables



// global functions


function update_url_page_param(utl_param, value) {
    let url = new URL(window.location.href);
    url.searchParams.set(utl_param, value);
    window.history.replaceState({}, '', url);
}

function get_css_value_of_variable(variable_name) {
    return window.getComputedStyle(document.documentElement).getPropertyValue(variable_name);
}



function show_pop_up_message(message, error_or_not) {
    document.getElementById("pop_up_message_text").innerHTML = message;

    document.getElementById("pop_up_message_buttons").style.display = "none";

    if(error_or_not) {document.getElementById("pop_up_message").classList.add("pop_up_message_error");}
    else{document.getElementById("pop_up_message").classList.remove("pop_up_message_error");}


    document.getElementById("pop_up_message").classList.add("pop_up_message_visible");
    setTimeout(() => {document.getElementById("pop_up_message").classList.remove("pop_up_message_visible");}, 3000);
}

function pop_up_message_get_confirmation(message, distructive_or_not, passed_function) {
    document.getElementById("pop_up_message_text").innerHTML = message;

    document.getElementById("pop_up_message_buttons").style.display = "flex";

    if(distructive_or_not) {document.getElementById("pop_up_message").classList.add("pop_up_message_error");}
    else{document.getElementById("pop_up_message").classList.remove("pop_up_message_error");}

    document.getElementById("pop_up_message_yes_button").setAttribute("onclick", passed_function);


    document.getElementById("pop_up_message").classList.add("pop_up_message_visible");
    setTimeout(() => {document.getElementById("pop_up_message").classList.remove("pop_up_message_visible");}, 6000);

}




function pop_up_message_get_confirmation_decline() {
    document.getElementById("pop_up_message").classList.remove("pop_up_message_visible");
}




function handleCredentialResponse(response) {
    var sign_in_square = document.getElementById("sign_in_square");
    const data = { id_token: response.credential };
    fetch('/website_resources/logic/back_end/core/attempt_log_in.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "success") {
            // window.location.reload();

            sign_in_square.innerHTML = "<span>Successfully logged in</span><div class=\"spacer_xl\"></div><span>" + data.user_name + "</span>";
            setTimeout(() => {sign_in_square.style.opacity = "0";}, 2000);
            setTimeout(() => {sign_in_square.outerHTML = "";}, 2500);

            document.getElementById("top_bar_user_picture").src = data.picture;
            document.getElementById("top_bar_user_picture").style.display = "block";

            load_page();
        } else {
            show_pop_up_message('Login failed:', data.message, true);
        }
    })
    .catch(error => {
        show_pop_up_message('Please try again later', true);
    });
}


function remove_empty_input_class(input) {
    input.classList.remove("empty_input");
}


function toggle_options_pop_up_menu(respective_options_pop_up_menu_container) {
    respective_options_pop_up_menu_container.querySelector(".options_pop_up_menu").classList.toggle("options_pop_up_menu_visible");
}


function close_floating_box(floating_box_close_button) {
    floating_box_close_button.closest(".floating_box").classList.add("floating_box_hidden");
}



function join_group_show_mwssage() {
    switch(quick_join_group_message) {
        case 'nothing':
            break;
        case 'log_in_before_joining':
            show_pop_up_message("Please log in before joining the group", true);
            break;
        case 'joined':
            show_pop_up_message("You have successfully joined the group", false);
            break;
        case 'already_joined_group':
            show_pop_up_message("You are already a member of the group", true);
            break;
        case 'invalid_token':
            show_pop_up_message("The token for joining group has already expired", true);
            break;
        case 'error':
            show_pop_up_message("There was an error joining the group. Please try again later", true);
            break;
    }

    update_url_page_param("join_group_token", '');
    
}

join_group_show_mwssage();




// top_bar functions

function change_top_bar_title(title) {
    var top_bar_title = document.getElementById("top_bar_title");
    top_bar_title.querySelector("span").innerHTML = title;
}


function toggle_top_bar_floater(floater_name) {
    var user_options_floater = document.getElementById(floater_name);
    if(user_options_floater == null) {return;}

    if(user_options_floater.classList.contains('floater_hidden')) {user_options_floater.classList.remove('floater_hidden');}
    else {user_options_floater.classList.add('floater_hidden');}
}

function log_out() {
    //go to log out page
    window.location.href = "/website_resources/logic/back_end/core/log_out.php";    
}





function top_bar_current_view_action(page_name, action_name) {
    // see if page_name_bottom_sheet is loaded inside bottom_drag_sheet_stored_templates
    return new Promise((resolve, reject) => {
        var bottom_sheet_stored_templates = document.getElementById(action_name + "__bottom_sheet_action_template");
        if(bottom_sheet_stored_templates == null) {
            load_bottom_sheet_action_template(page_name)
            .then(() => {
                insert_bottom_sheet_template_and_open();
                resolve("success");
            })
            .catch(reject);
        }
        else {
            insert_bottom_sheet_template_and_open();
            resolve("success");
        }
    });


    function insert_bottom_sheet_template_and_open() {
        var respective_template = document.getElementById(action_name + "__bottom_sheet_action_template");
        document.getElementById("bottom_drag_sheet_content").innerHTML = respective_template.innerHTML;
        open_bottom_sheet();
    }


    
    
}

function load_bottom_sheet_action_template(page_name) {
    // make an ajax request to get the page content and populate the respective view_screen_page__PAGE_NAME
    var bottom_sheet_stored_templates = document.getElementById("bottom_drag_sheet_stored_templates");

    return fetch(pages_drag_sheet_templates[page_name])
    .then(response => response.text())
    .then(data => {
        bottom_sheet_stored_templates.innerHTML += data;
        return "success";
    });
}












// bottom_bar functions

function change_page(page_name) {
    if(!pages_array.includes(page_name)) {return;}

    if(!loaded_pages[page_name]) {load_page(page_name);}
    else {change_top_bar_title(pages_names_array[pages_array.indexOf(page_name)]);}

    var app_view_screen_pages = document.getElementsByClassName("app_view_screen_page");
    var bottom_bar_buttons = document.getElementsByClassName("bottom_bar_button");
    //get index of page_name in pages_array
    var page_index = pages_array.indexOf(page_name);

    // forech page in pages_array
    for(var i = 0; i < pages_array.length; i++) {
        if(i < page_index) {
            // hide the page
            app_view_screen_pages[i].classList.add("app_view_screen_page_left");
            app_view_screen_pages[i].classList.remove("app_view_screen_page_center");
            app_view_screen_pages[i].classList.remove("app_view_screen_page_right");

            bottom_bar_buttons[i].classList.remove("bottom_bar_button_active");
        }
        else if(i == page_index) {
            // show the page
            app_view_screen_pages[i].classList.remove("app_view_screen_page_left");
            app_view_screen_pages[i].classList.add("app_view_screen_page_center");
            app_view_screen_pages[i].classList.remove("app_view_screen_page_right");

            bottom_bar_buttons[i].classList.add("bottom_bar_button_active");
        }
        else {
            // hide the page
            app_view_screen_pages[i].classList.remove("app_view_screen_page_left");
            app_view_screen_pages[i].classList.remove("app_view_screen_page_center");
            app_view_screen_pages[i].classList.add("app_view_screen_page_right");

            bottom_bar_buttons[i].classList.remove("bottom_bar_button_active");
        }
    }

    //update top_nar action button
    var top_bar_action_button = document.getElementById("top_bar_action_button");
    top_bar_action_button.src = pages_top_bar_action_buttons[page_name][1];
    top_bar_action_button.setAttribute("onclick", pages_top_bar_action_buttons[page_name][0]);


    //update browser url

    update_url_page_param("page", page_name);

    current_page = page_name;
}



// page_view functions

function load_page(page_name) {
    // if page_name is not provided, get it from the url
    if(page_name == undefined) {
        var url = new URL(window.location.href);
        page_name = url.searchParams.get("page");
    }
    else{
        // see if page_name is valid
        if(!pages_array.includes(page_name)) {return;}
    }

    if(null == page_name) {page_name = pages_array[0];}

    // make an ajax request to get the page content and populate the respective view_screen_page__PAGE_NAME
    var respective_view_screen_page = document.getElementById("view_screen_page__" + page_name);

    fetch('/website_resources/logic/back_end/website_pages/fetch_page.php?page=' + page_name)
    .then(response => response.text())
    .then(data => {
        respective_view_screen_page.innerHTML = data;
        // update loaded_pages
        loaded_pages[page_name] = true;

        change_top_bar_title(pages_names_array[pages_array.indexOf(page_name)]);
    });


    var top_bar_action_button = document.getElementById("top_bar_action_button")

    top_bar_action_button.style.display = "block";
    top_bar_action_button.onclick = pages_top_bar_action_buttons[page_name][0];
    top_bar_action_button.src = pages_top_bar_action_buttons[page_name][1];


}











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
        handle.addEventListener('mousedown', startDragging);
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
    e.preventDefault();
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


// pages functions



    // pages patients functions


    

function load_more_patients(button) {
    let patients_container = document.getElementById("view_screen_page__patients__content");

    var patients_initially_loaded = 0;
    patients_initially_loaded = patients_container.querySelectorAll(".patient_card").length;

    let data = { patients_offset: patients_initially_loaded };

    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/patients/load_patients.php?' + new URLSearchParams(data), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(html => {

        patients_container.innerHTML += html;

        let patients_loaded = patients_container.querySelectorAll(".patient_card").length - patients_initially_loaded;

        console.log("patients initially loaded: " + patients_initially_loaded + ", patients finally loaded: " + patients_loaded);

        // Check if there are more to-dos to load
        if (patients_loaded < 10) {
            button.closest('.load_more_button_container').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        show_pop_up_message('Please try again later', true);
    });
}



    function edit_patient(patient_id) {


        create_or_edit_patient_obj = {
            create_or_edit: "edit", 
            edit_id: patient_id
        };
    
        top_bar_current_view_action(current_page, "create_or_edit_patient")
        .then(() => {
            popualte_create_or_add_patient_bottom_sheet();   
        });
    
        function popualte_create_or_add_patient_bottom_sheet() {
            var respective_patient_element = document.getElementById("patient__" + patient_id);

            document.getElementById("add_patient_name_input").value = respective_patient_element.querySelector(".patient_right_main_row_identification").innerText;
            document.getElementById("add_patient_age_input").value = respective_patient_element.querySelector(".patient_right_main_row_age").querySelector("span").innerText;
            document.getElementById("add_patient_location_input").value = respective_patient_element.querySelector(".patient_right_main_row_location").innerText;
            document.getElementById("add_patient_description_input").value = respective_patient_element.querySelector(".patient_description_span").innerText;
        
            var update_patient_admission_date = respective_patient_element.querySelector(".patient_admission_date").getAttribute("data-admission_date").split(" ");
            document.getElementById("add_patient_admission_day_input").value = update_patient_admission_date[0];
            document.getElementById("add_patient_admission_month_input").value = update_patient_admission_date[1];
            document.getElementById("add_patient_admission_year_input").value = update_patient_admission_date[2];
    
        }



        // // adds a class that makes the to do content editable (and will later show delete buttons nar media in order to delete them too).
        // // also shows the done editing button near the 3 dots button
        // var respective_patient_element = document.getElementById("patient__" + patient_id);
    
        // //mark editable elements as contenteditable - UNCOMMENT
        //             respective_patient_element.querySelector(".to_do_item_title").contentEditable = "true";
        //             // if(respective_patient_element.querySelector(".to_do_item_description").classList.contains("description_empty")) {
                
        //             //     respective_patient_element.querySelector(".to_do_item_description").classList.remove("description_empty");
        //             //     respective_patient_element.querySelector(".to_do_item_description_span").innerText = "Some description";
                
        //             // } 
        //             //     // to_do_item_description_span
        //             //     respective_patient_element.querySelector(".to_do_item_description_span").contentEditable = "true";
    
        // // display the edit_done button
        // var edit_to_do_done_button = document.getElementById("patient__" + patient_id).querySelector(".patient_edit_done_button");
    
        // edit_to_do_done_button.style.width = "22px";
    }

    function update_patient() {

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



    var data_in = {patient_id: create_or_edit_patient_obj.edit_id, patient_name: patient_name, patient_age: patient_age, patient_location: patient_location, patient_description: patient_description, patient_admission_day: patient_admission_day, patient_admission_month: patient_admission_month, patient_admission_year: patient_admission_year};
    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/patients/update_patient.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_in)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "success") {
            update_patient_card();

            close_bottom_sheet();
        } else {
            show_pop_up_message('Updating patient failed:', data.message, true);
            close_bottom_sheet();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        show_pop_up_message('Please try again later', true);
        close_bottom_sheet();
    });
    


    reset_create_or_edit_obj();


    
    function update_patient_card() {
        var month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        var respective_patient_element = document.getElementById("patient__" + create_or_edit_patient_obj.edit_id);

        respective_patient_element.querySelector(".patient_admission_date").setAttribute("data-admission_date", patient_admission_day + " " + patient_admission_month + " " + patient_admission_year);
        respective_patient_element.querySelector(".patient_admission_date").querySelector("span").innerText = patient_admission_day + " " + month_names[(parseInt(patient_admission_month) - 1)] + " " + patient_admission_year;

        respective_patient_element.querySelector(".patient_right_main_row_identification").querySelector("span").innerText = patient_name;
        respective_patient_element.querySelector(".patient_right_main_row_age").querySelector("span").innerText = patient_age;
        respective_patient_element.querySelector(".patient_right_main_row_location").querySelector("span").innerText = patient_location
        respective_patient_element.querySelector(".patient_description_span").innerText = patient_description;

        if(patient_description.length < 1) {respective_patient_element.querySelector(".patient_description").classList.add("description_empty");}
        else {respective_patient_element.querySelector(".patient_description").classList.remove("description_empty");}
    }
        
    }
    
    
    
    function delete_patient(patient_id, confirmed) {
        if (!confirmed) {
            pop_up_message_get_confirmation("Do you really want to delete this patient's data?", true, "delete_patient('" + patient_id + "', true)");
            return;
        }
    
        var data_in = { patient_id: patient_id};
        fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/patients/delete_patient.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_in)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == "success") {
                // Remove the group row from the settings page
                document.getElementById('patient__' + patient_id).remove();
    
    
                show_pop_up_message('Successfully deleted patient data.', false);
            } else {
                show_pop_up_message('Deleting patient data failed: ', data.message, true);
            }
        })
        .catch(error => {
            show_pop_up_message('Please try again later', true);
        });
    } 





    // pages global to dos functions

function toggle_to_do(to_do_id, button) {
    let to_do = button.closest('.to_do_item');
    if (!to_do) return;


    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/toggle_to_do.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to_do_id: to_do_id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            if (data.new_status == 1) {
                to_do.setAttribute("data-to_do_done", "1");
                to_do.classList.add("to_do_item_done");
                to_do.classList.remove("to_do_item_not_done");
            } else {
                to_do.setAttribute("data-to_do_done", "0");
                to_do.classList.add("to_do_item_not_done");
                to_do.classList.remove("to_do_item_done");
            }
        } else {
            show_pop_up_message('Failed to toggle to-do item:', data.message, true);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        show_pop_up_message('Please try again later', true);
    });

}



function load_more_to_dos(group_or_personal, button) {
    if (!["group", "personal"].includes(group_or_personal)) {
        show_pop_up_message('Please try again later', true);
        return;
    }
    var to_dos_initially_loaded = 0;
    if(group_or_personal == "personal") {
        to_dos_initially_loaded = document.getElementById("view_screen_page__personal_to_dos__content").querySelectorAll(".to_do_item").length;
    }
    else {
        to_dos_initially_loaded = document.getElementById("view_screen_page__group_to_dos__content").querySelectorAll(".to_do_item").length;
    }

    let data = { personal_to_dos: (group_or_personal == "personal" ? "true" : "false"), to_dos_offset: to_dos_initially_loaded };

    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/load_to_dos.php?' + new URLSearchParams(data), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(html => {
        let to_dos_container = group_or_personal === 'group' ? 
            document.getElementById("view_screen_page__group_to_dos__content") : 
            document.getElementById("view_screen_page__personal_to_dos__content");

        to_dos_container.innerHTML += html;

        let to_dos_loaded = to_dos_container.querySelectorAll(".to_do_item").length - to_dos_initially_loaded;

        console.log("to dos initially loaded: " + to_dos_initially_loaded + ", to dos finally loaded: " + to_dos_loaded);

        // Check if there are more to-dos to load
        if (to_dos_loaded < 10) {
            button.closest('.load_more_button_container').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        show_pop_up_message('Please try again later', true);
    });
}





function delete_to_do(to_do_id, confirmed) {
    if (!confirmed) {
        pop_up_message_get_confirmation("Do you really want to delete this to do?", true, "delete_to_do('" + to_do_id + "', true)");
        return;
    }

    var data_in = { to_do_id: to_do_id};
    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/delete_to_do.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_in)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "success") {
            // Remove the group row from the settings page
            document.getElementById('to_do__' + to_do_id).remove();


            show_pop_up_message('Successfully deleted the to do.', false);
        } else {
            show_pop_up_message('Deleting to do failed: ', data.message, true);
        }
    })
    .catch(error => {
        show_pop_up_message('Please try again later', true);
    });
} 



    // pages group to dos functions


    // pages personal to dos functions



    // pages settings functions


function select_group_as_default(group_id) {
    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/groups/select_group_as_default.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ group_id: group_id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            show_pop_up_message('Group set as default:<br/>' + data.group_name, false);

            // Remove the default class from all group rows
            document.querySelectorAll('.settings_group_row').forEach(row => {
                row.classList.remove('settings_group_row_selected');
            });

            // Add the default class to the selected group row
            document.getElementById('group_row__' + group_id).classList.add('settings_group_row_selected');

            loaded_pages["patients"] = false;
            loaded_pages["group_to_dos"] = false;

        } else {
            show_pop_up_message('Failed to set group as default:', data.message, true);
        }
    })
    .catch(error => {
        show_pop_up_message('Please try again later', true);
    });
}




function load_more_groups(button) {
    let groups_initially_loaded = document.getElementById("view_screen_page__settings__content").querySelectorAll(".settings_group_row").length;

    let data = { groups_offset: groups_initially_loaded };

    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/groups/load_groups.php?' + new URLSearchParams(data), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.text())
    .then(html => {
        let groups_container = document.getElementById("view_screen_page__settings__content");

        groups_container.innerHTML += html;

        let groups_loaded = groups_container.querySelectorAll(".settings_group_row").length - groups_initially_loaded;

        console.log("groups initially loaded: " + groups_initially_loaded + ", groups finally loaded: " + groups_loaded);

        // Check if there are more to-dos to load
        if (groups_loaded < 10) {
            button.closest('.load_more_button_container').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        show_pop_up_message('Please try again later', true);
    });
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

var main_steps = {
    no_due_date: 0,
    one_day: parseInt(get_css_value_of_variable("--due_date_picker_reference_size")) + parseInt(get_css_value_of_variable("--border_radius_medium")),
    ten_days: parseInt(document.querySelector('.due_date_picker_container').clientWidth - parseInt(get_css_value_of_variable("--due_date_picker_reference_size")))
}


let isDragging = false;
let dragStartX = 0;
let pointerStartX = 0;

function due_date_picker_startDrag(event) {
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
    
    const max_left = container.clientWidth - (pointer.clientWidth /* + parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('--spacing_small')) * 2 */);

    if (newLeft < 0) newLeft = 0;
    if (newLeft > max_left) newLeft = max_left;
    pointer.style.left = `${newLeft}px`;
}

function due_date_picker_stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', due_date_picker_onDrag);
    document.removeEventListener('touchmove', due_date_picker_onDrag);
    document.removeEventListener('mouseup', due_date_picker_stopDrag);
    document.removeEventListener('touchend', due_date_picker_stopDrag);


    document.querySelector('.due_date_picker_pointer').style.transition = "";

    due_date_calculate();

}


function due_date_calculate() {
    let due_date_picker = document.querySelector('.due_date_picker_pointer');
    let due_date_container = document.getElementById("create_or_edit_to_do_due_date_picker");

    let picker_left = parseInt(due_date_picker.offsetLeft);

    if(picker_left < (main_steps.no_due_date + main_steps.one_day) / 2) {
        due_date_container.setAttribute("data-due_date", "0");
    }
    else {
        let due_days = 
            Math.floor( 
                (picker_left - (main_steps.no_due_date + main_steps.one_day) / 2) 
                / (main_steps.ten_days - main_steps.one_day)
                + 0.5
                + 1 
            ); //CHECK
        due_date_container.setAttribute("data-due_date", due_days);
    }

    show_pop_up_message(picker_left + " px; container_position: " + due_date_container, false);
 
  
//
    
    due_date_picker_re_position();
}

function due_date_picker_re_position() {
    let snap_position = parseInt(document.getElementById("create_or_edit_to_do_due_date_picker").getAttribute("data-due_date"));
    let due_date_picker = document.querySelector('.due_date_picker_pointer');


    if(snap_position == 0) {
        due_date_picker.style.left = "0px";
    }
    else{
        due_date_picker.style.left = (main_steps.one_day + (snap_position - 1) * (main_steps.ten_days - main_steps.one_day) / 10) + "px";
    } 
}





function edit_to_do(to_do_id) {

    create_or_edit_to_do_obj = {
        create_or_edit: "edit", 
        edit_id: to_do_id
    };

    top_bar_current_view_action(current_page, "create_or_edit_to_do")
    .then(() => {
        popualte_create_or_add_to_do_bottom_sheet();   
    });

    function popualte_create_or_add_to_do_bottom_sheet() {
        var respective_to_do_element = document.getElementById("to_do__" + to_do_id);

        document.getElementById("add_to_do_title_input").value = respective_to_do_element.querySelector(".to_do_item_title").innerText;
        document.getElementById("add_to_do_description_input").value = respective_to_do_element.querySelector(".to_do_item_description_span").innerText;

    }


    //     // adds a class that makes the to do content editable (and will later show delete buttons nar media in order to delete them too).
    //     // also shows the done editing button near the 3 dots button
    //     var respective_to_do_element = document.getElementById("to_do__" + to_do_id);

    // //mark editable elements as contenteditable
    // respective_to_do_element.querySelector(".to_do_item_title").contentEditable = "true";
    // if(respective_to_do_element.querySelector(".to_do_item_description").classList.contains("description_empty")) {

    //     respective_to_do_element.querySelector(".to_do_item_description").classList.remove("description_empty");
    //     respective_to_do_element.querySelector(".to_do_item_description_span").innerText = "Some description";

    // } 
    //     // to_do_item_description_span
    //     respective_to_do_element.querySelector(".to_do_item_description_span").contentEditable = "true";

    // // display the edit_done button
    // var edit_to_do_done_button = respective_to_do_element.querySelector(".to_do_edit_done_button");

    // edit_to_do_done_button.style.width = "22px";
}

function update_to_do(/* to_do_id */) {

    // Get the title and description values from the to-do
    var to_do_title = document.getElementById("add_to_do_title_input").value;
    var to_do_description = document.getElementById("add_to_do_description_input").value;

    if(to_do_title.length < 1) {document.getElementById("add_to_do_title_input").classList.add("empty_input");return;}


    var respective_to_do_element = document.getElementById("to_do__" + create_or_edit_to_do_obj.edit_id);

    respective_to_do_element.querySelector(".to_do_item_title").innerText = to_do_title;
    respective_to_do_element.querySelector(".to_do_item_description_span").innerText = to_do_description;

    if(to_do_description.length < 1) {respective_to_do_element.querySelector(".to_do_item_description").classList.add("description_empty");}
    else {respective_to_do_element.querySelector(".to_do_item_description").classList.remove("description_empty");}
    

    // Send the data to the server
    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/update_to_do.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'to_do_id': create_or_edit_to_do_obj.edit_id,
            'to_do_title': to_do_title,
            'to_do_description': to_do_description
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
    if(to_do_text == "") {document.getElementById("add_to_do_title_input").classList.add("empty_input");return;}

    var data_in = {to_do_text: to_do_text, to_do_description: to_do_description, group_or_personal: (current_page == "group_to_dos" ? "group" : "personal")};
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


// settings sheet functions



function toggle_password_visibility(input_id, button_element) {
    let password_input = document.getElementById(input_id);

    if(password_input.getAttribute("type") == "password") {
        password_input.setAttribute("type", "text");
        button_element.querySelector("img").src = "/website_resources/design/media/icons/bottom_sheets/closed_eye.png";
    }
    else {
        password_input.setAttribute("type", "password");
        button_element.querySelector("img").src = "/website_resources/design/media/icons/bottom_sheets/open_eye.png";
    }
}


function generate_password_for_group() {
    let create_group_password_input = document.getElementById("create_group_password_input");

    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&*#$%!@-';
    let password = '';
    let length = Math.floor(Math.random() * 3) + 6; // random length 6-8
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    create_group_password_input.value = password;

    if(create_group_password_input.getAttribute("type") == "password") {document.getElementById("create_group_toggle_password_visibility_button").click();}
}


function join_group() {
    var group_name = document.getElementById("add_group_name_input").value;
    var group_password = document.getElementById("add_group_password_input").value;

    if(group_name == "") {document.getElementById("add_group_name_input").classList.add("empty_input");return;}
    if(group_password.length < 6) {document.getElementById("add_group_password_input").classList.add("empty_input");return;}

    var data_in = {group_name: group_name, group_password: group_password};
    fetch('/website_resources/logic/back_end/components/bottom_drag_sheet_templates/dependencies/join_group_script.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_in)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "success") {
            
            // Remove the default class from all group rows
            document.querySelectorAll('.settings_group_row').forEach(row => {
                row.classList.remove('settings_group_row_selected');
            });
            
                document.getElementById("view_screen_page__settings__content").innerHTML = atob(data.group_row_html) + document.getElementById("view_screen_page__settings__content").innerHTML;

            loaded_pages["patients"] = false;
            loaded_pages["group_to_dos"] = false;
                

            close_bottom_sheet();
        } else {
            show_pop_up_message('Adding group failed:', data.message, true);
            close_bottom_sheet();
        }
    })
    .catch(error => {
        show_pop_up_message('Please try again later', true);
        close_bottom_sheet();
    });
}


function create_group_in_db() {
    var group_name = document.getElementById("create_group_name_input").value;
    var group_password = document.getElementById("create_group_password_input").value;

    if (group_name == "") {
        document.getElementById("create_group_name_input").classList.add("empty_input");
        return;
    }
    if (group_password.length < 6) {
        document.getElementById("create_group_password_input").classList.add("empty_input");
        return;
    }

    var data_in = { group_name: group_name, group_password: group_password };
    fetch('/website_resources/logic/back_end/components/bottom_drag_sheet_templates/dependencies/create_group_script.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_in)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "success") {
            // Remove the default class from all group rows
            document.querySelectorAll('.settings_group_row').forEach(row => {
                row.classList.remove('settings_group_row_selected');
            });

            document.getElementById("view_screen_page__settings__content").innerHTML = atob(data.group_row_html) + document.getElementById("view_screen_page__settings__content").innerHTML;

            loaded_pages["patients"] = false;
            loaded_pages["group_to_dos"] = false;

            close_bottom_sheet();
        } else {
            show_pop_up_message('Creating group failed:', data.message, true);
            close_bottom_sheet();
        }
    })
    .catch(error => {
        show_pop_up_message('Please try again later', true);
        close_bottom_sheet();
    });
}



function create_qr_code_invite(group_id) {
    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/groups/generate_quick_join_code_and_qr.php?group_id=' + group_id)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            show_pop_up_message('Failed to generate QR code: ' + data.error, true);
        } else {
            // Display the QR code
            document.getElementById("join_group_qr_code_code").querySelector("img").src= "/content_resources/quick_join_qr_codes/" + data.token_entry_id + ".png";
            document.getElementById("join_group_qr_code").classList.remove("floating_box_hidden");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        show_pop_up_message('Please try again later', true);
    });
}



function exit_group(group_id, confirmed) {
    if (!confirmed) {
        pop_up_message_get_confirmation("Do you really want to leave this group?", true, "exit_group('" + group_id + "', true)");
        return;
    }

    var data_in = { group_id: group_id };
    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/groups/exit_group.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_in)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status == "success") {
            // Remove the group row from the settings page
            document.getElementById('group_row__' + group_id).remove();

            // If the exited group was the default group, update the default group in the session
            if (data.was_default_group) {
                loaded_pages["patients"] = false;
                loaded_pages["group_to_dos"] = false;
            }

            show_pop_up_message('Successfully exited the group.', false);
        } else {
            show_pop_up_message('Exiting group failed: ', data.message, true);
        }
    })
    .catch(error => {
        show_pop_up_message('Please try again later', true);
    });
}
