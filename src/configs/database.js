const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // MongoDB connection string
        const mongoURI = 'mongodb+srv://gk630471:T3k1nvTVn5wHTqCN@cluster0.ek0rw.mongodb.net/DEVTINDER'
      
        await mongoose.connect(mongoURI);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Database connection error: " + error.message);
        throw error; 
    }
};

module.exports = connectDB;
