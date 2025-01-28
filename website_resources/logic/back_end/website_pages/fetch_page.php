<?php $initial_load = false; require $_SERVER["DOCUMENT_ROOT"] . "/website_resources/logic/back_end/core/global_requirements.php";

$page_to_load = $_GET["page"];

// js handles views; just load page from folder if $page_to_load is in $pages_array
if(in_array($page_to_load, $pages_array)) {
    include $_SERVER["DOCUMENT_ROOT"] . "/" . $pages_uris[$page_to_load];
}


?>