const express = require('express');
const User = require('../models/user');
const profileRouter = express.Router();
const cookieParser = require('cookie-parser');
const { userAuth } = require('../middleware/auth');
const { validateProfileEdit, validateEditProfileData } = require('../utils/Validator');

// Use cookie-parser middleware to parse cookies
profileRouter.use(cookieParser());

profileRouter.get('/profile', userAuth, async (req, res) => {
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
            token: req.cookies.token || null // Include token if needed
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while retrieving user profile",
            error: error.message
        });
    }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
      if (!validateEditProfileData(req)) {
        return res.status(400).send("ERROR : Invalid data" );
      }
  
      const loggedInUser = req.user;
  
      Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
  
      await loggedInUser.save();
  
      res.json({
        message: `${loggedInUser.fname}, your profile updated successfuly`,
        data: loggedInUser,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });

module.exports = profileRouter;
