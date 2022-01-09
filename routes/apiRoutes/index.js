const express = require('express');

const router = express.Router();

// Candidate routes
router.use(require('./candidatesRoutes'));
// Party Routes
router.use(require('./partyRoutes'));
// Voter Routes
router.use(require('./voterRoutes'));
// Vote Routes
router.use(require('./voteRoutes'));

module.exports = router;