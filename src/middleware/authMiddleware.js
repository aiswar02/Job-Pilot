const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access token required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        if (decoded.type !== "access") {
            return res.status(401).json({
                message: "Invalid access token"
            });
        }

        req.userId = decoded.userId;
        next();

    } catch (error) {
        console.log("Auth error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;