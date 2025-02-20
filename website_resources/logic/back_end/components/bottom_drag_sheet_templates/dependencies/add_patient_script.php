<?php $initial_load = false; require $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/core/global_requirements.php";

require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

if (!$_SERVER['REQUEST_METHOD'] === 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$creator_user_id = $_SESSION['user_id'];

$group_id = $_SESSION["default_group_id"];

$patient_name = $input['patient_name'];
$patient_age = $input['patient_age'];
$patient_location = $input['patient_location'];
$patient_description = $input['patient_description'];

$patient_admission_day = $input['patient_admission_day'];
$patient_admission_month = $input['patient_admission_month'];
$patient_admission_year = $input['patient_admission_year'];

// Transform admission date into datetime format
$patient_admission_date = date('Y-m-d H:i:s', strtotime("$patient_admission_year-$patient_admission_month-$patient_admission_day"));

$date_created = date('Y-m-d H:i:s');

$stmt = $conn->prepare("INSERT INTO patients (group_id, creator_user_id, patient_identification, age, location, description, date_admitted, date_created, visible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)");
$stmt->bind_param("iisissss", $group_id, $creator_user_id, $patient_name, $patient_age, $patient_location, $patient_description, $patient_admission_date, $date_created);

if ($stmt->execute()) {
} else {
    echo json_encode(["status" => "error", "message" => "Failed to add patient."]);
    exit;
}

$patient_id = $conn->insert_id;

$patient_template = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/website_resources/logic/back_end/website_pages/pages/dependencies/patients/patient.html');

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
        $patient_id, 
        date('d M Y', strtotime("$patient_admission_year-$patient_admission_month-$patient_admission_day")), 
        date('d m Y', strtotime("$patient_admission_year-$patient_admission_month-$patient_admission_day")), 
        $_SESSION["user_name"],
        "", 
        $patient_name, 
        $patient_age,
        $patient_location,
        empty($patient_description) ? 'description_empty' : '', 
        $patient_description
    ],
    $patient_template
);

$response = [
    "status" => "success",
    "message" => "Patient added successfully.",
    "patient_html" => base64_encode($patient_html)
];

echo json_encode($response);



$stmt->close();
$conn->close();

?>
