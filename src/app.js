const express = require("express");
const path = require("path");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.static(path.join(__dirname, "public")));


const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const jobAnalysisRoutes = require("./routes/jobAnalysisRoutes");


app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/applications", jobApplicationRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/job-analysis", jobAnalysisRoutes);


app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => res.render("auth/login"));
app.get("/register", (req, res) => res.render("auth/register"))
app.get("/dashboard", (req, res) => res.render("dashboard"));
app.get("/applications", (req, res) => res.render("applications"));
app.get("/applications/add", (req, res) => res.render("application-form"));
app.get("/applications/details", (req, res) => res.render("application-details"));
app.get("/reminders", (req, res) => res.render("reminders"));
app.get("/reminders/add", (req, res) => res.render("reminder-form"));
app.get("/job-analysis", (req, res) => res.render("job-analysis"));
app.get("/resume", (req, res) => res.render("resume"));
app.get("/profile", (req, res) => res.render("profile"));
app.get("/settings", (req, res) => res.render("settings"));


const errorMiddleware = require("./middleware/errorMiddleware");
app.use(errorMiddleware);

module.exports = app