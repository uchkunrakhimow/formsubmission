const mongoose = require("mongoose");

const FormFieldSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["text", "number", "email", "date", "select"],
    default: "text",
  },
  placeholder: String,
  required: {
    type: Boolean,
    default: false,
  },
  options: [String], // For select fields
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("FormField", FormFieldSchema);
