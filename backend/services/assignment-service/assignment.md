# Dokumentasi API Assignment Service OTI Academy

## 1. Setup Postman

### Environment Variables
```
baseUrl: http://localhost:8000
accessToken: (akan diisi otomatis setelah login)
refreshToken: (akan diisi otomatis setelah login)
```

### Mendapatkan Token (Authentication)
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

## 2. Endpoint Assignment Service

### 2.1. Assignment Management

#### 2.1.1. Membuat Assignment Baru (Create Assignment) - Admin Only

```
POST {{baseUrl}}/assignments
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Introduction to Web Development",
  "description": "Create a simple HTML page with CSS styling to demonstrate your understanding of basic web development concepts.",
  "courseId": "550e8400-e29b-41d4-a716-446655440001",
  "dueDate": "2025-06-15T23:59:59Z",
  "points": 100
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Assignment created successfully",
  "data": {
    "id": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
    "title": "Introduction to Web Development",
    "description": "Create a simple HTML page with CSS styling to demonstrate your understanding of basic web development concepts.",
    "courseId": "550e8400-e29b-41d4-a716-446655440001",
    "dueDate": "2025-06-15T23:59:59.000Z",
    "points": 100,
    "status": "ACTIVE",
    "createdAt": "2025-05-12T08:30:15.567Z",
    "updatedAt": "2025-05-12T08:30:15.567Z"
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

#### 2.1.2. Mendapatkan Semua Assignment (Admin Only)

```
GET {{baseUrl}}/assignments/admin
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
```
page: 1
limit: 10
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
      "title": "Introduction to Web Development",
      "description": "Create a simple HTML page with CSS styling to demonstrate your understanding of basic web development concepts.",
      "courseId": "550e8400-e29b-41d4-a716-446655440001",
      "dueDate": "2025-06-15T23:59:59.000Z",
      "points": 100,
      "status": "ACTIVE",
      "createdAt": "2025-05-12T08:30:15.567Z",
      "updatedAt": "2025-05-12T08:30:15.567Z",
      "_count": {
        "submissions": 5
      }
    },
    {
      "id": "f82d3a45-7c8b-49e5-b1f2-d3e4a5b6c7d8",
      "title": "Data Structures Implementation",
      "description": "Implement a binary search tree in Python and analyze its time complexity.",
      "courseId": "550e8400-e29b-41d4-a716-446655440002",
      "dueDate": "2025-06-20T23:59:59.000Z",
      "points": 150,
      "status": "ACTIVE",
      "createdAt": "2025-05-13T10:45:30.123Z",
      "updatedAt": "2025-05-13T10:45:30.123Z",
      "_count": {
        "submissions": 3
      }
    }
  ]
}
```

#### 2.1.3. Mendapatkan Assignment Berdasarkan Course

```
GET {{baseUrl}}/assignments/course/:courseId
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
      "id": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
      "title": "Introduction to Web Development",
      "description": "Create a simple HTML page with CSS styling to demonstrate your understanding of basic web development concepts.",
      "courseId": "550e8400-e29b-41d4-a716-446655440001",
      "dueDate": "2025-06-15T23:59:59.000Z",
      "points": 100,
      "status": "ACTIVE",
      "createdAt": "2025-05-12T08:30:15.567Z",
      "updatedAt": "2025-05-12T08:30:15.567Z",
      "_count": {
        "submissions": 5
      }
    },
    {
      "id": "a9b8c7d6-e5f4-3g2h-1i0j-k9l8m7n6o5p4",
      "title": "Responsive Website Project",
      "description": "Build a fully responsive website for a fictitious business using HTML, CSS, and JavaScript.",
      "courseId": "550e8400-e29b-41d4-a716-446655440001",
      "dueDate": "2025-06-30T23:59:59.000Z",
      "points": 200,
      "status": "ACTIVE",
      "createdAt": "2025-05-14T09:20:45.789Z",
      "updatedAt": "2025-05-14T09:20:45.789Z",
      "_count": {
        "submissions": 0
      }
    }
  ]
}
```

**Response (404) - Course Not Found:**
```json
{
  "status": "error",
  "message": "Course not found"
}
```

#### 2.1.4. Mendapatkan Detail Assignment Berdasarkan ID

```
GET {{baseUrl}}/assignments/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200) - Untuk Student:**
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
    "title": "Introduction to Web Development",
    "description": "Create a simple HTML page with CSS styling to demonstrate your understanding of basic web development concepts.",
    "courseId": "550e8400-e29b-41d4-a716-446655440001",
    "dueDate": "2025-06-15T23:59:59.000Z",
    "points": 100,
    "status": "ACTIVE",
    "createdAt": "2025-05-12T08:30:15.567Z",
    "updatedAt": "2025-05-12T08:30:15.567Z"
  }
}
```

**Response (200) - Untuk Admin (dengan submissions):**
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
    "title": "Introduction to Web Development",
    "description": "Create a simple HTML page with CSS styling to demonstrate your understanding of basic web development concepts.",
    "courseId": "550e8400-e29b-41d4-a716-446655440001",
    "dueDate": "2025-06-15T23:59:59.000Z",
    "points": 100,
    "status": "ACTIVE",
    "createdAt": "2025-05-12T08:30:15.567Z",
    "updatedAt": "2025-05-12T08:30:15.567Z",
    "submissions": [
      {
        "id": "c5d4e3f2-b1a2-c3d4-e5f6-g7h8i9j0k1l2",
        "userId": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
        "content": "This is my submission for the web development assignment.",
        "fileUrl": "https://storage.example.com/assignments/file123.zip",
        "submittedAt": "2025-06-10T14:25:30.123Z",
        "status": "SUBMITTED",
        "score": null,
        "feedback": null
      },
      {
        "id": "z1x2c3v4-b5n6m7-8l9k0j-i8u7y6t5r4e3",
        "userId": "w2s3e4r5-t6y7u8i9-o0p1a2s3d4f5",
        "content": "Here is my completed assignment.",
        "fileUrl": "https://storage.example.com/assignments/file456.zip",
        "submittedAt": "2025-06-12T09:15:45.678Z",
        "status": "GRADED",
        "score": 85,
        "feedback": "Good work, but could improve on CSS organization."
      }
    ]
  }
}
```

**Response (404) - Assignment Not Found:**
```json
{
  "status": "error",
  "message": "Assignment not found"
}
```

#### 2.1.5. Mengupdate Assignment (Update Assignment) - Admin Only

```
PUT {{baseUrl}}/assignments/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Updated: Introduction to Web Development",
  "description": "Updated description with more clear instructions for the assignment.",
  "dueDate": "2025-06-20T23:59:59Z",
  "points": 120
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Assignment updated successfully",
  "data": {
    "id": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
    "title": "Updated: Introduction to Web Development",
    "description": "Updated description with more clear instructions for the assignment.",
    "courseId": "550e8400-e29b-41d4-a716-446655440001",
    "dueDate": "2025-06-20T23:59:59.000Z",
    "points": 120,
    "status": "ACTIVE",
    "createdAt": "2025-05-12T08:30:15.567Z",
    "updatedAt": "2025-05-12T10:15:23.456Z"
  }
}
```

#### 2.1.6. Menghapus Assignment (Delete Assignment) - Admin Only

```
DELETE {{baseUrl}}/assignments/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Assignment deleted successfully",
  "data": null
}
```

### 2.2. Submission Management

#### 2.2.1. Mengumpulkan Assignment (Submit Assignment) - Student Only

##### A. Submit dengan JSON

```
POST {{baseUrl}}/assignments/:id/submit
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "content": "This is my submission for the web development assignment. I created a responsive website using HTML, CSS, and JavaScript.",
  "fileUrl": "https://storage.example.com/assignments/mysubmission.zip"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Assignment submitted successfully",
  "data": {
    "id": "c5d4e3f2-b1a2-c3d4-e5f6-g7h8i9j0k1l2",
    "assignmentId": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
    "userId": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
    "content": "This is my submission for the web development assignment. I created a responsive website using HTML, CSS, and JavaScript.",
    "fileUrl": "https://storage.example.com/assignments/mysubmission.zip",
    "submittedAt": "2025-06-10T14:25:30.123Z",
    "status": "SUBMITTED",
    "score": null,
    "feedback": null,
    "gradedAt": null
  }
}
```

##### B. Submit dengan File Upload

```
POST {{baseUrl}}/assignments/:id/submit
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: multipart/form-data
```

**Body (form-data):**
```
content: This is my submission for the web development assignment. I created a responsive website.
file: [file to upload]
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Assignment submitted successfully",
  "data": {
    "id": "c5d4e3f2-b1a2-c3d4-e5f6-g7h8i9j0k1l2",
    "assignmentId": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
    "userId": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
    "content": "This is my submission for the web development assignment. I created a responsive website.",
    "fileUrl": "/uploads/a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6.zip",
    "submittedAt": "2025-06-10T14:25:30.123Z",
    "status": "SUBMITTED",
    "score": null,
    "feedback": null,
    "gradedAt": null
  }
}
```

**Response (400) - Past Due Date:**
```json
{
  "status": "error",
  "message": "Assignment due date has passed"
}
```

**Response (403) - Not Enrolled:**
```json
{
  "status": "error",
  "message": "You are not enrolled in this course"
}
```

#### 2.2.2. Mendapatkan Submission untuk Assignment (Admin Only)

```
GET {{baseUrl}}/assignments/:id/submissions
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
      "id": "c5d4e3f2-b1a2-c3d4-e5f6-g7h8i9j0k1l2",
      "assignmentId": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
      "userId": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
      "content": "This is my submission for the web development assignment.",
      "fileUrl": "https://storage.example.com/assignments/file123.zip",
      "submittedAt": "2025-06-10T14:25:30.123Z",
      "status": "SUBMITTED",
      "score": null,
      "feedback": null,
      "gradedAt": null,
      "user": {
        "id": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
        "name": "Budi Santoso",
        "email": "budi@example.com"
      }
    },
    {
      "id": "z1x2c3v4-b5n6m7-8l9k0j-i8u7y6t5r4e3",
      "assignmentId": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
      "userId": "w2s3e4r5-t6y7u8i9-o0p1a2s3d4f5",
      "content": "Here is my completed assignment.",
      "fileUrl": "https://storage.example.com/assignments/file456.zip",
      "submittedAt": "2025-06-12T09:15:45.678Z",
      "status": "GRADED",
      "score": 85,
      "feedback": "Good work, but could improve on CSS organization.",
      "gradedAt": "2025-06-13T11:30:22.345Z",
      "user": {
        "id": "w2s3e4r5-t6y7u8i9-o0p1a2s3d4f5",
        "name": "Siti Aminah",
        "email": "siti@example.com"
      }
    }
  ]
}
```

#### 2.2.3. Mendapatkan Submission Siswa

```
GET {{baseUrl}}/assignments/submissions/user/:userId
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
      "id": "c5d4e3f2-b1a2-c3d4-e5f6-g7h8i9j0k1l2",
      "assignmentId": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
      "userId": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
      "content": "This is my submission for the web development assignment.",
      "fileUrl": "https://storage.example.com/assignments/file123.zip",
      "submittedAt": "2025-06-10T14:25:30.123Z",
      "status": "SUBMITTED",
      "score": null,
      "feedback": null,
      "assignment": {
        "id": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
        "title": "Introduction to Web Development",
        "courseId": "550e8400-e29b-41d4-a716-446655440001",
        "dueDate": "2025-06-15T23:59:59.000Z",
        "points": 100
      }
    },
    {
      "id": "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
      "assignmentId": "f82d3a45-7c8b-49e5-b1f2-d3e4a5b6c7d8",
      "userId": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
      "content": "Here is my data structures implementation in Python.",
      "fileUrl": "https://storage.example.com/assignments/file789.zip",
      "submittedAt": "2025-06-18T16:40:12.345Z",
      "status": "GRADED",
      "score": 92,
      "feedback": "Excellent implementation and thorough analysis.",
      "assignment": {
        "id": "f82d3a45-7c8b-49e5-b1f2-d3e4a5b6c7d8",
        "title": "Data Structures Implementation",
        "courseId": "550e8400-e29b-41d4-a716-446655440002",
        "dueDate": "2025-06-20T23:59:59.000Z",
        "points": 150
      }
    }
  ]
}
```

**Response (403) - Not Authorized:**
```json
{
  "status": "error",
  "message": "You can only view your own submissions"
}
```

#### 2.2.4. Menilai Submission (Grade Submission) - Admin Only

```
POST {{baseUrl}}/assignments/submissions/:submissionId/grade
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "score": 85,
  "feedback": "Good work, but could improve on CSS organization and responsiveness for mobile devices."
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Submission graded successfully",
  "data": {
    "id": "c5d4e3f2-b1a2-c3d4-e5f6-g7h8i9j0k1l2",
    "assignmentId": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
    "userId": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
    "content": "This is my submission for the web development assignment.",
    "fileUrl": "https://storage.example.com/assignments/file123.zip",
    "submittedAt": "2025-06-10T14:25:30.123Z",
    "status": "GRADED",
    "score": 85,
    "feedback": "Good work, but could improve on CSS organization and responsiveness for mobile devices.",
    "gradedAt": "2025-06-13T11:30:22.345Z"
  }
}
```

**Response (400) - Invalid Score:**
```json
{
  "status": "error",
  "message": "Score must be between 0 and 100"
}
```

### 2.3. Service Integration

#### 2.3.1. Verifikasi Service Access (Service-to-Service)

```
GET {{baseUrl}}/assignments/service/verify
```

**Headers:**
```
Authorization: Bearer {{serviceToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "authenticated": true,
    "service": "assignment-service"
  }
}
```

**Response (401) - Invalid Service Token:**
```json
{
  "status": "error",
  "message": "Invalid or expired service token"
}
```

## 3. Role Access Control

Service ini mengimplementasikan sistem Role-Based Access Control (RBAC) dengan role berikut:

1. **ADMIN**: 
   - Akses penuh (CRUD) untuk assignment dan melihat semua submission
   - Dapat menilai submission siswa
   - Dapat melihat semua data dengan detail lengkap

2. **DIKE** dan **UMUM**:
   - Hanya dapat melihat (READ) assignment
   - Dapat mengumpulkan tugas untuk kursus yang diikuti
   - Hanya dapat melihat submission milik sendiri
   - Tidak dapat menilai submission

3. **SERVICE**:
   - Digunakan untuk komunikasi antar layanan
   - Memerlukan service token khusus

## 4. Integrasi dengan Layanan Lain

1. **Course Service Integration**:
   - Verifikasi keberadaan course saat membuat assignment
   - Mendapatkan informasi course untuk tampilan

2. **Enrollment Service Integration**:
   - Verifikasi enrollment siswa saat mengumpulkan tugas
   - Memastikan siswa hanya bisa mengerjakan tugas dari kursus yang diikuti

3. **Auth Service Integration**:
   - Validasi token dan informasi user
   - Role-based access control

## 5. Response Error

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