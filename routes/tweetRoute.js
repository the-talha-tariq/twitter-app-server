const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
const verifyToken = require("../middleware/auth"); // Middleware to verify JWT
const upload = require("../middleware/upload");

router.post(
    "/",
    verifyToken,
    upload.array("attachments", 4), // Maximum of 4 files
    tweetController.createTweet
); // Create a new tweet
router.get("/", tweetController.getAllTweets); // Get all tweets
router.get("/:id", tweetController.getTweetById); // Get a tweet by ID
router.put("/:id/like", verifyToken, tweetController.likeTweet); // Like a tweet
router.put("/:id/retweet", verifyToken, tweetController.retweet); // Retweet a tweet
router.put("/:id/comment", verifyToken, tweetController.commentOnTweet); // Comment on a tweet
router.delete("/:id", verifyToken, tweetController.deleteTweet); // Delete a tweet

module.exports = router;
