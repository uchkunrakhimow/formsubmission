const mongoose = require("mongoose");

const FormSubmissionSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FormSubmission", FormSubmissionSchema);
