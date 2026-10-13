# Task Manager API

A RESTful Task Management API built with **NestJS, TypeScript, MongoDB, Mongoose, and JWT Authentication**.

This project provides secure user authentication and task management with user-based access control.

## Features

- User Registration and Login
- Password Hashing with bcrypt
- JWT Authentication
- Protected API Endpoints
- Create, Read, Update, and Delete Tasks (CRUD)
- User-Owned Tasks
- Task Search by Title
- Filter Tasks by Completion Status
- Pagination
- Request Validation
- MongoDB Integration
- Environment Variable Configuration

## Tech Stack

- **Backend:** NestJS
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Security:** bcrypt
- **Validation:** class-validator
- **Testing:** Jest

## Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or a local MongoDB instance
- [Postman](https://www.postman.com/) for API testing

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project

```bash
cd task-manager-api
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root directory.

```env
PORT=3000
MONGODB_URI="YOUR_MONGODB_CONNECTION_STRING"
JWT_SECRET="YOUR_LONG_RANDOM_SECRET"
JWT_EXPIRES_IN="1d"
```

Replace the placeholder values with your actual MongoDB connection string and a securely generated JWT secret.

**Security:** Never commit your `.env` file or expose database credentials and JWT secrets publicly.

### 5. Start the development server

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:3000
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in and receive a JWT |

### Tasks

All task endpoints require a valid JWT access token.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tasks` | Create a task |
| GET | `/tasks` | Get the authenticated user's tasks |
| GET | `/tasks/:id` | Get a specific owned task |
| PATCH | `/tasks/:id` | Update an owned task |
| DELETE | `/tasks/:id` | Delete an owned task |

### Query Parameters

The task list endpoint supports:

| Parameter | Example | Description |
|---|---|---|
| `search` | `?search=nestjs` | Search tasks by title |
| `completed` | `?completed=true` | Filter completed tasks |
| `page` | `?page=1` | Select the page |
| `limit` | `?limit=10` | Number of tasks per page |

Example:

```text
GET /tasks?completed=false&page=1&limit=10
```

## Authentication

After logging in, copy the `accessToken` from the response.

Include it in protected requests using the following HTTP header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Requests without a valid token will receive an `Unauthorized` response.

## Example Requests

### Register a user

`POST /auth/register`

```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "YourStrongPassword123"
}
```

### Log in

`POST /auth/login`

```json
{
  "email": "testuser@example.com",
  "password": "YourStrongPassword123"
}
```

### Create a task

`POST /tasks`

```json
{
  "title": "Learn NestJS",
  "description": "Build a secure Task Manager API"
}
```

### Update a task

`PATCH /tasks/TASK_ID`

```json
{
  "completed": true
}
```

### Delete a task

`DELETE /tasks/TASK_ID`

Replace `TASK_ID` with the actual task ID returned by the API.

## Project Structure

```text
task-manager-api/
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── jwt-auth.guard.ts
│   ├── users/
│   │   ├── user.schema.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── tasks/
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task.dto.ts
│   │   ├── task.schema.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── tasks.module.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The structure above represents the intended organization. Keep only files that actually exist in your repository.

## Testing

Run unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage:

```bash
npm run test:cov
```

## Security

- Passwords are hashed before storage.
- Protected routes require JWT authentication.
- Task operations are restricted by user ownership.
- Input validation helps reject invalid requests.
- Environment variables are used for sensitive configuration.

## Future Improvements

- Refresh token support
- Email verification and password reset
- API documentation with Swagger
- Rate limiting
- Integration and end-to-end testing
- Docker-based deployment
- CI/CD automation

## Author

**Maduka Avishka**

GitHub: https://github.com/madukaavi

## License

This project is currently intended for learning and development purposes. Add a license if you plan to distribute or reuse it publicly.
