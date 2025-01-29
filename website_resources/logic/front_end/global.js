// global variables



// global functions


function update_url_page_param(utl_param, value) {
    let url = new URL(window.location.href);
    url.searchParams.set(utl_param, value);
    window.history.replaceState({}, '', url);
}


function show_pop_up_message(message, error_or_not) {
    document.getElementById("pop_up_message").innerHTML = message;

    if(error_or_not) {document.getElementById("pop_up_message").classList.add("pop_up_message_error");}
    else{document.getElementById("pop_up_message").classList.remove("pop_up_message_error");}


    document.getElementById("pop_up_message").classList.add("pop_up_message_visible");
    setTimeout(() => {document.getElementById("pop_up_message").classList.remove("pop_up_message_visible");}, 3000);
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
    var bottom_sheet_stored_templates = document.getElementById(action_name + "__bottom_sheet_action_template");
    if(bottom_sheet_stored_templates == null) {
        load_bottom_sheet_action_template(page_name)
        .then(() => {
            insert_bottom_sheet_template_and_open();

        });
    }
    else {insert_bottom_sheet_template_and_open();}


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
}



// Add touch/mouse handling for bottom sheet drag
let startY = 0;
let startHeight = 0;

var handle, sheet;

function initBottomSheetDrag() {
    handle = document.getElementById('bottom_drag_sheet_action_handle');
    sheet = document.getElementById('bottom_drag_sheet');

    handle.addEventListener('touchstart', startDragging, { passive: true });
    handle.addEventListener('mousedown', startDragging);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchend', stopDragging);
    document.addEventListener('mouseup', stopDragging);
}

function startDragging(e) {
    sheet.style.transition = 'none';
    startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
    startHeight = parseInt(window.getComputedStyle(sheet).height)
}

function drag(e) {
    if (startY === 0) return;
    
    const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    const diff = currentY - startY;
    
    const newHeight = Math.min(startHeight - diff, window.innerHeight - 100);
    
    sheet.style.height = `${newHeight}px`;
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
document.addEventListener('DOMContentLoaded', initBottomSheetDrag);




// pages functions



    // pages patients functions


    // pages global to dos functions

    function toggle_to_do(to_do_id, button) {

        let to_do = button.closest('.to_do_item');
        if (!to_do) return;
        
        if(to_do.getAttribute("data-to_do_done") == "0") {
            to_do.setAttribute("data-to_do_done", "1");
            
            to_do.classList.add("to_do_item_done");
            to_do.classList.remove("to_do_item_not_done");
        }
        else {
            to_do.setAttribute("data-to_do_done", "0");
            
            to_do.classList.add("to_do_item_not_done");
            to_do.classList.remove("to_do_item_done");
        }
        
}

    // pages group to dos functions


    // pages personal to dos functions



    // pages settings functions











// bottom sheet functions


// patient sheet functions


// global to dos sheet functions

function add_to_do_to_db() {
    var to_do_text = document.getElementById("add_to_do_title_input").value;
    var to_do_description = document.getElementById("add_to_do_description_input").value;
    if(to_do_text == "") {document.getElementById("add_to_do_title_input").classList.add("empty_input");return;}

    var data_in = {to_do_text: to_do_text, to_do_description: to_do_description};
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
            if(current_page == "group_to_dos") {document.getElementById("view_screen_page__group_to_dos__content").innerHTML = data.to_do_html;}
            else {document.getElementById("view_screen_page__personal_to_dos__content").innerHTML = data.to_do_html;}

            close_bottom_sheet();
        } else {
            show_pop_up_message('Adding to do failed:', data.message, true);
            close_bottom_sheet();
        }
    })
    .catch(error => {
        show_pop_up_message('Please try again later', true);
        close_bottom_sheet();
    });
}


// settings sheet functions