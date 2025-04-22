# Dokumentasi Postman untuk Auth Service

Berikut adalah dokumentasi lengkap untuk pengujian Auth Service menggunakan Postman. Ini fokus hanya pada auth-service untuk manajemen pengguna.

## Environment Setup

Pertama, buat environment di Postman dengan variabel berikut:

```
BASE_URL: http://localhost:8001 (atau alamat API Gateway)
ACCESS_TOKEN: (akan diisi otomatis setelah login)
REFRESH_TOKEN: (akan diisi otomatis setelah login)
```

## Auth Service API Collection

### 1. Authentication Endpoints

#### 1.1 Register

```
POST {{BASE_URL}}/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body (UMUM User):**
```json
{
  "name": "User Umum",
  "email": "user@example.com",
  "password": "Password123!",
  "type": "UMUM"
}
```

**Body (DIKE User):**
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
      "id": 1,
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

**Tests (JavaScript):**
```javascript
// Save tokens to environment
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("ACCESS_TOKEN", jsonData.data.accessToken);
    pm.environment.set("REFRESH_TOKEN", jsonData.data.refreshToken);
}
```

#### 1.2 Login

```
POST {{BASE_URL}}/auth/login
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
      "id": 1,
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

**Tests (JavaScript):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("ACCESS_TOKEN", jsonData.data.accessToken);
    pm.environment.set("REFRESH_TOKEN", jsonData.data.refreshToken);
}
```

#### 1.3 Refresh Token

```
POST {{BASE_URL}}/auth/refresh-token
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "{{REFRESH_TOKEN}}"
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

**Tests (JavaScript):**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("ACCESS_TOKEN", jsonData.data.accessToken);
}
```

#### 1.5 Change Password

```
PATCH {{BASE_URL}}/auth/change-password
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
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

#### 1.6 Update Profile

```
PATCH {{BASE_URL}}/auth/update-profile
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
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
    "id": 1,
    "name": "Updated Name",
    "email": "user@example.com",
    "role": "UMUM",
    "type": "UMUM",
    "nim": null,
    "createdAt": "2025-04-22T12:00:00.000Z"
  }
}
```

#### 1.7 Logout

```
POST {{BASE_URL}}/auth/logout
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "{{REFRESH_TOKEN}}"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

#### 1.8 Forgot Password

```
POST {{BASE_URL}}/auth/forgot-password
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

#### 1.9 Verify Reset Token

```
GET {{BASE_URL}}/auth/verify-reset/:token
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "valid": true,
    "email": "us****@example.com"
  }
}
```

#### 1.10 Reset Password

```
POST {{BASE_URL}}/auth/reset-password
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

### 2. User Management Endpoints

#### 2.1 Get All Users (Admin Only)

```
GET {{BASE_URL}}/users
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN",
      "type": "UMUM",
      "nim": null,
      "createdAt": "2025-04-22T10:00:00.000Z"
    },
    {
      "id": 2,
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

### 2.2 Get current user info

```
GET {{BASE_URL}}/users/me
```
**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": 1,
    "name": "User Umum",
    "email": "user@example.com",
    "role": "UMUM",
    "type": "UMUM",
    "nim": null,
    "createdAt": "2025-04-22T12:00:00.000Z"
  }
}
```


#### 2.2 Get User by ID

```
GET {{BASE_URL}}/users/1
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Success",
  "data": {
    "id": 1,
    "name": "User Umum",
    "email": "user@example.com",
    "role": "UMUM",
    "type": "UMUM",
    "nim": null,
    "createdAt": "2025-04-22T12:00:00.000Z"
  }
}
```

#### 2.3 Update User

```
PATCH {{BASE_URL}}/users/1
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "New User Name",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "New User Name",
    "email": "newemail@example.com",
    "role": "UMUM",
    "type": "UMUM",
    "nim": null,
    "createdAt": "2025-04-22T12:00:00.000Z"
  }
}
```

#### 2.4 Delete User (Admin Only)

```
DELETE {{BASE_URL}}/users/3
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

### 3. Admin Endpoints

#### 3.1 Import DIKE Students

```
POST {{BASE_URL}}/auth/admin/import-dike-students
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
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

#### 3.2 Update User Role

```
PATCH {{BASE_URL}}/auth/admin/users/role
```

**Headers:**
```
Authorization: Bearer {{ACCESS_TOKEN}}
Content-Type: application/json
```

**Body:**
```json
{
  "userId": 2,
  "role": "ADMIN"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User role updated successfully",
  "data": {
    "id": 2,
    "name": "User DIKE",
    "email": "dike@example.com",
    "role": "ADMIN",
    "type": "DIKE",
    "nim": "24/000000/PA/000000"
  }
}
```

## Menggunakan Postman Collection

1. Buat environment baru di Postman dengan variabel `BASE_URL`, `ACCESS_TOKEN`, dan `REFRESH_TOKEN`
2. Import collection ke Postman
3. Jalankan Register atau Login request terlebih dahulu untuk mendapatkan token
4. Token akan otomatis disimpan ke environment variables (jika script tests digunakan)
5. Akses endpoint lain menggunakan token tersebut

## Catatan Penting

1. Untuk pengujian endpoint admin, pastikan Anda login menggunakan akun admin
2. Format CSV untuk import DIKE students harus memiliki header: `name,nim,email`
3. Error code dan messages yang umum:
   - 400: Bad Request - Input validation error
   - 401: Unauthorized - Invalid credentials or missing token
   - 403: Forbidden - Not authorized to access this resource
   - 404: Not Found - Resource not found
   - 409: Conflict - Resource already exists (e.g., duplicate email or NIM)
   - 500: Internal Server Error - Server-side error

Semua endpoint sudah divalidasi menggunakan middleware dan controller yang sesuai untuk memastikan keamanan dan konsistensi data.