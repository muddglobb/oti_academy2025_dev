# 📦 OTI Package-Service Documentation

Ini adalah **microservice** untuk mengelola **paket kursus** di platform OTI Academy.  
Service ini dibangun menggunakan **Express.js**, **Prisma ORM**, dan **PostgreSQL**.

> ⚠️ **Catatan**:  
> Data `Course` dikelola oleh **tim lain dalam service terpisah (Course-Service)**.  
> Jadi untuk sekarang, jika dibutuhkan data course, kita akan menggunakan **dummy data** berupa UUID string saja (contoh: `"course-uuid-123"`).

---

## 📐 Prisma Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum PackageType {
  BEGINNER
  INTERMEDIATE
  BUNDLE
}

model Package {
  id         String          @id @default(uuid())
  name       String
  type       PackageType
  price      Int
  createdAt  DateTime        @default(now())
  updatedAt  DateTime        @updatedAt
  courses    PackageCourse[]
}

model PackageCourse {
  package   Package @relation(fields: [packageId], references: [id])
  packageId String
  courseId  String  // UUID dari Course (dummy untuk sekarang)
  @@id([packageId, courseId])
}
```

---

## 🚧 Backend Implementation Plan

### 📁 Folder Structure (Rekomendasi)

```
src/
├── controllers/
│   └── package.controller.js
│   └── packageCourse.controller.js
├── routes/
│   └── package.routes.js
│   └── packageCourse.routes.js
├── services/
│   └── package.service.js
│   └── packageCourse.service.js
├── middlewares/
├── prisma/
│   └── schema.prisma
├── index.js
```

---

## 📦 Fitur Utama Package-Service

### 1. Manajemen Paket (di `package.controller.js`)

* `createPackage(req, res)`
* `getAllPackages(req, res)`
* `getPackageById(req, res)`
* `updatePackage(req, res)`
* `deletePackage(req, res)`

### 2. Manajemen Relasi Course dalam Paket (di `packageCourse.controller.js`)

* `addCourseToPackage(req, res)`
* `removeCourseFromPackage(req, res)`
* `listCoursesInPackage(req, res)`
  *(opsional dummy response dengan courseId dan nama course dummy)*

---

## 🧪 Contoh Dummy Course Data

Untuk testing, kita bisa gunakan dummy seperti ini:

```json
[
  {
    "courseId": "course-uuid-001",
    "title": "Intro to Web Development"
  },
  {
    "courseId": "course-uuid-002",
    "title": "Intermediate JavaScript"
  }
]
```

---

## 📝 Catatan Tambahan

* Tidak ada validasi terhadap `courseId` karena service ini tidak memiliki akses langsung ke Course-Service.
* Nantinya, kita bisa pakai **API Gateway** atau **service-to-service communication** untuk validasi course yang sebenarnya.

---

💡 Kalau semua ini sudah oke, kita bisa lanjut ke implementasi controller dan route pertama dari `/packages`.