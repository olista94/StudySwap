const TutorOffer = require("../models/TutorOffer");

exports.getMyOffers = async (req, res) => {
  try {
    const offers = await TutorOffer.find({ userId: req.user.id });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener tus clases" });
  }
};

exports.create = async (req, res) => {
  try {
    const offer = new TutorOffer({ ...req.body, userId: req.user.id });
    await offer.save();
    res.status(201).json(offer);
  } catch (err) {
    res.status(500).json({ message: "Error al crear oferta", error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const offers = await TutorOffer.find().populate("userId", "name email profileImage");
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener ofertas" });
  }
};

exports.remove = async (req, res) => {
  try {
    const offer = await TutorOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Oferta no encontrada" });
    if (offer.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }
    await offer.deleteOne();
    res.json({ message: "Oferta eliminada" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar oferta" });
  }
};

exports.update = async (req, res) => {
  try {
    const offer = await TutorOffer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: "Oferta no encontrada" });
    if (offer.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "No autorizado" });
    }
    Object.assign(offer, req.body);
    await offer.save();
    res.json(offer);
  } catch (err) {
    console.error("❌ Error en update de TutorOffer:", err);
    res.status(500).json({ message: "Error al actualizar oferta", error: err.message });
  }
};
