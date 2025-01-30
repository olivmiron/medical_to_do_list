<?php
if(!$initial_load) {require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";}
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$creator_user_id = $_SESSION['user_id'];

if($personal_to_dos) {$personal_or_group_id = 0;}
else {$personal_or_group_id = $_SESSION["default_group_id"];}

// if need to load grou to dos but no default_group_id, then throw static message to add/create a group
if(!($personal_to_dos or !empty($personal_or_group_id))) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/add_a_group_first.html';}
else {


    $stmt = $conn->prepare("SELECT * FROM to_dos WHERE creator_user_id = ? AND personal_or_group_id = ? ORDER BY date_created DESC LIMIT 10 OFFSET 0");
    $stmt->bind_param("ii", $creator_user_id, $personal_or_group_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $to_dos = [];
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
                $row['title'], 
                $row['description'],
                empty($row['description']) ? 'description_empty' : ''
            ],
            $to_do_template
        );
        
        echo $to_do_html;
    }
    
    $stmt->close();
    $conn->close();
}
?>
