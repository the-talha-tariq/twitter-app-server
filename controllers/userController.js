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
                profileImage: req.body.profileImage, // Assuming the file is already uploaded and you are storing its name.
                coverImage: req.body.coverImage,
            };

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
}