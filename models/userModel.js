const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {type: String, require: true, unique: true},
    email: {type: String, require: true, unique: true},
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },

    // Profile details
    name: { type: String },
    bio: { type: String, maxlength: 160 },
    location: { type: String },
    website: { type: String },
    profileImage: { type: String },
    coverImage: { type: String },

    // Account interactions
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
    tweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
    retweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],

    // Additional fields
    notifications: [{ type: Schema.Types.Mixed }],
    isPrivate: { type: Boolean, default: false },
    verified: { type: Boolean, default: false }
});


module.exports = mongoose.model('User',UserSchema);