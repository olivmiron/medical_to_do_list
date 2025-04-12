


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





function load_or_open_bottom_sheet(page_name, action_name) {
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