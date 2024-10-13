const express = require('express');
const connectDB = require("./configs/database"); // Ensure your DB config file is set up properly
const signuprouter = require('./routes/signup'); // Ensure your path is correct
const loginrouter = require('./routes/login'); // Ensure your path is correct
const cookieParser = require('cookie-parser');
const profileRouter = require('./routes/profile'); // Ensure your path is correct
const app = express(); // Define the app variable here

// Middleware to parse JSON body data
app.use(express.json());
app.use(cookieParser());


// Use the signup route
app.use('/signup', signuprouter); // Mount the signuprouter at the /signup endpoint
app.use('/login', loginrouter); // Mount the loginrouter at the /login endpoint
app.use('/profile', profileRouter); // Mount the profileRouter at the /profile endpoint

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
