const mongoose = require("mongoose");
const User=require("./userSchema");

const contentSchema = new mongoose.Schema(
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
    tags: {
      type: [String], 
      default: [],
    },
    image: {
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

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
