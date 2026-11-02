const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { analyzeJob } = require("../controllers/jobAnalysisController");

router.post("/", authMiddleware, analyzeJob);

module.exports = router;