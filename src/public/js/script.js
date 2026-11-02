const API = "http://localhost:3000/api";

// Get token from browser storage
function getToken() {
    return localStorage.getItem("accessToken");
}

// API request helper
async function apiRequest(url, method = "GET", data = null) {

    const options = {
        method,
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    };

    if (data instanceof FormData) {
        options.body = data;
    } else if (data) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
    }

    return result;
}

// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        try {

            const result = await apiRequest(
                `${API}/auth/register`,
                "POST",
                {
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                }
            );

            document.getElementById("message").textContent =
                result.message || "Registration successful";

            window.location.href = "/login";

        } catch (error) {

            document.getElementById("message").textContent = error.message;
        }
    });
}

// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        try {

            const result = await apiRequest(
                `${API}/auth/login`,
                "POST",
                {
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                }
            );

            localStorage.setItem("accessToken", result.accessToken);

            if (result.refreshToken) {
                localStorage.setItem("refreshToken", result.refreshToken);
            }

            window.location.href = "/dashboard";

        } catch (error) {

            document.getElementById("message").textContent = error.message;
        }
    });
}

// DASHBOARD
async function loadDashboard() {

    if (!document.getElementById("totalApplications")) return;

    try {

        const result = await apiRequest(`${API}/dashboard`);

        const data = result.dashboard;

        document.getElementById("totalApplications").textContent = data.totalApplications;
        document.getElementById("saved").textContent = data.saved;
        document.getElementById("applied").textContent = data.applied;
        document.getElementById("interviews").textContent = data.interviews;
        document.getElementById("offers").textContent = data.offers;
        document.getElementById("rejected").textContent = data.rejected;
        document.getElementById("pendingReminders").textContent = data.pendingReminders;

    } catch (error) {
        console.log(error.message);
    }
}

loadDashboard();

// CREATE APPLICATION
const applicationForm = document.getElementById("applicationForm");

if (applicationForm) {

    applicationForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        try {

            const data = {
                companyName: document.getElementById("companyName").value,
                jobTitle: document.getElementById("jobTitle").value,
                location: document.getElementById("location").value,
                jobType: document.getElementById("jobType").value,
                workMode: document.getElementById("workMode").value,
                salary: Number(document.getElementById("salary").value) || 0,
                source: document.getElementById("source").value,
                jobUrl: document.getElementById("jobUrl").value,
                status: document.getElementById("status").value,
                appliedDate: document.getElementById("appliedDate").value,
                notes: document.getElementById("notes").value
            };

            await apiRequest(`${API}/applications`, "POST", data);

            alert("Application saved successfully!");

            window.location.href = "/applications";

        } catch (error) {

            alert(error.message);
        }
    });
}

// GET APPLICATIONS
async function loadApplications() {

    const table = document.getElementById("applicationsTable");

    if (!table) return;

    try {

        const result = await apiRequest(`${API}/applications`);

        const applications = result.applications || result.data || [];

        table.innerHTML = "";

        applications.forEach(application => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${application.companyName}</td>
                <td>${application.jobTitle}</td>
                <td>${application.status}</td>
                <td>${application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : "-"}</td>
                <td>
                    <button onclick="deleteApplication('${application._id}')">Delete</button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {

        console.log(error.message);
    }
}

loadApplications();

// DELETE APPLICATION
async function deleteApplication(id) {

    if (!confirm("Are you sure you want to delete this application?")) return;

    try {

        await apiRequest(`${API}/applications/${id}`, "DELETE");

        alert("Application deleted successfully!");

        loadApplications();

    } catch (error) {

        alert(error.message);
    }
}

// CREATE REMINDER
const reminderForm = document.getElementById("reminderForm");

if (reminderForm) {

    reminderForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        try {

            const data = {
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                reminderType: document.getElementById("reminderType").value,
                dueDate: document.getElementById("dueDate").value,
                status: document.getElementById("status").value
            };

            await apiRequest(`${API}/reminders`, "POST", data);

            alert("Reminder created successfully!");

            window.location.href = "/reminders";

        } catch (error) {

            alert(error.message);
        }
    });
}

// GET REMINDERS
async function loadReminders() {

    const table = document.getElementById("remindersTable");

    if (!table) return;

    try {

        const result = await apiRequest(`${API}/reminders`);

        const reminders = result.reminders || result.data || [];

        table.innerHTML = "";

        reminders.forEach(reminder => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${reminder.title}</td>
                <td>${reminder.reminderType}</td>
                <td>${new Date(reminder.dueDate).toLocaleString()}</td>
                <td>${reminder.status}</td>
                <td>
                    <button onclick="deleteReminder('${reminder._id}')">Delete</button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {

        console.log(error.message);
    }
}

loadReminders();

// DELETE REMINDER
async function deleteReminder(id) {

    if (!confirm("Delete this reminder?")) return;

    try {

        await apiRequest(`${API}/reminders/${id}`, "DELETE");

        alert("Reminder deleted!");

        loadReminders();

    } catch (error) {

        alert(error.message);
    }
}

// JOB ANALYSIS
const jobAnalysisForm = document.getElementById("jobAnalysisForm");

if (jobAnalysisForm) {

    jobAnalysisForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        try {

            const result = await apiRequest(
                `${API}/job-analysis`,
                "POST",
                {
                    jobDescription: document.getElementById("jobDescription").value
                }
            );

            const analysis = result.analysis;

            document.getElementById("analysisResult").innerHTML = `
                <h3>Analysis Result</h3>
                <p>Match Percentage: ${analysis.matchPercentage}%</p>
                <p>Matched Skills: ${analysis.matchedSkills.join(", ")}</p>
                <p>Missing Skills: ${analysis.missingSkills.join(", ")}</p>
            `;

        } catch (error) {

            alert(error.message);
        }
    });
}

// RESUME UPLOAD
const resumeForm = document.getElementById("resumeForm");

if (resumeForm) {

    resumeForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        try {

            const formData = new FormData();

            formData.append(
                "resume",
                document.getElementById("resumeFile").files[0]
            );

            await apiRequest(`${API}/resume`, "POST", formData);

            alert("Resume uploaded successfully!");

            loadResume();

        } catch (error) {

            alert(error.message);
        }
    });
}

// GET RESUME
async function loadResume() {

    const resumeDetails = document.getElementById("resumeDetails");

    if (!resumeDetails) return;

    try {

        const result = await apiRequest(`${API}/resume`);

        resumeDetails.innerHTML = `
            <p>Resume uploaded successfully</p>
            <a href="${result.resume.url}" target="_blank">View Resume</a>
        `;

    } catch (error) {

        resumeDetails.textContent = "No resume uploaded.";
    }
}

loadResume();

// DELETE RESUME
const deleteResumeButton = document.getElementById("deleteResume");

if (deleteResumeButton) {

    deleteResumeButton.addEventListener("click", async function () {

        if (!confirm("Delete your resume?")) return;

        try {

            await apiRequest(`${API}/resume`, "DELETE");

            alert("Resume deleted!");

            loadResume();

        } catch (error) {

            alert(error.message);
        }
    });
}

// PROFILE
async function loadProfile() {

    const profileForm = document.getElementById("profileForm");

    if (!profileForm) return;

    try {

        const result = await apiRequest(`${API}/profile`);

        const user = result.user || result.profile;

        document.getElementById("name").value = user.name || "";
        document.getElementById("email").value = user.email || "";
        document.getElementById("qualification").value = user.qualification || "";
        document.getElementById("graduationYear").value = user.graduationYear || "";
        document.getElementById("experienceYears").value = user.experienceYears || 0;
        document.getElementById("skills").value = (user.skills || []).join(", ");
        document.getElementById("locations").value = (user.preferences?.locations || []).join(", ");
        document.getElementById("minimumSalary").value = user.preferences?.minimumSalary || "";

    } catch (error) {

        console.log(error.message);
    }
}

loadProfile();

// UPDATE PROFILE
const profileForm = document.getElementById("profileForm");

if (profileForm) {

    profileForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        try {

            const data = {
                name: document.getElementById("name").value,
                qualification: document.getElementById("qualification").value,
                graduationYear: Number(document.getElementById("graduationYear").value),
                experienceYears: Number(document.getElementById("experienceYears").value),
                skills: document.getElementById("skills").value.split(",").map(skill => skill.trim()),
                preferences: {
                    locations: document.getElementById("locations").value.split(",").map(location => location.trim()),
                    workModes: Array.from(document.getElementById("workModes").selectedOptions).map(option => option.value),
                    minimumSalary: Number(document.getElementById("minimumSalary").value)
                }
            };

            await apiRequest(`${API}/profile`, "PUT", data);

            alert("Profile updated successfully!");

        } catch (error) {

            alert(error.message);
        }
    });
}

// LOGOUT
async function logout() {

    try {

        const refreshToken = localStorage.getItem("refreshToken");

        await apiRequest(`${API}/auth/logout`, "POST", {
            refreshToken
        });

    } catch (error) {

        console.log(error.message);

    } finally {

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";
    }
}