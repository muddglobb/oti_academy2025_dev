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