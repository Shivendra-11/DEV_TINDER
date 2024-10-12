const express = require('express');
const connectDB = require("./configs/database"); // Ensure your DB config file is set up properly
const signuprouter = require('./routes/signup'); // Ensure your path is correct
const app = express(); // Define the app variable here

// Middleware to parse JSON body data
app.use(express.json());

// Use the signup route
app.use('/signup', signuprouter); // Mount the signuprouter at the /signup endpoint

// Connect to the database and start the server
const startServer = async () => {
    try {
        await connectDB(); // Await the database connection
        console.log("Database connected successfully");

        const port = process.env.PORT || 4000; // Use PORT from .env or default to 4000
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`); // Confirm the correct port number
        });
    } catch (error) {
        console.error("Database connection failed: " + error.message);
    }
};

// Start the server
startServer();
