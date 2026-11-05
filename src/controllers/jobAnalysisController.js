const User = require("../models/user");

// ANALYZE JOB DESCRIPTION
const analyzeJob = async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide a job description"
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get skills saved in user profile
        const userSkills = (user.skills || []).map(skill =>
            skill.trim().toLowerCase()
        );

        // Convert job description to lowercase
        const description = jobDescription.toLowerCase();

        // Skills matching
        const matchedSkills = userSkills.filter(skill =>
            description.includes(skill)
        );

        const missingSkills = userSkills.filter(skill =>
            !description.includes(skill)
        );

        // Calculate percentage
        const matchPercentage = userSkills.length > 0
            ? Math.round(
                (matchedSkills.length / userSkills.length) * 100
            )
            : 0;

        return res.status(200).json({
            success: true,
            message: "Job analysis completed successfully",
            analysis: {
                totalSkills: userSkills.length,
                matchedSkills,
            missingSkills,
            matchPercentage
        }
        });

    } catch (error) {
        console.error("Job analysis error:", error);

        return res.status(500).json({
            success: false,
            message: "Job analysis failed",
            error: error.message
        });
    }
};

module.exports = { analyzeJob };