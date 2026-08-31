<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>E-Ticket Bioskop Cinevia - {{ $booking->booking_code }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        body {
            background-color: #0f172a;
            color: #f8fafc;
            padding: 24px;
        }
        .ticket-card {
            background: #1e293b;
            border-radius: 16px;
            overflow: hidden;
            border: 2px solid #334155;
        }
        .header {
            background: linear-gradient(135deg, #e11d48, #be123c);
            padding: 16px 20px;
            text-align: center;
        }
        .header h1 {
            font-size: 20px;
            font-weight: 900;
            letter-spacing: 2px;
            color: #ffffff;
            text-transform: uppercase;
        }
        .header p {
            font-size: 11px;
            color: #ffe4e6;
            margin-top: 2px;
        }
        .content {
            padding: 20px;
        }
        .movie-title {
            font-size: 18px;
            font-weight: 800;
            color: #f43f5e;
            margin-bottom: 4px;
        }
        .movie-meta {
            font-size: 11px;
            color: #94a3b8;
            margin-bottom: 16px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }
        .info-table td {
            padding: 6px 0;
            font-size: 12px;
            border-bottom: 1px dashed #334155;
        }
        .label {
            color: #94a3b8;
            width: 35%;
        }
        .val {
            color: #f8fafc;
            font-weight: 700;
            text-align: right;
        }
        .seats-badge {
            background: #f43f5e;
            color: #ffffff;
            padding: 3px 8px;
            border-radius: 6px;
            font-weight: 800;
            display: inline-block;
        }
        .qr-section {
            text-align: center;
            padding: 16px;
            background: #0f172a;
            border-radius: 12px;
            margin-top: 10px;
        }
        .qr-section img {
            width: 110px;
            height: 110px;
            background: white;
            padding: 6px;
            border-radius: 8px;
        }
        .booking-code {
            font-family: monospace;
            font-size: 15px;
            font-weight: 900;
            letter-spacing: 3px;
            color: #fb7185;
            margin-top: 8px;
        }
        .footer {
            text-align: center;
            font-size: 9px;
            color: #64748b;
            margin-top: 16px;
        }
    </style>
</head>
<body>
    <div class="ticket-card">
        <div class="header">
            <h1>CINEVIA CINEMA</h1>
            <p>TIKET ELEKTRONIK RESMI</p>
        </div>

        <div class="content">
            <div class="movie-title">{{ $booking->showtime->movie->title ?? 'Film' }}</div>
            <div class="movie-meta">
                Genre: {{ $booking->showtime->movie->genre }} | Durasi: {{ $booking->showtime->movie->duration_minutes }} Menit | Rating: {{ $booking->showtime->movie->age_rating }}
            </div>

            <table class="info-table">
                <tr>
                    <td class="label">Nama Pemesan</td>
                    <td class="val">{{ $booking->user->name }}</td>
                </tr>
                <tr>
                    <td class="label">Studio</td>
                    <td class="val">{{ $booking->showtime->studio->name }}</td>
                </tr>
                <tr>
                    <td class="label">Tanggal Tayang</td>
                    <td class="val">{{ \Carbon\Carbon::parse($booking->showtime->show_date)->translatedFormat('l, d F Y') }}</td>
                </tr>
                <tr>
                    <td class="label">Jam Mulai</td>
                    <td class="val">{{ \Carbon\Carbon::parse($booking->showtime->start_time)->format('H:i') }} WIB</td>
                </tr>
                <tr>
                    <td class="label">Nomor Kursi</td>
                    <td class="val">
                        <span class="seats-badge">
                            {{ $booking->bookingSeats->map(fn($bs) => $bs->seat->seat_label)->join(', ') }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td class="label">Total Pembayaran</td>
                    <td class="val" style="color: #4ade80;">Rp {{ number_format($booking->total_price, 0, ',', '.') }} (LUNAS)</td>
                </tr>
            </table>

            <div class="qr-section">
                <img src="data:image/svg+xml;base64,{{ $qrCode }}" alt="QR Code Ticket">
                <div class="booking-code">{{ $booking->booking_code }}</div>
                <p style="font-size: 10px; color: #94a3b8; margin-top: 4px;">Tunjukkan QR Code ini kepada petugas studio saat memasuki bioskop</p>
            </div>

            <div class="footer">
                Harap hadir 15 menit sebelum film dimulai. Tiket yang sudah dibeli tidak dapat ditukar atau dikembalikan.<br>
                &copy; {{ date('Y') }} Cinevia Cinema Reservation System.
            </div>
        </div>
    </div>
</body>
</html>
