JobPilot API Documentation

Base URL

"http://localhost:3000/api"

1. Register

- Method: POST
- Endpoint: "/auth/register"
- Purpose: Create a new user account.
- Authentication: Not required.

Request body

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "ExamplePass123"
}

Success response — 201 Created

{
  "message": "Registration successful",
  "user": {
    "id": "USER_ID",
    "name": "Test User",
    "email": "test@example.com"
  }
}

Status codes

- "201" — Account created.
- "400" — Invalid input.
- "409" — Email already registered.
- "500" — Server error.

2. Login

- Method: POST
- Endpoint: "/auth/login"
- Purpose: Authenticate a user and return a JWT.
- Authentication: Not required.

Request body

{
  "email": "test@example.com",
  "password": "ExamplePass123"
}

Success response — 200 OK

{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Test User",
    "email": "test@example.com"
  }
}

Status codes

- "200" — Login successful.
- "400" — Invalid input.
- "401" — Invalid email or password.
- "500" — Server error.

3. Get Profile

- Method: GET
- Endpoint: "/auth/profile"
- Purpose: Retrieve the authenticated user's profile.
- Authentication: JWT required.

Request header

"Authorization: Bearer YOUR_JWT_TOKEN"

Success response — 200 OK

{
  "user": {
    "id": "USER_ID",
    "name": "Test User",
    "email": "test@example.com"
  }
}

Status codes

- "200" — Profile retrieved.
- "401" — Missing, invalid, or expired token.
- "404" — User not found.
- "500" — Server error.

4. Logout

- Method: POST
- Endpoint: "/auth/logout"
- Purpose: End the client's authenticated state.
- Authentication: JWT required.

Request header

"Authorization: Bearer YOUR_JWT_TOKEN"

Success response — 200 OK

{
  "message": "Logout successful. Please remove your token."
}

Status codes

- "200" — Logout response successful.
- "401" — Missing, invalid, or expired token.

Note: The current JWT implementation requires the client to delete its token after logout. It does not revoke a token on the server.

Security

- Passwords are hashed using bcrypt.
- JWTs expire after one hour.
- Profile and logout endpoints require authentication.
- Private environment variables must not be committed to GitHub.