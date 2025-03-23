const Image = require("../models/imageSchema");

const addImage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    const { title, body, imageUrl } = req.body;
    const image = new Image({
      title,
      body,
      imageUrl,
      admin: req.user.id,
    });

    await image.save();

    res.status(201).json({ message: "Content created successfully", image });
  } catch (error) {
    console.error("Error saving content:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getImage = async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No content found" });
    }

    console.log(images);
    res.status(200).json({ success: true, images });
  } catch (error) {
    console.error("Error fetching content:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addImage, getImage };
