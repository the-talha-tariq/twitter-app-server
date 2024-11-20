// index.js
const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const userRoute = require('./routes/userRoute')
const tweetRoutes = require('./routes/tweetRoute')
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect Database
connectDB();
app.use('/api/user',userRoute);
app.use("/api/tweet", tweetRoutes);
app.use("/uploads", express.static("uploads"));
// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Listen on PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
