const express = require('express');
const router = express.Router();
const VoteController = require('../controllers/VoteController');
const auth = require('../middlewares/auth');

router.get('/resources/:id', VoteController.getVotes);
router.post('/resources/:id/vote', auth, VoteController.vote);
router.delete('/resources/:id/vote', auth, VoteController.removeVote);

module.exports = router;
