const mongoose = require('mongoose');

// Define the User schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String, // Typically a URL or Base64 string for the user's avatar
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
