const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/admin/users', authMiddleware, isAdmin, UserController.getAll);
router.get('/me', authMiddleware, UserController.getMe);
router.get('/:id', UserController.getUserById);
router.put('/me', authMiddleware, UserController.updateProfile);
router.put('/me/password', authMiddleware, UserController.changePassword);

module.exports = router;
