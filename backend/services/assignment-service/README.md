# Dokumentasi API OTI Academy - Assignment dan Submission Service

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

## 2. Timezone Handling

### Penting: Proses Konversi Timezone WIB - UTC

Assignment Service mengimplementasikan penanganan timezone untuk memastikan konsistensi data:

- **Input dari User (API Request)**: Format tanggal menggunakan timezone WIB (UTC+7), seperti "2025-05-14T01:00:00"
- **Penyimpanan di Database**: Semua tanggal dikonversi ke UTC sebelum disimpan, misalnya "2025-05-13T18:00:00Z"
- **Output ke User (API Response)**: Tanggal dikonversi kembali dari UTC ke WIB untuk ditampilkan, seperti "14 Mei 2025 pukul 01.00"

#### Pemrosesan Date pada API:
1. Ketika melakukan `POST` atau `PUT` ke API assignments, berikan tanggal dalam format ISO string dengan asumsi timezone WIB
2. Server akan mengkonversi tanggal WIB menjadi UTC sebelum menyimpan ke database
3. Ketika mengambil data, server akan mengkonversi kembali dari UTC ke WIB untuk ditampilkan

**Contoh:**
- Input dari frontend: "2025-05-14T01:00:00" (1 pagi WIB)
- Disimpan dalam database: "2025-05-13T18:00:00Z" (6 sore UTC, sama dengan 1 pagi WIB)
- Ditampilkan dalam response: "14 Mei 2025 pukul 01.00"

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
  "dueDate": "2025-05-15T01:00:00", //dalam WIB
  "points": 100,
  "resourceUrl": "https://drive.google.com/drive/folders/1a2b3c4d5e6f"
}
```

> **Catatan Format Waktu**: Format `dueDate` di atas (`2025-05-15T01:00:00`) akan secara otomatis diinterpretasikan sebagai waktu WIB (UTC+7) dan dikonversi ke UTC untuk disimpan di database.

**Response (201):**
```json
{
    "status": "success",
    "message": "Assignment created successfully",
    "data": {
        "id": "b95aec2d-8e43-42db-aa9f-4dd101f42f52",
        "title": "tugas 2",
        "description": "222222222222",
        "courseId": "07da244f-cdc6-4664-97a2-647a7f92bed2",
        "dueDate": "2025-05-13T11:52:00.000Z",
        "points": 100,
        "resourceUrl": "https://drive.google.com/drive/folders/1a2b3c4d5e6f",
        "status": "ACTIVE",
        "createdAt": "2025-05-13T11:50:26.069Z",
        "updatedAt": "2025-05-13T11:50:26.069Z"
    }
}
```

#### 2.1.2. Mendapatkan Semua Assignment (Admin Only)

```
GET {{baseUrl}}/assignments
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
```
page: 1
limit: 10
status: ACTIVE (optional - ACTIVE, DRAFT, EXPIRED, DELETED)
courseId: 550e8400-e29b-41d4-a716-446655440001 (optional)
search: web (optional - pencarian judul atau deskripsi)
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Success",
    "data": {
        "assignments": [
            {
                "id": "c5a0cd6d-200f-4f1b-bbd6-2ce56ad339bf",
                "title": "Project - UI/UX",
                "description": "Create a comprehensive project that demonstrates your understanding of the course content. Submit a link to your project repository or documentation.",
                "courseId": "c5a0cd6d-200f-4f1b-bbd6-2ce56ad339bf",
                "dueDate": "2025-06-30T00:00:00.000Z",
                "points": 100,
                "resourceUrl": "https://drive.google.com/drive/folders/633561306364366",
                "status": "ACTIVE",
                "createdAt": "2025-05-13T10:25:38.128Z",
                "updatedAt": "2025-05-13T10:25:38.128Z",
                "_count": {
                    "submissions": 0
                },
                "dueDateWib": "30 Juni 2025 pukul 07.00",
                "isPastDue": false
            },
            {
                "id": "f96ed25b-38b5-4539-a3c5-240d042d15bb",
                "title": "tugas python",
                "description": "piton",
                "courseId": "07da244f-cdc6-4664-97a2-647a7f92bed2",
                "dueDate": "2025-05-13T18:00:00.000Z",
                "points": 100,
                "resourceUrl": "https://drive.google.com/drive/folders/1a2b3c4d5e6f",
                "status": "ACTIVE",
                "createdAt": "2025-05-13T10:27:42.414Z",
                "updatedAt": "2025-05-13T10:27:42.414Z",
                "_count": {
                    "submissions": 1
                },
                "dueDateWib": "14 Mei 2025 pukul 01.00",
                "isPastDue": false
            },
            {
                "id": "b95aec2d-8e43-42db-aa9f-4dd101f42f52",
                "title": "tugas 2",
                "description": "222222222222",
                "courseId": "07da244f-cdc6-4664-97a2-647a7f92bed2",
                "dueDate": "2025-05-13T11:52:00.000Z",
                "points": 100,
                "resourceUrl": "https://drive.google.com/drive/folders/1a2b3c4d5e6f",
                "status": "ACTIVE",
                "createdAt": "2025-05-13T11:50:26.069Z",
                "updatedAt": "2025-05-13T11:50:26.069Z",
                "_count": {
                    "submissions": 0
                },
                "dueDateWib": "13 Mei 2025 pukul 18.52",
                "isPastDue": true
            }
        ],
        "pagination": {
            "total": 3,
            "page": 1,
            "limit": 10,
            "pages": 1
        }
    }
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
      "dueDate": "2025-05-14T18:00:00.000Z",
      "dueDateWib": "15 Mei 2025, 01:00",
      "isPastDue": false,
      "points": 100,
      "status": "ACTIVE",
      "createdAt": "2025-05-12T08:30:15.567Z",
      "updatedAt": "2025-05-12T08:30:15.567Z",
      "_count": {
        "submissions": 5
      }
    }
  ]
}
```

#### 2.1.4. Mendapatkan Detail Assignment Berdasarkan assignment ID (admin)

```
GET {{baseUrl}}/assignments/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200) - Untuk Admin:**
```json
{
    "status": "success",
    "message": "Success",
    "data": {
        "id": "f96ed25b-38b5-4539-a3c5-240d042d15bb",
        "title": "tugas python",
        "description": "piton",
        "courseId": "07da244f-cdc6-4664-97a2-647a7f92bed2",
        "dueDate": "2025-05-13T18:00:00.000Z",
        "points": 100,
        "resourceUrl": "https://drive.google.com/drive/folders/1a2b3c4d5e6f",
        "status": "ACTIVE",
        "createdAt": "2025-05-13T10:27:42.414Z",
        "updatedAt": "2025-05-13T10:27:42.414Z",
        "submissions": [
            {
                "id": "db1af91e-e124-4fe8-8826-2389fec017e4",
                "assignmentId": "f96ed25b-38b5-4539-a3c5-240d042d15bb",
                "userId": "3f9509e4-f952-4542-bf8b-8d0dd34fcd2d",
                "fileUrl": "https://url.com",
                "submittedAt": "2025-05-13T11:48:57.274Z",
                "status": "SUBMITTED",
                "createdAt": "2025-05-13T10:31:47.900Z",
                "updatedAt": "2025-05-13T11:48:57.275Z"
            }
        ],
        "dueDateWib": "14 Mei 2025 pukul 01.00",
        "isPastDue": false
    }
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
  "dueDate": "2025-05-20T01:00:00",
  "points": 120,
  "resourceUrl": "https://drive.google.com/drive/folders/updated-folder-1a2b3c4d",
  "status": "ACTIVE"
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
    "dueDate": "2025-05-19T18:00:00.000Z",
    "dueDateWib": "20 Mei 2025, 01:00",
    "isPastDue": false,
    "points": 120,
    "resourceUrl": "https://drive.google.com/drive/folders/updated-folder-1a2b3c4d",
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

## 3. Endpoint Submission Service

### 3.1. Submission Management

#### 3.1.1. Mengumpulkan Assignment (Submit Assignment) - Student Only

```
POST {{baseUrl}}/submissions/:assignmentId
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "fileUrl": "https://github.com/username/repository-name"
}
```

**Response (201):**
```json
{
    "status": "success",
    "message": "Submission file updated successfully",
    "data": {
        "id": "db1af91e-e124-4fe8-8826-2389fec017e4",
        "assignmentId": "f96ed25b-38b5-4539-a3c5-240d042d15bb",
        "userId": "3f9509e4-f952-4542-bf8b-8d0dd34fcd2d",
        "fileUrl": "https://url.com",
        "submittedAt": "2025-05-13T11:48:57.274Z",
        "status": "SUBMITTED",
        "createdAt": "2025-05-13T10:31:47.900Z",
        "updatedAt": "2025-05-13T11:48:57.275Z"
    }
}
```

**Response (400) - Validasi:**
```json
{
  "status": "error",
  "message": "Content or file URL is required"
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

#### 3.1.2. Mendapatkan Semua Submissions (Admin Only)

```
GET {{baseUrl}}/submissions
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters:**
```
page: 1
limit: 10
status: SUBMITTED (optional - SUBMITTED, NOT_SUBMITTED, LATE)
assignmentId: d71c2819-5a6d-47e4-93f5-c8de1f6a3b25 (optional)
userId: 92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1 (optional)
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "submissions": [
      {
        "id": "c5d4e3f2-b1a2-c3d4-e5f6-g7h8i9j0k1l2",
        "assignmentId": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
        "userId": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
        "content": "This is my submission for the web development assignment.",
        "fileUrl": "https://github.com/username/repository-name",
        "submittedAt": "2025-05-13T06:25:30.123Z",
        "status": "SUBMITTED",
        "assignment": {
          "id": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
          "title": "Introduction to Web Development",
          "courseId": "550e8400-e29b-41d4-a716-446655440001",
          "dueDate": "2025-05-14T18:00:00.000Z",
          "points": 100
        },
        "user": {
          "id": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
          "name": "Budi Santoso",
          "email": "budi@example.com"
        }
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

#### 3.1.3. Mendapatkan Submissions by courseId

```
GET {{baseUrl}}/submissions/course/{{courseId}}
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
    "data": {
        "submissions": [
            {
                "id": "db1af91e-e124-4fe8-8826-2389fec017e4",
                "assignmentId": "f96ed25b-38b5-4539-a3c5-240d042d15bb",
                "userId": "3f9509e4-f952-4542-bf8b-8d0dd34fcd2d",
                "fileUrl": "https://url.com",
                "submittedAt": "2025-05-13T11:48:57.274Z",
                "status": "SUBMITTED",
                "createdAt": "2025-05-13T10:31:47.900Z",
                "updatedAt": "2025-05-13T11:48:57.275Z",
                "assignment": {
                    "id": "f96ed25b-38b5-4539-a3c5-240d042d15bb",
                    "title": "tugas python",
                    "courseId": "07da244f-cdc6-4664-97a2-647a7f92bed2",
                    "dueDate": "2025-05-13T18:00:00.000Z",
                    "points": 100,
                    "dueDateWib": "14 Mei 2025 pukul 01.00"
                },
                "user": {
                    "id": "3f9509e4-f952-4542-bf8b-8d0dd34fcd2d",
                    "name": "Kevin Antonio Wiyono Lauw",
                    "email": "keviniogt02@gmail.com"
                }
            }
        ],
        "pagination": {
            "total": 1,
            "page": 1,
            "limit": 10,
            "pages": 1
        }
    }
}
```

**Response (403) - User mencoba melihat submission orang lain:**
```json
{
  "status": "error",
  "message": "You can only view your own submissions"
}
```

#### 3.1.4. Mendapatkan Submissions User

```
GET {{baseUrl}}/submissions/user/:userId
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
  "data": {
    "submissions": [
      {
        "id": "c5d4e3f2-b1a2-c3d4-e5f6-g7h8i9j0k1l2",
        "assignmentId": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
        "userId": "92a7b8c9-d0e1-f2g3-h4i5-j6k7l8m9n0o1",
        "content": "This is my submission for the web development assignment.",
        "fileUrl": "https://github.com/username/repository-name",
        "submittedAt": "2025-05-13T06:25:30.123Z",
        "status": "SUBMITTED",
        "assignment": {
          "id": "d71c2819-5a6d-47e4-93f5-c8de1f6a3b25",
          "title": "Introduction to Web Development",
          "courseId": "550e8400-e29b-41d4-a716-446655440001",
          "dueDate": "2025-05-14T18:00:00.000Z",
          "dueDateWib": "15 Mei 2025, 01:00",
          "points": 100
        }
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

**Response (403) - User mencoba melihat submission orang lain:**
```json
{
  "status": "error",
  "message": "You can only view your own submissions"
}
```

#### 3.1.5. Mendapatkan Submission sendiri

```
GET {{baseUrl}}/submissions/me
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
            "id": "db1af91e-e124-4fe8-8826-2389fec017e4",
            "assignmentId": "f96ed25b-38b5-4539-a3c5-240d042d15bb",
            "userId": "3f9509e4-f952-4542-bf8b-8d0dd34fcd2d",
            "fileUrl": "https://youtube.com",
            "submittedAt": "2025-05-13T11:04:57.981Z",
            "status": "SUBMITTED",
            "createdAt": "2025-05-13T10:31:47.900Z",
            "updatedAt": "2025-05-13T11:04:57.983Z",
            "assignment": {
                "id": "f96ed25b-38b5-4539-a3c5-240d042d15bb",
                "title": "tugas python",
                "description": "piton",
                "courseId": "07da244f-cdc6-4664-97a2-647a7f92bed2",
                "dueDate": "2025-05-13T18:00:00.000Z",
                "points": 100,
                "resourceUrl": "https://drive.google.com/drive/folders/1a2b3c4d5e6f",
                "status": "ACTIVE",
                "createdAt": "2025-05-13T10:27:42.414Z",
                "updatedAt": "2025-05-13T10:27:42.414Z",
                "dueDateWib": "14 Mei 2025 pukul 01.00"
            }
        }
    ]
}
```

#### 3.1.6. Update link Submission sendiri

```
PATCH {{baseUrl}}/submissions/{{submissionId}}
```

**Body:**
```json
{
    "fileUrl": "https://url.com"
}
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "Submission file updated successfully",
    "data": {
        "id": "db1af91e-e124-4fe8-8826-2389fec017e4",
        "assignmentId": "f96ed25b-38b5-4539-a3c5-240d042d15bb",
        "userId": "3f9509e4-f952-4542-bf8b-8d0dd34fcd2d",
        "fileUrl": "https://url.com",
        "submittedAt": "2025-05-13T11:48:57.274Z",
        "status": "SUBMITTED",
        "createdAt": "2025-05-13T10:31:47.900Z",
        "updatedAt": "2025-05-13T11:48:57.275Z"
    }
}
```

## 4. Role Access Control

Service ini mengimplementasikan sistem Role-Based Access Control (RBAC) dengan role berikut:

1. **ADMIN**: 
   - Akses penuh (CRUD) untuk assignment dan melihat semua submission
   - Dapat melihat semua data dengan detail lengkap
   - Akses ke analytics dan statistik pengumpulan tugas

2. **DIKE** dan **UMUM**:
   - Hanya dapat melihat (READ) assignment
   - Dapat mengumpulkan tugas untuk kursus yang diikuti
   - Hanya dapat melihat submission milik sendiri

3. **SERVICE**:
   - Digunakan untuk komunikasi antar layanan
   - Memerlukan service token khusus

## 5. Integrasi dengan Layanan Lain

1. **Course Service Integration**:
   - Verifikasi keberadaan course saat membuat assignment
   - Mendapatkan informasi course untuk tampilan

2. **Payment Service Integration (Enrollment)**:
   - Verifikasi enrollment siswa saat mengumpulkan tugas
   - Memastikan siswa hanya bisa mengerjakan tugas dari kursus yang diikuti

3. **Auth Service Integration**:
   - Validasi token dan informasi user
   - Role-based access control

## 6. Format Waktu dan Zona Waktu

1. **Input Format**:
   - Input tanggal dari client dalam format ISO 8601 tanpa timezone (`YYYY-MM-DDTHH:mm:ss`) akan diinterpretasikan sebagai waktu WIB (UTC+7)
   - Contoh: `2025-05-15T01:00:00` akan diinterpretasikan sebagai 1 pagi WIB pada tanggal 15 Mei 2025

2. **Storage Format**:
   - Semua tanggal disimpan dalam database dalam format UTC
   - Contoh: `2025-05-15T01:00:00` (WIB) akan disimpan sebagai `2025-05-14T18:00:00Z` (UTC)

3. **Output Format**:
   - Response API menyertakan:
     - `dueDate`: Format UTC asli dari database (contoh: `2025-05-14T18:00:00Z`)
     - `dueDateWib`: Format human-readable dalam WIB (contoh: `15 Mei 2025, 01:00`)
     - `isPastDue`: Boolean yang menunjukkan apakah deadline sudah lewat

## 7. Response Error

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
