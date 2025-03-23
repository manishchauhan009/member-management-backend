const Content = require("../models/contentSchema");

const addContent = async (req, res) => {
  try {
    // Check if req.user exists
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { title, body, tags } = req.body;

    console.log("Received Data:", { title, body, tags, user: req.user });

    // Convert tags to an array if it's a string
    const tagsArray = Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim());

    const content = new Content({
      title,
      body,
      tags: tagsArray,
      admin: req.user.id, // Ensure req.user.id is valid
    });

    await content.save();

    res.status(201).json({ message: "Content created successfully", content });
  } catch (error) {
    console.error("Error saving content:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getContent = async (req, res) => {
  try {
    // Fetch all content from the database
    const content = await Content.find();

    // Check if content exists
    if (!content || content.length === 0) {
      return res.status(404).json({ message: "No content found" });
    }

    // Send the retrieved content as a response
    res.status(200).json({ success: true, content });
  } catch (error) {
    console.error("Error fetching content:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
module.exports = { addContent, getContent };
