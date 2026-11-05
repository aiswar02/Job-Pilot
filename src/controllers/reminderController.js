const Reminder = require("../models/reminder");

// CREATE REMINDER
const createReminder = async (req, res) => {
    try {
        const { title, reminderType, dueDate, status, notes, applicationId } = req.body;

        if (!title || !reminderType || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Title, reminder type and due date are required"
            });
        }

        const reminder = await Reminder.create({
            userId: req.userId,
            title,
            reminderType,
            dueDate,
            status: status || "PENDING",
            notes: notes || "",
            applicationId: applicationId || null
        });

        res.status(201).json({
            success: true,
            message: "Reminder created successfully",
            reminder
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL REMINDERS
const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({
            userId: req.userId,
            isDeleted: false
        }).sort({ dueDate: 1 });

        res.status(200).json({
            success: true,
            count: reminders.length,
            reminders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET REMINDER BY ID
const getReminderById = async (req, res) => {
    try {
        const reminder = await Reminder.findOne({
            _id: req.params.id,
            userId: req.userId,
            isDeleted: { $ne: true }
        },
        {
            isDeleted: true,
            deletedAt: new Date()
        },
        {new: true}
    );

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found"
            });
        }

        return res.status(200).json({ success: true, 
            message: "Reminder deleted successfully"
         });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid reminder ID"
        });
    }
};

// UPDATE REMINDER
const updateReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId,
                isDeleted: false
            },
            req.body,
            {new: true,
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Reminder updated successfully",
            reminder
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE REMINDER
const deleteReminder = async (req, res) => {
    try {
        const reminder = await Reminder.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Reminder deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid reminder ID"
        });
    }
};

module.exports = {
    createReminder,
    getReminders,
    getReminderById,
    updateReminder,
    deleteReminder
}