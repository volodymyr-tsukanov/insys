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

// SQL query to delete actor data where the first_name is 'CHRIS'

$firstName = "NICK";
$sql = "SELECT actor_id FROM actor WHERE first_name = ? LIMIT 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $firstName);
$stmt->execute();
$stmt->bind_result($actorId);
$stmt->fetch();
$stmt->close();

$sql = "DELETE FROM film_actor WHERE actor_id = $actorId; DELETE FROM actor WHERE actor_id = $actorId";

// Execute the query
if ($conn->query($sql) === TRUE) {
    echo "Records deleted successfully: 'NICK' has been removed.<br>";
} else {
    echo "Error deleting record: " . $conn->error . "<br>";
}

// Close the database connection
$conn->close();
?>
