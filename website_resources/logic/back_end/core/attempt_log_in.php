<?php
  require_once $_SERVER['DOCUMENT_ROOT'] . "/Composer/vendor/autoload.php";
  require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

$client = new Google_Client(['client_id' => '64629051096-v5i6qsdt1mccdd8qimne5v1496o839tj.apps.googleusercontent.com']);
$id_token = json_decode(file_get_contents('php://input'), true)['id_token'];

function throw_message($message_parameters, $error_or_not) { // throw_message(["status" => "error", "message" => "Invalid id token"], true);
    echo json_encode($message_parameters);
    if($error_or_not == true) {die();}
}

try {
    $payload = $client->verifyIdToken($id_token);
    if ($payload) {
        // $userid = $payload['sub'];
        // Create or update user session

        $google_client_user = [
            "user_id" => "0",
            "user_name" => $payload["name"],
            "user_email" => $payload["email"], 
            "picture_url" => $payload["picture"]
        ];
    } else {
        throw_message(["status" => "error", "message" => "Invalid id token"], true);
    }
} catch (Exception $e) {
    throw_message(["status" => "error", "message" => $e->getMessage()], true);
}


// create random token for log in persitence

$new_token = (string) bin2hex(random_bytes(20));

// verify if user exists

$stmt_verify = $conn->prepare("SELECT * FROM accounts where email = ?");
$stmt_verify->bind_param("s", $google_client_user["user_email"]);
$stmt_verify->execute();
$result = $stmt_verify->get_result(); // get the mysqli result
$sql_row = $result->fetch_assoc();

if(mysqli_num_rows($result) < 1) {
    // account not found
    $stmt_create = $conn->prepare("INSERT INTO accounts (name, email, user_tokens, date_created, date_updated) VALUES (?, ?, ?, NOW(), NOW())");
    $stmt_create->bind_param("sss", $google_client_user["user_name"], $google_client_user["user_email"], $new_token);
    $stmt_create->execute();

    $new_user_id = $conn->insert_id;
    $sql_row = ["id" => $new_user_id];

    // Download and save user picture
    $imageData = file_get_contents($google_client_user["picture_url"]);
    file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/content_resources/user_pictures/" . $new_user_id . ".png", $imageData);
}
else {
    // check last_updated_date
    // if later than one week, change name and re-download picture

    $update_last_updated = false;

    if (strtotime($sql_row["date_updated"]) < strtotime('-1 week')) {

    // change name and last updated date
    
    $stmt_verify = $conn->prepare("UPDATE accounts SET name = ?, date_updated = NOW() WHERE email = ?");
    $stmt_verify->bind_param("ss", $google_client_user["user_name"], $google_client_user["user_email"]);
    $stmt_verify->execute();


    // re-download picture
    $imageData = file_get_contents($google_client_user["picture_url"]);
    file_put_contents($_SERVER['DOCUMENT_ROOT'] . "/content_resources/user_pictures/" . $sql_row["id"] . ".png", $imageData);

        $update_last_updated = true;

    }

    // update random token

    $stmt_verify = $conn->prepare("UPDATE accounts SET user_tokens = CONCAT(user_tokens, ',', ?) " . ($update_last_updated ? ", date_updated = NOW()" : "") . " WHERE email = ?");
    $stmt_verify->bind_param("ss", $new_token, $google_client_user["user_email"]);
    $stmt_verify->execute();

}

// if yess, create $_SESSION

$_SESSION["user_id"] = $sql_row["id"];
$_SESSION["user_name"] = $google_client_user["user_name"];
$_SESSION["user_email"] = $google_client_user["user_email"];
$_SESSION["user_token"] = $new_token;

// set persistence cookie

setcookie("log_in_cookie", serialize(["user_id" => $sql_row["id"], "user_token" => $new_token]), time() + (86400 * 14), "/");


throw_message(["status" => "success", "message" => "Successfully logged in", "user_name" => $google_client_user["user_name"], "picture" => $google_client_user["picture_url"]], false);


?>
