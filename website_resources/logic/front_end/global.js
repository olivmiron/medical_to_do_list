// global variables



// global functions


function update_url_page_param(utl_param, value) {
    let url = new URL(window.location.href);
    url.searchParams.set(utl_param, value);
    window.history.replaceState({}, '', url);
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
        } else {
            console.error('Login failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



// top_bar functions




// bottom_bar functions

function change_page(page_name) {
    if(!pages_array.includes(page_name)) {return;}

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

    update_url_page_param("page", page_name)
}