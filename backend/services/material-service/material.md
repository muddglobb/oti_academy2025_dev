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

### 2.1. Material Management

#### 2.1.1. Membuat Material Baru (Create Material) - Admin Only

```
POST {{baseUrl}}/materials
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
  "title": "HTML Structure Basics",
  "description": "Learn the fundamentals of HTML document structure",
  "resourceUrl": "https://storage.googleapis.com/learning-materials/html-basics.pdf",
  "unlockDate": "2025-05-20T00:00:00+07:00"
}
```

**Note:** `unlockDate` harus dalam format ISO 8601 dan dalam zona waktu WIB (UTC+7).

**Response (201):**
```json
{
  "status": "success",
  "message": "Material created successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
    "courseId": "550e8400-e29b-41d4-a716-446655440001",
    "title": "HTML Structure Basics",
    "description": "Learn the fundamentals of HTML document structure",
    "resourceUrl": "https://storage.googleapis.com/learning-materials/html-basics.pdf",
    "unlockDate": "2025-05-20T00:00:00+07:00",
    "createdAt": "2025-05-16T08:30:15.789Z",
    "updatedAt": "2025-05-16T08:30:15.789Z"
  }
}
```

#### 2.1.2. Mendapatkan Semua Material (Admin Only)

```
GET {{baseUrl}}/materials
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
    "status": "success",
    "message": "All materials retrieved successfully",
    "data": [
        {
            "id": "76746ee0-0fa0-44ac-9d5c-a06fc1176af4",
            "courseId": "347a1af4-abfa-4802-9782-a6429ab9d7f0",
            "title": "tes2",
            "description": "Learn the fundamentals of HTML document structure",
            "resourceUrl": "https://storage.googleapis.com/learning-materials/html-basics.pdf",
            "unlockDate": {
                "utc": {
                    "iso": "2025-05-16T16:25:00.000Z",
                    "timestamp": 1747412700000
                },
                "wib": {
                    "iso": "2025-05-16T23:25:00.000Z",
                    "timestamp": 1747437900000
                }
            },
            "createdAt": "2025-05-16T16:21:05.354Z",
            "updatedAt": "2025-05-16T16:21:05.354Z",
            "unlocked": true,
            "course": {
                "title": "Course information not included"
            }
        },
        {
            "id": "2a9f5bf3-e6ab-424e-ad4e-932f940b4e10",
            "courseId": "347a1af4-abfa-4802-9782-a6429ab9d7f0",
            "title": "tes3",
            "description": "Learn the fundamentals of HTML document structure",
            "resourceUrl": "https://storage.googleapis.com/learning-materials/html-basics.pdf",
            "unlockDate": {
                "utc": {
                    "iso": "2025-05-16T16:39:00.000Z",
                    "timestamp": 1747413540000
                },
                "wib": {
                    "iso": "2025-05-16T23:39:00.000Z",
                    "timestamp": 1747438740000
                }
            },
            "createdAt": "2025-05-16T16:37:26.493Z",
            "updatedAt": "2025-05-16T16:37:26.493Z",
            "unlocked": true,
            "course": {
                "title": "Course information not included"
            }
        },
        {
            "id": "501ed2d4-b475-4ed0-b781-b11576653629",
            "courseId": "347a1af4-abfa-4802-9782-a6429ab9d7f0",
            "title": "HTML Structure Basics",
            "description": "Learn the fundamentals of HTML document structure",
            "resourceUrl": "https://storage.googleapis.com/learning-materials/html-basics.pdf",
            "unlockDate": {
                "utc": {
                    "iso": "2025-05-17T13:00:00.000Z",
                    "timestamp": 1747486800000
                },
                "wib": {
                    "iso": "2025-05-17T20:00:00.000Z",
                    "timestamp": 1747512000000
                }
            },
            "createdAt": "2025-05-16T14:49:30.986Z",
            "updatedAt": "2025-05-16T14:49:30.986Z",
            "unlocked": true,
            "course": {
                "title": "Course information not included"
            }
        }
    ]
}
```

#### 2.1.3. Mendapatkan Material Berdasarkan ID

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
        "id": "501ed2d4-b475-4ed0-b781-b11576653629",
        "courseId": "347a1af4-abfa-4802-9782-a6429ab9d7f0",
        "title": "HTML Structure Basics",
        "description": "Learn the fundamentals of HTML document structure",
        "resourceUrl": "https://storage.googleapis.com/learning-materials/html-basics.pdf",
        "unlockDate": {
            "utc": {
                "iso": "2025-05-17T13:00:00.000Z",
                "timestamp": 1747486800000
            },
            "wib": {
                "iso": "2025-05-17T20:00:00.000Z",
                "timestamp": 1747512000000
            }
        },
        "createdAt": "2025-05-16T14:49:30.986Z",
        "updatedAt": "2025-05-16T14:49:30.986Z",
        "unlocked": true
    }
}
```

#### 2.1.4. Mendapatkan Semua Material untuk Course Tertentu

```
GET {{baseUrl}}/materials/course/:courseId
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
            "id": "76746ee0-0fa0-44ac-9d5c-a06fc1176af4",
            "courseId": "347a1af4-abfa-4802-9782-a6429ab9d7f0",
            "title": "tes2",
            "description": "Learn the fundamentals of HTML document structure",
            "resourceUrl": "https://storage.googleapis.com/learning-materials/html-basics.pdf",
            "unlockDate": {
                "utc": {
                    "iso": "2025-05-16T16:25:00.000Z",
                    "timestamp": 1747412700000
                },
                "wib": {
                    "iso": "2025-05-16T23:25:00.000Z",
                    "timestamp": 1747437900000
                }
            },
            "createdAt": "2025-05-16T16:21:05.354Z",
            "updatedAt": "2025-05-16T16:21:05.354Z",
            "unlocked": true
        },
        {
            "id": "2a9f5bf3-e6ab-424e-ad4e-932f940b4e10",
            "courseId": "347a1af4-abfa-4802-9782-a6429ab9d7f0",
            "title": "tes3",
            "description": "Learn the fundamentals of HTML document structure",
            "resourceUrl": "https://storage.googleapis.com/learning-materials/html-basics.pdf",
            "unlockDate": {
                "utc": {
                    "iso": "2025-05-16T16:39:00.000Z",
                    "timestamp": 1747413540000
                },
                "wib": {
                    "iso": "2025-05-16T23:39:00.000Z",
                    "timestamp": 1747438740000
                }
            },
            "createdAt": "2025-05-16T16:37:26.493Z",
            "updatedAt": "2025-05-16T16:37:26.493Z",
            "unlocked": true
        },
        {
            "id": "501ed2d4-b475-4ed0-b781-b11576653629",
            "courseId": "347a1af4-abfa-4802-9782-a6429ab9d7f0",
            "title": "HTML Structure Basics",
            "description": "Learn the fundamentals of HTML document structure",
            "resourceUrl": null,
            "unlockDate": {
                "utc": {
                    "iso": "2025-05-17T13:00:00.000Z",
                    "timestamp": 1747486800000
                },
                "wib": {
                    "iso": "2025-05-17T20:00:00.000Z",
                    "timestamp": 1747512000000
                }
            },
            "createdAt": "2025-05-16T14:49:30.986Z",
            "updatedAt": "2025-05-16T14:49:30.986Z",
            "unlocked": false,
            "availableFrom": "2025-05-17T20:00:00.000Z"
        }
    ]
}
```

#### 2.1.4. Mengupdate Material (Update Material) - Admin Only

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
  "resourceUrl": "https://storage.googleapis.com/learning-materials/html-complete.pdf",
  "unlockDate": "2025-05-18T00:00:00+07:00"
}
```

**Note:** `unlockDate` harus dalam format ISO 8601 dan dalam zona waktu WIB (UTC+7).

**Response (200):**
```json
{
  "status": "success",
  "message": "Material updated successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-4g7h-8i9j-k0l1m2n3o4p5",
    "courseId": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Updated: HTML Document Structure",
    "description": "Comprehensive guide to HTML document structure with examples",
    "resourceUrl": "https://storage.googleapis.com/learning-materials/html-complete.pdf",
    "unlockDate": "2025-05-18T00:00:00+07:00",
    "createdAt": "2025-05-16T08:30:15.789Z",
    "updatedAt": "2025-05-16T11:15:30.123Z"
  }
}
```

#### 2.1.5. Menghapus Material (Delete Material) - Admin Only

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
| Create Material            | ✅    | ❌   | ❌   | ❌   |
| Get All Materials          | ✅    | ❌   | ❌   | ❌   |
| Get Material by ID         | ✅    | ✅   | ✅   | ✅   |
| Get Materials by Course    | ✅    | ✅   | ✅   | ✅   |
| Update Material            | ✅    | ❌   | ❌   | ❌   |
| Delete Material            | ✅    | ❌   | ❌   | ❌   |

## 4. Integrasi dengan Layanan Lain

Material Service terintegrasi dengan layanan lain di OTI Academy sebagai berikut:

1. **Auth Service**: Untuk validasi token dan otorisasi
2. **Course Service**: Untuk validasi keberadaan course sebelum membuat material

## 5. Penanganan Timezone 

Material Service mengimplementasikan penanganan timezone untuk field `unlockDate`:

- Semua input `unlockDate` dari user dianggap dalam format WIB (UTC+7)
- Data disimpan ke database dalam format UTC
- Data yang ditampilkan ke user dikonversi kembali ke WIB

## 6. Akses Material Berdasarkan Tanggal

Material Service mengimplementasikan akses berbasis tanggal:

- Material hanya akan tersedia untuk diakses oleh non-admin users (DIKE, UMUM, USER) setelah tanggal `unlockDate`
- Admin dapat mengakses semua material tanpa batasan waktu
- Jika user mencoba mengakses material yang belum waktunya dibuka, akan menerima respons error 403

## 7. Response Error

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
      "field": "resourceUrl",
      "message": "Resource URL must be a valid URL"
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

**Material Not Yet Available (403):**
```json
{
  "status": "error",
  "message": "This material is not yet available."
}
```

**Not Found (404):**
```json
{
  "status": "error",
  "message": "Material not found"
}
```