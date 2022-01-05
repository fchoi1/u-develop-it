const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

const mysql = require('mysql2');
const { sqlPassword } = require('./sqlPassword.json');

// Connect to a database

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: sqlPassword,
    database: 'election'
});
db.query('SELECT * FROM candidates', (err, rows) => {
    console.log(rows);
})

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Hello World'});
});

// Default response for any other request:  404 error (not found)
app.get((req, res) => res.status(404).end());

app.listen(PORT, () => {
    console.log(`Server is runnign on port ${PORT}`)
});