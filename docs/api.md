# JobPilot API Documentation

## Project
JobPilot – Smart Job Application Tracking and Career Readiness System

## Base URL
http://localhost:3000/api

## Technology Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Multer

## Authentication
Protected APIs require a JWT access token.

Header:
Authorization: Bearer <accessToken>

---

# 1. Authentication APIs

## 1.1 Register User
POST /auth/register

### Request Body
{
  "name": "John",
  "email": "john@example.com",
  "password": "Password123"
}

### Response
{
  "message": "User registered successfully"
}

## 1.2 Login User
POST /auth/login

### Request Body
{
  "email": "john@example.com",
  "password": "Password123"
}

### Response
{
  "accessToken": "...",
  "refreshToken": "..."
}

## 1.3 Refresh Access Token
POST /auth/refresh-token

### Request Body
{
  "refreshToken": "..."
}

### Response
{
  "accessToken": "..."
}

## 1.4 Logout User
POST /auth/logout

### Request Body
{
  "refreshToken": "..."
}

### Response
{
  "message": "Logged out successfully"
}

---

# 2. Profile APIs

All profile APIs require authentication.

## 2.1 Get Profile
GET /profile

### Response
{
  "user": {
    "name": "John",
    "email": "john@example.com",
    "qualification": "B.Tech",
    "graduationYear": 2025,
    "experienceYears": 0,
    "skills": ["JavaScript", "Node.js"],
    "preferences": {
      "locations": ["Kerala"],
      "workModes": ["REMOTE"],
      "minimumSalary": 15000
    }
  }
}

## 2.2 Update Profile
PUT /profile

### Request Body
{
  "name": "John",
  "qualification": "B.Tech",
  "graduationYear": 2025,
  "experienceYears": 0,
  "skills": ["JavaScript", "Node.js"],
  "preferences": {
    "locations": ["Kerala", "Bangalore"],
    "workModes": ["REMOTE", "HYBRID"],
    "minimumSalary": 20000
  }
}

### Response
{
  "message": "Profile updated successfully"
}

---

# 3. Resume APIs

All resume APIs require authentication.

## 3.1 Upload Resume
POST /resume

### Content-Type
multipart/form-data

### Form Data
resume: <PDF file>

### Response
{
  "message": "Resume uploaded successfully",
  "resume": {
    "url": "...",
    "publicId": "..."
  }
}

## 3.2 Get Resume
GET /resume

### Response
{
  "message": "Resume found",
  "resume": {
    "url": "...",
    "publicId": "..."
  }
}

## 3.3 Download Resume
GET /resume/download

### Response
Downloads the uploaded resume as a PDF file.

## 3.4 Delete Resume
DELETE /resume

### Response
{
  "message": "Resume deleted successfully"
}

---

# 4. Job Application APIs

All job application APIs require authentication.

## 4.1 Create Job Application
POST /applications

### Request Body
{
  "companyName": "ABC Technologies",
  "jobTitle": "Software Developer",
  "jobLocation": "Kochi",
  "jobType": "FULL_TIME",
  "workMode": "HYBRID",
  "salary": 20000,
  "jobUrl": "https://example.com/job",
  "applicationDate": "2026-11-05",
  "status": "APPLIED",
  "notes": "Applied through company website"
}

## 4.2 Get All Applications
GET /applications

## 4.3 Get Single Application
GET /applications/:id

## 4.4 Update Application
PUT /applications/:id

### Request Body
{
  "companyName": "ABC Technologies",
  "jobTitle": "Software Developer",
  "status": "INTERVIEW",
  "notes": "Interview scheduled"
}

## 4.5 Delete Application
DELETE /applications/:id

---

# 5. Reminder APIs

All reminder APIs require authentication.

## 5.1 Create Reminder
POST /reminders

### Request Body
{
  "title": "Interview preparation",
  "reminderType": "INTERVIEW",
  "dueDate": "2026-11-10T10:00:00",
  "status": "PENDING",
  "notes": "Prepare technical questions",
  "applicationId": null
}

## 5.2 Get All Reminders
GET /reminders

## 5.3 Get Single Reminder
GET /reminders/:id

## 5.4 Update Reminder
PUT /reminders/:id

### Request Body
{
  "title": "Interview preparation",
  "reminderType": "INTERVIEW",
  "dueDate": "2026-11-10T10:00:00",
  "status": "COMPLETED",
  "notes": "Preparation completed"
}

## 5.5 Delete Reminder
DELETE /reminders/:id

---

# 6. Dashboard API

Requires authentication.

## 6.1 Get Dashboard Statistics
GET /dashboard

### Response
{
  "totalApplications": 10,
  "applied": 5,
  "interviews": 2,
  "offers": 1,
  "rejected": 2,
  "upcomingReminders": []
}

---

# 7. Job Analysis API

Requires authentication.

## 7.1 Analyze Job Description
POST /job-analysis

### Request Body
{
  "jobDescription": "We are looking for a Node.js developer with JavaScript, Express, MongoDB and REST API skills."
}

### Response
{
  "message": "Job analysis completed successfully",
  "analysis": {
    "totalSkills": 5,
    "matchedSkills": ["JavaScript", "Node.js"],
    "missingSkills": ["Express", "MongoDB", "REST API"],
    "matchPercentage": 40
  }
}

---

# 8. Application Status Values

- SAVED
- APPLIED
- ASSESSMENT
- INTERVIEW
- OFFER
- REJECTED

# 9. Reminder Type Values

- INTERVIEW
- FOLLOW_UP
- OTHER

# 10. Reminder Status Values

- PENDING
- COMPLETED
- CANCELLED

# 11. Work Mode Values

- ONSITE
- HYBRID
- REMOTE

# 12. Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Bad request |
| 401 | Unauthorized / Invalid token |
| 403 | Forbidden |
| 404 | Resource not found |
| 500 | Internal server error |

---

# End of Documentation