const User = require("../models/User");

// ANALYZE JOB DESCRIPTION
const analyzeJob = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                message: "Please provide a job description"
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const userSkills = user.skills || [];

        const description = jobDescription.toLowerCase();

        const matchedSkills = userSkills.filter(skill =>
            description.includes(skill.toLowerCase())
        );

        const missingSkills = userSkills.filter(skill =>
            !description.includes(skill.toLowerCase())
        );

        const matchPercentage = userSkills.length > 0
            ? Math.round(
                (matchedSkills.length / userSkills.length) * 100
            )
            : 0;

        res.status(200).json({
            message: "Job analysis completed successfully",
            analysis: {
                totalSkills: userSkills.length,
                matchedSkills,
                missingSkills,
                matchPercentage
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Job analysis failed",
            error: error.message
        });
    }
};

module.exports = { analyzeJob };