const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const verifyToken = require("../middleware/auth");

// Fetch all notifications for the logged-in user
router.get("/", verifyToken, notificationController.getAllNotifications);

// Mark all notifications as read
router.patch("/mark-read", verifyToken, notificationController.markNotificationsAsRead);
router.post("/create", verifyToken, notificationController.createNotification);




module.exports = router;
