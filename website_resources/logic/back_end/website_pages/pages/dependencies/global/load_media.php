<?php
$initial_load = false; 
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

if(empty($load_one_media_element)) {

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["status" => "error", "message" => "Invalid request method."]);
        exit;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if(!in_array($input['to_do_or_patient'], ['to_do', 'patient'])) {
        echo json_encode(["status" => "error", "message" => "Invalid request."]);
        exit;
    }
    
    $to_do_or_patient = $input['to_do_or_patient'] === 'to_do' ? 0 : 1;
    $element_id = (int)$input['element_id'];
    $content_elements_already_loaded = (int)$input['content_elements_already_loaded'];
    $elements_to_load = 5;
}
else {
    
    $to_do_or_patient = $load_one_media_element['to_do_or_patient'] === 'to_do' ? 0 : 1;
    $element_id = (int)$load_one_media_element['to_do_or_patient_id'];
    $content_elements_already_loaded = 0;
    $elements_to_load = $load_one_media_element['elements_to_load'];
}


// CHECK IF USER IS ALLOWED TO SEE THIS CONTENT
// ...

$stmt = $conn->prepare("SELECT * FROM added_content WHERE patient_or_to_do = ? AND patient_or_to_do_id = ? AND visible = 1 ORDER BY date_added DESC LIMIT ? OFFSET ?");
$stmt->bind_param("iiii", $to_do_or_patient, $element_id, $elements_to_load, $content_elements_already_loaded);
$stmt->execute();
$result = $stmt->get_result();

$content_template = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/media_element.html');

$content_html = '';
$number_of_elements_loaded = 0;
while ($row = $result->fetch_assoc()) {
    $number_of_elements_loaded++;
    
    // Fetch media files associated with this content
    $media_stmt = $conn->prepare("SELECT * FROM media WHERE content_id = ?");
    $media_stmt->bind_param("i", $row['id']);
    $media_stmt->execute();
    $media_result = $media_stmt->get_result();
    
    $media_html = '';
    $media_element_file_number = 0;
    while ($media_row = $media_result->fetch_assoc()) {$media_element_file_number++;
        $media_type = strpos($media_row['file_type'], 'image') !== false ? 'image' : 'video';
        $media_html .= $media_type === 'image' ? 
            '<img src="/content_resources/media_content/images/' . $media_row['file_path'] . '"/>' : 
            '<video controls src="/content_resources/media_content/videos/' . $media_row['file_path'] . '"></video>';
    }
    
    $content_html .= str_replace(
        [
            '{{media_element_id}}', 
            '{{patient_or_to_do}}', 
            '{{media_element_date}}',
            "{{media_element_file_number}}", 
            '{{media_element_title}}',
            '{{media_element_media}}',
            "media_element_media_hidden", 
            '{{media_element_description}}', 
            "media_element_description_hidden"
        ],
        [
            $row['id'], 
            $row["patient_or_to_do"] == 0 ? "to_do" : "patient",
            date('d M Y H:i', strtotime($row['date_added'])),
            ' - ' . $media_element_file_number . ' file' . ($media_element_file_number != 1 ? 's' : ''),
            $row['title'],
            $media_html,
            $row["contains_media"] == "0" ? "media_element_media_hidden" : "",
            $row['description'], 
            $row['description'] == "" or empty($row["description"]) ? "media_element_description_hidden" : ""
        ],
        $content_template
    );
    
    $media_stmt->close();
}

$response = [
    "status" => "success",
    "content_html" => base64_encode($content_html), 
    "number_of_elements_loaded" => $number_of_elements_loaded
];

echo json_encode($response);

if($stmt) {
    $stmt->close();
}
if($conn) {
    $conn->close();
}
?>
