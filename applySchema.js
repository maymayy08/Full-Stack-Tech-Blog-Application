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

// Function to apply the schema
function applySchema() {
  // First drop the existing database, then create it again
  connection.query('DROP DATABASE IF EXISTS techblog_db;', (err, result) => {
    if (err) {
      console.error('Error dropping database:', err);
      connection.end();
      process.exit(1); // Exit if dropping the database fails
    }

    console.log('Database dropped (if it existed).');

    // Now create the database
    connection.query('CREATE DATABASE techblog_db;', (err, result) => {
      if (err) {
        console.error('Error creating database:', err);
        connection.end();
        process.exit(1); // Exit if creating the database fails
      }

      console.log('Database created successfully.');

      // Now apply the schema to the newly created database
      fs.readFile(schemaPath, 'utf8', (err, sql) => {
        if (err) {
          console.error('Error reading schema file:', err);
          connection.end();
          process.exit(1); // Exit if schema file can't be read
        }

        // Apply the SQL schema to the database
        connection.query(sql, (err, result) => {
          if (err) {
            console.error('Error applying schema:', err);
            connection.end();
            process.exit(1); // Exit if applying the schema fails
          }

          console.log('Schema applied successfully.');
          connection.end(); // Close the database connection
        });
      });
    });
  });
}

// Export the function
module.exports = applySchema;
