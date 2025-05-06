# Dokumentasi API Package-Service untuk Postman

Berikut adalah dokumentasi lengkap untuk pengujian Package-Service menggunakan Postman.

## 🔧 Setup Environment Postman

Pertama, buat environment di Postman dengan variabel berikut:
```
baseUrl: http://localhost:8000
accessToken: (akan diisi otomatis setelah login)
refreshToken: (akan diisi otomatis setelah login)
```

## 🔑 Autentikasi

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

## 📋 Endpoint Package-Service

### 1. Package Management

#### 1.1. Get All Packages
```
GET {{baseUrl}}/packages
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
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Beginner Web Development",
      "type": "BEGINNER",
      "price": 250000,
      "createdAt": "2025-05-06T04:30:45.123Z",
      "updatedAt": "2025-05-06T04:30:45.123Z",
      "courses": []
    }
  ]
}
```

#### 1.2. Get Package by ID
```
GET {{baseUrl}}/packages/:packageId
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
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Beginner Web Development",
    "type": "BEGINNER",
    "price": 250000,
    "createdAt": "2025-05-06T04:30:45.123Z",
    "updatedAt": "2025-05-06T04:30:45.123Z",
    "courses": [
      {
        "packageId": "550e8400-e29b-41d4-a716-446655440000",
        "courseId": "course-uuid-001"
      }
    ]
  }
}
```

#### 1.3. Create Package (Admin Only)
```
POST {{baseUrl}}/packages
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Intermediate JavaScript",
  "type": "INTERMEDIATE",
  "price": 350000
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Package berhasil dibuat",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Intermediate JavaScript",
    "type": "INTERMEDIATE",
    "price": 350000,
    "createdAt": "2025-05-06T05:15:30.123Z",
    "updatedAt": "2025-05-06T05:15:30.123Z"
  }
}
```

#### 1.4. Update Package (Admin Only)
```
PUT {{baseUrl}}/packages/:packageId
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Updated Intermediate JavaScript",
  "price": 375000
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Package berhasil diperbarui",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Updated Intermediate JavaScript",
    "type": "INTERMEDIATE",
    "price": 375000,
    "createdAt": "2025-05-06T05:15:30.123Z",
    "updatedAt": "2025-05-06T05:25:45.123Z"
  }
}
```

#### 1.5. Delete Package (Admin Only)
```
DELETE {{baseUrl}}/packages/:packageId
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Package berhasil dihapus",
  "data": null
}
```

### 2. Package Courses Management

#### 2.1. Get All Courses in Package
```
GET {{baseUrl}}/packages/:packageId/courses
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
      "courseId": "course-uuid-001",
      "title": "Intro to Web Development",
      "packageId": "550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "courseId": "course-uuid-002",
      "title": "Intermediate JavaScript",
      "packageId": "550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

#### 2.2. Add Course to Package (Admin Only)

##### 2.2.1 Untuk Package Tipe BEGINNER dan INTERMEDIATE
```
POST {{baseUrl}}/packages/:packageId/courses
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "courseId": "course-uuid-003"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Course berhasil ditambahkan ke package",
  "data": {
    "packageId": "550e8400-e29b-41d4-a716-446655440000",
    "courseId": "course-uuid-003"
  }
}
```

##### 2.2.2 Untuk Package Tipe BUNDLE
```
POST {{baseUrl}}/packages/:packageId/courses
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "courseIds": ["course-uuid-001", "course-uuid-002"]
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Pasangan course berhasil ditambahkan ke package BUNDLE",
  "data": [
    {
      "packageId": "550e8400-e29b-41d4-a716-446655440002",
      "courseId": "course-uuid-001"
    },
    {
      "packageId": "550e8400-e29b-41d4-a716-446655440002",
      "courseId": "course-uuid-002"
    }
  ]
}
```

#### 2.3. Remove Course from Package (Admin Only)
```
DELETE {{baseUrl}}/packages/:packageId/courses/:courseId
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Course berhasil dihapus dari package",
  "data": null
}
```

## ⚠️ Catatan Penting

1. **Port API Gateway**: API Gateway berjalan pada `http://localhost:8000` yang meneruskan request ke package-service
2. **Autentikasi**: Semua endpoint memerlukan autentikasi melalui header `Authorization: Bearer {{accessToken}}`
3. **Role-Based Access Control**:
   - Semua user dengan role `ADMIN`, `DIKE`, `UMUM`, atau `USER` dapat mengakses endpoint GET
   - Hanya user dengan role `ADMIN` yang dapat membuat, memperbarui, atau menghapus data
4. **Batasan Course dalam Package**:
   - **BEGINNER**: Dapat memiliki banyak course tanpa batasan
   - **INTERMEDIATE**: Dapat memiliki banyak course tanpa batasan
   - **BUNDLE**: Setiap penambahan course harus berpasangan (2 course sekaligus) menggunakan format `courseIds`
5. **Format Request Body Berbeda untuk Tipe Package**:
   - Package **BEGINNER** dan **INTERMEDIATE**: Gunakan `{ "courseId": "course-uuid-xxx" }`
   - Package **BUNDLE**: Gunakan `{ "courseIds": ["course-uuid-xxx", "course-uuid-yyy"] }`
6. **Error yang umum**:
   - 400: Bad Request - Input validation error (format tidak sesuai dengan tipe package)
   - 400: Bad Request - "Untuk package tipe BUNDLE, courseIds wajib berupa array yang berisi 2 course ID"
   - 401: Unauthorized - Invalid token atau missing token
   - 403: Forbidden - Role tidak memiliki akses
   - 404: Not Found - Package tidak ditemukan
   - 400: Bad Request - "Course sudah ada dalam package" (saat course sudah ada di package)
   - 500: Internal Server Error - Error pada server

## 🔄 Langkah-Langkah Pengujian

1. Import collection ke Postman
2. Set environment dengan `baseUrl`
3. Jalankan request "Login (Get Token)" terlebih dahulu untuk mendapatkan token
4. Gunakan token tersebut untuk mengakses endpoint Package-Service lainnya

## 📋 Contoh Penggunaan BUNDLE

Berikut adalah contoh untuk menambahkan pasangan course ke package tipe BUNDLE:

### 1. Penambahan Bundle Web Development + Software Engineering
```
POST {{baseUrl}}/packages/550e8400-e29b-41d4-a716-446655440002/courses
```
**Body:**
```json
{
  "courseIds": ["course-uuid-001", "course-uuid-002"]
}
```

### 2. Penambahan Bundle Graphic Design + UI/UX 
```
POST {{baseUrl}}/packages/550e8400-e29b-41d4-a716-446655440002/courses
```
**Body:**
```json
{
  "courseIds": ["course-uuid-003", "course-uuid-004"]
}
```

### 3. Penambahan Bundle Python + Data Science
```
POST {{baseUrl}}/packages/550e8400-e29b-41d4-a716-446655440002/courses
```
**Body:**
```json
{
  "courseIds": ["course-uuid-005", "course-uuid-006"]
}
```