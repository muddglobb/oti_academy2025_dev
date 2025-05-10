# Enrollment Service Documentation

## Overview
The Enrollment Service manages user enrollments into courses after payment approval. This service is part of the OTI Academy microservice architecture.

## Key Features
- Users can only enroll in a course once (no duplicates)
- Bundle purchases automatically enroll users in all courses in the bundle
- Users can view their enrollments
- Frontend can check if a user is enrolled in a course
- RBAC (Role-Based Access Control) implementation similar to other services

## API Endpoints
- `POST /enrollments/payment-approved` - For payment service to trigger enrollments
- `GET /enrollments/me` - For users to view their enrollments
- `GET /enrollments/:courseId/status` - For checking if user is enrolled in a course
- `GET /enrollments` - For admins to view all enrollments for a course

## Enrollment Queue
The service processes enrollment queue files from the `/enrollment-queue` directory. Sample queue files are provided:

### Current Implementation Notes
The current schema has been simplified to avoid foreign key constraints. Instead of maintaining references to Users, Courses and Packages (which are managed by other services), we simply store the IDs as strings.

### Sample Queue File Format
```json
{
  "userId": "<valid-user-id>",
  "packageId": "<valid-package-id>",
  "courseIds": ["<valid-course-id>", "<valid-course-id>"],
  "paymentId": "<payment-reference>",
  "timestamp": "2025-05-09T12:30:45Z"
}
```

## Troubleshooting
If you encounter foreign key constraint errors when processing the enrollment queue, ensure:

1. The schema has been updated to remove direct references (relations) to external entities
2. All necessary service containers are running
3. The Docker container maps volumes correctly

## Development Notes
To modify the database schema, update the Prisma schema in `prisma/schema.prisma` and run:
```bash
docker-compose down
docker-compose up --build enrollment-service-api
```

This will rebuild the service with the latest schema changes.
