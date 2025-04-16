# Auth Service Documentation

## Overview

The Auth Service is a microservice responsible for handling user authentication and authorization for the OTI Academy platform. It provides endpoints for user registration, login, password management, and user profile management.

## Features

- User registration and login
- JWT-based authentication
- Password hashing and validation
- Role-based access control
- Error handling and response formatting

## Project Structure

```
auth-service
├── prisma
│   ├── schema.prisma
│   └── migrations
├── src
│   ├── index.js
│   ├── config
│   │   ├── index.js
│   │   └── validation.js
│   ├── controllers
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   ├── models
│   │   └── user.model.js
│   ├── routes
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   └── utils
│       ├── jwt.util.js
│       └── password.util.js
├── .env
├── package.json
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/muddglobb/oti_academy2025_dev.git
   cd auth-service
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   JWT_SECRET=your_jwt_secret
   DATABASE_URL=your_database_connection_string
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the service:
   ```bash
   npm run dev
   ```

## Usage

### Endpoints

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Log in an existing user.
- **POST /auth/forgot-password**: Request a password reset.
- **POST /auth/reset-password**: Reset the user's password.
- **POST /auth/change-password**: Change the user's password.
- **GET /user/profile**: Retrieve the authenticated user's profile information.

## Security

- All sensitive data is hashed and stored securely.
- JWT tokens are used for authentication, ensuring secure access to protected routes.
- Role-based access control is implemented to restrict access to certain endpoints based on user roles.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.