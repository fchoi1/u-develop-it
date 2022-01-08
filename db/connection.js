const mysql = require('mysql2');
const { sqlPassword } = require('../sqlPassword.json');

// Connect to a database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: sqlPassword,
    database: 'election'
});

module.exports = db;
