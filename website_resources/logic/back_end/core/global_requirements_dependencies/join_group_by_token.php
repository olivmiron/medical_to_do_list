<?php

$join_group_by_token_error_pass = true;

$deocded_join_group_data =json_decode(urldecode($_GET["join_group_token"]), true);  // structure: ["group_id" -> xxx, "token" -> yyy]

if(!isset($deocded_join_group_data["group_id"]) or !isset($deocded_join_group_data["token"])) {$join_group_by_token_error_pass = false;}


if($join_group_by_token_error_pass) {

    $group_id = $deocded_join_group_data["group_id"];
    $token = $deocded_join_group_data["token"];
    $user_id = $_SESSION["user_id"];


        // Check if the token is valid and not expired
    $stmt = $conn->prepare("SELECT id FROM groups_entry_tokens WHERE group_id = ? AND token = ? AND date_created >= NOW() - INTERVAL 3 MINUTE
    ");
    $stmt->bind_param("is", $group_id, $token);
    $stmt->execute();
    $stmt->bind_result($id);
    $stmt->fetch();
    $stmt->close();

    if ($id) {

        //please check if already memeber of the group
        $stmt = $conn->prepare("SELECT id FROM groups_members WHERE group_id = ? AND member_id = ?");
        $stmt->bind_param("ii", $group_id, $user_id);
        $stmt->execute();
        $stmt->bind_result($existing_membership);
        $stmt->fetch();
        $stmt->close();

        if ($existing_membership) {
            $quick_join_group_message = "already_joined_group";
        }
        else {
            //if not, join group:

                        
            // Token is valid, add the user to the group
            $stmt = $conn->prepare("INSERT INTO groups_members (group_id, member_id, date_joined) VALUES (?, ?, NOW())");
            $stmt->bind_param("ii", $group_id, $user_id);
            $stmt->execute();
            $stmt->close();

            $stmt = $conn->prepare("UPDATE accounts SET default_group_id = ? WHERE id = ?");
            $stmt->bind_param("ii", $group_id, $user_id);
            $stmt->execute();
            $stmt->close();

            $_SESSION["default_group_id"] = $group_id;


            
            $quick_join_group_message = "joined";

        }
                
                delete_token_from_sql();

    } else {
    delete_token_from_sql();
    // throw_error("Invalid or expired token.");
    $quick_join_group_message = "invalid_token";
    }
}
else {
    
    // $quick_join_group_message = "error";
}

function delete_token_from_sql() {global $conn;global $group_id, $token;
    // Token is used, invalid or expired, delete it if it exists
    $stmt = $conn->prepare("DELETE FROM groups_entry_tokens WHERE group_id = ? AND token = ?");
    $stmt->bind_param("is", $group_id, $token);
    $stmt->execute();
    $stmt->close();
}

?>