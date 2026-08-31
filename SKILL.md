---
name: cinevia-development
description: Panduan pengembangan sistem Cinevia (reservasi tiket bioskop) berbasis Laravel 13 + Breeze + Inertia + React.js dengan database MySQL. Gunakan skill ini setiap kali mengerjakan fitur, migration, model, controller, request, policy, halaman React/Inertia, atau perubahan apa pun di dalam project Cinevia — termasuk autentikasi & role, jadwal tayang film, pemilihan kursi, booking, upload/verifikasi bukti pembayaran, dan e-ticket. Wajib dibaca sebelum menulis kode agar konsisten dengan konvensi penamaan (variabel berbahasa Indonesia), struktur database, alur status booking/pembayaran, lokasi penyimpanan file bukti pembayaran, serta pemilihan package/library yang tepat.
---

# Cinevia — Panduan Pengembangan

Skill ini adalah acuan konsistensi untuk membangun **Cinevia**, aplikasi web reservasi tiket bioskop (Laravel 13 + Breeze + Inertia + React.js + MySQL). fitur hanya yang benar-benar dibutuhkan alur "cari film → pilih kursi → booking → bayar → verifikasi → e-ticket".

## 1. Ringkasan Project

Alur inti: pilih film & jadwal tayang → pilih kursi studio → booking → pembayaran manual (upload bukti) → verifikasi oleh staff → e-ticket terbit.

**Role pengguna (3 role):**

| Role | Fokus Akses |
|---|---|
| `customer` | Cari film & jadwal, booking, pilih kursi, upload bukti pembayaran, lihat e-ticket |
| `staff` | Verifikasi/tolak bukti pembayaran, lihat booking |
| `admin` | Kelola film, studio, kursi, jadwal tayang, dan user |

Kenapa cukup 3 role: kebutuhan bisnisnya hanya butuh pemisahan *yang bertransaksi* (customer), *yang memverifikasi* (staff), dan *yang mengelola master data* (admin). Tidak perlu role tambahan (mis. "kasir" atau "manager") kecuali nanti ada kebutuhan spesifik — tambah role baru hanya kalau benar-benar ada proses bisnis berbeda, bukan sekadar beda jabatan.

Guest (belum login) hanya boleh browsing film & jadwal tayang secara publik; wajib login/register untuk booking.

## 2. Prinsip & Konvensi Penamaan (WAJIB DIIKUTI)

- **Variabel dalam bahasa Indonesia** — variabel lokal PHP (controller, service, request) dan JS/React (state, props lokal). Contoh: `$jadwalTayangTerpilih`, `$kursiTersedia`, `$totalHarga`, `$buktiPembayaran`.
- **Struktur & konvensi framework tetap bahasa Inggris** — nama tabel/kolom, nama class Model/Controller/Request/Policy, nama route, migration (`showtimes`, `BookingController`, `StoreBookingRequest`).
- PSR-12 untuk PHP, konvensi ESLint/Prettier project untuk JS/JSX.
- Validasi lewat **Form Request**, otorisasi lewat **Policy**, data ke frontend lewat **Eloquent Resource** (jangan expose model mentah).
- Status pakai **PHP native enum**, bukan string bebas — lihat §5.

## 3. Fitur & Struktur Database (Diefisienkan)

tiket bioskop tidak butuh data identitas per kursi, cukup jumlah kursi & kursi mana yang dipesan.

| Tabel | Keterangan |
|---|---|
| `users` | Data akun pengguna |
| `roles` | customer / staff / admin |
| `movies` | Judul, genre, durasi, sinopsis, poster, rating usia |
| `studios` | Nama studio/ruang tayang, kapasitas |
| `seats` | Nomor kursi, relasi ke `studios` |
| `showtimes` | Relasi `movies` + `studios`, tanggal & jam tayang, harga tiket |
| `bookings` | Kode booking, relasi `users` + `showtimes`, status booking, total harga |
| `booking_seats` | Relasi `bookings` ↔ `seats` yang dipesan |
| `payments` | Nominal, bukti pembayaran, status, `verified_by`, `verified_at` |

Tidak perlu tabel `trains`/`coaches` setara — `studios` di Cinevia menggabungkan peran "ruang + kelas" karena bioskop biasanya tidak punya sub-kelas kursi majemuk seperti kereta (kalau nanti butuh kelas kursi seperti VIP/reguler, cukup tambah kolom `kelas` di `seats`, tidak perlu tabel baru).

## 4. Fitur & Hak Akses

Fokus hanya fitur inti — sengaja **tidak** ditambah fitur sekunder (review film, promo/diskon, refund, dsb) supaya scope tetap efisien; tambahkan nanti hanya kalau memang diminta.

| Fitur | Customer | Staff | Admin |
|---|---|---|---|
| Lihat daftar film & jadwal tayang | ✓ | ✓ | ✓ |
| Pilih kursi & booking | ✓ | — | — |
| Upload bukti pembayaran | ✓ | — | — |
| Verifikasi / tolak bukti pembayaran | — | ✓ | ✓ |
| Lihat daftar booking | milik sendiri | ✓ (semua) | ✓ (semua) |
| Lihat / download e-ticket | ✓ | ✓ | ✓ |
| Kelola film (CRUD) | — | — | ✓ |
| Kelola studio & kursi (CRUD) | — | — | ✓ |
| Kelola jadwal tayang (CRUD) | — | — | ✓ |
| Kelola user & role | — | — | ✓ |

Route group per role:

```php
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // kelola film, studio, kursi, jadwal tayang, user
});

Route::middleware(['auth', 'role:staff,admin'])->prefix('staff')->group(function () {
    // verifikasi pembayaran, lihat semua booking
});

Route::middleware(['auth', 'role:customer'])->group(function () {
    // booking, upload bukti pembayaran, e-ticket
});
```

Kepemilikan data (customer hanya boleh lihat booking miliknya) tetap dicek lewat **Policy**, bukan hanya middleware role.

## 5. Alur Bisnis & Status (State Machine)

```
1. Customer pilih film & jadwal tayang (showtime)
2. Customer pilih kursi yang tersedia di studio tersebut
3. Sistem buat booking, status booking = PENDING, status pembayaran = UNPAID
4. Customer transfer sesuai nominal & upload bukti pembayaran
5. Status pembayaran -> WAITING_VERIFICATION
6. Staff periksa bukti pembayaran
7. Valid   -> payment = PAID,     booking = CONFIRMED
   Invalid -> payment = REJECTED, booking tetap PENDING (customer boleh upload ulang)
8. Customer lihat/download e-ticket setelah booking CONFIRMED
```

**Status Payment:** `UNPAID → WAITING_VERIFICATION → PAID / REJECTED`
**Status Booking:** `PENDING → CONFIRMED / CANCELLED`

(tiket otomatis "terpakai" begitu jadwal tayang lewat, tidak butuh transisi manual). Rekomendasi tambahan yang tetap sederhana: beri kolom `expired_at` pada `bookings` (mis. 30 menit sejak dibuat) — kalau customer belum upload bukti pembayaran sebelum waktu itu, booking otomatis `CANCELLED` dan kursi dilepas kembali. Ini penting untuk bioskop karena kursi harus cepat tersedia lagi buat customer lain, beda dengan tiket kereta yang biasanya dipesan jauh-jauh hari.

```php
enum StatusPembayaran: string
{
    case BELUM_BAYAR = 'UNPAID';
    case MENUNGGU_VERIFIKASI = 'WAITING_VERIFICATION';
    case LUNAS = 'PAID';
    case DITOLAK = 'REJECTED';
}

enum StatusBooking: string
{
    case MENUNGGU = 'PENDING';
    case DIKONFIRMASI = 'CONFIRMED';
    case DIBATALKAN = 'CANCELLED';
}
```

Transisi status hanya lewat method khusus di Model/Service (mis. `Payment::verifikasi()`, `Payment::tolak()`), jangan set kolom status langsung dari controller.

## 6. Penyimpanan Bukti Pembayaran

**tidak publik**, simpan di disk `local` yang default-nya mengarah ke `storage/app/private`:

```php
// config/filesystems.php
'local' => [
    'driver' => 'local',
    'root' => storage_path('app/private'),
    'serve' => true,
    'throw' => false,
],
```

- Upload: `Storage::disk('local')->putFile('bukti-pembayaran', $request->file('bukti_pembayaran'));`
- Simpan **path**-nya saja di kolom `payments.bukti_pembayaran`.
- Akses lewat route terproteksi `auth` + Policy (staff/admin, atau pemilik booking), stream file — jangan pakai URL publik:

```php
Route::get('/payments/{payment}/bukti', function (Payment $payment) {
    Gate::authorize('view', $payment);
    return Storage::disk('local')->response($payment->bukti_pembayaran);
})->middleware('auth')->name('payments.bukti');
```

## 7. Library / Package

Cek dulu `composer.json` / `package.json` project sebelum menambah dependency — kalau sudah ada, pakai yang ada; kalau belum, tambahkan dan sampaikan ke user.

| Kebutuhan | Package | Catatan |
|---|---|---|
| RBAC (customer/staff/admin) | `spatie/laravel-permission` | standar Laravel untuk role & permission |
| QR Code e-ticket | `simplesoftwareio/simple-qrcode` atau `endroid/qr-code` | QR berisi kode booking untuk validasi di pintu masuk studio |
| PDF e-ticket | `barryvdh/laravel-dompdf` | Tombol "download e-ticket" |
| Upload & validasi gambar bukti pembayaran | Bawaan Laravel (`image` rule di Form Request) | Tidak perlu package tambahan |
| Auto-cancel booking kedaluwarsa | Laravel Scheduler bawaan (`schedule:run` + Command custom) | Tidak perlu package eksternal, cukup 1 Artisan Command yang cek `expired_at` |

Instalasi jika belum ada:

```bash
composer require spatie/laravel-permission
composer require barryvdh/laravel-dompdf
composer require simplesoftwareio/simple-qrcode
```

## 8. Seeder Akun Default

Sediakan `UserSeeder` yang membuat 3 akun demo, satu per role, dipanggil dari `DatabaseSeeder` setelah seeder role:

```php
class UserSeeder extends Seeder
{
    public function run(): void
    {
        $akunPerRole = [
            ['name' => 'Customer Demo', 'email' => 'customer@cinevia.test', 'role' => 'customer'],
            ['name' => 'Staff Demo', 'email' => 'staff@cinevia.test', 'role' => 'staff'],
            ['name' => 'Admin Demo', 'email' => 'admin@cinevia.test', 'role' => 'admin'],
        ];

        foreach ($akunPerRole as $dataAkun) {
            $user = User::firstOrCreate(
                ['email' => $dataAkun['email']],
                ['name' => $dataAkun['name'], 'password' => Hash::make('password'), 'email_verified_at' => now()]
            );
            $user->assignRole($dataAkun['role']);
        }
    }
}
```

Jalankan dengan `php artisan migrate:fresh --seed`, gunakan `firstOrCreate` supaya aman dijalankan berulang.

## 9. Struktur Frontend (Inertia + React)

```
resources/js/Pages/
├── Auth/                  # bawaan Breeze
├── Public/                # daftar film & jadwal tayang (bisa diakses guest)
├── Customer/
│   ├── Booking/
│   ├── Payment/
│   └── Ticket/
├── Staff/
│   └── PaymentVerification/
└── Admin/
    ├── Users/
    ├── Movies/
    ├── Studios/
    ├── Seats/
    └── Showtimes/
```

- Komponen reusable (denah kursi studio, kartu film, badge status) di `resources/js/Components/`.
- Kirim status (`StatusBooking`, `StatusPembayaran`) sebagai string value dari enum lewat Resource ke frontend, cukup label + value untuk badge warna.
- Semua form (booking, upload bukti, verifikasi) pakai `useForm` dari Inertia, bukan `fetch`/`axios` manual.

## 10. Checklist Sebelum Commit Fitur Baru

- [ ] Variabel lokal PHP & JS pakai bahasa Indonesia, class/route/table tetap bahasa Inggris.
- [ ] Perubahan status booking/pembayaran lewat method khusus di model/service, bukan set kolom langsung.
- [ ] Bukti pembayaran tersimpan di `storage/app/private`, tidak ada akses publik langsung.
- [ ] Otorisasi dicek lewat Policy, bukan hanya `if` role di controller.
- [ ] Validasi input lewat Form Request.
- [ ] Fitur baru dicek dulu: apakah benar-benar inti alur booking-bayar-verifikasi, atau fitur tambahan yang bisa ditunda.
- [ ] Package baru dicek dulu di `composer.json`/`package.json` sebelum ditambahkan, dan diberitahukan ke user.
- [ ] `UserSeeder` tersedia dan menghasilkan 3 akun demo (customer, staff, admin) lewat `DatabaseSeeder`.
