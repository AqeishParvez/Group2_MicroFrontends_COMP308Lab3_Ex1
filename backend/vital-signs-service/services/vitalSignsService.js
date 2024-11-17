const VitalSign = require('../models/vitalSignsModel');

const addVitalSign = async (vitalSign) => {
  return await VitalSign.create(vitalSign);
};

const updateVitalSign = async (id, updatedData) => {
  return await VitalSign.findByIdAndUpdate(id, updatedData, { new: true });
};

const getVitalSigns = async (userId) => {
  return await VitalSign.find({ userId });
};

module.exports = { addVitalSign, updateVitalSign, getVitalSigns };