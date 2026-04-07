const User = require("../models/User");
const jwt = require("jsonwebtoken");


// 📩 SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({ phone });
    }

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();

    console.log("OTP:", otp); // 👈 for testing

    res.json({
      message: "OTP sent successfully",
      otp, // remove this in production
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};