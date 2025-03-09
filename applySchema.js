const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database connection details
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Path to the schema.sql file
const schemaPath = path.join(__dirname, 'db', 'schema.sql');

// Define a function to apply the schema
function applySchema() {
  // Read the schema.sql file
  fs.readFile(schemaPath, 'utf8', (err, sql) => {
    if (err) {
      console.error("Error reading schema file:", err);
      process.exit(1); // Exit if schema file can't be read
    }

    // Apply the SQL schema to the database
    connection.query(sql, (err, result) => {
      if (err) {
        console.error("Error applying schema:", err);
        process.exit(1); // Exit if schema application fails
      }

      console.log("Schema applied successfully:", result);
      connection.end(); // Close the database connection
    });
  });
}

// Export the function
module.exports = applySchema;