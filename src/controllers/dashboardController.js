const JobApplication = require("../models/jobApplication");
const Reminder = require("../models/reminder");

// GET DASHBOARD
const getDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        const totalApplications = await JobApplication.countDocuments({ userId });

        const saved = await JobApplication.countDocuments({
            userId,
            status: "SAVED"
        });

        const applied = await JobApplication.countDocuments({
            userId,
            status: "APPLIED"
        });

        const interviews = await JobApplication.countDocuments({
            userId,
            status: "INTERVIEW"
        });

        const offers = await JobApplication.countDocuments({
            userId,
            status: "OFFER"
        });

        const rejected = await JobApplication.countDocuments({
            userId,
            status: "REJECTED"
        });

        const pendingReminders = await Reminder.countDocuments({
            userId,
            status: "PENDING"
        });

        res.status(200).json({
            message: "Dashboard fetched successfully",
            dashboard: {
                totalApplications,
                saved,
                applied,
                interviews,
                offers,
                rejected,
                pendingReminders
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard",
            error: error.message
        });
    }
};

module.exports = { getDashboard };