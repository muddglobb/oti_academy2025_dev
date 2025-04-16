# Auth Service Documentation

## Overview

The Auth Service is a microservice responsible for handling user authentication and authorization for the OTI Academy platform. It provides endpoints for user registration, login, password management, and user profile management with special support for DIKE students.

## Features

- User registration and login with JWT authentication
- Support for different user types (DIKE students and regular users)
- NIM validation for DIKE students
- Password reset flow with secure token validation
- Role-based access control (User, Admin, Mentor)
- CSV import for DIKE student data (admin only)
- Auto-initialization of admin account
- Refresh token mechanism
- Profile management

## Project Structure

```
auth-service
├── prisma
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Database migrations
│   └── seed.js           # Seed script for admin user
├── src
│   ├── index.js          # Entry point
│   ├── controllers
│   │   ├── auth.controller.js   # Authentication logic
│   │   └── admin.controller.js  # Admin-specific features
│   ├── middleware
│   │   ├── auth.middleware.js   # JWT validation
│   │   ├── async.middleware.js  # Async handler
│   │   └── validation.middleware.js # Input validation
│   ├── routes
│   │   ├── auth.routes.js       # Auth endpoints
│   │   └── admin.routes.js      # Admin endpoints
│   └── utils
│       ├── api-response.js      # Standardized responses
│       └── upload.util.js       # File upload utilities
├── uploads/              # Directory for uploaded files
├── .env                  # Environment configuration
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/muddglobb/oti_academy2025_dev.git
   cd backend/services/auth-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a .env file in the root directory and add the following:
   ```
   # Server Configuration
   PORT=8001
   NODE_ENV=development

   # Database Configuration
   DATABASE_URL="postgresql://username:password@localhost:5432/auth_service_db?schema=public"

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000

   # Email Service (optional)
   EMAIL_SERVICE_URL=http://localhost:8002
   FRONTEND_URL=http://localhost:3000
   ```

4. Set up the database:
   ```bash
   # Create database migrations
   npx prisma migrate dev

   # Initialize admin account
   npm run seed
   ```

5. Start the service:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

- **POST /auth/register**: Register a new user
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "securepassword",
    "type": "UMUM"
  }
  ```
  Or for DIKE students:
  ```json
  {
    "name": "Student Name",
    "email": "student@mail.com",
    "password": "securepassword",
    "type": "DIKE",
    "nim": "12345678"
  }
  ```

- **POST /auth/login**: Log in a user
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```

- **POST /auth/refresh-token**: Get a new access token
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

- **POST /auth/logout**: Log out a user (requires authentication)
  ```json
  {
    "refreshToken": "your-refresh-token"
  }
  ```

### Password Management

- **POST /auth/forgot-password**: Request password reset link
  ```json
  {
    "email": "user@example.com"
  }
  ```

- **POST /auth/reset-password**: Reset password with token
  ```json
  {
    "token": "reset-token-from-email",
    "password": "new-password"
  }
  ```

- **GET /auth/verify-reset/:token**: Verify if reset token is valid

- **PATCH /auth/change-password**: Change password (requires authentication)
  ```json
  {
    "currentPassword": "old-password",
    "newPassword": "new-password"
  }
  ```

### User Management

- **GET /auth/me**: Get current user profile (requires authentication)

- **PATCH /auth/update-profile**: Update user profile (requires authentication)
  ```json
  {
    "name": "Updated Name"
  }
  ```

### Admin Features

- **POST /auth/admin/import-dike-students**: Import DIKE students from CSV (requires admin role)
  - Must be a multipart/form-data request with a CSV file
  - CSV should have headers: `name,nim,email`

## Default Admin Account

On first startup, the service automatically creates an admin account:
- Email: `omahtiacademy@gmail.com`
- Password: `Azh@riB3St6969!`

It's recommended to change this password after first login in production.

## Security

- All passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Role-based access control is implemented
- Password reset tokens are hashed before storing
- CORS is configured to restrict origins

## Development

### Running Tests

```bash
npm test
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Create a migration
npx prisma migrate dev --name migration_name

# Reset database (development only)
npx prisma migrate reset
```

## License

This project is licensed under the MIT License.