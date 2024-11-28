const Tweet = require('../models/tweetModel');
const User = require('../models/userModel');

module.exports = {
    searchTweets: async (req, res) => {
        try {
            const { query } = req.query;

            if (!query) {
                return res.status(400).json({ message: "Search query is required." });
            }

            const tweets = await Tweet.find(
                { $text: { $search: query } },
                { score: { $meta: "textScore" } } // Retrieve text search relevance score
            ).sort({ score: { $meta: "textScore" } }); // Sort by relevance score

            res.status(200).json({
                message: "Tweets fetched successfully.",
                tweets,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error searching tweets.",
                error: error.message,
            });
        }
    },

    searchUsers: async (req, res) => {
        try {
            const { query } = req.query;

            if (!query) {
                return res.status(400).json({ message: "Search query is required." });
            }

            const users = await User.find(
                { $text: { $search: query } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } });

            res.status(200).json({
                message: "Users fetched successfully.",
                users,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error searching users.",
                error: error.message,
            });
        }
    },

    searchHashtags: async (req, res) => {
        try {
            const { query } = req.query;

            if (!query) {
                return res.status(400).json({ message: "Search query is required." });
            }

            const tweets = await Tweet.find(
                { hashtags: { $regex: new RegExp(query, "i") } } // Case-insensitive regex for hashtags
            );

            res.status(200).json({
                message: "Hashtags fetched successfully.",
                tweets,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error searching hashtags.",
                error: error.message,
            });
        }
    },
};
