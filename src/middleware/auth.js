const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");


const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        // Verify the JWT token
        const decodedData = jwt.verify(token, "shivendra1111");
        const { id } = decodedData;

        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach the user to the request object
        req.user = user;

        // Call next middleware function
        next();
    } catch (error) {
        console.error("Error in userAuth middleware:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { userAuth };
