
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


    // var top_bar_action_button = document.getElementById("top_bar_action_button");

    // top_bar_action_button.style.display = "block";
    // top_bar_action_button.onclick = pages_top_bar_action_buttons[page_name][0];
    // top_bar_action_button.src = pages_top_bar_action_buttons[page_name][1];


}



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
        
            load_or_open_bottom_sheet(current_page, "create_or_edit_patient")
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
            else {hide_pop_up_message();}
        
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
        else {hide_pop_up_message();}
    
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
    
    function toggle_content(to_do_or_patient, to_do_or_patient_id) {
        var respective_patient_or_to_do_element = document.getElementById(to_do_or_patient + "__" + to_do_or_patient_id);
        if(!respective_patient_or_to_do_element.querySelector(".content_peek").classList.contains("content_peek_active")) {
            respective_patient_or_to_do_element.querySelector(".content_peek").classList.add("content_peek_active");
    
            if(parseInt(respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content").getAttribute("data-content_loaded")) == 0) {
    
                load_more_content(to_do_or_patient, to_do_or_patient_id);
    
                respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content").setAttribute("data-content_loaded", 1);
                respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content").classList.add("patient_or_to_do_content_visible");
    
            }
            else {
                respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content").classList.add("patient_or_to_do_content_visible");
            }
        }
        else {
            respective_patient_or_to_do_element.querySelector(".content_peek").classList.remove("content_peek_active");
            respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content").classList.remove("patient_or_to_do_content_visible");
        }
    }
    
    function load_more_content(to_do_or_patient, to_do_or_patient_id) {
        var respective_patient_or_to_do_element = document.getElementById(to_do_or_patient + "__" + to_do_or_patient_id);
        let number_of_elements_loaded = respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content_inside").querySelectorAll(".media_element").length;
        load_media_content(to_do_or_patient, to_do_or_patient_id, number_of_elements_loaded)
                .then(data => {
                    if(data.status == "success") {
                        
                        if(data.number_of_elements_loaded > 0) {
                        respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content_no_content").querySelector("span").innerText = "";
                        respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content_inside").innerHTML += atob(data.content_html);
                        }
    
                        if(data.number_of_elements_loaded < 5) {
                            respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content_load_more").outerHTML = "";
                        }
                    }
                    else {
                        respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content_no_content").querySelector("span").innerText = "Error loading content";
                        respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content_load_more").outerHTML = "";
                    }
                });
    }
    
    function load_media_content(to_do_or_patient, element_id, content_elements_already_loaded) {//load 5 elements at a time
        var data_in = {
            to_do_or_patient: to_do_or_patient, 
            element_id: element_id, 
            content_elements_already_loaded: content_elements_already_loaded
        };
        return fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/global/load_media.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data_in)
        })
        .then(response => response.json())
        .then(data => {
            if(data.status == "success") {
                return data; // status, html and number of elements loaded
            }
            else {
                show_pop_up_message('Failed to load to do content:', data.message, true);
                return {status: "error"};
            }
        })
        .catch(error => {
            show_pop_up_message('Please try again later', true);
            return {status: "error"};
        });
    }
    
    
    let add_content_obj = {
        // to_do_or_patient: null,
        // to_do_or_patient_id: null,
        // title: "",
        // description: "",
        // media: []
    }
    
    function re_initialize_add_content_obj(to_do_or_paient, to_do_or_patient_id) {
        add_content_obj = {
            to_do_or_patient: to_do_or_paient,
            to_do_or_patient_id: to_do_or_patient_id,
            title: "",
            description: "",
            media: []
        }
    }
    
    
    function add_content(to_do_or_paient, to_do_or_patient_id) {
        re_initialize_add_content_obj(to_do_or_paient, to_do_or_patient_id);
        // load/open add_conmtent bottom_sheet
        load_or_open_bottom_sheet("add_content", "add_content");
    }
    
    
    function add_content_to_db() {
        add_content_obj.title = document.getElementById("add_content_title_input").value;
        add_content_obj.description = document.getElementById("add_content_description_input").value;
    
        if(add_content_obj.title == "") {document.getElementById("add_content_title_input").classList.add("empty_input");return;}
    
        const formData = new FormData();
        formData.append('title', add_content_obj.title);
        formData.append('description', add_content_obj.description);
        formData.append('to_do_or_patient', add_content_obj.to_do_or_patient);
        formData.append('to_do_or_patient_id', add_content_obj.to_do_or_patient_id);
    
        add_content_obj.media.forEach((file, index) => {
            formData.append(`media[${index}]`, file);
        });
    
        fetch('/website_resources/logic/back_end/components/bottom_drag_sheet_templates/dependencies/add_content_script.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.status == "success") {
                add_content_to_patient_or_to_do(data.content_html);
    
                
                let peek_content_numbering = document.getElementById(add_content_obj.to_do_or_patient + "__" + add_content_obj.to_do_or_patient_id).querySelector(".peek_content_number");
                peek_content_numbering.innerText = parseInt(peek_content_numbering.innerText) + 1;
    
    
                show_pop_up_message('Successfully added content', false);
                close_bottom_sheet();
            }
            else {
                show_pop_up_message('Failed to add content:', data.message, true);
                close_bottom_sheet();
            }
        })
        .catch(error => {
            show_pop_up_message('Please try again later' + error, true);
            close_bottom_sheet();
        });
    
    
        function add_content_to_patient_or_to_do(content_html) { // based on add_content_obj.to_do_or_patient
            // fetch website_resources/logic/back_end/website_pages/pages/dependencies/global/load_media.php iwth the mention to only fetch the last
            let respective_patient_or_to_do_element = document.getElementById(add_content_obj.to_do_or_patient + "__" + add_content_obj.to_do_or_patient_id);
            respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content_no_content").querySelector("span").innerText = "";
            respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content_inside").innerHTML = atob(content_html) + " x " + respective_patient_or_to_do_element.querySelector(".patient_or_to_do_content_inside").innerHTML;
        }
        
    
    }
    

    

    



function delete_media_element(media_element_id, patient_or_to_do, confirmed) {
    if (confirmed !== true) {
        pop_up_message_get_confirmation("Do you really want to delete this media element?", true, "delete_media_element('" + media_element_id + "', '" + patient_or_to_do + "', true)");
        return;
    }
    else {hide_pop_up_message();}

    var data_in = { media_element_id: media_element_id};
    fetch('/website_resources/logic/back_end/website_pages/pages/dependencies/global/delete_media_element.php', {
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
            let peek_content_numbering;
            if(patient_or_to_do == "to_do") {
                peek_content_numbering = document.getElementById('media_element__' + media_element_id).closest(".to_do_item").querySelector(".content_peek_content").querySelector("div");
            }
            else {
                peek_content_numbering = document.getElementById('media_element__' + media_element_id).closest(".patient_card").querySelector(".content_peek_content").querySelector("div");
            }
            peek_content_numbering.innerText = parseInt(peek_content_numbering.innerText) - 1;
            document.getElementById('media_element__' + media_element_id).remove();

            
            show_pop_up_message('Successfully deleted media element.', false);

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




function edit_to_do(to_do_id) {

    create_or_edit_to_do_obj = {
        create_or_edit: "edit", 
        edit_id: to_do_id
    };

    load_or_open_bottom_sheet(current_page, "create_or_edit_to_do")
    .then(() => {
        popualte_create_or_add_to_do_bottom_sheet();   
    });

    function popualte_create_or_add_to_do_bottom_sheet() {
        var respective_to_do_element = document.getElementById("to_do__" + to_do_id);

        document.getElementById("add_to_do_title_input").value = respective_to_do_element.querySelector(".to_do_item_title").innerText;
        document.getElementById("add_to_do_description_input").value = respective_to_do_element.querySelector(".to_do_item_description_span").innerText;

        var due_or_not = parseInt(respective_to_do_element.querySelector(".to_do_due_row").getAttribute("data-due_or_not"));
        var due_date = parseInt(respective_to_do_element.querySelector(".to_do_due_row").getAttribute("data-due_date"));
        if(due_date < 0) {due_date = 0;}

        document.getElementById("create_or_edit_to_do_due_date_picker").setAttribute("data-due_or_not", due_or_not);
        document.getElementById("create_or_edit_to_do_due_date_picker").setAttribute("data-due_date", due_date);

        due_date_picker_re_position();

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
    else {hide_pop_up_message();}

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
