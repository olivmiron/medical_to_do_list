<?php
if(!isset($initial_load)) {$initial_load = false;}
if(!$initial_load) {require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";}
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$creator_user_id = $_SESSION['user_id'];

$personal_to_dos = $_GET["personal_to_dos"];
$to_dos_offset = (int) $_GET["to_dos_offset"];

if($personal_to_dos == "true") {$personal_or_group_id = 0;}
else {$personal_or_group_id = $_SESSION["default_group_id"];}

// if need to load grou to dos but no default_group_id, then throw static message to add/create a group
if(!($personal_to_dos == "true" or !empty($personal_or_group_id))) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/add_a_group_first.html';}
else {


    if($personal_to_dos == "true") {
        // $stmt = $conn->prepare("SELECT * FROM to_dos WHERE creator_user_id = ? AND personal_or_group_id = 0 AND visible = 1 ORDER BY date_created DESC, id DESC LIMIT 10 OFFSET ?");
        $stmt = $conn->prepare("SELECT to_dos.*, accounts.name AS creator_name FROM to_dos JOIN accounts ON to_dos.creator_user_id = accounts.id WHERE to_dos.creator_user_id = ? AND to_dos.personal_or_group_id = 0 AND to_dos.visible = 1 ORDER BY to_dos.date_created DESC, to_dos.id DESC LIMIT 10 OFFSET ?");
        $stmt->bind_param("ii", $creator_user_id, $to_dos_offset);
    }
    else {
        $stmt = $conn->prepare("SELECT to_dos.*, accounts.name AS creator_name FROM to_dos JOIN accounts ON to_dos.creator_user_id = accounts.id WHERE to_dos.personal_or_group_id = ? AND to_dos.personal_or_group_id != 0 AND to_dos.visible = 1 ORDER BY to_dos.date_created DESC, to_dos.id DESC LIMIT 10 OFFSET ?");
        $stmt->bind_param("ii", $personal_or_group_id, $to_dos_offset);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $to_dos = [];

    
    $to_do_template = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/pages/dependencies/to_dos/to_do.html');

    $loaded_to_dos = 0;
    while ($row = $result->fetch_assoc()) {

        $days_text = "";
        $due_date_class = "";
        $due_date_days = 0;
        if($row["due_or_not"] == 1) {
            // due in x days, ,or due x days ago
            $today = new DateTime();
            $due = new DateTime($row["due_date"]);
            $interval = $today->diff($due);
            $days_difference = $interval->days;

            $due_date_class = "not_due due_today already_due";

            if ($today->format('Y-m-d') === $due->format('Y-m-d')) {
                $days_text = "Due today";
                $due_date_class = explode(" ", $due_date_class)[1];
            } elseif ($today->modify('+1 day')->format('Y-m-d') === $due->format('Y-m-d')) {
                $days_text = "Due tomorrow";
                $due_date_class = explode(" ", $due_date_class)[0];
                $due_date_days = 1;
            } elseif ($today->modify('-1 day')->format('Y-m-d') === $due->format('Y-m-d')) {
                $days_text = "Due yesterday";
                $due_date_class = explode(" ", $due_date_class)[2];
            } else if ($today > $due) {
                $days_text = "Due " . $days_difference . " day" . ($days_difference != 1 ? "s" : "") . " ago";
                $due_date_class = explode(" ", $due_date_class)[2];
            } else {
                $days_text = "Due in " . $days_difference . " day" . ($days_difference != 1 ? "s" : "");
                $due_date_class = explode(" ", $due_date_class)[0];
                $due_date_days = $days_difference;
            }
        }
        
        $description_class = empty($row['description']) ? 'description_empty' : '';

        // Count the number of added_content rows for this to-do
        $stmt_content = $conn->prepare("SELECT COUNT(*) AS content_count FROM added_content WHERE patient_or_to_do = 0 AND patient_or_to_do_id = ?");
        $stmt_content->bind_param("i", $row['id']);
        $stmt_content->execute();
        $content_result = $stmt_content->get_result();
        $content_row = $content_result->fetch_assoc();
        $content_count = $content_row['content_count'];
        $stmt_content->close();
    
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
                'description_empty', 

                "to_do_due_row_not_due", 
                "{{due_or_not}}", 
                "{{due_date_days}}", 
                "{{due_date}}", 
                "{{not_due due_today already_due}}",
                '{{peek_content_number}}'
            ],
            [
                $row['id'], 
                ($row["to_do_done"] == 0 ? "to_do_item_not_done" : "to_do_item_done" ),
                ($row["to_do_done"] == 0 ? "data-to_do_done='0'" : "data-to_do_done='1'" ),
                date('d M Y H:i', strtotime($row['date_created'])), 
                $row['creator_name'],
                ($row["creator_user_id"] == $_SESSION["user_id"] ? "" : "options_pop_up_menu_option_hidden"),
                $row['title'], 
                $row['description'],
                empty($row['description']) ? 'description_empty' : '', 

                $row["due_or_not"] == 0 ? "to_do_due_row_not_due" : "", 
                $row["due_or_not"], 
                $due_date_days, 
                $days_text, 
                $due_date_class,
                $content_count
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
