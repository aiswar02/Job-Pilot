const Reminder = require("../models/reminder");

// CREATE REMINDER
const createReminder = async (req, res) => {
    try {
        const reminder = await Reminder.create({
            ...req.body,
            userId: req.userId
        });

        res.status(201).json({
            message: "Reminder created successfully",
            reminder
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// GET ALL REMINDERS
const getReminders = async (req, res) => {
    try {
        const reminders = await Reminder.find({
            userId: req.userId
        }).sort({ reminderDate: 1 });

        res.json({
            count: reminders.length,
            reminders
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET REMINDER BY ID
const getReminderById = async (req, res) => {
    try {
        const reminder = await Reminder.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        res.json({ reminder });

    } catch (error) {
        res.status(400).json({
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
                userId: req.userId
            },
            req.body,
            {
               returnDocument: "after",
                runValidators: true
            }
        );

        if (!reminder) {
            return res.status(404).json({
                message: "Reminder not found"
            });
        }

        res.json({
            message: "Reminder updated successfully",
            reminder
        });

    } catch (error) {
        res.status(400).json({
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
                message: "Reminder not found"
            });
        }

        res.json({
            message: "Reminder deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
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
};