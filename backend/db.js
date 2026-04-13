const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.getConnection()
    .then((connection) => {
        console.log("✅ DB Connected");
        connection.release();
    })
    .catch((err) => {
        console.error("DB connection error:", err);
    });

module.exports = db;