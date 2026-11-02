const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createApplication,
    getApplications,
    getApplicationById,
    updateApplication,
    deleteApplication
} = require("../controllers/jobApplicationController");

router.post("/", authMiddleware, createApplication);
router.get("/", authMiddleware, getApplications);
router.get("/:id", authMiddleware, getApplicationById);
router.put("/:id", authMiddleware, updateApplication);
router.delete("/:id", authMiddleware, deleteApplication);

module.exports = router