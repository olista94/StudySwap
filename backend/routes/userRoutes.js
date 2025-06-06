const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

// Rutas de autenticación
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Rutas de usuario
router.get('/me', authMiddleware, UserController.getMe);
router.put('/me', authMiddleware, UserController.updateProfile);
router.post('/me/upload-profile-image', authMiddleware, upload.single('profileImage'), UserController.uploadProfileImage);
router.put('/me/password', authMiddleware, UserController.changePassword);

// Rutas de administración
router.get('/:id', UserController.getUserById);
router.put('/:id', authMiddleware, isAdmin, UserController.updateByAdmin);
router.delete('/:id', authMiddleware, isAdmin, UserController.deleteByAdmin);

module.exports = router;
