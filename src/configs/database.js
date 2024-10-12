const mongoose = require('mongoose');

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // MongoDB connection string
        const mongoURI = 'mongodb+srv://shivendrakeshari581:GSkOBaxp0dvwWeqm@cluster0.yjpol.mongodb.net/DEvTINDER';

      
        await mongoose.connect(mongoURI);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Database connection error: " + error.message);
        throw error; 
    }
};

module.exports = connectDB;
