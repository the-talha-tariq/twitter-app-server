const Notification = require("../models/notificationModel");

module.exports = {
    // Fetch all notifications for the logged-in user
    getAllNotifications: async (req, res) => {
        try {
            const notifications = await Notification.find({ user: req.user.id })
                .populate("sender", "userName profileImage") // Populate sender details
                .populate("tweet", "content") // Populate tweet details if applicable
                .sort({ createdAt: -1 }); // Sort notifications by most recent

            res.status(200).json({
                message: "Notifications fetched successfully.",
                notifications,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error fetching notifications.",
                error: error.message,
            });
        }
    },

    // Mark notifications as read
    markNotificationsAsRead: async (req, res) => {
        try {
            await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });

            res.status(200).json({
                message: "Notifications marked as read successfully.",
            });
        } catch (error) {
            res.status(500).json({
                message: "Error marking notifications as read.",
                error: error.message,
            });
        }
    },

    // Create a notification (used internally for various events)
    createNotification: async (userId, senderId, type, tweetId = null) => {
        try {
            const newNotification = new Notification({
                user: userId,
                sender: senderId,
                type,
                tweet: tweetId,
            });

            await newNotification.save();
        } catch (error) {
            console.error("Error creating notification:", error.message);
        }
    },
};
