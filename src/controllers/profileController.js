const User = require("../models/user");

// GET PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile fetched successfully",
            profile: user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
    try {
        const {
            name,
            qualification,
            graduationYear,
            experienceYears,
            skills,
            preferences
        } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name !== undefined) user.name = name;
        if (qualification !== undefined) user.qualification = qualification;
        if (graduationYear !== undefined) user.graduationYear = graduationYear;
        if (experienceYears !== undefined) user.experienceYears = experienceYears;
        if (skills !== undefined) user.skills = skills;

        if (preferences !== undefined) {
            user.preferences = {
                ...user.preferences.toObject(),
                ...preferences
            };
        }

        await user.save();

        res.json({
            message: "Profile updated successfully",
            profile: user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile
};