const express=require("express");
const authRouter=express.Router();  
const { validateSignup } = require("../utils/Validator"); // Correct import
const bcrypt = require('bcrypt');
const User=require("../models/user");   


// Signup Router

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignup(req);  // Call the validation function
    } catch (error) {
        return res.status(400).send({ error: error.message }); // Handle validation errors
    }

    try {
        const { fname, lname, email, password, age, gender, city, phone } = req.body;
        const hashpassword = await bcrypt.hash(password, 10);
        

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email is already registered");
        }

        const newUser = await User.create({
            fname,
            lname,
            email,
            password: hashpassword,
            age,
            gender,
            city,
            phone,
        });

        return res.status(201).send({ message: "User created successfully", user: newUser });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while creating the user: " + error.message);
    }
});


// Login Router

authRouter.post("/login", async (req, res) => {
    try {
        // Extract email and password from request body
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

        // If password matches, generate the JWT token using the existing user instance
        const token = await existingUser.getJWT(); // Call getJWT on the instance

        // Set the token in a cookie with an expiration of 24 hours
        res.cookie("token", token, {
            expires: new Date(Date.now() + 24 * 3600000), // 24 hours
        });

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

authRouter.post("/logout", async (req, res) => {
    try {
        // Clear the token cookie to logout the user
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error); // Structured logging
        return res.status(500).json({ 
            error: "An error occurred while logging out: " + error.message 
        }); // Internal Server Error
    }
}); 

module.exports = authRouter;
