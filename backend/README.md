## Dokumentasi API
# Dokumentasi API OTI Academy

## Daftar Isi
1. Auth Service
2. Course Service
3. Email Service
4. Package Service
5. Payment Service
6. Enrollment Service

## 1. Dokumentasi API Auth Service OTI Academy

### 1.1. Setup Environment

Pertama, siapkan environment Postman dengan variabel berikut:
```
baseUrl: http://localhost:8000
accessToken: (akan diisi otomatis setelah login)
refreshToken: (akan diisi otomatis setelah login)
```

### 1.2. Endpoint Auth Service

#### 1.2.1. Authentication

##### Register

```
POST {{baseUrl}}/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body untuk UMUM User:**
```json
{
  "name": "User Umum",
  "email": "user@example.com",
  "password": "Password123!",
  "type": "UMUM"
}
```

**Body untuk DIKE User:**
```json
{
  "name": "User DIKE",
  "email": "dike@example.com",
  "password": "Password123!",
  "type": "DIKE",
  "nim": "24/000000/PA/000000"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "User DIKE",
      "email": "dike@example.com",
      "role": "DIKE",
      "type": "DIKE"
    },
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "a1b2c3d4..."
  }
}
```

**Script Tests:**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
}
```

##### Login

```
POST {{baseUrl}}/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "user-uuid",
      "name": "User Umum",
      "email": "user@example.com",
      "role": "UMUM",
      "type": "UMUM"
    },
    "accessToken": "eyJhbGciOiJIUzI1...",
    "refreshToken": "a1b2c3d4..."
  }
}
```

**Script Tests:**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
}
```

##### Refresh Token

```
POST {{baseUrl}}/auth/refresh-token
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1..."
  }
}
```

##### Change Password

```
PATCH {{baseUrl}}/auth/change-password
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

##### Update Profile

```
PATCH {{baseUrl}}/auth/update-profile
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Updated Name"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "user-uuid",
    "name": "Updated Name",
    "email": "user@example.com",
    "role": "UMUM",
    "type": "UMUM",
    "nim": null,
    "createdAt": "2025-04-22T12:00:00.000Z"
  }
}
```

##### Logout

```
POST {{baseUrl}}/auth/logout
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

**Script Tests:**
```javascript
if (pm.response.code === 200) {
    pm.environment.set("accessToken", "");
    pm.environment.set("refreshToken", "");
}
```

##### Forgot Password

```
POST {{baseUrl}}/auth/forgot-password
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "If your email is registered, you will receive reset instructions shortly"
}
```

##### Reset Password

```
POST {{baseUrl}}/auth/reset-password
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "token": "reset-token-received-by-email",
  "password": "NewPassword123!"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Password has been reset successfully"
}
```

#### 1.2.2. User Management

##### Get Current User
```
GET {{baseUrl}}/users/me
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "user-uuid",
    "name": "User Umum",
    "email": "user@example.com",
    "role": "UMUM",
    "type": "UMUM",
    "nim": null,
    "createdAt": "2025-04-22T12:00:00.000Z"
  }
}
```

##### Get All Users (Admin Only)
```
GET {{baseUrl}}/users
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "admin-uuid",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN",
      "type": "UMUM",
      "nim": null,
      "createdAt": "2025-04-22T10:00:00.000Z"
    },
    {
      "id": "user-uuid",
      "name": "User DIKE",
      "email": "dike@example.com",
      "role": "DIKE",
      "type": "DIKE",
      "nim": "24/000000/PA/000000",
      "createdAt": "2025-04-22T11:00:00.000Z"
    }
  ]
}
```

#### 1.2.3. Admin Features

##### Import DIKE Students (Admin Only)
```
POST {{baseUrl}}/auth/admin/import-dike-students
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
file: [CSV file with columns: name,nim,email]
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Successfully imported 3 DIKE students",
  "data": {
    "totalProcessed": 3,
    "imported": 3,
    "errors": null
  }
}
```

##### Update User Role (Admin Only)
```
PATCH {{baseUrl}}/auth/admin/users/role
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "user-uuid",
  "role": "ADMIN"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User role updated successfully",
  "data": {
    "id": "user-uuid",
    "name": "User DIKE",
    "email": "dike@example.com",
    "role": "ADMIN",
    "type": "DIKE",
    "nim": "24/000000/PA/000000"
  }
}
```

### 1.3. Catatan Penting

1. **Autentikasi**: Sebagian besar endpoint memerlukan token yang valid di header `Authorization`
2. **Format CSV**: Untuk import DIKE students, file CSV harus memiliki header: `name,nim,email`
3. **Role-Based Access Control**:
   - `ADMIN`: Akses ke semua endpoint
   - `DIKE`, `UMUM`, `USER`: Akses terbatas sesuai peran masing-masing
4. **Error code umum**:
   - 400: Bad Request - Input validation error
   - 401: Unauthorized - Invalid credentials atau token
   - 403: Forbidden - Tidak memiliki hak akses ke resource
   - 404: Not Found - Resource tidak ditemukan
   - 500: Internal Server Error - Error pada server

## 2. Dokumentasi API Course Service OTI Academy

### 2.1. Setup Postman

1. **Set environment variables**:
   - `baseUrl`: `http://localhost:8000` (URL API Gateway)

2. **Set headers untuk semua requests**:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer {{accessToken}}`

3. **Mendapatkan access token**:
   - Gunakan endpoint `/auth/login` untuk mendapatkan token
   - Simpan token tersebut di environment variable `accessToken`

### 2.2. Endpoint Course Service

#### 2.2.1. Mendapatkan Semua Course (Get All Courses)

##### A. Untuk User Biasa (Authenticated)

```
GET {{baseUrl}}/courses
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters (opsional):**
```
?level=ENTRY  # filter berdasarkan level (ENTRY/INTERMEDIATE)
?search=Web   # pencarian berdasarkan title atau description
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Web Development Fundamentals",
      "description": "Learn HTML, CSS, and JavaScript to build responsive websites from scratch.",
      "quota": 140,
      "level": "ENTRY",
      "createdAt": "2025-05-06T04:30:45.123Z",
      "updatedAt": "2025-05-06T04:30:45.123Z",
      "sessions": [
        {
          "id": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
          "courseId": "550e8400-e29b-41d4-a716-446655440001",
          "startAt": "2025-05-10T13:00:00.000Z",
          "durationHrs": 2,
          "description": "HTML & CSS Basics",
          "createdAt": "2025-05-06T04:30:45.123Z",
          "updatedAt": "2025-05-06T04:30:45.123Z"
        }
      ]
    }
  ]
}
```

##### B. Untuk Admin (Detail Lengkap)

```
GET {{baseUrl}}/courses/admin
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Web Development Fundamentals",
      "description": "Learn HTML, CSS, and JavaScript to build responsive websites from scratch.",
      "quota": 140,
      "level": "ENTRY",
      "createdAt": "2025-05-06T04:30:45.123Z",
      "updatedAt": "2025-05-06T04:30:45.123Z",
      "sessions": [
        {
          "id": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
          "courseId": "550e8400-e29b-41d4-a716-446655440001",
          "startAt": "2025-05-10T13:00:00.000Z",
          "durationHrs": 2,
          "description": "HTML & CSS Basics",
          "createdAt": "2025-05-06T04:30:45.123Z",
          "updatedAt": "2025-05-06T04:30:45.123Z"
        }
      ]
    }
  ]
}
```

#### 2.2.2. Mendapatkan Detail Course Berdasarkan ID (Get Course By ID)

##### A. Untuk User Biasa (Authenticated)

```
GET {{baseUrl}}/courses/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Web Development Fundamentals",
    "description": "Learn HTML, CSS, and JavaScript to build responsive websites from scratch.",
    "quota": 140,
    "level": "ENTRY",
    "createdAt": "2025-05-06T04:30:45.123Z",
    "updatedAt": "2025-05-06T04:30:45.123Z",
    "sessions": [
      {
        "id": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
        "courseId": "550e8400-e29b-41d4-a716-446655440001",
        "startAt": "2025-05-10T13:00:00.000Z",
        "durationHrs": 2,
        "description": "HTML & CSS Basics",
        "createdAt": "2025-05-06T04:30:45.123Z",
        "updatedAt": "2025-05-06T04:30:45.123Z"
      }
    ]
  }
}
```

**Response (404):**
```json
{
  "status": "error",
  "message": "Course not found"
}
```

##### B. Untuk Admin (Detail Lengkap)

```
GET {{baseUrl}}/courses/admin/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Web Development Fundamentals",
    "description": "Learn HTML, CSS, and JavaScript to build responsive websites from scratch.",
    "quota": 140,
    "level": "ENTRY",
    "createdAt": "2025-05-06T04:30:45.123Z",
    "updatedAt": "2025-05-06T04:30:45.123Z",
    "sessions": [
      {
        "id": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
        "courseId": "550e8400-e29b-41d4-a716-446655440001",
        "startAt": "2025-05-10T13:00:00.000Z",
        "durationHrs": 2,
        "description": "HTML & CSS Basics",
        "createdAt": "2025-05-06T04:30:45.123Z",
        "updatedAt": "2025-05-06T04:30:45.123Z"
      }
    ]
  }
}
```

#### 2.2.3. Membuat Course Baru (Create Course) - Admin Only

```
POST {{baseUrl}}/courses/admin
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Data Science & Artificial Intelligence & Machine Learning",
  "description": "Learn data analysis, machine learning fundamentals, and AI implementation with Python.",
  "level": "INTERMEDIATE",
  "quota": 100
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Course created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Data Science & Artificial Intelligence & Machine Learning",
    "description": "Learn data analysis, machine learning fundamentals, and AI implementation with Python.",
    "level": "INTERMEDIATE",
    "quota": 100,
    "createdAt": "2025-05-06T05:15:30.123Z",
    "updatedAt": "2025-05-06T05:15:30.123Z",
    "sessions": []
  }
}
```

**Response (400) - Validation Error:**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 5 characters"
    }
  ]
}
```

#### 2.2.4. Mengupdate Course (Update Course) - Admin Only

```
PUT {{baseUrl}}/courses/admin/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Advanced Data Science & Artificial Intelligence & Machine Learning",
  "description": "Learn advanced data analysis, deep learning techniques, and AI model deployment.",
  "level": "INTERMEDIATE",
  "quota": 80
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Course updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Advanced Data Science & Artificial Intelligence & Machine Learning",
    "description": "Learn advanced data analysis, deep learning techniques, and AI model deployment.",
    "level": "INTERMEDIATE",
    "quota": 80,
    "createdAt": "2025-05-06T05:15:30.123Z",
    "updatedAt": "2025-05-06T06:20:15.456Z",
    "sessions": []
  }
}
```

**Response (404) - Course Not Found:**
```json
{
  "status": "error",
  "message": "Course not found"
}
```

#### 2.2.5. Menghapus Course (Delete Course) - Admin Only

```
DELETE {{baseUrl}}/courses/admin/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Course deleted successfully",
  "data": null
}
```

**Response (404) - Course Not Found:**
```json
{
  "status": "error",
  "message": "Course not found"
}
```

### 2.3. Session Management APIs

#### 2.3.1. Mendapatkan Semua Session untuk Course Tertentu

```
GET {{baseUrl}}/courses/:courseId/sessions
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
      "courseId": "550e8400-e29b-41d4-a716-446655440001",
      "startAt": "2025-05-10T13:00:00.000Z",
      "durationHrs": 2,
      "description": "HTML & CSS Basics",
      "createdAt": "2025-05-06T04:30:45.123Z",
      "updatedAt": "2025-05-06T04:30:45.123Z"
    },
    {
      "id": "9a2cf45b-3c7d-5e19-871a-e25cb9f4a2e3",
      "courseId": "550e8400-e29b-41d4-a716-446655440001",
      "startAt": "2025-05-17T13:00:00.000Z",
      "durationHrs": 2, 
      "description": "JavaScript Essentials",
      "createdAt": "2025-05-06T04:30:45.123Z",
      "updatedAt": "2025-05-06T04:30:45.123Z"
    }
  ]
}
```

#### 2.3.2. Membuat Session (Create Session) - Admin Only

```
POST {{baseUrl}}/sessions
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "courseId": "550e8400-e29b-41d4-a716-446655440002",
  "startAt": "2025-05-20T14:00:00.000Z",
  "durationHrs": 2,
  "description": "Introduction to Data Science & Artificial Intelligence"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Session created successfully",
  "data": {
    "id": "b3e7a8f1-2d9c-4c5a-b6e7-8f9a0b1c2d3e",
    "courseId": "550e8400-e29b-41d4-a716-446655440002",
    "startAt": "2025-05-20T14:00:00.000Z",
    "durationHrs": 2,
    "description": "Introduction to Data Science & Artificial Intelligence",
    "createdAt": "2025-05-07T09:30:15.789Z",
    "updatedAt": "2025-05-07T09:30:15.789Z"
  }
}
```

#### 2.3.3. Mengupdate Session (Update Session) - Admin Only

```
PUT {{baseUrl}}/sessions/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "startAt": "2025-05-21T15:00:00.000Z",
  "durationHrs": 3,
  "description": "Introduction to Data Science & Artificial Intelligence and Python"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Session updated successfully",
  "data": {
    "id": "b3e7a8f1-2d9c-4c5a-b6e7-8f9a0b1c2d3e",
    "courseId": "550e8400-e29b-41d4-a716-446655440002",
    "startAt": "2025-05-21T15:00:00.000Z",
    "durationHrs": 3,
    "description": "Introduction to Data Science & Artificial Intelligence and Python",
    "createdAt": "2025-05-07T09:30:15.789Z",
    "updatedAt": "2025-05-07T10:45:20.456Z"
  }
}
```

#### 2.3.4. Menghapus Session (Delete Session) - Admin Only

```
DELETE {{baseUrl}}/sessions/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Session deleted successfully",
  "data": null
}
```

### 2.4. Role Access Control

Service ini mengimplementasikan sistem Role-Based Access Control (RBAC) dengan role berikut:

1. **ADMIN**: 
   - Akses penuh (CRUD) untuk course dan session
   - Dapat melihat semua data dengan detail lengkap

2. **DIKE** dan **UMUM**:
   - Hanya bisa melihat (READ) course dan session
   - Tidak bisa membuat, mengubah, atau menghapus data

### 2.5. Response Error

Berikut adalah format response error standar:

```json
{
  "status": "error",
  "message": "Pesan error yang menjelaskan masalah"
}
```

Format untuk validation error:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title", 
      "message": "Title must be at least 5 characters"
    }
  ]
}
```

Kode HTTP status yang mungkin:

1. **400 Bad Request** - Request tidak valid atau validasi gagal
2. **401 Unauthorized** - Token tidak ada atau tidak valid
3. **403 Forbidden** - Tidak memiliki hak akses untuk operasi tersebut
4. **404 Not Found** - Resource yang diminta tidak ditemukan
5. **500 Internal Server Error** - Terjadi kesalahan di server

## 3. Dokumentasi API Email Service OTI Academy

### 3.1. Setup Postman

#### Environment Variables
```
baseUrl: http://localhost:8000
accessToken: (akan diisi otomatis setelah login)
refreshToken: (akan diisi otomatis setelah login)
```

#### Mendapatkan Token (Authentication)
```
POST {{baseUrl}}/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**Script untuk menyimpan token:**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
}
```

### 3.2. Endpoint Email Service

#### 3.2.1. Send Email

##### Send Payment Confirmation Email
```
POST {{baseUrl}}/email/payment-confirmation
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
x-api-key: {{SERVICE_API_KEY}}
```

**Body:**
```json
{
  "email": "recipient@example.com",
  "username": "User Name",
  "courseName": "Web Development",
  "amount": "Rp 250.000,00",
  "transactionId": "75c2d819-7a8d-4ce7-ac19-bba55efd2b72",
  "date": "11 Mei 2025"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Email sent successfully",
  "data": {
    "messageId": "<fdb73c4b-2d2a-9ae2-517f-656433fe4f69@omahti.web.id>"
  }
}
```

##### Send Enrollment Confirmation Email
```
POST {{baseUrl}}/email/enrollment-confirmation
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
x-api-key: {{SERVICE_API_KEY}}
```

**Body:**
```json
{
  "email": "recipient@example.com",
  "username": "User Name",
  "courseName": "Game Development",
  "packageName": "Paket Entry",
  "price": 250000,
  "paymentId": "fc05869b-72b2-4b55-b749-29ff64b1f28c",
  "date": "11 Mei 2025"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Email sent successfully",
  "data": {
    "messageId": "<2be62467-95c0-068f-93f6-9734224d2453@omahti.web.id>"
  }
}
```

#### 3.2.2. Template Management (Admin Only)

##### Get All Templates
```
GET {{baseUrl}}/email/templates
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Templates retrieved successfully",
  "data": [
    {
      "id": "payment-confirmation",
      "name": "Payment Confirmation",
      "subject": "Payment Confirmation - OmahTI Academy",
      "variables": ["username", "courseName", "amount", "transactionId", "date"]
    },
    {
      "id": "enrollment-confirmation",
      "name": "Enrollment Confirmation",
      "subject": "Enrollment Confirmation - OmahTI Academy",
      "variables": ["username", "courseName", "packageName", "price", "date"]
    }
  ]
}
```

##### Update Template (Admin Only)
```
PUT {{baseUrl}}/email/templates/:templateId
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "subject": "Your Payment is Confirmed - OmahTI Academy",
  "htmlContent": "<!DOCTYPE html><html>...(HTML content)...</html>"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Template updated successfully",
  "data": {
    "id": "payment-confirmation",
    "name": "Payment Confirmation",
    "subject": "Your Payment is Confirmed - OmahTI Academy"
  }
}
```

#### 3.2.3. Email Status

##### Check Email Status
```
GET {{baseUrl}}/email/status/:messageId
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Email status retrieved successfully",
  "data": {
    "messageId": "<2be62467-95c0-068f-93f6-9734224d2453@omahti.web.id>",
    "status": "delivered",
    "sentAt": "2025-05-11T15:16:21.000Z",
    "deliveredAt": "2025-05-11T15:16:25.000Z"
  }
}
```

#### 3.2.4. Health Check

```
GET {{baseUrl}}/email/health
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Email service is healthy",
  "data": {
    "uptime": "10h 23m",
    "queueStatus": "operational",
    "version": "1.0.0"
  }
}
```

### 3.3. Queue Management System

Email Service menggunakan sistem antrian (queue) untuk memproses email secara asynchronous, dengan jenis antrian:

1. **payment-confirmation** - Untuk email konfirmasi pembayaran
2. **enrollment-confirmation** - Untuk email konfirmasi pendaftaran kursus

Setiap email yang dikirimkan akan diproses melalui antrian untuk memastikan:
- Sistem tidak kewalahan dengan volume tinggi
- Email tetap terkirim meskipun ada gangguan sementara
- Pesan dapat dicoba ulang jika gagal

### 3.4. Role Access Control

1. **ADMIN**: 
   - Akses penuh untuk mengelola template email
   - Dapat melihat status pengiriman semua email

2. **SERVICE**:
   - Dapat mengirim email melalui API dengan service token
   - Memerlukan `x-api-key` untuk autentikasi antar layanan

3. **DIKE** dan **UMUM**:
   - Tidak dapat mengakses layanan email secara langsung
   - Email dikirim oleh sistem berdasarkan interaksi pengguna

### 3.5. Response Error

| Status Code | Description                     |
|-------------|---------------------------------|
| 400         | Bad Request - Parameter tidak valid |
| 401         | Unauthorized - Token tidak valid    |
| 403         | Forbidden - Tidak memiliki izin    |
| 404         | Not Found - Template/resource tidak ditemukan |
| 429         | Too Many Requests - Rate limit tercapai |
| 500         | Internal Server Error            |

## 4. Dokumentasi API Package-Service OTI Academy

### 4.1. Setup Environment Postman

Pertama, buat environment di Postman dengan variabel berikut:
```
baseUrl: http://localhost:8000
accessToken: (akan diisi otomatis setelah login)
refreshToken: (akan diisi otomatis setelah login)
```

### 4.2. Autentikasi

Semua endpoint Package-Service memerlukan autentikasi. Gunakan endpoint auth-service untuk login terlebih dahulu:

```
POST {{baseUrl}}/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "omahtiacademy@gmail.com",
  "password": "Azh@riB3St6969!"
}
```

**Script Tests untuk menyimpan token otomatis:**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
}
```

