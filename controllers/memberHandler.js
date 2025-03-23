const Member = require("../models/memberSchema"); // Adjust the path if needed
const User = require('../models/userSchema'); // Adjust the path to your User model
const mongoose=require('mongoose')

const registerMember = async (req, res) => {
  try {
    const memberData = req.body;

    if (!memberData.firstName || !memberData.lastName || !memberData.email) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const newMember = new Member(memberData);
    const savedMember = await newMember.save();

    res.status(201).json({ message: "Member registered successfully", data: savedMember });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already exists." });
    }
    console.error("Error registering member:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Handler to fetch all members
const fetchMembers = async (req, res) => {
  try {
    const members = await Member.find(); // Fetch all members
    res.status(200).json({ message: "Members retrieved successfully", data: members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkUsername = async (req, res) => {
  const userName = req.body.username;
  console.log("Checking username:", userName);

  try {
    const user = await User.findOne({ username: userName });

    if (user) {
      return res.status(200).json({
        success: true,
        message: "Username already taken",
        available: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "Username is available",
      available: true,
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const renewHandler=async (req, res) => {
  try {
    const memberId = req.params.id;
    const { newExpiryDate } = req.body;

    if (!newExpiryDate) {
      return res.status(400).json({ message: "New expiry date is required" });
    }

    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Validate the new expiry date (e.g., it should be in the future)
    const expiryDate = new Date(newExpiryDate);
    if (expiryDate <= new Date()) {
      return res.status(400).json({ message: "Expiry date must be in the future" });
    }

    // Update the expiry date
    member.expiryDate = expiryDate;
    await member.save();

    res.status(200).json({
      message: "Membership renewed successfully",
      member: {
        _id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        updatedExpiryDate: member.expiryDate,
      },
    });
  } catch (error) {
    console.error("Error renewing membership:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const updateMember = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid member ID format" });
  }


  try {
    const updatedMember = await Member.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMember) {
      return res.status(404).json({ error: "Member not found" });
    }
    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ error: "Failed to update member" });
  }
};



module.exports = {
  registerMember,
  fetchMembers,
  checkUsername,
  updateMember,
  renewHandler
};
