const JobApplication = require("../models/jobApplication");

// CREATE APPLICATION
const createApplication = async (req, res) => {
    try {
        const application = await JobApplication.create({
            ...req.body,
            userId: req.userId
        });

        res.status(201).json({
            message: "Job application created successfully",
            application
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// GET ALL APPLICATIONS
const getApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({
            userId: req.userId,
            isDeleted: { $ne: true }
        }).sort({ createdAt: -1 });

        res.json({
            count: applications.length,
            applications
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET APPLICATION BY ID
const getApplicationById = async (req, res) => {
    try {
        const application = await JobApplication.findOne({
            _id: req.params.id,
            userId: req.userId,
            isDeleted: { $ne: true }
        });

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({ application });

    } catch (error) {
        res.status(400).json({
            message: "Invalid application ID"
        });
    }
};

// UPDATE APPLICATION
const updateApplication = async (req, res) => {
    try {
        const application = await JobApplication.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application updated successfully",
            application
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// DELETE APPLICATION
const deleteApplication = async (req, res) => {
    try {
        const application = await JobApplication.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId,
                isDeleted: { $ne: true }
            },
            {
                isDeleted: true,
                deletedAt: new Date()
            },
            {
                new: true
            }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Application deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
};