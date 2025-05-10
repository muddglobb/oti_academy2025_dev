# Sistem Pembayaran dan Enrollment OTI Academy

## Sistem Quota Course

Setiap course di OTI Academy memiliki **total quota** (misalnya 100 seat) yang dibagi menjadi dua kategori:

1. **Quota Entry/Intermediate** - untuk pembelian satuan course (contoh: 70 seat)
2. **Quota Bundle** - untuk pembelian paket bundle (contoh: 30 seat)

## Alur Proses Payment ke Enrollment

### 1. Pembuatan Payment
- User membuat payment untuk paket tertentu
- Jenis payment:
  - **ENTRY/INTERMEDIATE**: Wajib memilih satu course spesifik
  - **BUNDLE**: Course tidak perlu dipilih (akan enroll ke semua course dalam bundle)
- Status awal payment: `PAID`
- **PENTING**: Saat ini belum mengurangi quota course

### 2. Validasi Quota Saat Pembuatan Payment
- Sistem validasi ketersediaan quota dengan `validateCourseAvailability()`
- Jika quota sudah penuh, payment ditolak
- Validasi ini hanya melihat payment yang sudah `APPROVED`

### 3. Approval Payment oleh Admin
- Admin menyetujui payment (status: `APPROVED`)
- Fungsi `approvePayment()` dipanggil
- **PENTING**: Baru pada tahap ini quota terpakai

### 4. Pembuatan Enrollment
- Setelah approval, fungsi `createEnrollmentAfterPayment()` dipanggil
- Data enrollment disimpan sementara di folder `enrollment-queue`
- Berdasarkan tipe paket:
  - **ENTRY/INTERMEDIATE**: Enrollment untuk satu course yang dipilih
  - **BUNDLE**: Enrollment untuk semua course dalam bundle

## Mekanisme Quota

### Aturan Pengisian Quota
- Quota dihitung berdasarkan payment `APPROVED`
- Ketika payment dibuat, sistem validasi `validateCourseAvailability()` melihat jumlah enrollment yang ada
- Jika quota sudah penuh, user tidak bisa membuat payment baru

### Aturan Kelebihan Quota
- Jika admin approve beberapa payment sekaligus, quota boleh terlewati
- Contoh: Quota Entry 70, tapi setelah approve bisa jadi 75

### Implementasi Quota
- `getCourseEnrollmentCount()` menghitung jumlah enrollment berdasarkan tipe
- Parameter yang dikembalikan: `{total, bundleCount, entryIntermediateCount}`

## Catatan Penting
- Enrollment service masih dalam development
- Saat ini data enrollment disimpan dalam file JSON di `enrollment-queue`
- Ketika enrollment service sudah siap, file-file ini akan diproses
- Function `checkEnrollmentStatus()` saat ini hanya mengecek apakah payment `APPROVED`



enrollment Service - Node.js + Express + Prisma
 * 
 * Konteks:
 * -------------
 * Aplikasi ini memiliki sistem pembelian kelas (course) melalui payment service. 
 * Ketika user membeli dan payment telah di-approve admin, maka user akan langsung 
 * di-*enroll* ke course tersebut. Bisa satu course (entry/intermediate) atau beberapa 
 * sekaligus (bundle). Tidak ada approval enrollment manual — enroll otomatis berdasarkan payment.
 * 
 * Kebutuhan:
 * -------------
 * - User hanya bisa enrolled 1x ke satu course (tidak duplikat)
 * - Jika membeli bundle, akan langsung enroll ke semua course dalam bundle tersebut
 * - Admin tidak perlu meng-approve enrollment
 * - User bisa melihat semua enrollments miliknya
 * - Frontend butuh tahu apakah user sudah enrolled di suatu course
 * 
 * Struktur Database (Prisma):
 * -------------
 * model Enrollment {
 *   id         String   @id @default(uuid())
 *   userId     String
 *   courseId   String
 *   packageId  String?
 *   createdAt  DateTime @default(now())
 *   updatedAt  DateTime @updatedAt
 * 
 *   user       User     @relation(fields: [userId], references: [id])
 *   course     Course   @relation(fields: [courseId], references: [id])
 *   package    Package? @relation(fields: [packageId], references: [id])
 * 
 *   @@unique([userId, courseId])
 * }
 * 
 * Endpoint yang Dibutuhkan:
 * -------------
 * 1. POST /payment-approved
 *    - Input: { userId, packageId, courseIds: string[] }
 *    - Deskripsi: Enroll user ke semua course dalam courseIds setelah payment approved
 *    - Catatan: Gunakan upsert agar tidak terjadi duplikat enrollment
 * 
 * 2. GET /me/enrollments
 *    - Output: Daftar course yang sudah user enroll
 *    - Deskripsi: Untuk keperluan menampilkan course yang sudah dimiliki user
       - Di responsenya, buatkan juga status isEnrolled (boolean), true jika emang sudah terenroll, false jika belum
 * 
 * 3. GET /:courseId/enrollment-status
 *    - Output: { isEnrolled: boolean }
 *    - Deskripsi: Untuk menampilkan tombol "Already Enrolled" di UI jika sudah terdaftar
 * 
 * 4. (Opsional) GET /enrollments?courseId=...
 *    - Output: Daftar user yang enroll di course tertentu
 *    - Deskripsi: Untuk keperluan panel admin melihat siapa saja yang sudah enroll
 * 
 * Contoh Fungsi Service:
 * -------------
 * // Enroll user to a list of courses (ex: bundle)
 * async function enrollUserToCourses(userId, packageId, courseIds) {
 *   for (const courseId of courseIds) {
 *     await prisma.enrollment.upsert({
 *       where: { userId_courseId: { userId, courseId } },
 *       update: {},
 *       create: { userId, courseId, packageId },
 *     });
 *   }
 * }
 */