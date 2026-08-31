<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Penjualan Cinevia</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 24px;
            background: #f8fafc;
            color: #0f172a;
        }
        .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #e11d48, #be123c);
            color: white;
            padding: 20px 24px;
        }
        .title {
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin: 0;
        }
        .subtitle {
            margin-top: 6px;
            font-size: 12px;
            opacity: 0.9;
        }
        .summary {
            display: flex;
            gap: 16px;
            padding: 20px 24px;
            background: #fff1f2;
            border-bottom: 1px solid #ffe4e6;
        }
        .summary-box {
            flex: 1;
            background: white;
            border: 1px solid #fecdd3;
            border-radius: 10px;
            padding: 12px;
        }
        .label {
            display: block;
            font-size: 10px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #64748b;
            margin-bottom: 8px;
        }
        .value {
            font-size: 18px;
            font-weight: 900;
            color: #0f172a;
        }
        .content {
            padding: 20px 24px 28px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }
        th, td {
            border: 1px solid #e2e8f0;
            padding: 8px 6px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background: #0f172a;
            color: #f8fafc;
            font-size: 9px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }
        tr:nth-child(even) td {
            background: #f8fafc;
        }
        .footer {
            padding: 0 24px 20px;
            font-size: 10px;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1 class="title">Cinevia</h1>
            <div class="subtitle">Laporan Penjualan • Periode {{ $startDate }} s.d. {{ $endDate }}</div>
        </div>

        <div class="summary">
            <div class="summary-box">
                <span class="label">Total Transaksi</span>
                <div class="value">{{ $totalTransactions }}</div>
            </div>
            <div class="summary-box">
                <span class="label">Total Pendapatan</span>
                <div class="value">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</div>
            </div>
        </div>

        <div class="content">
            @if ($bookings->isEmpty())
                <p style="margin: 0; color: #64748b; font-size: 12px;">Tidak ada data penjualan pada rentang tanggal yang dipilih.</p>
            @else
                <table>
                    <thead>
                        <tr>
                            <th>Kode</th>
                            <th>Pelanggan</th>
                            <th>Film</th>
                            <th>Studio</th>
                            <th>Tanggal</th>
                            <th>Kursi</th>
                            <th>Total</th>
                            <th>Verifikasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($bookings as $booking)
                            <tr>
                                <td>{{ $booking['booking_code'] }}</td>
                                <td>{{ $booking['customer_name'] }}</td>
                                <td>{{ $booking['movie_title'] }}</td>
                                <td>{{ $booking['studio_name'] }}</td>
                                <td>{{ $booking['show_date'] }}</td>
                                <td>{{ $booking['seat_labels'] }}</td>
                                <td>Rp {{ number_format($booking['total_price'], 0, ',', '.') }}</td>
                                <td>{{ $booking['verified_at'] }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>

        <div class="footer">
            Dicetak pada {{ now()->translatedFormat('d F Y H:i') }} WIB
        </div>
    </div>
</body>
</html>
