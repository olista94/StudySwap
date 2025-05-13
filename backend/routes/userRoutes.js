const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/me', authMiddleware, UserController.getMe);
router.get('/:id', UserController.getUserById);

module.exports = router;
