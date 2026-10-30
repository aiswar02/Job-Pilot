const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to JobPilot API"
    });
});

app.use("/api/auth", authRoutes);

module.exports = app;