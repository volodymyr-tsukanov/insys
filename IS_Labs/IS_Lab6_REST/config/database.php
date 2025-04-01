<?php
class Database {
    // Database connection parameters
    private $host = 'localhost';
    private $user = 'root';
    private $password = "";
    private $database = "nazwa_bazy";

    // Method to establish a connection to the database
    public function getConnection() {
        // Create a new mysqli connection using the provided credentials
        $conn = new mysqli($this->host, $this->user, $this->password, $this->database);

        // Check if the connection failed
        if ($conn->connect_error) {
            // If there is an error, terminate the script with an error message
            die("Error: Failed to connect to MySQL: " . $conn->connect_error);
        } else {
            // If successful, return the connection object
            return $conn;
        }
    }
}
?>
