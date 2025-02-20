<?php $initial_load = false; require $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/core/global_requirements.php";

require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$patient_id = $input['patient_id'];
$patient_name = $input['patient_name'];
$patient_age = $input['patient_age'];
$patient_location = $input['patient_location'];
$patient_description = $input['patient_description'];

$patient_admission_day = $input['patient_admission_day'];
$patient_admission_month = $input['patient_admission_month'];
$patient_admission_year = $input['patient_admission_year'];

// Transform admission date into datetime format
$patient_admission_date = date('Y-m-d H:i:s', strtotime("$patient_admission_year-$patient_admission_month-$patient_admission_day"));

$stmt = $conn->prepare("UPDATE patients SET patient_identification = ?, age = ?, location = ?, description = ?, date_admitted = ? WHERE id = ?");
$stmt->bind_param("sisssi", $patient_name, $patient_age, $patient_location, $patient_description, $patient_admission_date, $patient_id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Patient updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update patient."]);
}

$stmt->close();
$conn->close();

?>
