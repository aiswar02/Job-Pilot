const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobApplication",
            default: null
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        reminderType: {
            type: String,
            enum: ["INTERVIEW", "FOLLOW_UP", "OTHER"],
            required: true
        },

        dueDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "COMPLETED", "CANCELLED"],
            default: "PENDING"
        },

        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Reminder", reminderSchema);