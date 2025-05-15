const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const TutorOfferController = require("../controllers/TutorOfferController");

router.post("/", auth, TutorOfferController.create);
router.get("/", TutorOfferController.getAll);
router.delete("/:id", auth, TutorOfferController.remove);

module.exports = router;
