const User = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const validator = require("validator");

const register = async (req, res) => {
    try {
        const userData = req.body;

        // Validate input fields
        if (!userData.username || !userData.password || !userData.email) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Validate email format
        if (!validator.isEmail(userData.email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username: userData.username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username is already taken" });
        }

        // Check if the email is already registered
        const existingEmail = await User.findOne({ email: userData.email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email is already in use" });
        }

        // Validate password strength
        // if (userData.password.length < 6) {
        //     return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        // }

       
        const newUser = new User(userData);
        await newUser.save();

        return res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.error("Error adding new user:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    try {
        const user = await User.findOne({ username });

        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (isPasswordCorrect) {
                const token = jwt.sign(
                    { id: user._id, username: user.username, role: user.role },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                );

                res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                return res.status(200).json({
                    success: true,
                    token: token,
                    message: "User Logged in Successfully",
                    role: user.role,
                });
            }
        }

        return res.status(400).json({ success: false, message: "Incorrect Username or Password" });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




module.exports = { register, login };