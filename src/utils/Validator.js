// utils/Validator.js
const validator = require('validator');

const validateSignup = (req) => {
    const { fname, lname, email, password, age } = req.body;

    if (!fname || !lname || !email || !password || !age) {
        throw new Error("All fields are required");
    }

    if (!validator.isEmail(email)) {
        throw new Error("Please provide a valid email");
    }

   
};

module.exports = {
    validateSignup // Ensure you're exporting the function
};
