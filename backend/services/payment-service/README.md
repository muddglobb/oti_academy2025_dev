# Payment & Enrollment Service

## Arsitektur Baru

Layanan ini menggabungkan dua fungsi utama:
- **Payment Service**: Menangani pemrosesan pembayaran
- **Enrollment Service**: Menangani pendaftaran kursus

## Motivasi Penggabungan

Penggabungan kedua layanan ini dilakukan untuk:
1. **Menjamin konsistensi data** - Memastikan status pembayaran dan pendaftaran tetap konsisten
2. **Menghindari race condition** - Menghilangkan kemungkinan gagalnya pendaftaran setelah pembayaran disetujui
3. **Optimalisasi performa** - Mengurangi overhead komunikasi antar service

## Model Data Utama

### Payment
- ID
- User ID
- Package ID
- Course ID (opsional, untuk package non-bundle)
- Status (PAID, APPROVED)
- Payment Type (DIKE, UMUM)
- Proof Link
- Timestamp

### Enrollment
- ID
- Payment ID
- User ID
- Course ID
- Status (ENROLLED, NOT_ENROLLED)
- Progress
- Timestamp

## Alur Kerja Utama

1. Pengguna melakukan pembayaran → status PAID
2. Admin mengkonfirmasi pembayaran → status APPROVED
3. Secara otomatis dalam satu transaksi database:
   - Status payment diubah menjadi APPROVED
   - Enrollment dibuat untuk setiap kursus terkait dengan status ENROLLED

## API Endpoints

### Payment Endpoints
- `POST /payments`: Membuat pembayaran baru
- `GET /payments`: Mendapatkan daftar pembayaran
- `GET /payments/:id`: Mendapatkan detail pembayaran
- `PATCH /payments/:id/approve`: Menyetujui pembayaran dan memulai proses enrollment
- `GET /payments/user/:userId`: Mendapatkan pembayaran untuk pengguna tertentu

### Enrollment Endpoints
- `GET /enrollments/my-enrollments`: Mendapatkan enrollment pengguna yang login
- `GET /enrollments/:id`: Mendapatkan detail enrollment
- `GET /enrollments/course/:courseId/status`: Memeriksa status enrollment untuk kursus tertentu
- `PATCH /enrollments/:id/progress`: Memperbarui progress pembelajaran

## Cara Menjalankan

```bash
# Memulai service dalam mode development
npm run dev

# Memulai service dalam mode development
npm start

# Menjalankan dengan Docker
docker-compose up payment-service-api
```

## Catatan Penting

1. Komunikasi ke layanan lain dilakukan melalui token JWT service-to-service
2. Endpoint pendaftaran sekarang dilayani oleh payment-service-api
3. Pastikan variable .env diatur dengan benar, terutama JWT_SECRET dan SERVICE_API_KEY untuk komunikasi antar service
