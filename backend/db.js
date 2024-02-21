const mysql = require("mysql");
// Create MySQL connection

const db = mysql.createConnection({
  host: "192.168.1.65",
  user: "mohan",
  password: "Mohan@123",
  database: "fcommerce",
  connectTimeout: 30000,
});

// Connect to MySQL

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL");
});

module.exports = db;
