# Dokumentasi API Course Service OTI Academy

## 1. Setup Postman

1. **Set environment variables**:
   - `baseUrl`: `http://localhost:8000` (URL API Gateway)

2. **Set headers untuk semua requests**:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer {{accessToken}}`

3. **Mendapatkan access token**:
   - Gunakan endpoint `/auth/login` untuk mendapatkan token
   - Simpan token tersebut di environment variable `accessToken`

## 2. Endpoint Course Service

### 2.1. Mendapatkan Semua Course (Get All Courses)

#### A. Untuk User Biasa (Authenticated)

```
GET {{baseUrl}}/courses
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters (opsional):**
```
?level=ENTRY  // Filter berdasarkan level (ENTRY/INTERMEDIATE)
?search=Web   // Pencarian berdasarkan title atau description
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

#### B. Untuk Admin (Detail Lengkap)

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

### 2.2. Mendapatkan Detail Course Berdasarkan ID (Get Course By ID)

#### A. Untuk User Biasa (Authenticated)

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

#### B. Untuk Admin (Detail Lengkap)

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

### 2.3. Membuat Course Baru (Create Course) - Admin Only

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

### 2.4. Mengupdate Course (Update Course) - Admin Only

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

### 2.5. Menghapus Course (Delete Course) - Admin Only

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

## 3. Session Management APIs

### 3.1. Mendapatkan Semua Session untuk Course Tertentu

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

### 3.2. Membuat Session (Create Session) - Admin Only

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

### 3.3. Mengupdate Session (Update Session) - Admin Only

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

### 3.4. Menghapus Session (Delete Session) - Admin Only

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

## 4. Role Access Control

Service ini mengimplementasikan sistem Role-Based Access Control (RBAC) dengan role berikut:

1. **ADMIN**: 
   - Akses penuh (CRUD) untuk course dan session
   - Dapat melihat semua data dengan detail lengkap

2. **DIKE** dan **UMUM**:
   - Hanya bisa melihat (READ) course dan session
   - Tidak bisa membuat, mengubah, atau menghapus data

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