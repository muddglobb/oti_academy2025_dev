# Enrollment Service API Documentation

This document describes the API endpoints provided by the OTI Academy's Enrollment Service, which handles course enrollments for users.

## Base URL

```
http://localhost:8000/enrollments
```

## Authentication

All endpoints require authentication via JWT token unless specified otherwise.

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. List All Enrollments

Get all enrollments in the system (admin access).

```
GET /enrollments
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "All enrollments retrieved successfully",
    "data": {
        "enrollments": [
            {
                "id": "2871e874-d47f-4e2d-bc40-5c9537a1de6f",
                "userId": "d31b1585-adf9-4b6c-b284-a2e271c910a8",
                "courseId": "63955b74-1e7d-4f5e-860c-f9a30dcab2e5",
                "packageId": "06ad0320-e18e-4b43-93db-d4177608ec68",
                "createdAt": "2025-05-10T03:53:09.240Z",
                "updatedAt": "2025-05-10T03:53:09.240Z"
            },
            {
                "id": "8236f8d8-6343-4876-a308-ee8984a9f3b0",
                "userId": "d31b1585-adf9-4b6c-b284-a2e271c910a8",
                "courseId": "dd4a3d66-8500-49ea-b6fc-567a9e0462d2",
                "packageId": "06ad0320-e18e-4b43-93db-d4177608ec68",
                "createdAt": "2025-05-10T03:53:09.231Z",
                "updatedAt": "2025-05-10T03:53:09.231Z"
            }
        ]
    }
}
```

### 2. Check Enrollment Status for a Course

Check if the authenticated user is enrolled in a specific course.

```
GET /enrollments/{courseId}/status
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Enrollment status retrieved successfully",
    "data": {
        "isEnrolled": false
    }
}
```

### 3. Get Current User's Enrollments

Retrieve all courses the authenticated user is enrolled in.

```
GET /enrollments/me
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "User enrollments retrieved successfully",
    "data": {
        "enrollments": [
            {
                "id": "5f08560e-a7a1-46e4-8738-c1e8bebdffb0",
                "courseId": "5f200661-491f-4f48-88cd-05471d3eaf14",
                "packageId": "6b4a27d1-1900-4ac4-8f5f-eca97fc4ade7",
                "createdAt": "2025-05-10T10:36:05.066Z",
                "isEnrolled": true
            },
            {
                "id": "7aae0d98-e01c-486c-802a-c79500ca7711",
                "courseId": "dd4a3d66-8500-49ea-b6fc-567a9e0462d2",
                "packageId": "6b4a27d1-1900-4ac4-8f5f-eca97fc4ade7",
                "createdAt": "2025-05-10T10:36:05.075Z",
                "isEnrolled": true
            }
        ]
    }
}
```

### 4. Check If User Is Enrolled In Any Course

Check if the authenticated user is enrolled in any course.

```
GET /enrollments/isenrolled
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "User enrollment status retrieved successfully",
    "data": {
        "isEnrolled": true
    }
}
```

### 5. Create Enrollments After Payment Approval

Create enrollments for a user after their payment has been approved. This is typically called by the payment service.

```
POST /enrollments/payment-approved
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
x-service-api-key: {{serviceApiKey}}  // For service-to-service communication
```

**Body:**
```json
{
  "userId": "d31b1585-adf9-4b6c-b284-a2e271c910a8",
  "packageId": "06ad0320-e18e-4b43-93db-d4177608ec68",
  "courseIds": ["63955b74-1e7d-4f5e-860c-f9a30dcab2e5", "dd4a3d66-8500-49ea-b6fc-567a9e0462d2"]
}
```

**Response (201):**
```json
{
    "status": "success",
    "message": "Enrollments created successfully",
    "data": {
        "enrollments": [
            {
                "id": "2871e874-d47f-4e2d-bc40-5c9537a1de6f",
                "userId": "d31b1585-adf9-4b6c-b284-a2e271c910a8",
                "courseId": "63955b74-1e7d-4f5e-860c-f9a30dcab2e5",
                "packageId": "06ad0320-e18e-4b43-93db-d4177608ec68",
                "createdAt": "2025-05-10T03:53:09.240Z",
                "updatedAt": "2025-05-10T03:53:09.240Z"
            },
            {
                "id": "8236f8d8-6343-4876-a308-ee8984a9f3b0",
                "userId": "d31b1585-adf9-4b6c-b284-a2e271c910a8",
                "courseId": "dd4a3d66-8500-49ea-b6fc-567a9e0462d2",
                "packageId": "06ad0320-e18e-4b43-93db-d4177608ec68",
                "createdAt": "2025-05-10T03:53:09.231Z",
                "updatedAt": "2025-05-10T03:53:09.231Z"
            }
        ]
    }
}
```

### 6. Get Enrollments for a Specific Course

Retrieve all users enrolled in a specific course (admin access).

```
GET /enrollments/course/{courseId}
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Course enrollments retrieved successfully",
    "data": {
        "enrollments": [
            {
                "id": "2871e874-d47f-4e2d-bc40-5c9537a1de6f",
                "userId": "d31b1585-adf9-4b6c-b284-a2e271c910a8",
                "courseId": "63955b74-1e7d-4f5e-860c-f9a30dcab2e5",
                "packageId": "06ad0320-e18e-4b43-93db-d4177608ec68",
                "createdAt": "2025-05-10T03:53:09.240Z",
                "updatedAt": "2025-05-10T03:53:09.240Z",
                "user": {
                    "id": "d31b1585-adf9-4b6c-b284-a2e271c910a8",
                    "name": "John Doe",
                    "email": "john.doe@example.com"
                }
            }
        ]
    }
}
```

### 7. Check Enrollment Status (Service to Service)

Check if a specific user is enrolled in a specific course (for service-to-service communication).

```
GET /enrollments/service/{courseId}/status
```

**Headers:**
```
Authorization: Bearer {{serviceToken}}
Content-Type: application/json
x-service-api-key: {{serviceApiKey}}
x-user-id: {{userId}}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Enrollment status retrieved successfully",
    "data": {
        "isEnrolled": true
    }
}
```

### 8. Batch Check Enrollment Status

Check enrollment status for multiple courses at once for the authenticated user.

```
POST /enrollments/status/batch
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "courseIds": ["63955b74-1e7d-4f5e-860c-f9a30dcab2e5", "dd4a3d66-8500-49ea-b6fc-567a9e0462d2"]
}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Batch enrollment status retrieved successfully",
    "data": {
        "63955b74-1e7d-4f5e-860c-f9a30dcab2e5": {
            "isEnrolled": true
        },
        "dd4a3d66-8500-49ea-b6fc-567a9e0462d2": {
            "isEnrolled": false
        }
    }
}
```

## Error Responses

### 1. Authentication Error (401)

```json
{
    "status": "error",
    "message": "Authentication required"
}
```

### 2. Authorization Error (403)

```json
{
    "status": "error",
    "message": "You don't have permission to access this resource"
}
```

### 3. Resource Not Found (404)

```json
{
    "status": "error",
    "message": "Enrollment not found"
}
```

### 4. Validation Error (400)

```json
{
    "status": "error",
    "message": "Validation failed",
    "errors": [
        {
            "field": "courseIds",
            "message": "Course IDs are required"
        }
    ]
}
```

### 5. Server Error (500)

```json
{
    "status": "error",
    "message": "Internal server error occurred"
}
```

## Notes

1. The enrollment service automatically creates enrollments after payment approval without requiring manual approval.
2. Users can only be enrolled once in a specific course (enforced by unique constraint).
3. For bundle purchases, users are enrolled in all courses included in the bundle package.
4. The `isEnrolled` flag indicates whether a user is actively enrolled in a course.