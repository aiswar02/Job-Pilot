const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// UPLOAD RESUME
const uploadResume = async (req, res) => {
    console.log("UPLOAD RESUME API CALLED");
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF resume"
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "jobpilot/resumes",
          resource_type: "raw",
          public_id: `${user._id}_resume`,
          overwrite: true
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    user.resume = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id
    };

    await user.save();

    res.status(200).json({
      message: "Resume uploaded successfully",
      resume: user.resume
    });

  } catch (error) {
    console.log("Resume upload error:", error.message);
    res.status(500).json({
      message: error.message
    });
  }
};

// GET RESUME
const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.resume || !user.resume.url) {
      return res.status(404).json({
        message: "No resume uploaded yet"
      });
    }

    res.status(200).json({
      message: "Resume fetched successfully",
      resume: user.resume
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

// DELETE RESUME
const deleteResume = async (req, res) => {
    console.log("DELETE RESUME API CALLED");
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!user.resume || !user.resume.publicId) {
      return res.status(404).json({
        message: "No resume found to delete"
      });
    }

    await cloudinary.uploader.destroy(user.resume.publicId, {
      resource_type: "raw"
    });

    user.resume = {
      url: "",
      publicId: ""
    };

    await user.save();

    res.status(200).json({
      message: "Resume deleted successfully"
    });

  } catch (error) {
    console.log("Delete resume error:", error.message);

    res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  uploadResume,
  getResume,
  deleteResume
}