<?php
// Example of updating the actor table: all first_name 'ADAM' will be updated to 'CHRIS'

$servername = "localhost";
$username = "sakila2";  // Database username
$password = "pass";     // Database password
$database = "sakila";   // Database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

echo "Database connected successfully, username: " . $username . "<br><br>";

// SQL query to update actors where first_name is 'ADAM'
$sql = "UPDATE actor SET first_name = 'CHRIS' WHERE first_name = 'ADAM'";

// Execute the query
if ($conn->query($sql) === TRUE) {
    echo "Table actor updated – all 'ADAM' changed to 'CHRIS'.";
} else {
    echo "Error updating record: " . $conn->error;
}

// Close the database connection
$conn->close();
?>
