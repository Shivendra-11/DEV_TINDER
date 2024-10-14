const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken'); // Import JWT

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: [true, "First name is required"],
        minlength: [2, "First name must be at least 2 characters long"],
        maxlength: [50, "First name cannot exceed 50 characters"],
        trim: true
    },
    lname: {
        type: String,
        required: [true, "Last name is required"],
        minlength: [2, "Last name must be at least 2 characters long"],
        maxlength: [50, "Last name cannot exceed 50 characters"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
        // You can add more password validations (e.g., regex for strength)
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,  // Ensures email uniqueness in the database
        lowercase: true,
        validate: {
            validator: validator.isEmail,  // Using validator library to validate email format
            message: "Please provide a valid email"
        }
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [18, "You must be at least 18 years old"],
        max: [100, "Age must be below 100"]
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: {
            values: ["Male", "Female", "Other"],
            message: "Gender must be either Male, Female, or Other"
        }
    },
    city: {
        type: String,
        required: [true, "City is required"],
        minlength: [2, "City name must be at least 2 characters long"],
        maxlength: [100, "City name cannot exceed 100 characters"],
        trim: true
    },
    phone: {
        type: String,  // Changed to String for better formatting/length control
        required: [true, "Phone number is required"],
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);  // Simple validation for 10-digit phone number
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    }
}, {
    timestamps: true  // Automatically adds `createdAt` and `updatedAt` fields
});

// Method to generate JWT
userSchema.methods.getJWT = async function() {
    const user = this;  // Reference to the current user instance
    const token = jwt.sign({ id: user._id }, "shivendra1111", { expiresIn: "1h" });
    return token;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
