Package-service:
```
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

/// Jenis paket
enum PackageType {
  BEGINNER
  INTERMEDIATE
  BUNDLE
}

/// Paket yang berisi satu atau beberapa course
model Package {
  /// Primary key
  id         String       @id @default(uuid())

  /// Nama paket (misal: "Beginner Web Dev", "Bundle Full Stack")
  name       String

  /// Tipe paket
  type       PackageType

  /// Harga paket (commitment fee / full price)
  price      Int

  /// Relasi ke daftar course di paket ini
  courses    PackageCourse[]

  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
}

/// Join table untuk relasi n–m antara Package dan Course
/// Course di course-service, cukup simpan courseId sebagai String
model PackageCourse {
  package   Package  @relation(fields: [packageId], references: [id])
  packageId String

  courseId  String   // UUID dari Course (dikelola di course-service)

  @@id([packageId, courseId])
}
```

payment service:
```
model Payment {
  id                String            @id @default(uuid())
  userId            String
  packageId         String
  type              UserType
  proofLink         String
  status            PaymentStatus     @default(PAID)
  backPaymentMethod BackPaymentMethod
  backAccountNumber String?           // Nomor rekening atau e-wallet
  backRecipient     String?           // Nama penerima dana
  backStatus        BackStatus        @default(REQUESTED)
  backCompletedAt   DateTime?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
}

enum PaymentStatus {
  PAID
  APPROVED
}

enum BackStatus {
  REQUESTED
  COMPLETED
}

enum BackPaymentMethod {
  BCA
  BRI
  GOPAY
  SHOPEEPAY
}

enum UserType {
  DIKE
  UMUM
}

```

enrollment service:
```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Enrollment {
  id         String   @id @default(uuid())   
  userId     String                               
  courseId   String           
  status     EnrollmentStatus @default(PENDING)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  /// Pastikan user hanya sekali enroll per course
  @@unique([userId, courseId])
}

enum EnrollmentStatus {
  PENDING
  APPROVED
}
```

course service:
```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Level {
  BEGINNER
  INTERMEDIATE
}

model Course {
  id          String    @id @default(uuid())
  title       String
  description String
  quota       Int
  level       Level
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relasi ke sesi pertemuan
  sessions    Session[]
}

model Session {
  id          String    @id @default(uuid())
  courseId    String
  startAt     DateTime  // tanggal+jam mulai sesi
  durationHrs Int       // durasi sesi dalam jam
  description String?   // keterangan sesi
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relasi balik ke Course
  course      Course    @relation(fields: [courseId], references: [id])

  @@index([courseId])
}
```