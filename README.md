# JobPilot – Smart Job Application Tracking System

## About the Project

JobPilot is a web-based application designed to help fresh graduates and job seekers manage their job applications in one place.

Users can track applications from different sources, manage interview schedules, set follow-up reminders, and analyse their readiness for target job roles.

## Problem Statement

Job seekers often apply through multiple platforms, company websites, and emails. Managing application statuses, interview dates, and follow-ups separately can be difficult.

JobPilot aims to simplify this process through a centralised dashboard.

## Features

- User registration and login
- Secure password hashing using bcrypt
- JWT-based authentication
- Add, view, update, and delete job applications
- Track application statuses
- Manage interview and follow-up reminders
- Dashboard with job-search statistics
- Resume Analysis
- Job Fit Checker to identify matched and missing skills

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- ODM: Mongoose
- Authentication: bcrypt and JSON Web Token (JWT)
- API Testing: Postman
- Version Control: Git and GitHub

## Project Structure

- models/ – MongoDB schemas and models
- views/ – Frontend HTML pages
- controllers/ – Application logic
- routes/ – API route definitions
- middleware/ – Authentication and error handling
- config/ – Database configuration
- public/ – CSS, JavaScript, and images

## Installation

1. Clone the repository:

   bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   

2. Open the project folder:

   bash
   cd JobPilot
   

3. Install dependencies:

   bash
   npm install
   

4. Create a .env file in the root folder and configure:

   env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   

5. Start the development server using the script configured in package.json.

## Project Status

Currently under development.

## Future Enhancements


- Interview preparation
- Advanced job-readiness analysis
- Improved dashboard analytics
- Notifications and reminders

## Author

Developed as a full-stack web development project