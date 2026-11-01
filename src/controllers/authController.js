const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "Registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email })
            .select("+password +refreshToken");

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = jwt.sign(
            { userId: user._id, type: "access" },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { userId: user._id, type: "refresh" },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            message: "Login successful",
            accessToken,
            refreshToken
        });

    } catch (error) {
        console.log("Login error:", error.message);

        res.status(500).json({
            message: error.message
        });
    }
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        if (decoded.type !== "refresh") {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        const user = await User.findById(decoded.userId)
            .select("+refreshToken");

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        const newAccessToken = jwt.sign(
            { userId: user._id, type: "access" },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { userId: user._id, type: "refresh" },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            message: "Token refreshed successfully",
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        console.log("Refresh error:", error.message);

        res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
};

// LOGOUT
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.userId)
            .select("+refreshToken");

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        user.refreshToken = null;
        await user.save();

        res.json({
            message: "Logout successful"
        });

    } catch (error) {
        console.log("Logout error:", error.message);

        res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout
};