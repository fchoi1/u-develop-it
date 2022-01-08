const router = require('express').Router();
const db = require('../../db/connection');

// get all parties
router.get('/party', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        err ? res.status(500).json({error: err.message})
            : res.json({
                message: 'success',
                data: rows
            });
    });
});

// get a single party
router.get('/party/:id', (req, res) => {
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

// Delete a party
router.delete('/party/:id', (req, res) => {
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

module.exports = router;
