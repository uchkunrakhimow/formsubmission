const User = require("../models/User");
const Admin = require("../models/Admin");
const short = require("short-uuid");
const jwt = require("jsonwebtoken");
const { sendSMS } = require("../service/sms.service");

/**
 * Generate a token for a phone number and save to database
 */

exports.generateToken = async (req, res) => {
  const baseURL = process.env.BASE_URL;
  const token = short.generate();
  let { phoneNumber, branchName } = req.body;

  if (phoneNumber.length < 9) {
    res
      .status(400)
      .json({ success: false, message: "The phone number is too short" });
  }

  try {
    phoneNumber = phoneNumber.replace(/\D/g, "");

    if (phoneNumber.startsWith("998")) {
      phoneNumber = phoneNumber.slice(0, 12);
    } else {
      phoneNumber = "998" + phoneNumber;
    }

    if (phoneNumber.length > 12) {
      res
        .status(400)
        .json({ success: false, message: "The phone number is too long" });
    }

    let user = await User.findOne({ phoneNumber });

    if (user) {
      user.token = token;
      user.createdAt = Date.now();
    } else {
      user = new User({ phoneNumber, token });
    }

    const message = `Спасибо, что посетили наш ресторан, помогите улучшить его. ${baseURL}/form?p=${phoneNumber}&t=${token}&b=${branchName.trim()}`;

    sendSMS(phoneNumber, message);

    await user.save();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Verify a token against a phone number
 */

exports.verifyToken = async (req, res) => {
  try {
    const { phoneNumber, token } = req.body;
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
