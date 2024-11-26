const User =require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
    create : async(req, res, next)=>{
        try {
            console.log("Get Request")
            const userExists = await User.findOne({email: req.body.email})

            if(userExists)
            {
                return res.status(412).send({message: "User Already Exists!! ", success: false})
            }
            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            req.body.password = hashedPassword;
            const newUser = new User(req.body);
            
            await newUser.save()
            return res.status(200).send({message: "User Regiter SuccessFully!! ", success: true})
        }
        catch {
            res
            .status(500)
            .send({ message: "Error Creating User", success: false, error });
        }
    },
    authenticate: async (req, res, next) => {
        try {
            const userInfo = await User.findOne({ email: req.body.email });
            
            if (!userInfo) {
                return res.status(412).json({
                    status: "error",
                    message: "User does not exist!",
                    data: null,
                });
            }

            const isPasswordValid = await bcrypt.compare(req.body.password, userInfo.password);

            if (!isPasswordValid) {
                return res.status(412).json({
                    status: "error",
                    message: "Invalid Password!",
                    data: null,
                });
            }

            const token = jwt.sign(
                { id: userInfo._id, email: userInfo.email }, 
                process.env.JWT_SECRET, 
                { expiresIn: process.env.JWT_EXPIRES_IN } 
            );

            return res.json({
                status: "success",
                message: "User authenticated successfully!",
                data: { user: userInfo, token },
            });
        } catch (error) {
            res.status(500).json({
                status: "error",
                message: "Error during authentication",
                error,
            });
        }
    },
    getProfile: async (req, res) => {
        try {
            // `req.user` contains the decoded token payload (id, email, etc.)
            const user = await User.findById(req.user.id).select("-password"); // Exclude password from response

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            res.status(200).json({
                message: "User profile fetched successfully.",
                user,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error fetching user profile.",
                error: error.message,
            });
        }
    },
    updateProfile: async (req, res) => {
        try {
            const updates = {
                name: req.body.name,
                bio: req.body.bio,
                location: req.body.location,
                website: req.body.website,
            };
    
            // Check for uploaded files
            if (req.files) {
                if (req.files.profileImage) {
                    updates.profileImage = req.files.profileImage[0].filename; // Save profile image name
                }
                if (req.files.coverImage) {
                    updates.coverImage = req.files.coverImage[0].filename; // Save cover image name
                }
            }
    
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id,
                { $set: updates },
                { new: true, runValidators: true } // `new: true` returns the updated user.
            ).select("-password"); // Exclude password from response.
    
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found." });
            }
    
            res.status(200).json({
                message: "Profile updated successfully.",
                user: updatedUser,
            });
        } catch (error) {
            res.status(500).json({
                message: "Error updating profile.",
                error: error.message,
            });
        }
    },
    followUser: async (req, res) => {
        try {
            const currentUser = req.user.id; // From the token payload
            const targetUserId = req.params.id;

            // Prevent self-following
            if (currentUser === targetUserId) {
                return res.status(400).json({ message: "You cannot follow yourself." });
            }

            // Update the current user's following list
            const currentUserUpdate = await User.findByIdAndUpdate(
                currentUser,
                { $addToSet: { following: targetUserId } }, // Avoid duplicates
                { new: true }
            );

            // Update the target user's followers list
            const targetUserUpdate = await User.findByIdAndUpdate(
                targetUserId,
                { $addToSet: { followers: currentUser } },
                { new: true }
            );

            if (!targetUserUpdate) {
                return res.status(404).json({ message: "User not found." });
            }

            res.status(200).json({
                message: "Followed successfully.",
                currentUser: currentUserUpdate,
                targetUser: targetUserUpdate
            });
        } catch (error) {
            res.status(500).json({ message: "Error following user.", error: error.message });
        }
    },

    unfollowUser: async (req, res) => {
        try {
            const currentUser = req.user.id;
            const targetUserId = req.params.id;

            // Update the current user's following list
            const currentUserUpdate = await User.findByIdAndUpdate(
                currentUser,
                { $pull: { following: targetUserId } },
                { new: true }
            );

            // Update the target user's followers list
            const targetUserUpdate = await User.findByIdAndUpdate(
                targetUserId,
                { $pull: { followers: currentUser } },
                { new: true }
            );

            if (!targetUserUpdate) {
                return res.status(404).json({ message: "User not found." });
            }

            res.status(200).json({
                message: "Unfollowed successfully.",
                currentUser: currentUserUpdate,
                targetUser: targetUserUpdate
            });
        } catch (error) {
            res.status(500).json({ message: "Error unfollowing user.", error: error.message });
        }
    },

    getFollowing: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
                .populate("following", "userName profileImage") // Only select relevant fields
                .select("following");

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            res.status(200).json({
                message: "Following list fetched successfully.",
                following: user.following
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching following list.", error: error.message });
        }
    },

    getFollowers: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
                .populate("followers", "userName profileImage")
                .select("followers");

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            res.status(200).json({
                message: "Followers list fetched successfully.",
                followers: user.followers
            });
        } catch (error) {
            res.status(500).json({ message: "Error fetching followers list.", error: error.message });
        }
    }
}