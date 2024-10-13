const User = require("../models/user");
const express = require("express");
const { validateLogin } = require("../utils/Validator");  // Assuming a dedicated login validator
const bcrypt = require("bcrypt");
const loginrouter = express.Router();
const jwt = require("jsonwebtoken");

loginrouter.post("/", async (req, res) => {
    try {
        // Validate the request for login (email, password)
        const { email, password } = req.body;

        // Check if the user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ error: "Invalid credentials" }); // Unauthorized
        }

        // Compare passwords using bcrypt
        const passwordMatched = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatched) {
            return res.status(401).json({ error: "Invalid credentials" }); // Unauthorized
        }

        // If password matches, generate the JWT token
        const token = jwt.sign({ id: existingUser._id }, "shivendra1111", { expiresIn: "1h" });

        // Set the token in a cookie
        res.cookie("token", token);

        // Exclude sensitive data (like password) from user details before sending the response
        const { password: _, ...userDetails } = existingUser._doc;

        // Return a success response with the user details and token
        return res.status(200).json({
            message: "Login successful",
            user: userDetails,
            token: token 
        });
    } catch (error) {
        console.error("Login error:", error); // Structured logging
        return res.status(500).json({ 
            error: "An error occurred while logging in: " + error.message 
        }); // Internal Server Error
    }
});

// Export the login router
module.exports = loginrouter;
