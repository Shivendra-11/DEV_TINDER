const express = require('express');
const User = require('../models/user');
const profileRouter = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('../middleware/auth');

// Use cookie-parser middleware to parse cookies
profileRouter.use(cookieParser());

profileRouter.get('/', userAuth, async (req, res) => {
    try {
        const user = req.user; // Access user set by userAuth middleware
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Send the response with the user data
        return res.status(200).json({
            message: "User profile retrieved successfully",
            data: user,
            token: req.cookies.token // Include token if needed
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while retrieving user profile",
            error: error.message
        });
    }
});

module.exports = profileRouter;
