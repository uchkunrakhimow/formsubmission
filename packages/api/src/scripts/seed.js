require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const username = "admin";
const password = "@admin";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    try {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ username });

      if (existingAdmin) {
        console.log(`Admin user '${username}' already exists!`);
        process.exit(0);
      }

      // Create new admin
      const admin = new Admin({
        username,
        password,
      });

      await admin.save();
      console.log(`Admin user '${username}' created successfully!`);
      console.log("You can now log in to the admin dashboard.");

      // Close connection
      mongoose.connection.close();
      process.exit(0);
    } catch (error) {
      console.error("Error creating admin:", error.message);
      mongoose.connection.close();
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
