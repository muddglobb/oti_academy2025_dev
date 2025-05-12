# Dokumentasi API Email Service OTI Academy

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

## 2. Endpoint Email Service

### 2.1. Send Email

#### Send Payment Confirmation Email
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

#### Send Enrollment Confirmation Email
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

### 2.2. Template Management (Admin Only)

#### Get All Templates
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

#### Update Template (Admin Only)
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

### 2.3. Email Status

#### Check Email Status
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

### 2.4. Health Check

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

## 3. Queue Management System

Email Service menggunakan sistem antrian (queue) untuk memproses email secara asynchronous, dengan jenis antrian:

1. **payment-confirmation** - Untuk email konfirmasi pembayaran
2. **enrollment-confirmation** - Untuk email konfirmasi pendaftaran kursus

Setiap email yang dikirimkan akan diproses melalui antrian untuk memastikan:
- Sistem tidak kewalahan dengan volume tinggi
- Email tetap terkirim meskipun ada gangguan sementara
- Pesan dapat dicoba ulang jika gagal

## 4. Role Access Control

1. **ADMIN**: 
   - Akses penuh untuk mengelola template email
   - Dapat melihat status pengiriman semua email

2. **SERVICE**:
   - Dapat mengirim email melalui API dengan service token
   - Memerlukan `x-api-key` untuk autentikasi antar layanan

3. **DIKE** dan **UMUM**:
   - Tidak dapat mengakses layanan email secara langsung
   - Email dikirim oleh sistem berdasarkan interaksi pengguna

## 5. Response Error
```
| Status Code | Description                     |
|-------------|---------------------------------|
| 400         | Bad Request - Parameter tidak valid |
| 401         | Unauthorized - Token tidak valid    |
| 403         | Forbidden - Tidak memiliki izin    |
| 404         | Not Found - Template/resource tidak ditemukan |
| 429         | Too Many Requests - Rate limit tercapai |
| 500         | Internal Server Error            |
```