<?php
class Cities {
    // Database table name for cities
    private $citiesTable = "city";

    // Public properties corresponding to table columns
    public $id;
    public $name;
    public $countryCode;
    public $district;
    public $population;

    // Database connection container
    private $conn;

    // Constructor that accepts the database connection
    public function __construct($db) {
        $this->conn = $db;
    }

    // Function to read cities from the database
    function read() {
        // Check if an ID is provided to fetch a specific city record
        if ($this->id) {
            // Prepare a statement to select a specific city by ID
            $stmt = $this->conn->prepare("SELECT * FROM " . $this->citiesTable . " WHERE ID = ?");
            // Bind the city ID as an integer parameter
            $stmt->bind_param("i", $this->id);
        } else {
            // Prepare a statement to select all cities
            $stmt = $this->conn->prepare("SELECT * FROM " . $this->citiesTable);
        }
        // Execute the statement
        $stmt->execute();
        // Get and return the result from the executed statement
        $result = $stmt->get_result();
        return $result;
    }
}
?>
