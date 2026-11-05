const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        jobTitle: {
            type: String,
            required: true,
            trim: true
        },

        jobDescription: {
            type: String,
            default: ""
        },

        applicationSource: {
            type: String,
            trim: true
        },

        jobUrl: {
            type: String,
            trim: true
        },

        salaryMin: {
            type: Number,
            min: 0
        },

        salaryMax: {
            type: Number,
            min: 0
        },

        location: {
            type: String,
            trim: true
        },

        workMode: {
            type: String,
            enum: ["ONSITE", "HYBRID", "REMOTE"]
        },

        status: {
            type: String,
            enum: [
                "SAVED",
                "APPLIED",
                "ASSESSMENT",
                "INTERVIEW",
                "OFFER",
                "REJECTED"
            ],
            default: "SAVED"
        },

        appliedDate: {
            type: Date
        },

        interviewDate: {
            type: Date
        },

        followUpDate: {
            type: Date
        },

        notes: {
            type: String,
            default: ""
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "JobApplication",
    jobApplicationSchema
);