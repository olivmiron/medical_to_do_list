

function update_url_page_param(utl_param, value) {
    let url = new URL(window.location.href);
    url.searchParams.set(utl_param, value);
    window.history.replaceState({}, '', url);
}

function get_css_value_of_variable(variable_name) {
    return window.getComputedStyle(document.documentElement).getPropertyValue(variable_name);
}

function get_calc_css_value_of_variable(variable_name) {
    const tempElement = document.createElement('div');
    tempElement.style.height = "var(" + variable_name + ")";
    document.body.appendChild(tempElement);
    const value = window.getComputedStyle(tempElement).height;
    tempElement.remove();
    return value;
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

function hide_pop_up_message() {
    document.getElementById("pop_up_message").classList.remove("pop_up_message_visible");
}




function pop_up_message_get_confirmation_decline() {
    document.getElementById("pop_up_message").classList.remove("pop_up_message_visible");
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




function join_group_show_message() {
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

join_group_show_message();
