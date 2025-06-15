<?php
$servername = "localhost";  //for docker set to 'mysql'
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

// SQL query to fetch actor data
$sql = "SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name";

// Execute the query
$result = $conn->query($sql);

// Check if there are any results
if ($result->num_rows > 0) {
    // Output data for each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["actor_id"] . " - Name: " . $row["first_name"] . " " . $row["last_name"] . "<br>";
    }
} else {
    echo "0 results";
}

// Close the database connection
$conn->close();
?>
