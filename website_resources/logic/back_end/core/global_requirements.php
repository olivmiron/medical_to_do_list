<?php // include in the initial load of the page and in every ajax call !!!

// global variables

if(!isset($_SESSION))  {session_start();}

$pages_array = ["patients", "group_to_dos", "personal_to_dos", "settings"];
$pages_names_array = ["Patients", "Group to dos", "Personal to dos", "Settings"];
$pages_uris = [
    "patients" => "website_resources/logic/back_end/website_pages/pages/patients.php", 
    "group_to_dos" => "website_resources/logic/back_end/website_pages/pages/group_to_dos.php", 
    "personal_to_dos" => "website_resources/logic/back_end/website_pages/pages/personal_to_dos.php", 
    "settings" => "website_resources/logic/back_end/website_pages/pages/settings.php"
];

$pages_top_bar_action_buttons = [
    "patients" => ["top_bar_current_view_action('patients', 'add_patient')", "/website_resources/design/media/icons/top_bar/add_patient.png"],
    "group_to_dos" => ["top_bar_current_view_action('group_to_dos', 'add_to_do')", "/website_resources/design/media/icons/top_bar/add_to_do.png"],
    "personal_to_dos" => ["top_bar_current_view_action('personal_to_dos', 'add_to_do')", "/website_resources/design/media/icons/top_bar/add_to_do.png"],
    "settings" => ["top_bar_current_view_action('settings', 'add_group')", "/website_resources/design/media/icons/top_bar/add_group.png"]
];

$pages_drag_sheet_templates = [
    "patients" => "website_resources/logic/back_end/components/bottom_drag_sheet_templates/add_patient.php",
    "group_to_dos" => "website_resources/logic/back_end/components/bottom_drag_sheet_templates/add_to_do.php",
    "personal_to_dos" => "website_resources/logic/back_end/components/bottom_drag_sheet_templates/add_to_do.php",
    "settings" => "website_resources/logic/back_end/components/bottom_drag_sheet_templates/create_group.php"
];

if (!function_exists('throw_error')) {
    function throw_error($error_message) {
        echo "<div id='error_message'>" . $error_message . "</div>";
        exit();
    }
}


if($initial_load) {$_SESSION["loaded_pages"] = array_fill_keys($pages_array, false);}


    
// log in checker
    require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements_dependencies/log_in_checker.php";

// initial page view


if(isset($_GET["page"])) {
    if(in_array($_GET["page"], $pages_array)) {
        $initial_page = $_GET["page"];
    }
    else {
        $initial_page = $pages_array[0];
    }
}
else {
    $initial_page = $pages_array[0];
}

if($initial_load) {
    
    $top_bar_title = "Medical to do list";


    $pages_arrangement = array_fill_keys($pages_array, [1, "app_view_screen_page_center"]); // Initialize all pages to right (1)
    $current_page_index = array_search($initial_page, $pages_array);

    for ($i = 0; $i < count($pages_array); $i++) {
        if ($i < $current_page_index) {
            $pages_arrangement[$pages_array[$i]] = [-1, "app_view_screen_page_left"]; // Pages before current are left (-1)
        } elseif ($i == $current_page_index) {
            $pages_arrangement[$pages_array[$i]] = [0, "app_view_screen_page_center"]; // Current page is center (0)
            if($_SESSION["logged_in"]) {$_SESSION["loaded_pages"][$pages_array[$i]] = true;} // mark current page as loaded if logged in

            if($_SESSION["logged_in"]) {$top_bar_title = $pages_names_array[$i];}
        }
        else {
            $pages_arrangement[$pages_array[$i]] = [1, "app_view_screen_page_right"]; // Pages after current are right (1)
        }
    }

}
else{
    if(!$_SESSION["logged_in"]) {
        include $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/other/not_logged_in.html";
    }
}

?>