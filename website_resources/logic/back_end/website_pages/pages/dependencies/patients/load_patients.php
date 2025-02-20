<?php
if(!isset($initial_load)) {$initial_load = false;}
if(!$initial_load) {require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";}
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$creator_user_id = $_SESSION['user_id'];

$group_id = $_SESSION["default_group_id"];
$patients_offset = (int) $_GET["patients_offset"];

// if need to load grou to dos but no default_group_id, then throw static message to add/create a group
if(!($group_id or !empty($group_id))) {include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/add_a_group_first.html';}
else {


        $stmt = $conn->prepare("SELECT patients.*, accounts.name AS caregiver_name FROM patients JOIN accounts ON patients.creator_user_id = accounts.id WHERE patients.group_id = ? AND patients.visible = 1 ORDER BY patients.date_admitted DESC, patients.id DESC LIMIT 10 OFFSET ?");
        $stmt->bind_param("ii", $group_id, $patients_offset);
    
    $stmt->execute();
    $result = $stmt->get_result();

    $loaded_patients = 0;
    while ($row = $result->fetch_assoc()) {
        $patient_template = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/pages/dependencies/patients/patient.html');
        
        $description_class = empty($row['description']) ? 'description_empty' : '';
    
        $patient_html = str_replace(
            [
                '{{patient_id}}',
                '{{admission_date}}',
                '{{admission_date_spaces}}', 
                '{{caregiver_name}}',
                '{{delete_option_available_or_not}}',
                '{{patient_identification}}',
                '{{patient_age}}',
                '{{patient_location}}',
                'description_empty', 
                '{{patient_description}}'
            ],
            [
                $row['id'], 
                date('d M Y', strtotime($row['date_admitted'])), 
                date('d m Y', strtotime($row['date_admitted'])), 
                $row['caregiver_name'],
                ($row["creator_user_id"] == $_SESSION["user_id"] ? "" : "options_pop_up_menu_option_hidden"),
                $row['patient_identification'], 
                $row['age'],
                $row['location'],
                empty($row['description']) ? 'description_empty' : '', 
                $row['description']
            ],
            $patient_template
        );
        
        echo $patient_html;

        $loaded_patients++;
    }

    if($loaded_patients == 0 or ($loaded_patients < 10 and $patients_offset != 0)) {
        // if first load, only display if the number is 0; otherwise, inly display on further to dos request
        include $_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/other/query_end.html';
    }
}
?>
