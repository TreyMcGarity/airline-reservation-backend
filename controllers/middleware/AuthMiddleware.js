const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization; // Extract token
    // console.log("called token:",token)

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // console.log("Decoded JWT Payload:", decoded); // Debugging step

        if (!decoded.id) {
            return res.status(400).json({ message: "Invalid token: Missing user ID" });
        }

        req.user = decoded; // Attach user payload to request
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
