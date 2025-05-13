const express = require('express');
const router = express.Router();
const VoteController = require('../controllers/VoteController');
const auth = require('../middlewares/auth');

router.post('/resources/:id/vote', auth, VoteController.vote);
router.delete('/resources/:id/vote', auth, VoteController.removeVote);

module.exports = router;
