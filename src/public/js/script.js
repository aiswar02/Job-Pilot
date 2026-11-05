const API_BASE_URL ="https://job-pilot-1-czpi.onrender.com/api";

async function apiRequest(endpoint, method = "GET", data = null) {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
        "Authorization":`Bearer ${accessToken}`
    };

    if (!(data instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        headers: headers,
        body: data
            ? data instanceof FormData
                ? data
                : JSON.stringify(data)
            : null
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "API request failed");
    }

    return result;
}


// REGISTER


const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const data = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            };

            await apiRequest("/auth/register", "POST", data);

            alert("Registration successful! Please login.");

            window.location.href = "/login";

        } catch (error) {
            alert(error.message);
        }
    });
}


// LOGIN


const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const data = {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            };

            const result = await apiRequest("/auth/login", "POST", data);

            // Adjust these paths if your backend response differs
            const accessToken =
                result.accessToken ||
                result.result?.accessToken ||
                result.tokens?.accessToken;

            const refreshToken =
                result.refreshToken ||
                result.result?.refreshToken ||
                result.tokens?.refreshToken;

            if (!accessToken) {
                throw new Error("Access token not received from server");
            }

            localStorage.setItem("accessToken", accessToken);

            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            window.location.href = "/dashboard";

        } catch (error) {
            alert(error.message);
        }
    });
}


// DASHBOARD


async function loadDashboard() {
    try {
        const result = await apiRequest("/dashboard");

        const dashboard = result.dashboard || result.result?.dashboard || result;

        const fields = [
            "totalApplications",
            "saved",
            "applied",
            "interviews",
            "offers",
            "rejected",
            "pendingReminders"
        ];

        fields.forEach((field) => {
            const element = document.getElementById(field);

            if (element) {
                element.textContent = dashboard[field] ?? 0;
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error.message);
    }
}

if (document.getElementById("totalApplications")) {
    loadDashboard();
}

// ======================
// JOB APPLICATIONS
// ======================

async function loadApplications() {
    try {
        const result = await apiRequest("/applications");

        const applications =
            result.applications ||
            result.result?.applications ||
            result.data?.applications ||
            result.data ||
            [];

        const table = document.getElementById("applicationsTable");

        if (!table) return;

        table.innerHTML = "";

        if (!Array.isArray(applications) || applications.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="5">No applications found.</td>
                </tr>
            `;
            return;
        }

        applications.forEach((application) => {
            const row = document.createElement("tr");

            const appliedDate = application.appliedDate
                ? new Date(application.appliedDate).toLocaleDateString()
                : "-";

            row.innerHTML = `
                <td>${application.companyName || ""}</td>
                <td>${application.jobTitle || ""}</td>
                <td>${application.status || ""}</td>
                <td>${appliedDate}</td>
                <td>
                    <button onclick="viewApplication('${application._id}')">
                        View
                    </button>

                    <button onclick="editApplication('${application._id}')">
                        Edit
                    </button>

                    <button onclick="deleteApplication('${application._id}')">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Applications loading error:", error.message);
    }
}

if (document.getElementById("applicationsTable")) {
    loadApplications();
}

// APPLICATION SEARCH AND FILTER

const searchInput = document.getElementById("searchApplication");
const statusFilter = document.getElementById("filterStatus");

function filterApplications() {
    const searchText = searchInput?.value.toLowerCase() || "";
    const selectedStatus = statusFilter?.value || "";
    const table = document.getElementById("applicationsTable");

    if (!table) return;

    Array.from(table.querySelectorAll("tr")).forEach((row) => {
        const company = row.cells[0]?.textContent.toLowerCase() || "";
        const jobTitle = row.cells[1]?.textContent.toLowerCase() || "";
        const status = row.cells[2]?.textContent || "";

        const matchesSearch =
            company.includes(searchText) ||
            jobTitle.includes(searchText);

        const matchesStatus =
            !selectedStatus || status === selectedStatus;

        row.style.display =
            matchesSearch && matchesStatus ? "" : "none";
    });
}

if (searchInput) {
    searchInput.addEventListener("input", filterApplications);
}

if (statusFilter) {
    statusFilter.addEventListener("change", filterApplications);
}



// CREATE APPLICATION

/* =====================================
   CREATE AND EDIT APPLICATION
===================================== */

const applicationForm = document.getElementById("applicationForm");

if (applicationForm) {

    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");

    // LOAD APPLICATION FOR EDITING
    if (editId) {

        const heading = document.querySelector("h2");

        if (heading) {
            heading.textContent = "Edit Job Application";
        }

        const submitButton = applicationForm.querySelector(
            "button[type='submit']"
        );

        if (submitButton) {
            submitButton.textContent = "Update Application";
        }

        async function loadEditApplication() {

            try {

                const result = await apiRequest(`/applications/${editId}`);

                const application =
                    result.application ||
                    result.result?.application ||
                    result.data?.application ||
                    result.data ||
                    result;

                fillApplicationForm(application);

            } catch (error) {

                alert("Failed to load application: " + error.message);

                console.error("Load application error:", error);
            }
        }

        function fillApplicationForm(application) {

            document.getElementById("companyName").value =
                application.companyName || "";

            document.getElementById("jobTitle").value =
                application.jobTitle || "";

            document.getElementById("location").value =
                application.location || "";

            document.getElementById("jobType").value =
                application.jobType || "FULL_TIME";

            document.getElementById("workMode").value =
                application.workMode || "ONSITE";

            document.getElementById("salary").value =
                application.salary || "";

            document.getElementById("source").value =
                application.source || "";

            document.getElementById("jobUrl").value =
                application.jobUrl || "";

            document.getElementById("status").value =
                application.status || "SAVED";

            if (application.appliedDate) {

                const date = new Date(application.appliedDate);

                document.getElementById("appliedDate").value =
                    date.toISOString().split("T")[0];
            }

            document.getElementById("notes").value =
                application.notes || "";
        }

        loadEditApplication();
    }


    // SUBMIT APPLICATION FORM
    applicationForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const applicationData = {

            companyName:
                document.getElementById("companyName").value.trim(),

            jobTitle:
                document.getElementById("jobTitle").value.trim(),

            location:
                document.getElementById("location").value.trim(),

            jobType:
                document.getElementById("jobType").value,

            workMode:
                document.getElementById("workMode").value,

            salary:
                document.getElementById("salary").value,

            source:
                document.getElementById("source").value.trim(),

            jobUrl:
                document.getElementById("jobUrl").value.trim(),

            status:
                document.getElementById("status").value,

            appliedDate:
                document.getElementById("appliedDate").value,

            notes:
                document.getElementById("notes").value.trim()
        };

        try {

            if (editId) {

                await apiRequest(
                    `/applications/${editId}`,
                    "PUT",
                    applicationData
                );

                alert("Application updated successfully!");

            } else {

                await apiRequest(
                    `/applications`,
                    "POST",
                    applicationData
                );

                alert("Application added successfully!");
            }

            localStorage.removeItem("selectedApplication");

            window.location.href = "/applications";

        } catch (error) {

            alert("Failed to save application: " + error.message);

            console.error("Submit application error:", error);
        }
    });
}


/* =====================================
   VIEW APPLICATION
===================================== */

async function viewApplication(id) {

    try {

        const result = await apiRequest(`/applications/${id}`);

        const application =
            result.application ||
            result.result?.application ||
            result.data?.application ||
            result.data ||
            result;

        localStorage.setItem(
            "selectedApplication",
            JSON.stringify(application)
        );

        window.location.href = `/applications/details?id=${id}`;

    } catch (error) {

        alert("Failed to view application: " + error.message);

        console.error("View application error:", error);
    }
}


/* =====================================
   EDIT APPLICATION
===================================== */

async function editApplication(id) {

    window.location.href = `/applications/add?edit=${id}`;

}


/* =====================================
   DISPLAY APPLICATION DETAILS
===================================== */

const applicationDetails =
    document.getElementById("applicationDetails");

if (applicationDetails) {

    const application = JSON.parse(
        localStorage.getItem("selectedApplication") || "{}"
    );

    applicationDetails.innerHTML = `
        <h2>${application.companyName || ""}</h2>

        <p>Job Title: ${application.jobTitle || ""}</p>

        <p>Location: ${application.location || ""}</p>

        <p>Status: ${application.status || ""}</p>

        <p>Work Mode: ${application.workMode || ""}</p>

        <p>Salary: ${application.salary || ""}</p>

        <p>Source: ${application.source || ""}</p>

        <p>Notes: ${application.notes || ""}</p>
    `;
}


/* =====================================
   DELETE APPLICATION
===================================== */

async function deleteApplication(id) {

    if (!confirm("Are you sure you want to delete this application?")) {
        return;
    }

    try {

        await apiRequest(`/applications/${id}`, "DELETE");

        alert("Application deleted successfully!");

        await loadApplications();

    } catch (error) {

        alert("Failed to delete application: " + error.message);

        console.error("Delete application error:", error);
    }
}


// ======================
// REMINDERS
// ======================

async function loadReminders() {
    try {
        const result = await apiRequest("/reminders");

        const reminders =
            result.reminders ||
            result.result?.reminders ||
            result.data ||
            [];

        const table = document.getElementById("remindersTable");

        if (!table) return;

        table.innerHTML = "";

        reminders.forEach((reminder) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${reminder.title || ""}</td>
                <td>${reminder.reminderType || ""}</td>
                <td>${reminder.dueDate ? new Date(reminder.dueDate).toLocaleDateString() : ""}</td>
                <td>${reminder.status || ""}</td>
                <td>
                    <button onclick="deleteReminder('${reminder._id}')">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);
        });

    } catch (error) {
        console.error("Reminder error:", error.message);
    }
}

if (document.getElementById("remindersTable")) {
    loadReminders();
}

// CREATE REMINDER

async function loadReminders() {
    try {
        const result = await apiRequest("/reminders");

        const reminders =
            result.reminders ||
            result.result?.reminders ||
            result.data ||
            [];

        const table = document.getElementById("remindersTable");

        if (!table) return;

        table.innerHTML = "";

        if (reminders.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="5">No reminders found.</td>
                </tr>
            `;
            return;
        }

        reminders.forEach((reminder) => {
            const row = document.createElement("tr");

            const dueDate = reminder.dueDate
                ? new Date(reminder.dueDate).toLocaleDateString()
                : "-";

            row.innerHTML = `
                <td>${reminder.title || reminder.description || ""}</td>
                <td>${reminder.reminderType || ""}</td>
                <td>${dueDate}</td>
                <td>${reminder.status || ""}</td>
                <td>
                    <button onclick="editReminder('${reminder._id}')">
                        Edit
                    </button>

                    <button onclick="completeReminder('${reminder._id}')">
                        Complete
                    </button>

                    <button onclick="deleteReminder('${reminder._id}')">
                        Delete
                    </button>
                </td>
            `;

            table.appendChild(row);
        });

        // SEARCH AND FILTER
        const searchInput = document.getElementById("searchReminder");
        const statusFilter = document.getElementById("filterReminderStatus");

        function filterReminders() {
            const searchText = searchInput.value.toLowerCase();
            const selectedStatus = statusFilter.value;

            Array.from(table.querySelectorAll("tr")).forEach((row) => {
                const title = row.cells[0]?.textContent.toLowerCase() || "";
                const type = row.cells[1]?.textContent.toLowerCase() || "";
                const status = row.cells[3]?.textContent || "";

                const matchesSearch =
                    title.includes(searchText) ||
                    type.includes(searchText);

                const matchesStatus =
                    !selectedStatus || status === selectedStatus;

                row.style.display =
                    matchesSearch && matchesStatus ? "" : "none";
            });
        }

        if (searchInput) {
            searchInput.oninput = filterReminders;
        }

        if (statusFilter) {
            statusFilter.onchange = filterReminders;
        }

    } catch (error) {
        console.error("Reminder error:", error.message);
    }
}

if (document.getElementById("remindersTable")) {
    loadReminders();
}


// CREATE AND EDIT REMINDER


const reminderForm = document.getElementById("reminderForm");

if (reminderForm) {

    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");

    // LOAD EXISTING REMINDER FOR EDITING
    if (editId) {

        document.getElementById("reminderFormTitle").textContent =
            "Edit Reminder";

        document.getElementById("saveReminderBtn").textContent =
            "Update Reminder";

        async function loadReminderForEdit() {
            try {
                const result = await apiRequest(`/reminders/${editId}`);

                const reminder =
                    result.reminder ||
                    result.result?.reminder ||
                    result.data?.reminder ||
                    result.data ||
                    result;

                document.getElementById("title").value =
                    reminder.title || "";

                document.getElementById("reminderType").value =
                    reminder.reminderType || "OTHER";

                document.getElementById("status").value =
                    reminder.status || "PENDING";

                document.getElementById("notes").value =
                    reminder.notes || "";

                if (reminder.dueDate) {
                    const date = new Date(reminder.dueDate);

                    const localDate = new Date(
                        date.getTime() -
                        date.getTimezoneOffset() * 60000
                    );

                    document.getElementById("dueDate").value =
                        localDate.toISOString().slice(0, 16);
                }

            } catch (error) {
                alert("Failed to load reminder: " + error.message);
                console.error("Load reminder error:", error);
            }
        }

        loadReminderForEdit();
    }


    // SAVE NEW REMINDER OR UPDATE EXISTING REMINDER
    reminderForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const reminderData = {
            title: document.getElementById("title").value.trim(),

            reminderType:
                document.getElementById("reminderType").value,

            dueDate:
                document.getElementById("dueDate").value,

            status:
                document.getElementById("status").value,

            notes:
                document.getElementById("notes").value.trim()
        };

        try {

            if (editId) {

                await apiRequest(
                    `/reminders/${editId}`,
                    "PUT",
                    reminderData
                );

                alert("Reminder updated successfully!");

            } else {

                await apiRequest(
                    "/reminders",
                    "POST",
                    reminderData
                );

                alert("Reminder added successfully!");
            }

            window.location.href = "/reminders";

        } catch (error) {

            alert("Failed to save reminder: " + error.message);

            console.error("Save reminder error:", error);
        }
    });
}


/* =====================================
   EDIT REMINDER
===================================== */

async function editReminder(id) {

    window.location.href = `/reminders/add?edit=${id}`;

}


/* =====================================
   COMPLETE REMINDER
===================================== */

async function completeReminder(id) {

    try {

        await apiRequest(`/reminders/${id}`, "PUT", {
            status: "COMPLETED"
        });

        alert("Reminder marked as completed!");

        await loadReminders();

    } catch (error) {

        alert("Failed to complete reminder: " + error.message);

        console.error("Complete reminder error:", error);
    }
}


/* =====================================
   DELETE REMINDER
===================================== */

async function deleteReminder(id) {

    if (!confirm("Are you sure you want to delete this reminder?")) {
        return;
    }

    try {

        await apiRequest(`/reminders/${id}`, "DELETE");

        alert("Reminder deleted successfully!");

        await loadReminders();

    } catch (error) {

        alert("Failed to delete reminder: " + error.message);

        console.error("Delete reminder error:", error);
    }
}
// ======================
// JOB ANALYSIS
// ======================

const jobAnalysisForm = document.getElementById("jobAnalysisForm");

if (jobAnalysisForm) {
    jobAnalysisForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const jobDescription =
                document.getElementById("jobDescription").value;

            const result = await apiRequest(
                "/job-analysis",
                "POST",
                { jobDescription }
            );

            const analysis =
                result.analysis ||
                result.result?.analysis ||
                result;

            const output = document.getElementById("analysisResult");

            output.innerHTML = `
                <h2>Job Match: ${analysis.matchPercentage ?? 0}%</h2>

                <p>Total Skills: ${analysis.totalSkills ?? 0}</p>

                <h3>Matched Skills</h3>
                <p>${(analysis.matchedSkills || []).join(", ")}</p>

                <h3>Missing Skills</h3>
                <p>${(analysis.missingSkills || []).join(", ")}</p>
            `;

        } catch (error) {
            alert(error.message);
        }
    });
}


//    RESUME UPLOAD


const resumeForm = document.getElementById("resumeForm");

if (resumeForm) {

    resumeForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const fileInput = document.getElementById("resumeFile");
        const message = document.getElementById("message");

        if (!fileInput.files.length) {
            message.textContent = "Please select a PDF file.";
            return;
        }

        const file = fileInput.files[0];

        if (file.type !== "application/pdf") {
            message.textContent = "Only PDF files are allowed.";
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {

            message.textContent = "Uploading resume...";

            const result = await apiRequest(
                "/resume",
                "POST",
                formData
            );

            message.textContent = "Resume uploaded successfully!";

            fileInput.value = "";

            await loadResume();

        } catch (error) {

            message.textContent =
                "Upload failed: " + error.message;

            console.error("Resume upload error:", error);
        }
    });
}


/* =====================================
   LOAD RESUME
===================================== */

async function loadResume() {
    const resumeDetails = document.getElementById("resumeDetails");

    try {
        const result = await apiRequest("/resume");

        if (result.resume && result.resume.url) {

            resumeDetails.innerHTML = `
                <h3>Uploaded Resume</h3>
                

                <button type="button" id="downloadResumeButton">
                    Download Resume (PDF)
                </button>

                <button type="button" id="deleteResume">
                    Delete Resume
                </button>
            `;

            document.getElementById("downloadResumeButton")
                .addEventListener("click", downloadResumeFile);

            document.getElementById("deleteResume")
                .addEventListener("click", deleteResume);

        } else {

            resumeDetails.innerHTML = `
                <h3>No Resume Uploaded</h3>
                <p>Please upload your resume in PDF format.</p>
            `;
        }

    } catch (error) {

        console.error("Load Resume Error:", error);

        resumeDetails.innerHTML = `
            <p>Unable to load resume details.</p>
        `;
    }
}

loadResume();

async function downloadResumeFile() {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(
            `${API_BASE_URL}/resume/download`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Download API error:", errorData);

            alert(errorData.message || "Unable to download resume");
            return;
        }

        const blob = await response.blob();

        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "resume.pdf";

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
        console.error("Download error:", error);
        alert("Unable to download resume");
    }
}

// ======================
// PROFILE
// ======================

// GET PROFILE

async function loadProfile() {
    try {
        const result = await apiRequest("/profile");

        const profile = result.profile || result.result?.profile || result;

        if (document.getElementById("name")) {
            document.getElementById("name").value = profile.name || "";
        }

        if (document.getElementById("email")) {
            document.getElementById("email").value = profile.email || "";
        }

        if (document.getElementById("qualification")) {
            document.getElementById("qualification").value =
                profile.qualification || "";
        }

        if (document.getElementById("graduationYear")) {
            document.getElementById("graduationYear").value =
                profile.graduationYear || "";
        }

        if (document.getElementById("experienceYears")) {
            document.getElementById("experienceYears").value =
                profile.experienceYears || 0;
        }

        if (document.getElementById("skills")) {
            document.getElementById("skills").value =
                (profile.skills || []).join(", ");
        }

        if (document.getElementById("locations")) {
            document.getElementById("locations").value =
                (profile.preferences?.locations || []).join(", ");
        }

        if (document.getElementById("minimumSalary")) {
            document.getElementById("minimumSalary").value =
                profile.preferences?.minimumSalary || "";
        }

    } catch (error) {
        console.error("Profile error:", error.message);
    }
}

if (document.getElementById("profileForm")) {
    loadProfile();
}

// UPDATE PROFILE

const profileForm = document.getElementById("profileForm");

if (profileForm) {
    profileForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const selectedWorkModes = Array.from(
                document.querySelectorAll(
                    'input[name="workModes"]:checked'
                )
            ).map((input) => input.value);

            const data = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                qualification: document.getElementById("qualification").value,
                graduationYear: Number(
                    document.getElementById("graduationYear").value
                ),
                experienceYears: Number(
                    document.getElementById("experienceYears").value
                ),
                skills: document.getElementById("skills").value
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),
                preferences: {
                    locations: document.getElementById("locations").value
                        .split(",")
                        .map((location) => location.trim())
                        .filter(Boolean),
                    workModes: selectedWorkModes,
                    minimumSalary: Number(
                        document.getElementById("minimumSalary").value
                    )
                }
            };

            await apiRequest("/profile", "PUT", data);

            alert("Profile updated successfully!");

        } catch (error) {
            alert(error.message);
        }
    });
}

// ======================
// LOGOUT
// ======================

async function logout() {
    try {
        await apiRequest("/auth/logout", "POST", {
            refreshToken: localStorage.getItem("refreshToken")
        });
    } catch (error) {
        console.log("Logout API error:", error.message);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("selectedApplication");

    window.location.href = "/login";
}