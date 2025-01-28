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

            load_page();
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

    //update top_nar action button
    var top_bar_action_button = document.getElementById("top_bar_action_button");
    top_bar_action_button.src = pages_top_bar_action_buttons[page_name][1];
    top_bar_action_button.onclick = pages_top_bar_action_buttons[page_name][0];


    //update browser url

    update_url_page_param("page", page_name);
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

    // make an ajax request to get the page content and populate the respective view_screen_page__PAGE_NAME
    var respective_view_screen_page = document.getElementById("view_screen_page__" + page_name);

    fetch('/website_resources/logic/back_end/core/load_page.php?page=' + page_name)
    .then(response => response.text())
    .then(data => {
        respective_view_screen_page.innerHTML = data;
        // update loaded_pages
        loaded_pages[page_name] = true;
    })

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
    }
}

// Initialize dragging when DOM is loaded
document.addEventListener('DOMContentLoaded', initBottomSheetDrag);