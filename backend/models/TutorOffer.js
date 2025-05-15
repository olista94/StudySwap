const mongoose = require("mongoose");

const tutorOfferSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  modality: { type: String, enum: ["presencial", "online", "ambas"], default: "online" },
  availability: { type: String }, // texto libre: "Tardes entre semana", etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TutorOffer", tutorOfferSchema);
