// models/tweetModel.js
const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 280, // Limit for tweet content
    },
    attachments: [{ type: String }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    retweets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            content: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Tweet", TweetSchema);
