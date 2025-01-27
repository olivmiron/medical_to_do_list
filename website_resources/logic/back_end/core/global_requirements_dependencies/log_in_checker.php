<?php
    require $_SERVER['DOCUMENT_ROOT'] . "/website_resources/logic/back_end/core/database_connect.php";

    // $_SESSION:   logged_in, user_id, user_email, user_name

    // I. check log in status
    // II. if logged in, populate: user_id, user_email, user_name


    if (isset($_COOKIE["log_in_cookie"])) {
        $log_in_cookie = unserialize($_COOKIE["log_in_cookie"]);
        // var_dump($log_in_cookie);
        $user_id = $log_in_cookie["user_id"];
        // echo "user_id: " . $user_id;
        $user_token = $log_in_cookie["user_token"];

        $stmt_verify = $conn->prepare("SELECT * FROM accounts WHERE id = ? AND FIND_IN_SET(?, user_tokens)");
        $stmt_verify->bind_param("is", $user_id, $user_token);
        $stmt_verify->execute();
        $result = $stmt_verify->get_result();
        $sql_row = $result->fetch_assoc();
        
        var_dump($sql_row);

        if ($sql_row) {
            $_SESSION["logged_in"] = true;
            $_SESSION["user_id"] = $sql_row["id"];
            $_SESSION["user_name"] = $sql_row["name"];
            $_SESSION["user_email"] = $sql_row["email"];

            
        // create random token for log in persitence

        $new_token = (string) bin2hex(random_bytes(20));

        $old_token = $user_token;
        $tokens_array = explode(",", $sql_row["user_tokens"]);
        $tokens_array[array_search($old_token, $tokens_array)] = $new_token;
        $updated_tokens = implode(",", $tokens_array);

        $stmt_update = $conn->prepare("UPDATE accounts SET user_tokens = ? WHERE id = ?");
        $stmt_update->bind_param("si", $updated_tokens, $sql_row["id"]);
        $stmt_update->execute();

        // and please reset the expiry date of the cookie
        setcookie("log_in_cookie", ["user_id" => $sql_row["id"], "user_token" => $new_token], time() + (86400 * 14), "/");

        $logged_in = true;
        $_SESSION["logged_in"] = "2";

        } else {
            $_SESSION["logged_in"] = false;
            $logged_in = "1";
        }
    }
    else {$_SESSION["logged_in"] = false;
        $logged_in = "0";}

    echo "logged in or not: " . var_dump($_SESSION["logged_in"]) . " " . $logged_in;
?>