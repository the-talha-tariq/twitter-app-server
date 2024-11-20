const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from the Authorization header
    console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user info (id, email) to request
        next(); // Continue to the controller
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = verifyToken;
