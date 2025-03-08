const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "1h", // Auto expire tokens after 1 hour
  },
});

module.exports = mongoose.model("User", UserSchema);
