const express = require('express');
const User = require('../models/user'); // Ensure the path is correct
const signuprouter = express.Router(); // Keep the name as signuprouter

// POST signup route
signuprouter.post("/", async (req, res) => { // Remove "/signup" from here
    try {
        // Destructure user data from the request body
        const { fname, lname, email, password, age, gender, city, phone } = req.body;

        // Validate required fields
        if (!fname || !lname || !email || !password || !age || !gender || !city || !phone) {
            return res.status(400).send("All fields are required");
        }

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email is already registered");
        }

        // Create the new user
        const newUser = await User.create({
            fname,
            lname,
            email,
            password,
            age,
            gender,
            city,
            phone,
        });

        // Send a success response if user creation is successful
        return res.status(201).send({ message: "User created successfully", user: newUser });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send("An error occurred while creating the user"  +error.message);
    }
});

// Export the signup router
module.exports = signuprouter; // Corrected to export signuprouter
