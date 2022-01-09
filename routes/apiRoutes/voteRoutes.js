const router = require('express').Router();
const { json } = require('express');
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get votes
router.get('/votes', (req, res) => {
    const sql =`SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS count
        FROM votes
        LEFT JOIN candidates ON votes.candidate_id = candidates.id
        LEFT JOIN parties ON candidates.party_id = parties.id
        GROUP BY candidate_id ORDER BY count DESC;`;
    db.query(sql, (err, rows) => {
        err ? res.status(500).json({message: err.message})
            : res.json({
                message: 'sucess',
                data: rows
            });
    });
});

// Add new votes to vote tables
router.post('/vote', ({body}, res) => {
    const errors = inputCheck(body, 'voter_id', 'candidate_id');
    if (errors){
        res.status(400).json({error: errors});
        return
    }
    const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)`;
    const params = [body.voter_id, body.candidate_id];
    db.query(sql, params, (err, result) => {
        err ? res.status(400).json({message: err.message})
            : res.json({
                message: 'success',
                data: body,
                changes: result.affectedRows
        });
    });
});


module.exports = router;