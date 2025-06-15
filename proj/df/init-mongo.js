db = db.getSiblingDB('insys'); // This creates the DB if it doesn't exist
db.createCollection('initCollection'); // Ensures some structure is created
