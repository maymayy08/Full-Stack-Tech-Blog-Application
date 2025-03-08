// connection.js
const { Sequelize } = require('sequelize');

// Use DATABASE_URL for production environment (Clever Cloud or other hosting services)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // Change to 'mysql' if you're using MySQL
  logging: false, // Disable logging (optional)
  dialectOptions: {
    ssl: {
      require: true, // For SSL connection in production environments (like Clever Cloud)
      rejectUnauthorized: false, // To prevent certificate issues
    },
  },
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
