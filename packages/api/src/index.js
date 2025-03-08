require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Route imports
const authRoutes = require("./routes/auth");
const formRoutes = require("./routes/forms");

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/forms", formRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../ui/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../ui/build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
