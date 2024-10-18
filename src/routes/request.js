const express = require("express");
const { userAuth } = require("../middleware/auth");
const Connection = require("../models/connection"); // Import the correct model
const User = require("../models/user"); // Import the User model
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:touser", userAuth, async (req, res) => {
  try {
    const fromuser = req.user._id; // User ID from auth middleware
    const touserId = req.params.touser; // 'touser' parameter from URL
    const status = req.params.status; // 'status' parameter from URL

    const allowedStatus = ["ignored", "intrested"]; // Fixed typo in "interested"
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status: " + status,
      });
    }

    // check if the user is sending a request to himself
    if (fromuser.toString() === touserId) { 
        return res.status(400).json({
            message: "You cannot send a request to yourself",
        });
        }  

    // Check if a connection already exists
    const connectionExists = await Connection.findOne({
      $or: [
        { fromuser, touser: touserId },
        { fromuser: touserId, touser: fromuser },
      ],
    });

    if (connectionExists) {
      return res.status(400).json({
        message: "Connection already exists",
      });
    }

    // Find the user by touser ID
    const userfound = await User.findById(touserId);
    if (!userfound) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Create a new connection request
    const connectionRequest = new Connection({
      fromuser,
      touser: touserId, // Ensure touser is correctly referenced
      status,
    });

    // Save the connection request to the database
    const data = await connectionRequest.save();

    // Return a success message with the user's name
    return res.status(200).json({
      message: "Connection request sent successfully to " + userfound.fname,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while sending the request: " + error.message,
    });
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedinuser = req.user;
    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status: " + status,
      });
    }

    const connectionRequest = await Connection.findOne({
      _id: requestId,
      touser: loggedinuser._id,
      status:"intrested"  
    });

    if (!connectionRequest) {
      return res.status(404).json({
        message: "Connection request not found",
      });
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();
    res.json({ message: "Connection request " + status, data });

    return res.status(200).json({
      message: "Request status updated successfully",
      data,
    });

  } catch (error) {
    return res.status(400).json({
      message: "An error occurred while reviewing the request: " + error.message,
    });
  }
});

module.exports = requestRouter;
