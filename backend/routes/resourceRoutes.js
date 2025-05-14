const express = require('express');
const router = express.Router();
const ResourceController = require('../controllers/ResourceController');
const auth = require('../middlewares/auth');
const upload = require("../middlewares/multer");


router.get('/', ResourceController.getAll);
router.get('/:id', ResourceController.getById);
router.post('/', auth, upload.single("file"), ResourceController.uploadWithFile);
router.put('/:id', auth, ResourceController.update);
router.delete('/:id', auth, ResourceController.remove);

module.exports = router;
