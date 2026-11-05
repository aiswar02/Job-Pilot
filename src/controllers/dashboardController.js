const JobApplication = require("../models/jobApplication");
const Reminder = require("../models/reminder");

// GET DASHBOARD
const getDashboard = async (req, res) => {
    try {
        const userId = req.userId;

        // Count only active applications
        const totalApplications = await JobApplication.countDocuments({
            userId,
            isDeleted: false
        });

        const saved = await JobApplication.countDocuments({
            userId,
            status: "SAVED",
            isDeleted: false
        });

        const applied = await JobApplication.countDocuments({
            userId,
            status: "APPLIED",
            isDeleted: false
        });

        const interviews = await JobApplication.countDocuments({
            userId,
            status: "INTERVIEW",
            isDeleted: false
        });

        const offers = await JobApplication.countDocuments({
            userId,
            status: "OFFER",
            isDeleted: false
        });

        const rejected = await JobApplication.countDocuments({
            userId,
            status: "REJECTED",
            isDeleted: false
        });

        // Count only active pending reminders
        const pendingReminders = await Reminder.countDocuments({
            userId,
            status: "PENDING",
            isDeleted: false
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

module.exports = { getDashboard }