const Event = require("../models/eventSchema");

const addEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { title, body, imageUrls } = req.body;

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ message: "At least one image is required." });
    }

    const event = new Event({
      title,
      body,
      imageUrls, // Array of image URLs
      admin: req.user.id,
    });

    await event.save();

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });  

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addEvent, getEvent };
