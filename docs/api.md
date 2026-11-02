JobPilot — API Documentation

Project: Smart Job Application Tracking System
Backend: Node.js, Express.js, MongoDB, Mongoose
Base URL: "http://localhost:3000"

---

1. Authentication APIs

1.1 Register User

POST "/api/auth/register"

Registers a new user.

Request Body (JSON):

{
  "name": "Aiswar Krishna",
  "email": "aiswar@example.com",
  "password": "Password123"
}

1.2 Login User

POST "/api/auth/login"

Authenticates a registered user.

Request Body (JSON):

{
  "email": "aiswar@example.com",
  "password": "Password123"
}

Response: Returns authentication tokens and user information.

1.3 Refresh Token

POST "/api/auth/refresh-token"

Generates a new access token using a valid refresh token.

Request Body (JSON):

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}

1.4 Logout User

POST "/api/auth/logout"

Logs out the authenticated user and invalidates the refresh token.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

Request Body (JSON):

{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}

---

2. Profile APIs

2.1 Get Profile

GET "/api/profile"

Retrieves the logged-in user's profile.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

2.2 Update Profile

PUT "/api/profile"

Updates the logged-in user's profile information.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

Request Body (JSON):

{
  "name": "Aiswar Krishna",
  "email": "aiswar@example.com",
  "qualification": "B.Tech ECE",
  "graduationYear": 2025,
  "experienceYears": 0,
  "skills": ["HTML", "CSS", "JavaScript", "Node.js"],
  "preferences": {
    "locations": ["Trivandrum", "Kochi"],
    "workModes": ["ONSITE", "HYBRID"],
    "minimumSalary": 15000
  }
}

---

3. Resume APIs

3.1 Upload Resume

POST "/api/resume"

Uploads a resume to Cloudinary.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

Body: "multipart/form-data"

Key| Type| Value
"resume"| File| Your PDF resume

Restrictions: PDF format, maximum file size 5 MB.

3.2 Get Resume

GET "/api/resume"

Retrieves the logged-in user's uploaded resume information.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

3.3 Delete Resume

DELETE "/api/resume"

Deletes the logged-in user's uploaded resume.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

---

4. Job Application APIs

4.1 Create Job Application

POST "/api/applications"

Creates a new job application record.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

Request Body (JSON):

{
  "companyName": "ABC Technologies",
  "jobTitle": "Junior Developer",
  "location": "Technopark, Trivandrum",
  "jobType": "FULL_TIME",
  "workMode": "HYBRID",
  "salary": 20000,
  "source": "LinkedIn",
  "jobUrl": "https://example.com/job",
  "status": "APPLIED",
  "appliedDate": "2026-11-02",
  "notes": "Application submitted successfully"
}

4.2 Get All Job Applications

GET "/api/applications"

Retrieves all job applications belonging to the logged-in user.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

4.3 Get Single Job Application

GET "/api/applications/:id"

Retrieves a particular job application by its MongoDB ID.

Example:

GET /api/applications/672a1234567890abcdef1234

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

4.4 Update Job Application

PUT "/api/applications/:id"

Updates an existing job application.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

Request Body (JSON):

{
  "companyName": "ABC Technologies",
  "jobTitle": "Software Developer",
  "status": "INTERVIEW",
  "notes": "Interview scheduled"
}

4.5 Delete Job Application

DELETE "/api/applications/:id"

Deletes a job application by its ID.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

---

5. Reminder APIs

5.1 Create Reminder

POST "/api/reminders"

Creates a new reminder.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

Request Body (JSON):

{
  "title": "Follow up with HR",
  "description": "Check application status",
  "reminderType": "FOLLOW_UP",
  "dueDate": "2026-11-05T10:00:00.000Z",
  "status": "PENDING"
}

Reminder Types:

- "INTERVIEW"
- "FOLLOW_UP"
- "OTHER"

Reminder Statuses:

- "PENDING"
- "COMPLETED"
- "CANCELLED"

5.2 Get All Reminders

GET "/api/reminders"

Retrieves all reminders belonging to the logged-in user.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

5.3 Get Single Reminder

GET "/api/reminders/:id"

Retrieves a reminder by its ID.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

5.4 Update Reminder

PUT "/api/reminders/:id"

Updates an existing reminder.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

Request Body (JSON):

{
  "title": "Follow up with HR",
  "description": "Follow up regarding interview",
  "reminderType": "FOLLOW_UP",
  "dueDate": "2026-11-06T10:00:00.000Z",
  "status": "COMPLETED"
}

5.5 Delete Reminder

DELETE "/api/reminders/:id"

Deletes a reminder by its ID.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

---

6. Dashboard API

6.1 Get Dashboard Statistics

GET "/api/dashboard"

Retrieves application and reminder statistics for the logged-in user.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

Dashboard Statistics:

- "totalApplications"
- "saved"
- "applied"
- "interviews"
- "offers"
- "rejected"
- "pendingReminders"

---

7. Job Analysis API

7.1 Analyze Job Description

POST "/api/job-analysis"

Analyzes a job description and compares its required skills with the user's profile skills.

Headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

Request Body (JSON):

{
  "jobDescription": "We are looking for a developer with skills in HTML, CSS, JavaScript, Node.js, Express, and MongoDB."
}

Response Analysis:

- "totalSkills" — Total skills detected in the job description.
- "matchedSkills" — Skills matching the user's profile.
- "missingSkills" — Skills the user needs to learn.
- "matchPercentage" — Percentage of skills matched.

---

Authentication Notes

For all protected endpoints, include the access token in the request headers:

Authorization: Bearer YOUR_ACCESS_TOKEN

Token expiry:

- Access Token: 15 minutes
- Refresh Token: 7 days

When the access token expires, call the refresh-token API to obtain a new access token.

---

Common HTTP Status Codes

Status Code| Meaning
200| Request successful
201| Resource created
400| Bad request / validation error
401| Unauthorized / invalid or expired token
403| Forbidden
404| Resource or route not found
500| Internal server error

Important: Actual response fields and status codes may vary according to the implementation of your controllers.