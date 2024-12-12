const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const userRoute = require('./routes/userRoute')
const tweetRoutes = require('./routes/tweetRoute')
const notificationRoute = require('./routes/notificationRoute')
const searchRoute = require('./routes/searchRoute')
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
// Middleware
app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:3000", // Frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
      credentials: true, // Include credentials (if needed)
    })
  );
// Connect Database
connectDB();
app.use('/api/user',userRoute);
app.use("/api/tweet", tweetRoutes);
app.use("/api/notification",notificationRoute)
app.use("/api/search",searchRoute)
app.use("/uploads", express.static("uploads"));
// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use(cors());
// Listen on PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
