// ...existing code...

function resize_image($file, $max_width, $quality) {
    list($width, $height) = getimagesize($file);
    // Always compress, resize if width exceeds max_width
    if ($width > $max_width) {
        $ratio = $max_width / $width;
        $new_width = $max_width;
        $new_height = $height * $ratio;
    } else {
        $new_width = $width;
        $new_height = $height;
    }

    $src = imagecreatefromstring(file_get_contents($file));
    $dst = imagecreatetruecolor($new_width, $new_height);

    imagecopyresampled($dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
    imagejpeg($dst, $file, $quality);

    imagedestroy($src);
    imagedestroy($dst);
}

function compress_video($file, $output_file, $max_width) {
    $cmd = "ffmpeg -i $file -vf scale=$max_width:-1 -c:v libx264 -crf 23 -preset fast -c:a copy $output_file";
    shell_exec($cmd);
}

// ...existing code...

if ($add_content_stmt->execute()) {
    $content_id = $add_content_stmt->insert_id;

    // Handle media files
    if(!empty($media['name'])) {
        foreach ($media['name'] as $index => $file_name) {
            $file_tmp = $media['tmp_name'][$index];
            $file_type = $media['type'][$index];
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
            $file_new_name = $content_id . '_' . ($index + 1) . '.' . $file_ext;
    
            // Determine the folder based on file type
            $folder = (strpos($file_type, 'image') !== false) ? 'images' : 'videos';
            $file_path = $_SERVER['DOCUMENT_ROOT'] . "/content_resources/media_content/" . $folder . "/" . $file_new_name;
    
            if (move_uploaded_file($file_tmp, $file_path)) {
                // Resize and compress image if it's an image file
                if (strpos($file_type, 'image') !== false) {
                    resize_image($file_path, 720, 78);
                } elseif (strpos($file_type, 'video') !== false) {
                    $compressed_file_path = $_SERVER['DOCUMENT_ROOT'] . "/content_resources/media_content/" . $folder . "/compressed_" . $file_new_name;
                    compress_video($file_path, $compressed_file_path, 720);
                    // Replace original file with compressed file
                    rename($compressed_file_path, $file_path);
                }

                $query = "INSERT INTO media (content_id, file_name, file_type, file_path, date_added) VALUES (?, ?, ?, ?, NOW())";
                $add_media_stmt = $conn->prepare($query);
                $add_media_stmt->bind_param("isss", $content_id, $file_name, $file_type, $file_new_name);
                $add_media_stmt->execute();
                $add_media_stmt->close();
            }
        }
    }

    // ...existing code...
} else {
    // ...existing code...
}

// ...existing code...
?>




<?php
$initial_load = false; 
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/global_requirements.php";
require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$data = $_POST;

$title = $data['title'];
$description = $data['description'];
$to_do_or_patient = $data['to_do_or_patient'];
$to_do_or_patient_id = $data['to_do_or_patient_id'];
if(!empty($_FILES['media'])) {
    $media = $_FILES['media'];
} else {
    $media = [];
}

if (empty($title) or empty($to_do_or_patient) or empty($to_do_or_patient_id)) {
    echo json_encode(['status' => 'error', 'message' => 'Title is required']);
    exit();
}

$to_do_or_patient = $to_do_or_patient === 'to_do' ? 0 : 1;

// Set date and initial values
$date_added = date('Y-m-d H:i:s');
$contains_media = !empty($media) ? count($media['name']) : 0;
$visible = 1;

// Collect media extensions if files exist
$media_extensions = [];
if (!empty($media['name'])) {
    foreach ($media['name'] as $file_name) {
        $ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
        $media_extensions[] = $ext;
    }
}
$media_extensions_str = implode(',', $media_extensions);

$query = "INSERT INTO added_content (patient_or_to_do, patient_or_to_do_id, title, description, contains_media, media_extensions, date_added, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$add_content_stmt = $conn->prepare($query);
$add_content_stmt->bind_param("iississi", $to_do_or_patient, $to_do_or_patient_id, $title, $description, $contains_media, $media_extensions_str, $date_added, $visible);

function resize_image($file, $max_width, $quality) {
    list($width, $height) = getimagesize($file);
    // Always compress, resize if width exceeds max_width
    if ($width > $max_width) {
        $ratio = $max_width / $width;
        $new_width = $max_width;
        $new_height = $height * $ratio;
    } else {
        $new_width = $width;
        $new_height = $height;
    }

    $src = imagecreatefromstring(file_get_contents($file));
    $dst = imagecreatetruecolor($new_width, $new_height);

    imagecopyresampled($dst, $src, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
    imagejpeg($dst, $file, $quality);

    imagedestroy($src);
    imagedestroy($dst);
}

function compress_video_async($file, $output_file, $max_width) {
    $cmd = "ffmpeg -i $file -vf scale=$max_width:-1 -c:v libx264 -crf 23 -preset fast -c:a copy $output_file > /dev/null 2>&1 &";
    exec($cmd);
}

if ($add_content_stmt->execute()) {
    $content_id = $add_content_stmt->insert_id;

    // Handle media files
    if(!empty($media['name'])) {
        foreach ($media['name'] as $index => $file_name) {
            $file_tmp = $media['tmp_name'][$index];
            $file_type = $media['type'][$index];
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
            $file_new_name = $content_id . '_' . ($index + 1) . '.' . $file_ext;
    
            // Determine the folder based on file type
            $folder = (strpos($file_type, 'image') !== false) ? 'images' : 'videos';
            $file_path = $_SERVER['DOCUMENT_ROOT'] . "/content_resources/media_content/" . $folder . "/" . $file_new_name;
    
            if (move_uploaded_file($file_tmp, $file_path)) {
                // Resize and compress image if it's an image file
                if (strpos($file_type, 'image') !== false) {
                    resize_image($file_path, 720, 78);
                } elseif (strpos($file_type, 'video') !== false) {
                    $compressed_file_path = $_SERVER['DOCUMENT_ROOT'] . "/content_resources/media_content/" . $folder . "/compressed_" . $file_new_name;
                    compress_video_async($file_path, $compressed_file_path, 720);
                    // Replace original file with compressed file asynchronously
                    rename($compressed_file_path, $file_path);
                }

                $query = "INSERT INTO media (content_id, file_name, file_type, file_path, date_added) VALUES (?, ?, ?, ?, NOW())";
                $add_media_stmt = $conn->prepare($query);
                $add_media_stmt->bind_param("isss", $content_id, $file_name, $file_type, $file_new_name);
                $add_media_stmt->execute();
                $add_media_stmt->close();
            }
        }
    }

    //construct content_html
    $load_one_media_element = [
        'to_do_or_patient' => $to_do_or_patient,
        'to_do_or_patient_id' => $to_do_or_patient_id,
        'elements_to_load' => 1
    ];
    $content_html = "";
    ob_start();
    include $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/website_pages/pages/dependencies/global/load_media.php";
    $xx = ob_get_clean();
    $content_html = json_decode($xx, true)['content_html'];
    

    echo json_encode(['status' => 'success', 'message' => 'Content added successfully', 'content_id' => $content_id, 'content_html' => $content_html /* already base64_encoded */, 'test' => $xx]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to add content']);
}

$add_content_stmt->close();

?>
