<?php
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

$mw = array(
    "DOGBARK", "DOGBONE", "DOGTAIL", "BALLPARK", "BALLGAME", "BALLHOLE",
    "POKEMON", "POKEMASTER", "POKEBALL", "APPLE", "GUITAR", "SUNFLOWER",
    "MOUNTAIN", "OCEAN", "COMPUTER", "MOBILE", "TREASURE", "ZEBRA",
    "VAMPIRE", "DINOSAUR", "UNIVERSE", "MOON", "GALAXY", "PLANET",
    "PYTHON", "RUBIK", "HAMBURGER", "COFFEE", "PIRATE", "CUPCAKE",
    "JUNGLE", "TOAST", "BICYCLE", "RAINBOW", "CHOCOLATE", "WALNUT",
    "COCONUT", "ROBOT", "ANDROID", "FALCON", "WOLF", "TIGER", "LION", "PENGUIN",
    "SNOWMAN", "COFFEE", "CLOUD", "MOUNTAIN", "KEYBOARD", "SOFTWARE", "CLOUDCOMPUTING",
    "WIFI", "FIREWALL", "FLASH", "ACORN", "CATERPILLAR", "DRAGON", "UNICORN",
    "JET", "ASTEROID", "OCTOPUS", "SUSHI", "NINJA", "ZEBRA", "PIRATE", "LANTERN",
    "MYSTERY", "BUBBLE", "LEMONADE", "ICECREAM", "CANDY", "DOLPHIN", "KANGAROO", "BEAR",
    "ELEPHANT", "GIRAFFE", "TROOPER", "BUNNY", "MOLE", "TOADSTOOL", "SQUIRREL", "YOGA",
    "MARTIAN", "ALIEN", "CAVEMAN", "CYCLOPS", "SMURF", "GHOST", "SPIRIT", "WIZARD", "NINJA",
    "KILLER", "CROOK", "MONSTER", "BASTARD", "VIRGIN", "VIKING", "BRAINROT", "GOOFBALL",
    "BRAINROT", "SKIBIDI", "RIZZ", "SASSY", "VIBE", "SWAG", "HYPE", "GRIME", "BANTER",
    "CHATTER", "BUZZ", "CHIRP", "CLIQUE", "DRIP", "FLAIR", "FUNK", "GAB", "GLOSS", "GROOVE", "JIVE"
);
$first_name = $mw[array_rand($mw)];
$last_name = $mw[array_rand($mw)];

// SQL query to insert a new actor with a randomly selected first and last name
$sql = "INSERT INTO actor (first_name, last_name) VALUES ('$first_name', '$last_name')";

// Execute the query
if ($conn->query($sql) === TRUE) {
    echo "New actor added successfully: $first_name $last_name<br>";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close the database connection
$conn->close();
?>
