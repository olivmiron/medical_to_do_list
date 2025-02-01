<?php
if(!isset($initial_load)) {$initial_load = false;}
if(!$initial_load) {require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";}
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$user_id = $_SESSION['user_id'];

$groups_offset = (int) $_GET["groups_offset"];


    $stmt = $conn->prepare("
        SELECT g.id, g.group_name 
        FROM groups g 
        INNER JOIN groups_members gm ON g.id = gm.group_id 
        WHERE gm.member_id = ? 
        ORDER BY g.date_created DESC 
        LIMIT 10 OFFSET ? 
    ");
    $stmt->bind_param("iI", $user_id, $groups_offset);
    $stmt->execute();
    $result = $stmt->get_result();


    $loaded_group_rows = 0;
    while ($row = $result->fetch_assoc()) {
        $group_row_template = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/pages/dependencies/groups/group_row.html');
        
    
        $group_row_html = str_replace(
            [
                "{{group_id}}", 
                "{{default_group_or_not}}", 
                "{{group_name}}"
            ],
            [
                $row['id'], 
                ($_SESSION["default_group_id"] == $row["id"] ? "settings_group_row_selected" : "" ),
                $row["group_name"]
            ],
            $group_row_template
        );
        
        echo $group_row_html;

        $loaded_group_rows++;
    }

    if($loaded_group_rows == 0 or ($loaded_group_rows < 10 & $groups_offset != 0)) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/query_end.html';}
?>
