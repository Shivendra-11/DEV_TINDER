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

const validateEditProfileData = (req) => {

    const allowedEditFields = [
      "fname",
      "lname",
      "email",
      "gender",
      "age",
      "about",
    ];
  
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field)
    );
  
    return isEditAllowed;
  };

module.exports = {
    validateSignup,
    validateEditProfileData
};
