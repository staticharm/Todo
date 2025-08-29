const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo"
});

db.connect(error => {
    if (error) throw error;
    console.log("DB connected");
});

module.exports = db;