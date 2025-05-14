const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/CommentController');
const auth = require('../middlewares/auth');

router.get('/resources/:id/comments', CommentController.getByResource);
router.get('/resources/:id/comments/count', CommentController.countByResource);
router.post('/resources/:id/comments', auth, CommentController.create);
router.delete('/:id', auth, CommentController.remove);

module.exports = router;
