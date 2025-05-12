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
- Enrollment dibuat secara otomatis dan langsung via API call ke enrollment service
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
- Enrollment service sudah berjalan dan terintegrasi dengan payment service
- Enrollment terjadi secara langsung dan otomatis saat payment diapprove
- Terdapat mekanisme fallback berupa file JSON jika API enrollment service gagal diakses
- Function `checkEnrollmentStatus()` mengecek apakah user sudah terdaftar pada course

## Enrollment Service - Node.js + Express + Prisma
 
### Konteks
Aplikasi ini memiliki sistem pembelian kelas (course) melalui payment service. 
Ketika user membeli dan payment telah di-approve admin, maka user akan langsung 
di-*enroll* ke course tersebut. Bisa satu course (entry/intermediate) atau beberapa 
sekaligus (bundle). Tidak ada approval enrollment manual — enroll otomatis berdasarkan payment.

### Kebutuhan
- User hanya bisa enrolled 1x ke satu course (tidak duplikat)
- Jika membeli bundle, akan langsung enroll ke semua course dalam bundle tersebut
- Admin tidak perlu meng-approve enrollment
- User bisa melihat semua enrollments miliknya
- Frontend butuh tahu apakah user sudah enrolled di suatu course

### Struktur Database (Prisma)
```prisma
model Enrollment {
  id         String   @id @default(uuid())
  userId     String
  courseId   String
  packageId  String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  user       User     @relation(fields: [userId], references: [id])
  course     Course   @relation(fields: [courseId], references: [id])
  package    Package? @relation(fields: [packageId], references: [id])

  @@unique([userId, courseId])
}