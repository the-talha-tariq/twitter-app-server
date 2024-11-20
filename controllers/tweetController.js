const Tweet = require("../models/tweetModel");

module.exports = {
    createTweet: async (req, res) => {
        try {
            const { content } = req.body;

            // Validate request
            if (!content && req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Content or attachment is required.",
                });
            }

            // Store file names
            const attachments = req.files.map(file => file.filename);

            const tweet = new Tweet({
                content,
                author: req.user.id, // Assuming user info is extracted from the token
                attachments,
            });

            await tweet.save();

            res.status(201).json({
                success: true,
                message: "Tweet created successfully!",
                tweet,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Server error. Unable to create tweet.",
            });
        }
    },

    getAllTweets: async (req, res) => {
        try {
            const tweets = await Tweet.find()
                .populate("author", "userName profileImage")
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                tweets,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Server error. Unable to fetch tweets.",
            });
        }
    },
    getTweetById: async (req, res) => {
        try {
            const tweet = await Tweet.findById(req.params.id).populate("author", "userName profileImage");

            if (!tweet) {
                return res.status(404).json({ message: "Tweet not found." });
            }

            res.status(200).json({ tweet });
        } catch (error) {
            res.status(500).json({ message: "Error fetching tweet.", error: error.message });
        }
    },

    likeTweet: async (req, res) => {
        try {
            const tweet = await Tweet.findById(req.params.id);

            if (!tweet) {
                return res.status(404).json({ message: "Tweet not found." });
            }

            if (tweet.likes.includes(req.user.id)) {
                return res.status(400).json({ message: "You already liked this tweet." });
            }

            tweet.likes.push(req.user.id);
            await tweet.save();

            res.status(200).json({ message: "Tweet liked successfully." });
        } catch (error) {
            res.status(500).json({ message: "Error liking tweet.", error: error.message });
        }
    },

    retweet: async (req, res) => {
        try {
            const tweet = await Tweet.findById(req.params.id);

            if (!tweet) {
                return res.status(404).json({ message: "Tweet not found." });
            }

            if (tweet.retweets.includes(req.user.id)) {
                return res.status(400).json({ message: "You already retweeted this tweet." });
            }

            tweet.retweets.push(req.user.id);
            await tweet.save();

            res.status(200).json({ message: "Tweet retweeted successfully." });
        } catch (error) {
            res.status(500).json({ message: "Error retweeting.", error: error.message });
        }
    },

    commentOnTweet: async (req, res) => {
        try {
            const { content } = req.body;

            if (!content || content.trim() === "") {
                return res.status(400).json({ message: "Comment content cannot be empty." });
            }

            const tweet = await Tweet.findById(req.params.id);

            if (!tweet) {
                return res.status(404).json({ message: "Tweet not found." });
            }

            tweet.comments.push({
                user: req.user.id,
                content,
            });

            await tweet.save();

            res.status(200).json({ message: "Comment added successfully.", tweet });
        } catch (error) {
            res.status(500).json({ message: "Error adding comment.", error: error.message });
        }
    },

    deleteTweet: async (req, res) => {
        try {
            const tweet = await Tweet.findById(req.params.id);

            if (!tweet) {
                return res.status(404).json({ message: "Tweet not found." });
            }

            if (tweet.author.toString() !== req.user.id) {
                return res.status(403).json({ message: "You are not authorized to delete this tweet." });
            }

            await tweet.remove();
            res.status(200).json({ message: "Tweet deleted successfully." });
        } catch (error) {
            res.status(500).json({ message: "Error deleting tweet.", error: error.message });
        }
    },
};
