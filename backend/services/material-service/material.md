# Dokumentasi API Material-Service OTI Academy

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

## 2. Endpoint Material Service

### 2.1. Section Management

#### 2.1.1. Membuat Section Baru (Create Section) - Admin Only

```
POST {{baseUrl}}/sections
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "courseId": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Introduction to HTML & CSS",
  "description": "Basic HTML structure and fundamental CSS styling",
  "order": 1
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Section created successfully",
  "data": {
    "id": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
    "courseId": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Introduction to HTML & CSS",
    "description": "Basic HTML structure and fundamental CSS styling",
    "order": 1,
    "createdAt": "2025-05-10T08:15:30.123Z",
    "updatedAt": "2025-05-10T08:15:30.123Z"
  }
}
```

#### 2.1.2. Mendapatkan Semua Section untuk Course Tertentu

```
GET {{baseUrl}}/sections/course/:courseId
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Sections retrieved successfully",
  "data": [
    {
      "id": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
      "courseId": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Introduction to HTML & CSS",
      "description": "Basic HTML structure and fundamental CSS styling",
      "order": 1,
      "createdAt": "2025-05-10T08:15:30.123Z",
      "updatedAt": "2025-05-10T08:15:30.123Z",
      "materials": [
        {
          "id": "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
          "title": "HTML Structure Basics",
          "description": "Learn the fundamentals of HTML document structure",
          "type": "TEXT",
          "content": "<h1>HTML Basics</h1><p>HTML stands for HyperText Markup Language...</p>",
          "order": 1
        },
        {
          "id": "b2c3d4e5-f6g7-5h8i-9j0k-l1m2n3o4p5q6",
          "title": "CSS Introduction",
          "description": "Introduction to styling web pages with CSS",
          "type": "VIDEO",
          "externalUrl": "https://www.youtube.com/watch?v=example",
          "order": 2
        }
      ]
    },
    {
      "id": "8g5ef43f-9c3b-5d30-a7f2-g1edc0f4b3e2",
      "courseId": "550e8400-e29b-41d4-a716-446655440001",
      "title": "JavaScript Fundamentals",
      "description": "Introduction to JavaScript programming language",
      "order": 2,
      "createdAt": "2025-05-10T09:20:45.456Z",
      "updatedAt": "2025-05-10T09:20:45.456Z",
      "materials": [
        {
          "id": "c3d4e5f6-g7h8-6i9j-0k1l-m2n3o4p5q6r7",
          "title": "Variables and Data Types",
          "description": "Understanding JavaScript variables and data types",
          "type": "TEXT",
          "content": "<h1>Variables in JavaScript</h1><p>In JavaScript, variables are containers for storing data...</p>",
          "order": 1
        }
      ]
    }
  ]
}
```

#### 2.1.3. Mendapatkan Detail Section Berdasarkan ID

```
GET {{baseUrl}}/sections/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Section retrieved successfully",
  "data": {
    "id": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
    "courseId": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Introduction to HTML & CSS",
    "description": "Basic HTML structure and fundamental CSS styling",
    "order": 1,
    "createdAt": "2025-05-10T08:15:30.123Z",
    "updatedAt": "2025-05-10T08:15:30.123Z",
    "materials": [
      {
        "id": "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
        "title": "HTML Structure Basics",
        "description": "Learn the fundamentals of HTML document structure",
        "type": "TEXT",
        "content": "<h1>HTML Basics</h1><p>HTML stands for HyperText Markup Language...</p>",
        "order": 1,
        "sectionId": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
        "createdAt": "2025-05-10T08:30:15.789Z",
        "updatedAt": "2025-05-10T08:30:15.789Z"
      },
      {
        "id": "b2c3d4e5-f6g7-5h8i-9j0k-l1m2n3o4p5q6",
        "title": "CSS Introduction",
        "description": "Introduction to styling web pages with CSS",
        "type": "VIDEO",
        "externalUrl": "https://www.youtube.com/watch?v=example",
        "order": 2,
        "sectionId": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
        "createdAt": "2025-05-10T08:45:20.456Z",
        "updatedAt": "2025-05-10T08:45:20.456Z"
      }
    ]
  }
}
```

#### 2.1.4. Mengupdate Section (Update Section) - Admin Only

```
PUT {{baseUrl}}/sections/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Updated: HTML & CSS Fundamentals",
  "description": "Comprehensive introduction to HTML structure and CSS styling basics",
  "order": 1
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Section updated successfully",
  "data": {
    "id": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
    "courseId": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Updated: HTML & CSS Fundamentals",
    "description": "Comprehensive introduction to HTML structure and CSS styling basics",
    "order": 1,
    "createdAt": "2025-05-10T08:15:30.123Z",
    "updatedAt": "2025-05-10T10:25:40.567Z"
  }
}
```

#### 2.1.5. Menghapus Section (Delete Section) - Admin Only

```
DELETE {{baseUrl}}/sections/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Section deleted successfully",
  "data": null
}
```

### 2.2. Material Management

#### 2.2.1. Membuat Material Baru (Create Material) - Admin Only

```
POST {{baseUrl}}/materials
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body (TEXT type):**
```json
{
  "sectionId": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
  "title": "HTML Structure Basics",
  "description": "Learn the fundamentals of HTML document structure",
  "type": "TEXT",
  "content": "<h1>HTML Basics</h1><p>HTML stands for HyperText Markup Language...</p>",
  "order": 1
}
```

**Body (VIDEO type):**
```json
{
  "sectionId": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
  "title": "CSS Introduction",
  "description": "Introduction to styling web pages with CSS",
  "type": "VIDEO",
  "externalUrl": "https://www.youtube.com/watch?v=example",
  "duration": 45,
  "order": 2
}
```

**Body (PDF type):**
```json
{
  "sectionId": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
  "title": "JavaScript Cheat Sheet",
  "description": "A comprehensive cheat sheet for JavaScript",
  "type": "PDF",
  "order": 3
}
```
Note: For PDF type, fileUrl should be added via file upload.

**Response (201):**
```json
{
  "status": "success",
  "message": "Material created successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
    "sectionId": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
    "title": "HTML Structure Basics",
    "description": "Learn the fundamentals of HTML document structure",
    "type": "TEXT",
    "content": "<h1>HTML Basics</h1><p>HTML stands for HyperText Markup Language...</p>",
    "fileUrl": null,
    "externalUrl": null,
    "order": 1,
    "duration": null,
    "status": "ACTIVE",
    "createdAt": "2025-05-10T08:30:15.789Z",
    "updatedAt": "2025-05-10T08:30:15.789Z"
  }
}
```

#### 2.2.2. Upload Material File - Admin Only

```
POST {{baseUrl}}/materials/upload
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Form Data:**
```
file: (file binary)
```

**Response (200):**
```json
{
  "status": "success",
  "message": "File uploaded successfully",
  "data": {
    "fileUrl": "/uploads/f7e6d5c4-b3a2-4912-8765-0987654321fe.pdf"
  }
}
```

#### 2.2.3. Mendapatkan Material Berdasarkan ID

```
GET {{baseUrl}}/materials/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Material retrieved successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
    "sectionId": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
    "title": "HTML Structure Basics",
    "description": "Learn the fundamentals of HTML document structure",
    "type": "TEXT",
    "content": "<h1>HTML Basics</h1><p>HTML stands for HyperText Markup Language...</p>",
    "fileUrl": null,
    "externalUrl": null,
    "order": 1,
    "duration": null,
    "status": "ACTIVE",
    "createdAt": "2025-05-10T08:30:15.789Z",
    "updatedAt": "2025-05-10T08:30:15.789Z",
    "section": {
      "id": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
      "courseId": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Introduction to HTML & CSS"
    }
  }
}
```

#### 2.2.4. Mendapatkan Semua Material untuk Section Tertentu

```
GET {{baseUrl}}/materials/section/:sectionId
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Materials retrieved successfully",
  "data": [
    {
      "id": "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
      "sectionId": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
      "title": "HTML Structure Basics",
      "description": "Learn the fundamentals of HTML document structure",
      "type": "TEXT",
      "content": "<h1>HTML Basics</h1><p>HTML stands for HyperText Markup Language...</p>",
      "fileUrl": null,
      "externalUrl": null,
      "order": 1,
      "duration": null,
      "status": "ACTIVE",
      "createdAt": "2025-05-10T08:30:15.789Z",
      "updatedAt": "2025-05-10T08:30:15.789Z"
    },
    {
      "id": "b2c3d4e5-f6g7-5h8i-9j0k-l1m2n3o4p5q6",
      "sectionId": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
      "title": "CSS Introduction",
      "description": "Introduction to styling web pages with CSS",
      "type": "VIDEO",
      "content": null,
      "fileUrl": null,
      "externalUrl": "https://www.youtube.com/watch?v=example",
      "order": 2,
      "duration": 45,
      "status": "ACTIVE",
      "createdAt": "2025-05-10T08:45:20.456Z",
      "updatedAt": "2025-05-10T08:45:20.456Z"
    }
  ]
}
```

#### 2.2.5. Mengupdate Material (Update Material) - Admin Only

```
PUT {{baseUrl}}/materials/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Updated: HTML Document Structure",
  "description": "Comprehensive guide to HTML document structure with examples",
  "content": "<h1>HTML Document Structure</h1><p>Every HTML document should start with a proper structure...</p>",
  "order": 1
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Material updated successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
    "sectionId": "7f4df32e-8a2b-4b29-982c-f0dce9e3c8d1",
    "title": "Updated: HTML Document Structure",
    "description": "Comprehensive guide to HTML document structure with examples",
    "type": "TEXT",
    "content": "<h1>HTML Document Structure</h1><p>Every HTML document should start with a proper structure...</p>",
    "fileUrl": null,
    "externalUrl": null,
    "order": 1,
    "duration": null,
    "status": "ACTIVE",
    "createdAt": "2025-05-10T08:30:15.789Z",
    "updatedAt": "2025-05-10T11:15:30.123Z"
  }
}
```

#### 2.2.6. Menghapus Material (Delete Material) - Admin Only

```
DELETE {{baseUrl}}/materials/:id
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Material deleted successfully",
  "data": null
}
```

## 3. Hak Akses Berdasarkan Role

| Endpoint                   | Admin | DIKE | UMUM | USER |
|----------------------------|-------|------|------|------|
| Create Section             | ✅    | ❌   | ❌   | ❌   |
| Get Section by Course      | ✅    | ✅   | ✅   | ✅   |
| Get Section by ID          | ✅    | ✅   | ✅   | ✅   |
| Update Section             | ✅    | ❌   | ❌   | ❌   |
| Delete Section             | ✅    | ❌   | ❌   | ❌   |
| Create Material            | ✅    | ❌   | ❌   | ❌   |
| Upload Material File       | ✅    | ❌   | ❌   | ❌   |
| Get Material by ID         | ✅    | ✅   | ✅   | ✅   |
| Get Materials by Section   | ✅    | ✅   | ✅   | ✅   |
| Update Material            | ✅    | ❌   | ❌   | ❌   |
| Delete Material            | ✅    | ❌   | ❌   | ❌   |

## 4. Integrasi dengan Layanan Lain

Material Service terintegrasi dengan layanan lain di OTI Academy sebagai berikut:

1. **Auth Service**: Untuk validasi token dan otorisasi
2. **Course Service**: Untuk validasi keberadaan course sebelum membuat section

## 5. Format Material yang Didukung

Material Service mendukung berbagai jenis konten pembelajaran:

| Tipe Material | Deskripsi                                   | Field yang Diperlukan            |
|---------------|---------------------------------------------|----------------------------------|
| TEXT          | Konten teks atau HTML formatif              | content                          |
| PDF           | Dokumen PDF                                 | fileUrl (via upload)             |
| VIDEO         | Video pembelajaran                          | fileUrl atau externalUrl, duration|
| LINK          | Link eksternal ke sumber belajar            | externalUrl                      |
| QUIZ          | Kuis interaktif                             | content (format JSON)            |
| CODE          | Contoh kode dengan syntax highlighting      | content                          |

## 6. Response Error

### Error Format
```json
{
  "status": "error",
  "message": "Error message here",
  "errors": [] // Optional detailed error information
}
```

### Common Error Codes
- **400 Bad Request**: Format request salah atau validasi gagal
- **401 Unauthorized**: Token tidak valid atau expired
- **403 Forbidden**: Tidak memiliki izin untuk mengakses resource
- **404 Not Found**: Resource tidak ditemukan
- **500 Internal Server Error**: Error pada server

### Contoh Error Response

**Invalid Input (400):**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters"
    },
    {
      "field": "type",
      "message": "Invalid material type. Allowed types: TEXT, PDF, VIDEO, LINK, QUIZ, CODE"
    }
  ]
}
```

**Unauthorized (401):**
```json
{
  "status": "error",
  "message": "Authentication required. No token provided."
}
```

**Forbidden (403):**
```json
{
  "status": "error",
  "message": "Access denied. Only admins can create materials."
}
```

**Not Found (404):**
```json
{
  "status": "error",
  "message": "Section not found"
}
```