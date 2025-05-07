# Dokumentasi API Payment Service OTI Academy

## 1. Setup Postman

### Environment Variables
```
baseUrl: http://localhost:8080
accessToken: (akan diisi setelah login)
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
}
```

## 2. Endpoint Payment Service

### Membuat Pembayaran (Create Payment)

#### A. Untuk User UMUM

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
    "type": "UMUM",
    "proofLink": "https://example.com/bukti-transfer-umum.jpg",
    "status": "PAID",
    "backPaymentMethod": null,
    "backAccountNumber": null,
    "backRecipient": null,
    "backStatus": null,
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:15:30.123Z",
    "updatedAt": "2025-05-06T10:15:30.123Z"
  }
}
```

#### B. Untuk User DIKE

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
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-dike.jpg",
    "status": "PAID",
    "backPaymentMethod": "BNI",
    "backAccountNumber": "1234567890",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-06T10:17:45.567Z"
  }
}
```

#### C. Untuk Package Tipe BUNDLE

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
  "userId": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
  "packageId": "a31b1707-2c3a-4e1c-b0b8-a4d854ed47ec", // ID paket bundle
  "courseId": "00000000-0000-0000-0000-000000000007", // Pilih salah satu course dari bundle
  "type": "DIKE", // atau "UMUM" sesuai tipe user
  "proofLink": "https://example.com/bukti-transfer-bundle.jpg",
  "backPaymentMethod": "BNI", // wajib jika type = "DIKE"
  "backAccountNumber": "1234567890", // wajib jika type = "DIKE"
  "backRecipient": "Andi Susanto" // wajib jika type = "DIKE"
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
    "courseId": "00000000-0000-0000-0000-000000000007",
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-bundle.jpg",
    "status": "PAID",
    "backPaymentMethod": "BNI",
    "backAccountNumber": "1234567890",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-07T10:17:45.567Z",
    "updatedAt": "2025-05-07T10:17:45.567Z"
  }
}
```

**Catatan Penting untuk Paket Bundle:**
1. Pilih salah satu `courseId` yang ada dalam paket bundle (bisa menggunakan endpoint `/packages/{packageId}/courses` untuk melihat courses yang tersedia)
2. Payment service akan memvalidasi bahwa courseId yang dipilih memang termasuk dalam paket bundle
3. Ketika pembayaran disetujui (status = `APPROVED`), enrollment service akan mendaftarkan pengguna ke SEMUA course dalam paket bundle, tidak hanya ke course yang dipilih saat pembayaran
4. Pengguna yang sudah memiliki pembayaran aktif tidak bisa mendaftar ke paket bundle, dan pengguna dengan paket bundle tidak bisa mendaftar ke kelas lain

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
        "type": "DIKE",
        "proofLink": "https://example.com/bukti-transfer-dike.jpg",
        "status": "PAID",
        "backPaymentMethod": "BNI",
        "backAccountNumber": "1234567890",
        "backRecipient": "Andi Susanto",
        "backStatus": "REQUESTED",
        "backCompletedAt": null,
        "createdAt": "2025-05-06T10:17:45.567Z",
        "updatedAt": "2025-05-06T10:17:45.567Z"
      },
      {
        "id": "e71f3c5d-6c0f-42e4-8f85-39f4d15e2b19",
        "userId": "51f9bfb8-4c1a-4a7a-85a3-65ca1cde33d1",
        "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
        "type": "UMUM",
        "proofLink": "https://example.com/bukti-transfer-umum.jpg",
        "status": "PAID",
        "backPaymentMethod": null,
        "backAccountNumber": null,
        "backRecipient": null,
        "backStatus": null,
        "backCompletedAt": null,
        "createdAt": "2025-05-06T10:15:30.123Z",
        "updatedAt": "2025-05-06T10:15:30.123Z"
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

### Mendapatkan Detail Pembayaran

```
GET {{baseUrl}}/payments/75c2d819-7a8d-4ce7-ac19-bba55efd2b72
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
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-dike.jpg",
    "status": "PAID",
    "backPaymentMethod": "BNI",
    "backAccountNumber": "1234567890",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-06T10:17:45.567Z"
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
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-dike.jpg",
    "status": "APPROVED",
    "backPaymentMethod": "BNI",
    "backAccountNumber": "1234567890",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-06T10:25:12.891Z"
  }
}
```

### Memperbarui Informasi Back Payment (DIKE Only)

```
POST {{baseUrl}}/payments/75c2d819-7a8d-4ce7-ac19-bba55efd2b72/back
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "backPaymentMethod": "OVO",
  "backAccountNumber": "0812345678",
  "backRecipient": "Andi Susanto"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Back payment requested successfully",
  "data": {
    "id": "75c2d819-7a8d-4ce7-ac19-bba55efd2b72",
    "userId": "dafc9d5e-3b7a-4a63-b160-7a13c922104f",
    "packageId": "f23a7642-9df3-42cf-9c1e-b8962dbd5608",
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-dike.jpg",
    "status": "APPROVED",
    "backPaymentMethod": "OVO",
    "backAccountNumber": "0812345678",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-06T10:35:20.459Z"
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

**Body:**
```json
{
  "proofLink": "https://example.com/bukti-transfer-baru.jpg"
}
```

**Body (khusus untuk DIKE - memperbarui info back payment):**
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
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-baru.jpg",
    "status": "PAID",
    "backPaymentMethod": "DANA",
    "backAccountNumber": "0812345678",
    "backRecipient": "Andi Susanto",
    "backStatus": "REQUESTED",
    "backCompletedAt": null,
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-07T09:15:22.891Z"
  }
}
```

**Catatan Penting:**
1. Endpoint ini dapat digunakan oleh baik user DIKE maupun UMUM
2. User UMUM hanya dapat memperbarui `proofLink`
3. User DIKE dapat memperbarui `proofLink` dan/atau informasi back payment
4. Jika memperbarui informasi back payment, ketiga field (`backPaymentMethod`, `backAccountNumber`, `backRecipient`) harus disertakan
5. Hanya pemilik pembayaran yang dapat memperbarui data pembayarannya
6. Pembayaran yang sudah diapprove (status = `APPROVED`) tidak dapat diperbarui
7. Field `backStatus` akan otomatis diset ulang ke `REQUESTED` jika informasi back payment diperbarui

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
    "type": "DIKE",
    "proofLink": "https://example.com/bukti-transfer-dike.jpg",
    "status": "APPROVED",
    "backPaymentMethod": "OVO",
    "backAccountNumber": "0812345678",
    "backRecipient": "Andi Susanto",
    "backStatus": "COMPLETED",
    "backCompletedAt": "2025-05-06T11:05:33.128Z",
    "createdAt": "2025-05-06T10:17:45.567Z",
    "updatedAt": "2025-05-06T11:05:33.128Z"
  }
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

1. **Untuk Paket BEGINNER dan INTERMEDIATE:**
   - Enrollment service akan mendaftarkan pengguna hanya ke course yang dipilih saat pembayaran

2. **Untuk Paket BUNDLE:**
   - Enrollment service akan mendaftarkan pengguna ke SEMUA course yang ada dalam paket bundle
   - Course yang dipilih saat pembayaran hanya digunakan sebagai referensi dan validasi
   - Ini memungkinkan bundle berisi multiple courses tapi menggunakan model payment yang konsisten

## 5. Response Error

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