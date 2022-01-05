const express = require('express');
const inputCheck = require('./utils/inputCheck');

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

app.use(express.urlencoded({extended: false}));
app.use(express.json());


app.get('/api/candidates', (req, res) => {
    const sql = `
        SELECT candidates.*, parties.name AS party_name
        FROM candidates
        LEFT JOIN parties ON candidates.party_id = parties.id;`;
    // Get all candidates 
    db.query(sql, (err, rows) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

app.get('/api/candidate/:id', (req, res) => {
    // Search for specific ID
    const sql =`
        SELECT candidates.*, parties.name AS party_name
        FROM candidates
        LEFT JOIN parties ON candidates.party_id = parties.id
        WHERE candidates.id = ?`;
    const params = [req.params.id]
    db.query(sql, params, (err, rows) => {
        if(err){
            res.status(500).json({error: err.message});
            return
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id]
    db.query(sql, params, (err, result) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
            // check if any rows were affected
        }else if(!result.affectedRows){
            res.json({ message: "Candidate not found" })
        }else{
            res.json({
                message: "Candidate deleted",
                changes: result.affectedRows,
                id: req.params.id 
            });
        }
    });
});

// Only get the body parameter from request
app.post('/api/candidate', ({body}, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');

    if (errors){
        res.status(400).json({error: errors});
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
    VALUES (?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.industry_connected]
    db.query(sql, params, (err, result) => {
        if(err){
            res.status(500).json({error: err.message});
            return
        }
        res.json({
            message: "success",
            data: body
        });
    });
});

app.get('/', (req, res) => {
    res.json({message: 'Hello World'});
});

// Default response for any other request:  404 error (not found)
app.get((req, res) => res.status(404).end());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});