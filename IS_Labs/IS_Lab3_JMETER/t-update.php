<?php
$servername = "localhost";
$username = "sakila1";
$password = "pass";
$database = "sakila";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

echo "Database connected successfully, username: " . $username . "<br><br>";

// SQL query to update actor data, changing first_name 'ADAM' to 'CHRIS'
$sql = "UPDATE actor SET last_name = 'EVANS' WHERE first_name = 'CHRIS' LIMIT 1";

// Execute the query
if ($conn->query($sql) === TRUE) {
    echo "Records updated successfully: 'CHRIS' is now cap.<br>";
} else {
    echo "Error updating record: " . $conn->error . "<br>";
}

// Close the database connection
$conn->close();
?>
