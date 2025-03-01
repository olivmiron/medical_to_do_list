<?php
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$data = json_decode(file_get_contents('php://input'), true);

$title = $data['title'];
$description = $data['description'];
$to_do_or_patient = $data['to_do_or_patient'];
$to_do_or_patient = $to_do_or_patient === 'to_do' ? 0 : 1;
$to_do_or_patient_id = $data['to_do_or_patient_id'];
$media = $data['media'];

if (empty($title) or empty($to_do_or_patient) or empty($to_do_or_patient_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Title is required']);
    exit();
}
// Set date and initial values
$date_added = date('Y-m-d H:i:s');
$contains_media = !empty($media) ? count($media) : 0;
$visible = 1;

// Collect media extensions if files exist
$media_extensions = [];
if ($contains_media) {
    foreach ($media as $file) {
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $media_extensions[] = $ext;
    }
}
$media_extensions_str = implode(',', $media_extensions);

$query = "INSERT INTO added_content (patient_or_to_do, patient_or_to_do_id, title, description, contains_media, media_extensions, date_added, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($query);
$stmt->bind_param("iississi", $to_do_or_patient, $to_do_or_patient_id, $title, $description, $contains_media, $media_extensions_str, $date_added, $visible);

if ($stmt->execute()) {
    $content_id = $stmt->insert_id;

    // Handle media files
    foreach ($media as $index => $file) {
        $file_name = $file['name'];
        $file_tmp = $file['tmp_name'];
        $file_type = $file['type'];
        $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $file_new_name = $content_id . '_' . ($index + 1) . '.' . $file_ext;

        // Determine the folder based on file type
        $folder = (strpos($file_type, 'image') !== false) ? 'images' : 'videos';
        $file_path = $_SERVER['DOCUMENT_ROOT'] . "/content_resources/media_content/" . $folder . "/" . $file_new_name;

        if (move_uploaded_file($file_tmp, $file_path)) {
            $query = "INSERT INTO media (content_id, file_name, file_type, file_path, date_added) VALUES (?, ?, ?, ?, NOW())";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("isss", $content_id, $file_name, $file_type, $file_new_name);
            $stmt->execute();
        }
    }

    echo json_encode(['status' => 'success', 'message' => 'Content added successfully', 'content_id' => $content_id]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to add content']);
}

$stmt->close();
$conn->close();
?>
