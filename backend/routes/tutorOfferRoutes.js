const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const TutorOfferController = require("../controllers/TutorOfferController");
const isAdmin = require("../middlewares/isAdmin");

// Rutas de usuario
router.post("/", auth, TutorOfferController.create);
router.get("/", TutorOfferController.getAll);
router.get("/my-classes", auth, TutorOfferController.getMyOffers);
router.put("/:id", auth, TutorOfferController.update);
router.delete("/:id", auth, TutorOfferController.remove);

// Rutas de administración
router.get("/admin/manage-tutors", auth, isAdmin, TutorOfferController.getAll);

module.exports = router;
