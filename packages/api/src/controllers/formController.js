const FormField = require("../models/FormField");
const FormSubmission = require("../models/FormSubmission");
const User = require("../models/User");

/**
 * Get all form fields in order
 */
exports.getFormFields = async (req, res) => {
  try {
    const fields = await FormField.find().sort({ order: 1 });
    return res.status(200).json({ success: true, fields });
  } catch (error) {
    console.error("Error getting form fields:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Create a new form field
 */
exports.createFormField = async (req, res) => {
  try {
    const { label, type, placeholder, required, options } = req.body;

    // Get the max order to append this field at the end
    const maxOrderField = await FormField.findOne().sort({ order: -1 });
    const nextOrder = maxOrderField ? maxOrderField.order + 1 : 0;

    const newField = new FormField({
      label,
      type,
      placeholder,
      required,
      options,
      order: nextOrder,
    });

    await newField.save();

    return res.status(201).json({ success: true, field: newField });
  } catch (error) {
    console.error("Error creating form field:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Update a form field
 */
exports.updateFormField = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, type, placeholder, required, options, order } = req.body;

    const field = await FormField.findById(id);

    if (!field) {
      return res
        .status(404)
        .json({ success: false, message: "Field not found" });
    }

    field.label = label || field.label;
    field.type = type || field.type;
    field.placeholder =
      placeholder !== undefined ? placeholder : field.placeholder;
    field.required = required !== undefined ? required : field.required;
    field.options = options || field.options;
    field.order = order !== undefined ? order : field.order;

    await field.save();

    return res.status(200).json({ success: true, field });
  } catch (error) {
    console.error("Error updating form field:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Delete a form field
 */
exports.deleteFormField = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await FormField.findByIdAndDelete(id);

    if (!field) {
      return res
        .status(404)
        .json({ success: false, message: "Field not found" });
    }

    const remainingFields = await FormField.find().sort({ order: 1 });

    for (let i = 0; i < remainingFields.length; i++) {
      remainingFields[i].order = i;
      await remainingFields[i].save();
    }

    return res
      .status(200)
      .json({ success: true, message: "Field deleted successfully" });
  } catch (error) {
    console.error("Error deleting form field:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Submit form data
 */
exports.submitForm = async (req, res) => {
  try {
    const { phoneNumber, token, ...formData } = req.body;

    const user = await User.findOne({ phoneNumber, token });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const submission = new FormSubmission({
      phoneNumber,
      token,
      data: formData,
    });

    await submission.save();

    return res
      .status(201)
      .json({ success: true, message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get all form submissions
 */
exports.getFormSubmissions = async (req, res) => {
  try {
    const submissions = await FormSubmission.find()
      .sort({ createdAt: -1 })
      .lean();

    const fieldIds = new Set();
    submissions.forEach((sub) => {
      Object.keys(sub.data).forEach((id) => fieldIds.add(id));
    });

    const fields = await FormField.find({ _id: { $in: [...fieldIds] } }).select(
      "label"
    );

    const fieldMap = fields.reduce((acc, field) => {
      acc[field._id.toString()] = field.label;
      return acc;
    }, {});

    const populatedSubmissions = submissions.map((sub) => {
      const newData = {};
      for (const [key, value] of Object.entries(sub.data)) {
        newData[fieldMap[key] || key] = value;
      }
      return { ...sub, data: newData };
    });

    return res
      .status(200)
      .json({ success: true, submissions: populatedSubmissions });
  } catch (error) {
    console.error("Error getting form submissions:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
