# Dokumentasi API Payment Service OTI Academy

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

## 2. Endpoint Payment Service

### Membuat Pembayaran (Create Payment)

#### 1. Create Payment UMUM (Bukan Bundle - ENTRY atau INTERMEDIATE)

```
POST {{baseUrl}}/payments
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "packageId": "{{packageId}}",
  "courseId": "{{courseId}}",
  "type": "UMUM",
  "proofLink": "https://example.com/bukti-transfer-umum.jpg"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Payment created successfully",
  "data": {
    "id": "e71f3c5d-6c0f-42e4-8f85-39f4d15e2b19",
    "userId": "51f9bfb8-4c1a-4a7a-85a3-65ca1cde33d1",
    "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
    "courseId": "00000000-0000-0000-0000-000000000001",
    "type": "UMUM",
    "proofLink": "https://example.com/bukti-transfer-umum.jpg",
    "status": "PAID",
    "backPaymentMethod": null,
    "backAccountNumber": null,
    "backRecipient": null,
    "backStatus": null,
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:15:30.123Z",
    "updatedAt": "2025-05-06T10:15:30.123Z",
    "packageName": "Entry Web Development",
    "packageType": "ENTRY",
    "price": 250000
  }
}
```

#### 2. Create Payment UMUM (Bundle)

```
POST {{baseUrl}}/payments
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "packageId": "{{packageId}}",
  "type": "UMUM",
  "proofLink": "https://example.com/bukti-transfer-bundle.jpg"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Payment created successfully",
  "data": {
    "id": "5f91cc42-8dbd-4f6a-9f8d-3e0a3c50e5d2",
    "userId": "51f9bfb8-4c1a-4a7a-85a3-65ca1cde33d1",
    "packageId": "a31b1707-2c3a-4e1c-b0b8-a4d854ed47ec",
    "type": "UMUM",
    "proofLink": "https://example.com/bukti-transfer-bundle.jpg",
    "status": "PAID",
    "backPaymentMethod": null,
    "backAccountNumber": null,
    "backRecipient": null,
    "backStatus": null,
    "backCompletedAt": null,
    "createdAt": "2025-05-07T10:17:45.567Z",
    "updatedAt": "2025-05-07T10:17:45.567Z",
    "packageName": "Web Development Bundle",
    "packageType": "BUNDLE",
    "price": 450000
  }
}
```

#### 3. Create Payment DIKE (Bukan Bundle - ENTRY atau INTERMEDIATE)

```
POST {{baseUrl}}/payments
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "packageId": "{{packageId}}",
  "courseId": "{{courseId}}", 
  "type": "DIKE",
  "proofLink": "https://example.com/bukti-transfer-dike.jpg",
  "backPaymentMethod": "BNI",
  "backAccountNumber": "1234567890",
  "backRecipient": "Andi Susanto"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Payment created successfully",
  "data": {
    "id": "75c2d819-7a8d-4ce7-ac19-bba55efd2b72",
    "userId": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
    "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
    "courseId": "00000000-0000-0000-0000-000000000001",
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-dike.jpg",
    "status": "PAID",
    "backPaymentMethod": "BNI",
    "backAccountNumber": "1234567890",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-06T10:17:45.567Z",
    "packageName": "Entry Web Development",
    "packageType": "ENTRY",
    "price": 250000
  }
}
```

#### 4. Create Payment DIKE (Bundle)

```
POST {{baseUrl}}/payments
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "packageId": "{{packageId}}",
  "type": "DIKE",
  "proofLink": "https://example.com/bukti-transfer-dike.jpg",
  "backPaymentMethod": "BNI",
  "backAccountNumber": "1234567890",
  "backRecipient": "Andi Susanto"
}
```

**Response (201):**
```json
{
  "status": "success",
  "message": "Payment created successfully",
  "data": {
    "id": "5f91cc42-8dbd-4f6a-9f8d-3e0a3c50e5d2",
    "userId": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
    "packageId": "a31b1707-2c3a-4e1c-b0b8-a4d854ed47ec",
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-dike.jpg",
    "status": "PAID",
    "backPaymentMethod": "BNI",
    "backAccountNumber": "1234567890",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-07T10:17:45.567Z",
    "updatedAt": "2025-05-07T10:17:45.567Z",
    "packageName": "Web Development Bundle",
    "packageType": "BUNDLE",
    "price": 450000
  }
}
```

### Mendapatkan Semua Pembayaran (Admin Only)

```
GET {{baseUrl}}/payments
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Query Parameters (semua opsional):**
```
status=PAID
type=DIKE
backStatus=REQUESTED
startDate=2025-05-01
endDate=2025-05-07
page=1
limit=10
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Payments retrieved successfully",
  "data": {
    "payments": [
      {
        "id": "75c2d819-7a8d-4ce7-ac19-bba55efd2b72",
        "userId": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
        "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
        "courseId": "00000000-0000-0000-0000-000000000001",
        "type": "DIKE",
        "proofLink": "https://example.com/bukti-transfer-dike.jpg",
        "status": "PAID",
        "backPaymentMethod": "BNI",
        "backAccountNumber": "1234567890",
        "backRecipient": "Andi Susanto",
        "backStatus": "REQUESTED",
        "backCompletedAt": null,
        "createdAt": "2025-05-06T10:17:45.567Z",
        "updatedAt": "2025-05-06T10:17:45.567Z",
        "userName": "Andi Susanto",
        "userEmail": "andi@example.com",
        "userType": "DIKE",
        "packageName": "Entry Web Development",
        "packageType": "ENTRY",
        "price": 250000
      },
      {
        "id": "e71f3c5d-6c0f-42e4-8f85-39f4d15e2b19",
        "userId": "51f9bfb8-4c1a-4a7a-85a3-65ca1cde33d1",
        "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
        "courseId": "00000000-0000-0000-0000-000000000002",
        "type": "UMUM",
        "proofLink": "https://example.com/bukti-transfer-umum.jpg",
        "status": "PAID",
        "backPaymentMethod": null,
        "backAccountNumber": null,
        "backRecipient": null,
        "backStatus": null,
        "backCompletedAt": null,
        "createdAt": "2025-05-06T10:15:30.123Z",
        "updatedAt": "2025-05-06T10:15:30.123Z",
        "userName": "Budi Santoso",
        "userEmail": "budi@example.com",
        "userType": "UMUM",
        "packageName": "Entry Web Development",
        "packageType": "ENTRY",
        "price": 250000
      }
    ],
    "meta": {
      "page": 1,
      "pageSize": 10,
      "totalItems": 2,
      "totalPages": 1
    }
  }
}
```

### Mendapatkan Pembayaran Milik Saya

```
GET {{baseUrl}}/payments/my-payments
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User payments retrieved successfully",
  "data": [
    {
      "id": "75c2d819-7a8d-4ce7-ac19-bba55efd2b72",
      "userId": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
      "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
      "courseId": "00000000-0000-0000-0000-000000000001",
      "type": "DIKE",
      "proofLink": "https://example.com/bukti-transfer-dike.jpg",
      "status": "PAID",
      "backPaymentMethod": "BNI",
      "backAccountNumber": "1234567890",
      "backRecipient": "Andi Susanto",
      "backStatus": "REQUESTED",
      "backCompletedAt": null,
      "createdAt": "2025-05-06T10:17:45.567Z",
      "updatedAt": "2025-05-06T10:17:45.567Z",
      "packageName": "Entry Web Development",
      "packageType": "ENTRY",
      "price": 250000,
      "course": {
        "id": "00000000-0000-0000-0000-000000000001",
        "title": "Web Development Fundamentals"
      },
      "enrollmentStatus": false,
      "paymentDate": "2025-05-06T10:17:45.567Z"
    }
  ]
}
```

### Mendapatkan Detail Pembayaran

```
GET {{baseUrl}}/payments/{{paymentId}}
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Payment retrieved successfully",
  "data": {
    "id": "75c2d819-7a8d-4ce7-ac19-bba55efd2b72",
    "userId": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
    "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
    "courseId": "00000000-0000-0000-0000-000000000001",
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-dike.jpg",
    "status": "PAID",
    "backPaymentMethod": "BNI",
    "backAccountNumber": "1234567890",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-06T10:17:45.567Z",
    "packageName": "Entry Web Development",
    "packageType": "ENTRY",
    "price": 250000,
    "user": {
      "id": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
      "name": "Andi Susanto",
      "email": "andi@example.com",
      "type": "DIKE"
    },
    "course": {
      "id": "00000000-0000-0000-0000-000000000001",
      "title": "Web Development Fundamentals",
      "description": "Learn HTML, CSS, and JavaScript to build responsive websites from scratch",
      "level": "ENTRY"
    },
    "enrollmentStatus": false,
    "paymentDate": "2025-05-06T10:17:45.567Z"
  }
}
```

### Menyetujui Pembayaran (Admin Only)

```
PATCH {{baseUrl}}/payments/75c2d819-7a8d-4ce7-ac19-bba55efd2b72/approve
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Payment approved successfully",
  "data": {
    "id": "75c2d819-7a8d-4ce7-ac19-bba55efd2b72",
    "userId": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
    "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
    "courseId": "00000000-0000-0000-0000-000000000001",
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-dike.jpg",
    "status": "APPROVED",
    "backPaymentMethod": "BNI",
    "backAccountNumber": "1234567890",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-06T10:25:12.891Z",
    "packageName": "Entry Web Development",
    "packageType": "ENTRY",
    "price": 250000
  }
}
```

### Memperbarui Detail Pembayaran (DIKE & UMUM)

```
PATCH {{baseUrl}}/payments/75c2d819-7a8d-4ce7-ac19-bba55efd2b72/update
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body untuk UMUM:**
```json
{
  "proofLink": "https://example.com/bukti-transfer-baru.jpg"
}
```

**Body untuk DIKE:**
```json
{
  "proofLink": "https://example.com/bukti-transfer-baru.jpg",
  "backPaymentMethod": "DANA",
  "backAccountNumber": "0812345678",
  "backRecipient": "Andi Susanto"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Payment updated successfully",
  "data": {
    "id": "75c2d819-7a8d-4ce7-ac19-bba55efd2b72",
    "userId": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
    "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
    "courseId": "00000000-0000-0000-0000-000000000001",
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-baru.jpg",
    "status": "PAID",
    "backPaymentMethod": "DANA",
    "backAccountNumber": "0812345678",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-07T09:15:22.891Z",
    "packageName": "Entry Web Development",
    "packageType": "ENTRY",
    "price": 250000
  }
}
```

### Menyelesaikan Back Payment (Admin Only)

```
PATCH {{baseUrl}}/payments/75c2d819-7a8d-4ce7-ac19-bba55efd2b72/back/complete
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Back payment completed successfully",
  "data": {
    "id": "75c2d819-7a8d-4ce7-ac19-bba55efd2b72",
    "userId": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
    "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
    "courseId": "00000000-0000-0000-0000-000000000001",
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-dike.jpg",
    "status": "APPROVED",
    "backPaymentMethod": "OVO",
    "backAccountNumber": "0812345678",
    "backRecipient": "Andi Susanto",
    "backStatus": "COMPLETED",
    "backCompletedAt": "2025-05-06T11:05:33.128Z",
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-06T11:05:33.128Z",
    "packageName": "Entry Web Development",
    "packageType": "ENTRY",
    "price": 250000
  }
}
```

### Menghapus Pembayaran (Admin Only)

```
DELETE {{baseUrl}}/payments/75c2d819-7a8d-4ce7-ac19-bba55efd2b72
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Payment deleted successfully",
  "data": null
}
```


### Get payment stats

```
GET {{baseUrl}}/payments/{{courseId}}/stats
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
        "course": {
            "id": "6948a9a3-2a3c-4692-b19a-d230884a2334",
            "title": "Software Engineering",
            "level": "INTERMEDIATE"
        },
        "quota": {
            "total": 100,
            "entryIntermediateQuota": 70,
            "bundleQuota": 30
        },
        "enrollments": {
            "entryIntermediateCount": 1,
            "bundleCount": 2,
            "total": 3
        },
        "available": {
            "entryIntermediateAvailable": 69,
            "bundleAvailable": 28,
            "totalAvailable": 97
        },
        "percentageFilled": 3
    }
}
```

### Get all payment stats (ADMIN)

```
GET {{baseUrl}}/payments/all-stats
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
        "course": {
            "id": "6948a9a3-2a3c-4692-b19a-d230884a2334",
            "title": "Software Engineering",
            "level": "INTERMEDIATE"
        },
        "quota": {
            "total": 100,
            "entryIntermediateQuota": 70,
            "bundleQuota": 30
        },
        "enrollments": {
            "entryIntermediateCount": 1,
            "bundleCount": 2,
            "total": 3
        },
        "available": {
            "entryIntermediateAvailable": 69,
            "bundleAvailable": 28,
            "totalAvailable": 97
        },
        "percentageFilled": 3
    },
    ...
}
```

### Update Back Payment (DIKE Only)

```
PATCH {{baseUrl}}/payments/{{paymentId}}/update
```

**Headers**
```
Authorization: Bearer {{accessToken}}
```

```
{
  "backPaymentMethod": "OVO",
  "backAccountNumber": "08227394123",
  "backRecipient": "Kevin antonio",
  "proofLink": "https://youtu.com/img.jpg"
}
```


## 3. Perbedaan User UMUM dan DIKE

### User UMUM:
- Tidak memerlukan informasi back payment
- Field-field `backPaymentMethod`, `backAccountNumber`, `backRecipient` akan bernilai `null`
- Tidak dapat melakukan request back payment

### User DIKE:
- Harus menyertakan informasi back payment (`backPaymentMethod`, `backAccountNumber`, `backRecipient`)
- Pilihan `backPaymentMethod`: `BNI`, `GOPAY`, `OVO`, `DANA`
- Dapat melakukan request back payment setelah pembayaran dibuat
- Nilai default `backStatus` adalah `REQUESTED`

## 4. Integrasi dengan Enrollment Service

Saat pembayaran diapprove oleh admin (status = `APPROVED`), enrollment service akan menangani pendaftaran course untuk pengguna:

1. **Untuk Paket ENTRY dan INTERMEDIATE:**
   - Enrollment service akan mendaftarkan pengguna hanya ke course yang dipilih saat pembayaran

2. **Untuk Paket BUNDLE:**
   - Enrollment service akan mendaftarkan pengguna ke SEMUA course yang ada dalam paket bundle
   - Course yang dipilih saat pembayaran hanya digunakan sebagai referensi dan validasi untuk paket non-bundle
   - Ini memungkinkan bundle berisi multiple courses tapi menggunakan model payment yang konsisten

## 5. Aturan Validasi Penting

1. **Validasi Tipe User dan Tipe Payment:**
   - User dengan tipe DIKE hanya dapat membuat pembayaran dengan tipe DIKE
   - User dengan tipe UMUM hanya dapat membuat pembayaran dengan tipe UMUM
   
2. **Validasi Bundle Package:**
   - Pengguna yang sudah memiliki pembayaran aktif tidak bisa mendaftar ke paket bundle
   - Pengguna dengan paket bundle tidak bisa mendaftar ke kelas lain
   
3. **Validasi ENTRY/INTERMEDIATE Package:**
   - CourseId wajib diisi untuk paket tipe ENTRY dan INTERMEDIATE
   - CourseId yang dipilih harus termasuk dalam package yang dipilih
   - Pengguna tidak dapat mendaftar di kelas dengan tipe yang sama (contoh: tidak bisa mendaftar 2 kelas ENTRY)
   - Pengguna yang sudah memiliki paket bundle tidak bisa mendaftar ke kelas lain

4. **Validasi Back Payment (khusus DIKE):**
   - Jika tipe user DIKE, wajib menyertakan backPaymentMethod, backAccountNumber, dan backRecipient
   - Pilihan backPaymentMethod hanya BNI, GOPAY, OVO, atau DANA

## 6. Response Error

### 400 Bad Request (Validasi Gagal)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "code": "invalid_type",
      "path": ["proofLink"],
      "message": "Expected string, received null"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Access denied. Insufficient privileges."
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Payment not found"
}
```

### 400 Validasi Bisnis (Contoh-contoh)
```json
{
  "status": "error",
  "message": "Anda tidak dapat mendaftar paket bundle karena sudah terdaftar di kelas lain"
}
```

```json
{
  "status": "error",
  "message": "Anda sudah terdaftar di kelas entry. Tidak dapat mendaftar di kelas entry lainnya"
}
```

```json
{
  "status": "error",
  "message": "Course yang dipilih bukan bagian dari paket yang dipilih"
}
```

```json
{
  "status": "error",
  "message": "DIKE users require backPaymentMethod, backAccountNumber, and backRecipient"
}
```