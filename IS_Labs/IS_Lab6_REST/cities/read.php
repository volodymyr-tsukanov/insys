<?php
// Allow requests from all origins and specify JSON content type with UTF-8 charset
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// Allow additional methods for pre-flight requests.
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include the database configuration and Cities class
include_once '../config/database.php';
include_once '../class/cities.php';

// Create a new Database object and establish a connection
$database = new Database();
$db = $database->getConnection();

// Instantiate the Cities class with the database connection
$cities = new Cities($db);

// Determine the request method and route accordingly
$method = $_SERVER['REQUEST_METHOD'];

// For PUT and DELETE, you may need to retrieve the raw input data
$input = json_decode(file_get_contents("php://input"), true);

// Switch based on request type
switch ($method) {
    case 'GET':
        // Handle GET: either a single record (if id passed as GET) or all records.
        $cities->id = (isset($_GET['id']) && $_GET['id']) ? $_GET['id'] : 0;
        $result = $cities->read();
        if ($result->num_rows > 0) {
            $cityRecords = array();
            $cityRecords["cities"] = array();
            while ($city = $result->fetch_assoc()) {
                extract($city);
                $cityDetails = array(
                    "ID" => $ID,
                    "Name" => $Name,
                    "CountryCode" => $CountryCode,
                    "District" => $District,
                    "Population" => $Population
                );
                array_push($cityRecords["cities"], $cityDetails);
            }
            http_response_code(200);
            echo json_encode($cityRecords);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No item found."));
        }
        break;

    case 'POST':
        // Handle POST: create a new record, data from JSON payload
        // Ensure all required fields are provided
        if (isset($input['Name'], $input['CountryCode'], $input['District'], $input['Population'])) {
            $cities->name = $input['Name'];
            $cities->countryCode = $input['CountryCode'];
            $cities->district = $input['District'];
            $cities->population = $input['Population'];
            if ($cities->create()) {
                http_response_code(201);
                echo json_encode(array(
                    "message" => "City was created.",
                    "ID" => $cities->id
                ));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create city."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data."));
        }
        break;

    case 'PUT':
        // Handle PUT: update an existing record.
        // We assume the ID is passed as a query parameter or within the JSON data.
        $cities->id = isset($_GET['id']) ? $_GET['id'] : (isset($input['ID']) ? $input['ID'] : 0);
        if ($cities->id && isset($input['Name'], $input['CountryCode'], $input['District'], $input['Population'])) {
            $cities->name = $input['Name'];
            $cities->countryCode = $input['CountryCode'];
            $cities->district = $input['District'];
            $cities->population = $input['Population'];
            if ($cities->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "City was updated."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update city."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Incomplete data or missing city ID."));
        }
        break;

    case 'DELETE':
        // Handle DELETE: remove a record by id.
        // The id can be passed as a query string or through the JSON payload.
        $cities->id = isset($_GET['id']) ? $_GET['id'] : (isset($input['ID']) ? $input['ID'] : 0);
        if ($cities->id) {
            if ($cities->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "City was deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete city."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "City ID is missing."));
        }
        break;

    default:
        // Method not supported
        http_response_code(405);
        echo json_encode(array("message" => "Method Not Allowed."));
        break;
}
?>
