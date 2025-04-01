<?php
// Allow requests from all origins and specify JSON content type with UTF-8 charset
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include the database configuration and Cities class
include_once '../config/database.php';
include_once '../class/cities.php';

// Create a new Database object and establish a connection
$database = new Database();
$db = $database->getConnection();

// Instantiate the Cities class with the database connection
$cities = new Cities($db);

// Set the city ID from the GET parameter if provided; otherwise, use 0 (read all cities)
$cities->id = (isset($_GET['id']) && $_GET['id']) ? $_GET['id'] : '0';

// Execute the query to read city records
$result = $cities->read();

// Check if any records were returned
if ($result->num_rows > 0) {
    $cityRecords = array();
    $cityRecords["cities"] = array();

    // Loop through each record and store all city details in the output array
    while ($city = $result->fetch_assoc()) {
        // Using extract() to convert array keys into variables, e.g., $ID, $Name, etc.
        extract($city);

        // Build the associative array with all city properties
        $cityDetails = array(
            "ID"          => $ID,
            "Name"        => $Name,
            "CountryCode" => $CountryCode,
            "District"    => $District,
            "Population"  => $Population
        );

        // Add the current city details to the cities array
        array_push($cityRecords["cities"], $cityDetails);
    }

    // Set response code to 200 OK and return the JSON encoded records
    http_response_code(200);
    echo json_encode($cityRecords);
} else {
    // Set response code to 404 Not Found and echo a message in JSON format
    http_response_code(404);
    echo json_encode(
        array("message" => "No item found.")
    );
}
?>
