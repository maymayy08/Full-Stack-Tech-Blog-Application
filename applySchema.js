const mysql = require("mysql2");
const fs = require("fs");

// Replace with your actual Render database connection settings
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Read the schema.sql file
fs.readFile("db/schema.sql", "utf8", (err, sql) => {
  if (err) {
    console.error("Error reading schema file:", err);
    return;
  }

  // Execute the SQL from the file
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error applying schema:", err);
      return;
    }

    console.log("Schema applied successfully:", result);
  });
});