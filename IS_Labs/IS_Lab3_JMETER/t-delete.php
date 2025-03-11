<?php
$servername = "mysql";
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

// SQL query to delete actor data where the first_name is 'CHRIS'
$sql = "DELETE FROM actor WHERE first_name = 'NICK' LIMIT 1";

// Execute the query
if ($conn->query($sql) === TRUE) {
    echo "Records deleted successfully: 'NICK' has been removed.<br>";
} else {
    echo "Error deleting record: " . $conn->error . "<br>";
}

// Close the database connection
$conn->close();
?>
