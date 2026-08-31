# Cinevia — Sistem Reservasi & Manajemen Tiket Bioskop

Cinevia adalah aplikasi web reservasi dan manajemen tiket bioskop modern berbasis **Laravel 13 + Inertia.js + React.js + MySQL** dengan fitur Role-Based Access Control (RBAC 3-Role), pemilihan kursi studio interaktif, alur pembayaran manual dengan verifikasi staff, auto-cancel booking kedaluwarsa, penerbitan e-ticket resmi beserta QR Code dan download PDF, serta panel manajemen master data film, studio, kursi, dan jadwal tayang.

---

## Fitur Utama Sistem

### 1. Role-Based Access Control (RBAC) & Autentikasi
Menggunakan package `spatie/laravel-permission` dengan 3 role spesifik:
- **`customer`**: Pencarian film & jadwal tayang, pemilihan kursi studio interaktif, booking tiket bioskop, upload bukti transfer, melihat & mendownload e-ticket resmi.
- **`staff`**: Memeriksa dan memverifikasi / menolak bukti pembayaran tiket, melihat seluruh transaksi booking bioskop.
- **`admin`**: Akses penuh mengelola master data (Film, Studio, Kursi, Jadwal Tayang & Tarif), serta mengelola akun pengguna & role.

### 2. Katalog Film, Jadwal Tayang & Denah Kursi Studio
- Filter jadwal film berdasarkan tanggal tayang (7 hari ke depan), format studio, dan genre film.
- Denah ketersediaan kursi studio interaktif (*seat map*) dengan validasi pencegahan *double booking* secara realtime sebelum transaksi disimpan.
- Dukungan format studio: **IMAX Laser 4K**, **Dolby Atmos 3D**, dan **Premiere Lounge VIP**.

### 3. Alur Status & State Machine
Transisi status dijalankan melalui method model khusus (bukan manipulasi kolom langsung):
- **Status Pembayaran (`StatusPembayaran`)**: `UNPAID` (Belum Bayar) $\rightarrow$ `WAITING_VERIFICATION` (Menunggu Verifikasi) $\rightarrow$ `PAID` (Lunas) / `REJECTED` (Ditolak).
- **Status Booking (`StatusBooking`)**: `PENDING` (Menunggu) $\rightarrow$ `CONFIRMED` (Dikonfirmasi) / `CANCELLED` (Dibatalkan).
- Saat pembayaran berstatus `PAID`, booking otomatis terkonfirmasi (`CONFIRMED`) dan e-ticket langsung aktif.

### 4. Auto-Cancel Booking Kedaluwarsa (30 Menit)
- Setiap booking memiliki atribut `expired_at` (30 menit sejak dibuat).
- Artisan Command `php artisan bookings:cancel-expired` dijadwalkan berjalan otomatis via Laravel Scheduler (`routes/console.php`) untuk membatalkan booking yang belum dibayar dan melepas kursi kembali ke publik.

### 5. Keamanan Bukti Pembayaran
- File bukti transfer disimpan pada disk lokal privat (`storage/app/private/bukti-pembayaran/`).
- Tidak dapat diakses publik secara langsung; diakses melalui route terproteksi dengan otorisasi `PaymentPolicy` (hanya pemilik booking, staff, atau admin).

### 6. E-Ticket Resmi, QR Code & Unduh PDF
- Tiket hanya dapat diakses dan diunduh setelah booking berstatus `CONFIRMED`.
- Dilengkapi QR Code unik (berisi kode booking) menggunakan `simplesoftwareio/simple-qrcode`.
- Unduh tiket siap cetak format PDF menggunakan `barryvdh/laravel-dompdf`.

---

## Tech Stack & Library

| Komponen | Teknologi |
|---|---|
| **Framework Backend** | Laravel 13 (PHP 8.3+) |
| **Database** | MySQL |
| **Frontend Adapter** | Inertia.js (React.js) |
| **Styling** | Tailwind CSS (Dark Cinema Aesthetic) |
| **RBAC / Hak Akses** | `spatie/laravel-permission` |
| **PDF Generator** | `barryvdh/laravel-dompdf` |
| **QR Code** | `simplesoftwareio/simple-qrcode` |
| **Scheduler** | Laravel Native Scheduler |

---

## Struktur Database

```
users
├── roles (Spatie RBAC: customer, staff, admin)
└── bookings (1:N)
    ├── showtime (N:1)
    │   ├── movie (N:1 -> movies)
    │   └── studio (N:1 -> studios) ── seats (1:N)
    ├── booking_seats (1:N -> seats)
    └── payment (1:1)
```

---

## Akun Demo Bawaan (Seeder)

Setelah menjalankan database seeder, tersedia 3 akun default untuk pengujian:

| Role | Email | Password |
|---|---|---|
| **Customer** | `customer@cinevia.test` | `Password123_` |
| **Staff** | `staff@cinevia.test` | `Password123_` |
| **Admin** | `admin@cinevia.test` | `Password123_` |

*Catatan: Tombol pintasan pada halaman login dapat mengisi kredensial akun demo secara otomatis.*

---

## Panduan Instalasi & Menjalankan Project

### 1. Clone & Setup Dependensi
```bash
cp .env.example .env
composer install
npm install
php artisan key:generate
```

### 2. Konfigurasi Database pada `.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=Cinevia
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Migrasi & Seed Database
```bash
php artisan migrate:fresh --seed
```

### 4. Jalankan Server Pengembangan
Terminal 1 (Laravel Server):
```bash
php artisan serve
```

Terminal 2 (Vite / React Build):
```bash
npm run dev
```

---

## Ringkasan Route & Endpoint

### Publik / Guest
- `GET /` — Halaman Utama (Spotlight Film, Jadwal Tayang 7 Hari, Studio & Panduan)
- `GET /movies` — Katalog Seluruh Film & Filter Genre
- `GET /movies/{movie}` — Detail Film & Jadwal Tayang
- `GET /showtimes/{showtime}/seats` — Denah Pemilihan Kursi Studio

### Customer (`role:customer`)
- `GET /dashboard` — Panel Ringkasan Akun & Statistik
- `GET /bookings` — Riwayat Pemesanan Tiket
- `POST /bookings` — Pembuatan Booking Tiket Bioskop Baru
- `GET /bookings/{booking}` — Detail Booking & Instruksi Pembayaran
- `POST /bookings/{booking}/cancel` — Pembatalan Booking
- `POST /payments/{booking}/upload` — Upload Bukti Pembayaran
- `GET /tickets/{booking}` — Tampilan E-Ticket
- `GET /tickets/{booking}/download` — Download E-Ticket PDF Resmi

### Staff (`role:staff,admin`)
- `GET /staff/payments` — Antrean Pembayaran Menunggu Verifikasi
- `POST /staff/payments/{payment}/verify` — Verifikasi / Tolak Pembayaran

### Admin (`role:admin`)
- `RESOURCE /admin/users` — Manajemen Pengguna & Role
- `RESOURCE /admin/movies` — Manajemen Master Film & Poster
- `RESOURCE /admin/studios` — Manajemen Studio & Kapasitas
- `RESOURCE /admin/seats` — Manajemen Kursi Studio
- `RESOURCE /admin/showtimes` — Manajemen Jadwal Tayang Bioskop
