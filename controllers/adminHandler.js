const User = require('../models/userSchema');
const bcrypt = require("bcrypt");
const adminDetailHandler = async (req, res) => {
  try {
    const adminId = req.user.id;
      // const admin = await User.findById(adminId).select("-password");
    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const profileUpdateHandler = async (req, res) => {
  try {
    const { username, email, phone, address } = req.body;

    // Find the user by username instead of user ID
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user fields if provided in the request
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();
    
    res.json({ success: true, message: "Profile updated successfully" });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const passwordChangeHandler = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect old password" });
    }

    // if (newPassword.length < 8) {
    //   return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
    // }

    // Hash new password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



module.exports = {
  adminDetailHandler,
  profileUpdateHandler,
  passwordChangeHandler
};