const express = require('express');
const inputCheck = require('./utils/inputCheck');

// Express 
const PORT = process.env.PORT || 3001;
const app = express();

// SQL
const mysql = require('mysql2');
const { sqlPassword } = require('./sqlPassword.json');

// Connect to a database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: sqlPassword,
    database: 'election'
});

//Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/api/party', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        err ? res.status(500).json({error: err.message})
            : res.json({
                message: 'success',
                data: rows
            });
    });
});

app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, rows) => {
        err ? res.status(500).json({error: err.message})
            : res.json({
                message: 'success',
                data: rows
            });
    });
});

app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if(err){
            res.status(400).json({error: res.message});
        } else if (!result.affectedRows){ // Check to see if any rows were deleted
            res.json({message: 'Party Not Found!'});
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

// Get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `
        SELECT candidates.*, parties.name AS party_name
        FROM candidates
        LEFT JOIN parties ON candidates.party_id = parties.id;`;
    // Get all candidates 
    db.query(sql, (err, rows) => {
        err ? res.status(500).json({error: err.message})
            : res.json({
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
        err ? res.status(500).json({error: err.message}) 
            : res.json({
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

// Put/Change parties
app.put('/api/candidate/:id', (req, res) => {
    const sql = `UPDATE candidates SET party_id = ?
        WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    // Check for valid party id supplied
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    db.query(sql, params, (err, result) => {
        if(err) res.status(400).json({message: err.message})
        else if (!result.affectedRows){
            res.json({ message: 'Candidate Not Found' });
        }else{
            res.json({
                message: 'success',
                changes: result.affectedRows,
                data: req.body
            });
        }
    })
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
        err ? res.status(500).json({error: err.message}) 
            : res.json({
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