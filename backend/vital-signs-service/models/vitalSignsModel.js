const mongoose = require('mongoose');

const vitalSignsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bloodPressure: String,
  heartRate: Number,
  temperature: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VitalSign', vitalSignsSchema);
