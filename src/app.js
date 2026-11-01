const express = require("express");
const app = express();
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

module.exports = app;