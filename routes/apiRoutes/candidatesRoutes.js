const router = require('express').Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all candidates
router.get('/candidates', (req, res) => {
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

// Get a single candidate
router.get('/candidate/:id', (req, res) => {
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
router.delete('/candidate/:id', (req, res) => {
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

// Put/Change candidate party
router.put('/candidate/:id', (req, res) => {
    // Check for valid party id supplied
    const errors = inputCheck(req.body, 'party_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE candidates SET party_id = ?
        WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
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

// Create a candidate
router.post('/candidate', ({body}, res) => {
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

module.exports = router;
