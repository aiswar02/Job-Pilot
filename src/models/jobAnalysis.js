const mongoose = require("mongoose");

const jobAnalysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "JobApplication",
            required: true
        },

        jobTitle: {
            type: String,
            required: true
        },

        companyName: {
            type: String,
            required: true
        },

        jobDescription: {
            type: String,
            default: ""
        },

        requiredSkills: {
            type: [String],
            default: []
        },

        matchedSkills: {
            type: [String],
            default: []
        },

        missingSkills: {
            type: [String],
            default: []
        },

        matchPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        eligibilityResult: {
            type: String,
            enum: [
                "ELIGIBLE",
                "PARTIALLY_ELIGIBLE",
                "NOT_ELIGIBLE",
                "NEEDS_REVIEW"
            ],
            default: "NEEDS_REVIEW"
        },

        improvementSuggestions: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "JobAnalysis",
    jobAnalysisSchema
);