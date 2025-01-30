<?php
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$creator_user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT id, title, description, date_created FROM to_dos WHERE creator_user_id = ? AND personal_or_group_id = ? ORDER BY date_created DESC LIMIT 10");
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
            '{{to_do_date_created}}', 
            '{{to_do_creator_name}}',
            '{{to_do_title}}', 
            '{{to_do_description}}',
            'description_empty'
        ],
        [
            $row['id'], 
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
?>
