const mongoose = require('mongoose');

// Define the Member schema
const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  secondAddress: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
    match: /^[0-9]{5,6}$/, // Regex for valid pin code (5-6 digits)
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Regex for valid 10-digit phone number
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for valid email
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  registerByFirstName: {
    type: String,
    required: true,
  },
  registerByMiddleName: {
    type: String,
  },
  registerByLastName: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ["online", "offline","card"], // Restrict values to these options
    required: true,
  },
  remindersSent: {
    type: Number,
    default: 0, // Default to zero
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the current date
  },
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
