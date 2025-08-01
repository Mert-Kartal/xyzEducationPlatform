# Education Platform API

This repository contains the backend API for an education platform, built with NestJS and Prisma. It provides functionalities for user authentication, user management, question management, test creation and administration, and answer submission and evaluation.

## Table of Contents
- [Project Description](#project-description)
- [Installation Steps](#installation-steps)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Question Management](#question-management)
  - [Test Management](#test-management)
  - [Answer Management](#answer-management)
  - [Admin Endpoints](#admin-endpoints)
- [Example Requests and Responses](#example-requests-and-responses)

## Project Description

The Education Platform API is a robust backend system designed to support an online learning environment. It manages various aspects of an educational platform, including:

- **User Authentication & Authorization**: Secure registration, login, logout, and token refresh mechanisms with JWT. Role-based access control for Students, Professors, and Admins.
- **User Management**: Creation, retrieval, update, and deletion of user accounts.
- **Question Management**: Creation, retrieval, update, and deletion of multiple-choice questions with associated options. Professors can manage their questions and options.
- **Test Management**: Creation, retrieval, update, and deletion of tests. Tests can be composed of multiple questions. Professors can manage their tests and add/remove questions.
- **Answer Management**: Students can submit answers for tests. The system evaluates answers and provides results. Admins and Professors can view submitted answers.
- **Administrative Functions**: Comprehensive set of endpoints for administrators to manage users, questions, options, tests, and answers.

The API is built using [NestJS](https://nestjs.com/), a progressive Node.js framework, and [Prisma](https://www.prisma.io/), a next-generation ORM for Node.js and TypeScript. It uses a PostgreSQL database (or any other database supported by Prisma).

## Installation Steps

Follow these steps to set up and run the project locally.

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- PostgreSQL (or your preferred database, configured in `schema.prisma`)
- Git

### 1. Clone the repository

```bash
git clone <repository-url>
cd xyzEducationPlatform/api 
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the `api` directory based on `.env.example`.

```
DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"
JWT_SECRET="your_jwt_secret_key"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_key"
PORT=3000
```

- `DATABASE_URL`: Your database connection string.
- `JWT_SECRET`: A strong secret key for signing JWT access tokens.
- `JWT_REFRESH_SECRET`: A strong secret key for signing JWT refresh tokens.
- `PORT`: The port on which the API will run (default is `3000`).

### 4. Setup Database and Run Migrations

```bash
npx prisma migrate dev --name init
```

This command will create the database tables based on your Prisma schema.

### 5. Start the Application

```bash
npm run start:dev
# or
yarn start:dev
```

The API will be running at `http://localhost:3000/api` (or your configured port).

## API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint          | Description                                 | Roles      |
|--------|-------------------|---------------------------------------------|------------|
| `POST` | `/api/auth/register` | Register a new user.                        | `Public`   |
| `POST` | `/api/auth/login`    | Log in a user and get JWT tokens.           | `Public`   |
| `POST` | `/api/auth/logout`   | Invalidate the current session token.       | `All`      |
| `POST` | `/api/auth/refresh`  | Refresh access token using refresh token.   | `All`      |

### User Management

| Method | Endpoint          | Description                                 | Roles      |
|--------|-------------------|---------------------------------------------|------------|
| `GET`  | `/api/users/me`      | Get the profile of the authenticated user.  | `All`      |
| `PATCH`| `/api/users/me`      | Update the profile of the authenticated user. | `All`      |
| `DELETE`| `/api/users/me`      | Delete the authenticated user's account (soft delete). | `All`      |

### Question Management

| Method | Endpoint                         | Description                                            | Roles       |
|--------|----------------------------------|--------------------------------------------------------|-------------|
| `POST` | `/api/questions`                 | Create a new question.                                 | `Professor` |
| `GET`  | `/api/questions`                 | List all questions.                                    | `All`       |
| `GET`  | `/api/questions/search?field={field}` | Search questions by field (e.g., `MATH`, `SCIENCE`). | `All`       |
| `GET`  | `/api/questions/author/:authorId` | List questions by author ID.                           | `All`       |
| `GET`  | `/api/questions/:id`             | Get a single question by ID, including options.        | `All`       |
| `PATCH`| `/api/questions/:id`             | Update a question by ID.                               | `Professor` |
| `DELETE`| `/api/questions/:id`             | Delete a question by ID (soft delete).                 | `Professor` |
| `POST` | `/api/questions/:id/options`     | Add an option to a question.                           | `Professor` |
| `PATCH`| `/api/questions/:id/options/:optionId` | Update an option for a question.                     | `Professor` |
| `DELETE`| `/api/questions/:id/options/:optionId` | Delete an option from a question.                    | `Professor` |

### Test Management

| Method | Endpoint                                   | Description                                       | Roles       |
|--------|--------------------------------------------|---------------------------------------------------|-------------|
| `POST` | `/api/tests`                               | Create a new test.                                | `Professor` |
| `GET`  | `/api/tests`                               | List all tests.                                   | `All`       |
| `GET`  | `/api/tests/search?field={field}`          | Search tests by field.                            | `All`       |
| `GET`  | `/api/tests/:id`                           | Get a single test by ID, including questions.     | `All`       |
| `GET`  | `/api/tests/search/author/:authorId`       | List tests by author ID.                          | `All`       |
| `PATCH`| `/api/tests/:id`                           | Update a test by ID.                              | `Professor` |
| `DELETE`| `/api/tests/:id`                           | Delete a test by ID (soft delete).                | `Professor` |
| `POST` | `/api/tests/:id/questions/:questionId`     | Add a question to a test.                         | `Professor` |
| `DELETE`| `/api/tests/:id/questions/:questionId`     | Remove a question from a test.                    | `Professor` |

### Answer Management

| Method | Endpoint                                   | Description                                       | Roles       |
|--------|--------------------------------------------|---------------------------------------------------|-------------|
| `POST` | `/api/tests/:id/answers`                   | Submit answers for a test.                        | `Student`   |
| `GET`  | `/api/tests/answers/solved`                | Get all tests solved by the authenticated student.| `Student`   |
| `GET`  | `/api/tests/:id/answers/all`               | Get all answers for a specific test.              | `Professor` |
| `GET`  | `/api/tests/:id/answers`                   | Get authenticated student's answers for a test.   | `Student`   |
| `GET`  | `/api/tests/:id/answers/:userId`           | Get a specific user's answers for a given test.   | `Professor` |

### Admin Endpoints

All admin endpoints are prefixed with `/api/admin` and require an `Admin` role.

#### User Administration

| Method | Endpoint             | Description                           |
|--------|----------------------|---------------------------------------|
| `POST` | `/api/admin/users`   | Create a new user.                    |
| `GET`  | `/api/admin/users`   | List all users.                       |
| `GET`  | `/api/admin/users/:id` | Get a single user by ID.              |
| `PATCH`| `/api/admin/users/:id` | Update a user by ID.                  |
| `DELETE`| `/api/admin/users/:id` | Delete a user by ID (soft delete).    |

#### Content Administration

| Method | Endpoint                                | Description                                       |
|--------|-----------------------------------------|---------------------------------------------------|
| `DELETE`| `/api/admin/questions/:id`              | Delete a question by ID (soft delete).            |
| `DELETE`| `/api/admin/questions/:id/options/:optionId` | Delete an option from a question.                 |
| `DELETE`| `/api/admin/tests/:id`                  | Delete a test by ID (soft delete).                |

#### Answer Oversight

| Method | Endpoint                                  | Description                                           |
|--------|-------------------------------------------|-------------------------------------------------------|
| `GET`  | `/api/admin/tests/:testId/answers/:userId` | Get a specific user's answers for a given test.       |
| `GET`  | `/api/admin/tests/:testId/answers`        | Get all answers for a specific test.                  |
| `GET`  | `/api/admin/tests/users/:userId/answers`  | Get all answers submitted by a specific user.         |

## Example Requests and Responses

The base URL for all API requests is `http://localhost:3000/api` (or your configured port and global prefix).

### 1. Register a New User

**Request (Student Role)**
```bash
curl -X POST \
  http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Student User",
    "email": "student@example.com",
    "password": "password123",
    "role": "Student"
  }'
```

**Response**
```json
{
  "user": {
    "id": "uuid-of-student-user",
    "email": "student@example.com",
    "name": "Student User",
    "role": "Student",
    "field": null,
    "deletedAt": null,
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### 2. Login User

**Request**
```bash
curl -X POST \
  http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

**Response**
```json
{
  "user": {
    "id": "uuid-of-student-user",
    "email": "student@example.com",
    "name": "Student User",
    "role": "Student",
    "field": "ComputerScience",
    "deletedAt": null,
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### 3. Get Authenticated User Profile

**Request**
```bash
curl -X GET \
  http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <your_access_token>"
```

**Response**
```json
{
  "id": "uuid-of-student-user",
  "email": "student@example.com",
  "name": "Student User",
  "role": "Student",
  "field": "ComputerScience",
  "deletedAt": null,
  "createdAt": "2023-10-27T10:00:00.000Z",
  "updatedAt": "2023-10-27T10:00:00.000Z"
}
```

### 4. Create a Question (Professor Role)

**Request**
```bash
curl -X POST \
  http://localhost:3000/api/questions \
  -H "Authorization: Bearer <professor_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "What is the capital of France?",
    "type": "MULTIPLE_CHOICE",
    "isCorrect": false
  }'
```

**Response**
```json
{
  "id": "uuid-of-new-question",
  "content": "What is the capital of France?",
  "type": "MULTIPLE_CHOICE",
  "isCorrect": false,
  "authorId": "uuid-of-professor-user",
  "field": "SCIENCE",
  "deletedAt": null,
  "createdAt": "2023-10-27T10:30:00.000Z",
  "updatedAt": "2023-10-27T10:30:00.000Z"
}
```

### 5. Add Options to a Question (Professor Role)

**Request (Option A - Correct)**
```bash
curl -X POST \
  http://localhost:3000/api/questions/uuid-of-new-question/options \
  -H "Authorization: Bearer <professor_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "optionText": "Paris",
    "optionType": "A",
    "isCorrect": true
  }'
```

**Request (Option B - Incorrect)**
```bash
curl -X POST \
  http://localhost:3000/api/questions/uuid-of-new-question/options \
  -H "Authorization: Bearer <professor_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "optionText": "Berlin",
    "optionType": "B",
    "isCorrect": false
  }'
```

**Response (for each option creation)**
```json
{
  "id": "uuid-of-new-option",
  "optionText": "Paris",
  "optionType": "A",
  "isCorrect": true,
  "questionId": "uuid-of-new-question",
  "createdAt": "2023-10-27T10:35:00.000Z",
  "updatedAt": "2023-10-27T10:35:00.000Z"
}
```

### 6. Create a Test (Professor Role)

**Request**
```bash
curl -X POST \
  http://localhost:3000/api/tests \
  -H "Authorization: Bearer <professor_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Geography Quiz",
    "description": "A test to assess geographical knowledge.",
  }'
```

**Response**
```json
{
  "id": "uuid-of-new-test",
  "title": "Geography Quiz",
  "description": "A test to assess geographical knowledge.",
  "authorId": "uuid-of-professor-user",
  "field": "SCIENCE",
  "deletedAt": null,
  "createdAt": "2023-10-27T11:00:00.000Z",
  "updatedAt": "2023-10-27T11:00:00.000Z"
}
```

### 7. Add a Question to a Test (Professor Role)

**Request**
```bash
curl -X POST \
  http://localhost:3000/api/tests/uuid-of-new-test/questions/uuid-of-new-question \
  -H "Authorization: Bearer <professor_access_token>"
```

**Response**
```json
{
  "testId": "uuid-of-new-test",
  "questionId": "uuid-of-new-question",
  "createdAt": "2023-10-27T11:05:00.000Z"
}
```

### 8. Submit Answers for a Test (Student Role)

**Request**
```bash
curl -X POST \
  http://localhost:3000/api/tests/uuid-of-new-test/answers \
  -H "Authorization: Bearer <student_access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {
        "questionId": "uuid-of-new-question",
        "optionId": "uuid-of-correct-option-for-question"
      }
    ]
  }'
```

**Response**
```json
{
  "message": "Answers added successfully"
}
```

### 9. Get Student's Answers for a Test

**Request (Student Role)**
```bash
curl -X GET \
  http://localhost:3000/api/tests/uuid-of-new-test/answers \
  -H "Authorization: Bearer <student_access_token>"
```

**Response**
```json
{
  "answers": [
    {
      "Question": {
        "content": "What is the capital of France?"
      },
      "Option": {
        "optionText": "Paris"
      },
      "answer": "A",
      "isCorrect": true
    }
  ],
  "message": "You have answered 1 questions correctly out of 1 questions. Your correct answer rate is 100%"
}
```

### 10. List All Users (Admin Role)

**Request**
```bash
curl -X GET \
  http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer <admin_access_token>"
```

**Response**
```json
[
  {
    "id": "uuid-of-user1",
    "email": "user1@example.com",
    "name": "User One",
    "role": "Student",
    "field": null,
    "deletedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  },
  {
    "id": "uuid-of-user2",
    "email": "user2@example.com",
    "name": "User Two",
    "role": "Professor",
    "field": "SCIENCE",
    "deletedAt": null,
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```