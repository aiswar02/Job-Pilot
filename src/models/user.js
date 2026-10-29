const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        qualification: {
            type: String,
            trim: true
        },

        graduationYear: {
            type: Number
        },

        experienceYears: {
            type: Number,
            default: 0,
            min: 0
        },

        skills: {
            type: [String],
            default: []
        },

        preferences: {
            locations: {
                type: [String],
                default: []
            },

            workModes: {
                type: [String],
                enum: ["ONSITE", "HYBRID", "REMOTE"],
                default: []
            },

            minimumSalary: {
                type: Number,
                min: 0
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema)