const express = require("express");
const { userAuth } = require("../middleware/auth"); 
const Connection = require("../models/connection"); // Assuming 'Connection' is the Mongoose model for connection requests
const userRouter = express.Router(); // Initialize the router

// Route to get received connection requests
userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedinuser = req.user; // Get logged-in user's details from req.user
        
        // Fetch connection requests where the logged-in user is the recipient
        const connectionRequests = await Connection.find({
            touser: loggedinuser._id, // Use _id of the logged-in user
        }).populate("fromuser", "fname lname gender age"); // Populate sender's details

        return res.status(200).json({
            message: "All the received connection requests are here:",
            data: connectionRequests,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while getting connection requests: " + error.message,
        });
    }
});

// Route to get all accepted connection requests for the logged-in user
userRouter.get("/user/request/connection", userAuth, async (req, res) => {
    try {
        const loggedinuser = req.user;

        // Fetch connection requests where the logged-in user is either the sender or the recipient and the status is "accepted"
        const acceptedConnections = await Connection.find({
            $or: [
                { touser: loggedinuser._id, status: "accepted" },
                { fromuser: loggedinuser._id, status: "accepted" },
            ]
        }).populate("fromuser", "fname lname gender age"); // Populate sender's details

        return res.status(200).json({
            message: "Accepted connection requests fetched successfully",
            data: acceptedConnections,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while fetching connection requests: " + error.message,
        });
    }
});

module.exports = userRouter;
