// router.js
const express = require('express');
const User = require('../models/user'); // Ensure the path is correct
const signuprouter = express.Router();
const { validateSignup } = require("../utils/Validator"); // Correct import
const bcrypt = require('bcrypt');

// POST signup route
signuprouter.post("/", async (req, res) => {
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

module.exports = signuprouter;
