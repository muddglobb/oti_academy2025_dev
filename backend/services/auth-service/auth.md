# Dokumentasi API Auth Service OTI Academy

## 1. Setup Environment

Pertama, siapkan environment Postman dengan variabel berikut:
```
baseUrl: http://localhost:8000
accessToken: (akan diisi otomatis setelah login)
refreshToken: (akan diisi otomatis setelah login)
```

## 2. Endpoint Auth Service

### 2.1. Authentication

#### Register

```
POST {{baseUrl}}/auth/register
```

**Headers:**
```
Content-Type: application/json
```

**Body untuk UMUM User:**
```json
{
  "name": "User Umum",
  "email": "user@example.com",
  "password": "Password123!",
  "type": "UMUM"
}
```

**Body untuk DIKE User:**
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
      "id": "user-uuid",
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

**Script Tests:**
```javascript
if (pm.response.code === 201) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
}
```

#### Login

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
      "id": "user-uuid",
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

**Script Tests:**
```javascript
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("accessToken", jsonData.data.accessToken);
    pm.environment.set("refreshToken", jsonData.data.refreshToken);
}
```

#### Refresh Token

```
POST {{baseUrl}}/auth/refresh-token
```

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "{{refreshToken}}"
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

#### Change Password

```
PATCH {{baseUrl}}/auth/change-password
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
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

#### Update Profile

```
PATCH {{baseUrl}}/auth/update-profile
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
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
    "id": "user-uuid",
    "name": "Updated Name",
    "email": "user@example.com",
    "role": "UMUM",
    "type": "UMUM",
    "nim": null,
    "createdAt": "2025-04-22T12:00:00.000Z"
  }
}
```

#### Logout

```
POST {{baseUrl}}/auth/logout
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "refreshToken": "{{refreshToken}}"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

**Script Tests:**
```javascript
if (pm.response.code === 200) {
    pm.environment.set("accessToken", "");
    pm.environment.set("refreshToken", "");
}
```

#### Forgot Password

```
POST {{baseUrl}}/auth/forgot-password
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

#### Reset Password

```
POST {{baseUrl}}/auth/reset-password
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

### 2.2. User Management

#### Get Current User
```
GET {{baseUrl}}/users/me
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
    "id": "user-uuid",
    "name": "User Umum",
    "email": "user@example.com",
    "role": "UMUM",
    "type": "UMUM",
    "nim": null,
    "createdAt": "2025-04-22T12:00:00.000Z"
  }
}
```

#### Get All Users (Admin Only)
```
GET {{baseUrl}}/users
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
      "id": "admin-uuid",
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "ADMIN",
      "type": "UMUM",
      "nim": null,
      "createdAt": "2025-04-22T10:00:00.000Z"
    },
    {
      "id": "user-uuid",
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

### 2.3. Admin Features

#### Import DIKE Students (Admin Only)
```
POST {{baseUrl}}/auth/admin/import-dike-students
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
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

#### Update User Role (Admin Only)
```
PATCH {{baseUrl}}/auth/admin/users/role
```

**Headers:**
```
Authorization: Bearer {{accessToken}}
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "user-uuid",
  "role": "ADMIN"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "User role updated successfully",
  "data": {
    "id": "user-uuid",
    "name": "User DIKE",
    "email": "dike@example.com",
    "role": "ADMIN",
    "type": "DIKE",
    "nim": "24/000000/PA/000000"
  }
}
```

## 3. Catatan Penting

1. **Autentikasi**: Sebagian besar endpoint memerlukan token yang valid di header `Authorization`
2. **Format CSV**: Untuk import DIKE students, file CSV harus memiliki header: `name,nim,email`
3. **Role-Based Access Control**:
   - `ADMIN`: Akses ke semua endpoint
   - `DIKE`, `UMUM`, `USER`: Akses terbatas sesuai peran masing-masing
4. **Error code umum**:
   - 400: Bad Request - Input validation error
   - 401: Unauthorized - Invalid credentials atau token
   - 403: Forbidden - Tidak memiliki hak akses ke resource
   - 404: Not Found - Resource tidak ditemukan
   - 500: Internal Server Error - Error pada server