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

    // READ: fetch city records (if id is provided, only that city)
    public function read() {
        if ($this->id) {
            $stmt = $this->conn->prepare("SELECT * FROM " . $this->citiesTable . " WHERE ID = ?");
            $stmt->bind_param("i", $this->id);
        } else {
            $stmt = $this->conn->prepare("SELECT * FROM " . $this->citiesTable);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        return $result;
    }

    // CREATE: Insert a new city record from object properties
    public function create() {
        $stmt = $this->conn->prepare("INSERT INTO " . $this->citiesTable . " (Name, CountryCode, District, Population) VALUES (?, ?, ?, ?)");
        // Bind parameters: name, countryCode, district, population
        $stmt->bind_param("sssi", $this->name, $this->countryCode, $this->district, $this->population);
        if ($stmt->execute()) {
            // Get last inserted ID and assign it to object
            $this->id = $stmt->insert_id;
            return true;
        }
        return false;
    }

    // UPDATE: Update a city record based on the id set in object and other properties
    public function update() {
        // Ensure id is set for update
        if (!$this->id) {
            return false;
        }
        $stmt = $this->conn->prepare("UPDATE " . $this->citiesTable . " SET Name = ?, CountryCode = ?, District = ?, Population = ? WHERE ID = ?");
        $stmt->bind_param("sssii", $this->name, $this->countryCode, $this->district, $this->population, $this->id);
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // DELETE: Delete a city record based on the id property
    public function delete() {
        if (!$this->id) {
            return false;
        }
        $stmt = $this->conn->prepare("DELETE FROM " . $this->citiesTable . " WHERE ID = ?");
        $stmt->bind_param("i", $this->id);
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
