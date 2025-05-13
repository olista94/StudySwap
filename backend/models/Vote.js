const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource', required: true },
  type: { type: String, enum: ['like', 'dislike'], required: true }
});

module.exports = mongoose.model('Vote', voteSchema);
