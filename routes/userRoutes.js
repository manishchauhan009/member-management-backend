const express = require("express");
const router = express.Router();
const User = require("../models/userSchema"); 
const Member = require("../models/memberSchema"); 

// Import controllers and middleware
const { register, login } = require("../controllers/authHandler");
const { isAdmin } = require("../middleware/authMiddleware");
const { checkUsername } = require("../controllers/memberHandler");
const {adminDetailHandler,profileUpdateHandler,passwordChangeHandler}=require("../controllers/adminHandler");

// Authentication and validation routes
router.post("/register", register);
router.post("/login", login); // User login
router.post("/login/admin", isAdmin, login); // Admin login
router.post("/check-username", checkUsername);
router.get("/admin-details",isAdmin,adminDetailHandler)
router.put("/update-profile",profileUpdateHandler)
router.post("/change-password",passwordChangeHandler)

// Function to fetch dashboard data
const dashboardData = async () => {
  try {
    // Get current date and calculate next 7 days
    const currentDate = new Date(new Date().toISOString()); // Ensure UTC format
    const next7Days = new Date(currentDate);
    next7Days.setDate(next7Days.getDate() + 7);

    // Count total users in the database
    const totalUsers = await User.countDocuments();

    // Count users with expiryDate within the next 7 days
    const pendingRenewals = await Member.countDocuments({
      expiryDate: {
        $gte: currentDate, 
        $lte: next7Days, 
      },
    });

    return {
      totalUsers,
      pendingRenewals,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    return {
      error: "Unable to fetch dashboard data. Please try again later.",
    };
  }
};

router.get("/dashboard", async (req, res) => {
  try {
    const data = await dashboardData();
    if (data.error) {
      return res.status(500).json({ success: false, message: data.error });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in dashboard route:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
