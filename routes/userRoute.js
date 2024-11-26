const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const verifyToken = require('../middleware/auth');
const upload = require("../middleware/upload");

router.post('/register',userController.create);
router.post('/login',userController.authenticate);

router.get("/profile", verifyToken, userController.getProfile);
router.put(
    "/profile",
    verifyToken,
    upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    userController.updateProfile
);

// Follow/Unfollow Routes
router.put("/follow/:id", verifyToken, userController.followUser);
router.put("/unfollow/:id", verifyToken, userController.unfollowUser);

// Get followers and following
router.get("/following", verifyToken, userController.getFollowing); // Get following list
router.get("/followers", verifyToken, userController.getFollowers); // Get followers list

module.exports = router;