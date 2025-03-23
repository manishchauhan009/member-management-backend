const mongoose = require("mongoose");
const User=require("./userSchema");

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100, 
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String, 
      default: null,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
