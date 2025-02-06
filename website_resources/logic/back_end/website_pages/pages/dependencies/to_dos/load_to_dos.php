<?php
if(!isset($initial_load)) {$initial_load = false;}
if(!$initial_load) {require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";}
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$creator_user_id = $_SESSION['user_id'];

$personal_to_dos = $_GET["personal_to_dos"];
$to_dos_offset = (int) $_GET["to_dos_offset"];

if($personal_to_dos) {$personal_or_group_id = 0;}
else {$personal_or_group_id = $_SESSION["default_group_id"];}

// if need to load grou to dos but no default_group_id, then throw static message to add/create a group
if(!($personal_to_dos or !empty($personal_or_group_id))) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/add_a_group_first.html';}
else {


    if($personal_to_dos) {
        $stmt = $conn->prepare("SELECT * FROM to_dos WHERE creator_user_id = ? AND personal_or_group_id = 0 AND visible = 1 ORDER BY date_created DESC, id DESC LIMIT 10 OFFSET ?");
        $stmt->bind_param("ii", $creator_user_id, $to_dos_offset);
    }
    else {
        $stmt = $conn->prepare("SELECT * FROM to_dos WHERE personal_or_group_id = ? AND personal_or_group_id != 0 AND visible = 1 ORDER BY date_created DESC, id DESC LIMIT 10 OFFSET ?");
        $stmt->bind_param("ii", $personal_or_group_id, $to_dos_offset);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $to_dos = [];

    $loaded_to_dos = 0;
    while ($row = $result->fetch_assoc()) {
        $to_do_template = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/to_do.html');
        
        $description_class = empty($row['description']) ? 'description_empty' : '';
    
        $to_do_html = str_replace(
            [
                '{{to_do_id}}', 
                "{{to_do_done_or_not}}", 
                "data-to_do_done='0'",
                '{{to_do_date_created}}', 
                '{{to_do_creator_name}}',
                "{{delete_option_available_or_not}}",
                '{{to_do_title}}', 
                '{{to_do_description}}',
                'description_empty'
            ],
            [
                $row['id'], 
                ($row["to_do_done"] == 0 ? "to_do_item_not_done" : "to_do_item_done" ),
                ($row["to_do_done"] == 0 ? "data-to_do_done='0'" : "data-to_do_done='1'" ),
                date('d M Y H:i', strtotime($row['date_created'])), 
                $_SESSION["user_name"],
                ($row["creator_user_id"] == $_SESSION["user_id"] ? "" : "options_pop_up_menu_option_hidden"),
                $row['title'], 
                $row['description'],
                empty($row['description']) ? 'description_empty' : ''
            ],
            $to_do_template
        );
        
        echo $to_do_html;

        $loaded_to_dos++;
    }

    if($loaded_to_dos == 0 or ($loaded_to_dos < 10 and $to_dos_offset != 0)) {
        // if first load, only display if the number is 0; otherwise, inly display on further to dos request
        include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/query_end.html';
    }
}
?>
