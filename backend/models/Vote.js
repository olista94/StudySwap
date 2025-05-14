const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  value: { type: Number, enum: [1, -1], required: true }, // 1 = like, -1 = dislike
});

voteSchema.index({ resourceId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);
