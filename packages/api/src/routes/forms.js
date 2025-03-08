const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const { adminAuth } = require("../middleware/auth");

// Public routes
router.get("/fields", formController.getFormFields);
router.post("/submit", formController.submitForm);

// Admin routes
router.post("/fields", adminAuth, formController.createFormField);
router.put("/fields/:id", adminAuth, formController.updateFormField);
router.delete("/fields/:id", adminAuth, formController.deleteFormField);
router.get("/submissions", adminAuth, formController.getFormSubmissions);

module.exports = router;
