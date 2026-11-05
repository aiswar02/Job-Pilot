const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadmiddleware");

const {
    uploadResume,
    getResume,
    deleteResume,
    downloadResume
} = require("../controllers/resumeController");

router.post("/", authMiddleware, upload.single("resume"), uploadResume);
router.get("/", authMiddleware, getResume);
router.get("/download", authMiddleware, downloadResume);
router.delete("/", authMiddleware, deleteResume);


module.exports = router;