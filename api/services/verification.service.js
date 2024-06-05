const VerificationModel = require("../models/verification");

module.exports = {
  createVerification: async (updateData) => {
    try {
      const verification = await VerificationModel.create(updateData);
      return { success: true, verification };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  getVerificationByQuery: async (query) => {
    try {
      const verification = await VerificationModel.find(query);
      if (!verification) return { success: false };
      return { success: true, verification };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  getVerificationById: async (id) => {
    try {
      const verification = await VerificationModel.findById(id);
      if (!verification) return { success: false };
      return { success: true, verification };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  updateVerificationById: async (id, newVerification) => {
    try {
      const updatedVerification = await VerificationModel.updateById(
        id,
        newVerification
      );
      return { success: true, updatedVerification };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};
