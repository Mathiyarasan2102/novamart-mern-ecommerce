const mongoose = require("mongoose");

const FeatureSchema = new mongoose.Schema(
  {
    image: String,
    type: {
      type: String,
      default: "slider", // 'slider', 'login', 'account'
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feature", FeatureSchema);