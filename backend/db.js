// const mysql = require("mysql2");
// require("dotenv").config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed ❌");
//     console.error(err);
//     return;
//   }

//   console.log("MySQL Connected Successfully ✅");
// });

// module.exports = db;

require("dotenv").config();

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: process.env.DB_SSL_CA
        ? {
              ca: process.env.DB_SSL_CA
          }
        : undefined
});

db.connect((err) => {
    if (err) {
        console.error("❌ Aiven MySQL connection failed:");
        console.error(err.message);
        return;
    }

    console.log("✅ Aiven MySQL Connected Successfully");
});

module.exports = db;