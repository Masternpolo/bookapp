const mysql = require('mysql');
require('dotenv').config();

// SQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) console.error(err);
  else console.log("connected to database");
});

module.exports = db;