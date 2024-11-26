const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    type: { 
        type: String, 
        enum: ["like", "follow", "mention"], 
        required: true 
    },
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }, 
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Notification", NotificationSchema);
