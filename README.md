# Project - Assignment Submission Portal API

## Overview
Express backend service with MongoDB for managing assignment submissions.

## Technologies
- **NodeJS**
- **ExpressJS**
- **MongoDB**

## Set-up instructions
- Install required packages using `npm install`.
- Setup **.env** file using the given **env-example** file.
- To test the API endpoints, visit the [swagger page][Swagger URL].
- For OAuth login, visit the [base url][Base URL]. On successful login, a Bearer token is returned, which can be used to login in the [swagger page][Swagger URL].

[Base URL]: https://assignment-submission-api.onrender.com
[Swagger URL]: https://assignment-submission-api.onrender.com/api-docs


## API Endpoints

### 1. Register user -

**Endpoint:** `POST /register`

**Description:** Registers a new user

**Request Body:**
```json
{
  "name": "User name",
  "email": "user1@email.com",
  "password": "string",
  "role": "user"
}
```

**Features:**

- Checks if user with given email already exists. If yes an error is thrown - 'User already exists'.
- Creates a new user if no user exists with given email.
- Password is saved as a hash. 

---

### 2. User Login -

**Endpoint:** `POST /login`

**Description:** Login for existing users

**Request Body:**
```json
{
  "email": "user1@email.com",
  "password": "string"
}
```

**Features:**

- Checks if a user with given email id exists.
- If found, validates the password. If credentials don't match, throws an error - 'Invalid credentials'. Else, returns the generated bearer token.
- If no user is found, throws an error - 'User with given email id not found'.

---

### 3. Upload Assignment -

**Endpoint:** `POST /upload`

**Description:** For uploading assignment submissions

**Request Body:**
```json
{
  "task": "Sample task",
  "admin": "id-string"
}
```

**Features:**

- Creates assignment submissions
- Checks if admin user with given id exists. If not, throws an error - 'Admin with given id not found'.

---

### 4. Get all admins -

**Endpoint:** `GET /admins`

**Description:** Retrieves a list of all available admins

--- 

### 5. Get all assignments for given admin -

**Endpoint:** `GET /assignments`

**Description:** Retrieves all assignment submissions for the given admin

---

### 6. Accept assignment -

**Endpoint:** `POST /assignments/{id}/accept`

**Description:** Accepts assignment submission using given assignment id

**Features:**

- Accepts submissions
- Checks if assignment submission with given id exists. If not, throws an error - 'Assignment with given id not found'.

---

### 7. Reject assignment -

**Endpoint:** `POST /assignments/{id}/reject`

**Description:** Rejects assignment submission using given assignment id

**Features:**

- Rejects submissions
- Checks if assignment submission with given id exists. If not, throws an error - 'Assignment with given id not found'.



