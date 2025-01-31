<?php

$user_id = $_SESSION['user_id'];
$default_group_id = $_SESSION['default_group_id'];

if ($default_group_id) {
    // Check if the user is a member of the default group and get the group name
    $stmt = $conn->prepare("
        SELECT g.group_name
        FROM groups g
        INNER JOIN groups_members gm ON gm.group_id = g.id
        WHERE gm.group_id = ? AND gm.member_id = ?
    ");
    $stmt->bind_param("ii", $default_group_id, $user_id);
    $stmt->execute();
    $stmt->bind_result($group_name);
    $stmt->fetch();

    if ($group_name) {echo $group_name;} 
    else {echo "group";}
} 
else {echo "group";}

?>
