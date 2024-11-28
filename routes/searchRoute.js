const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

// Search Routes
router.get("/tweet", searchController.searchTweets);
router.get("/user", searchController.searchUsers);
router.get("/hashtag", searchController.searchHashtags);

module.exports = router;
