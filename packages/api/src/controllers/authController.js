const User = require("../models/User");
const Admin = require("../models/Admin");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

/**
 * Generate a token for a phone number and save to database
 */
exports.generateToken = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    const token = uuidv4();

    let user = await User.findOne({ phoneNumber });

    if (user) {
      user.token = token;
      user.createdAt = Date.now();
    } else {
      user = new User({
        phoneNumber,
        token,
      });
    }

    await user.save();

    return res.status(200).json({
      success: true,
      token,
      url: `${process.env.BASE_URL}/form?phone=${phoneNumber}&token=${token}`,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Verify a token against a phone number
 */
exports.verifyToken = async (req, res) => {
  try {
    const { phoneNumber, token } = req.body;

    if (!phoneNumber || !token) {
      return res.status(400).json({
        success: false,
        message: "Phone number and token are required",
      });
    }

    // Look up the user
    const user = await User.findOne({ phoneNumber, token });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Token verified successfully" });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Admin login
 */
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("Error in admin login:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
