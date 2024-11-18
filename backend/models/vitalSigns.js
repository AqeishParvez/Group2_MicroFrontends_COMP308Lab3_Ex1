const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vitalSignsSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bloodPressure: String,
    heartRate: String,
    temperature: String,
    createdAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model("VitalSigns", vitalSignsSchema);
  