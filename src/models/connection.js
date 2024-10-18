const mongoose = require('mongoose');
const User=require("./user.js");

const connectionSchema = new mongoose.Schema({
    fromuser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    touser: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['intrested', 'rejected', 'pending', 'ignored'],
            message: '{VALUE} is not supported'
        }
    }
}, { timestamps: true });  // Enable timestamps

connectionSchema.index({ fromuser: 1, touser: 1 }, { unique: true });  // Add unique index

const connection = mongoose.model('connection', connectionSchema);

module.exports = connection;
