import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0);

const statusStyle = {
    PENDING: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
    CONFIRMED: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    CANCELLED: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
    WAITING_VERIFICATION: 'bg-sky-500/10 text-sky-300 border border-sky-500/30',
    PAID: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    REJECTED: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
    UNPAID: 'bg-slate-500/10 text-slate-300 border border-slate-500/30',
};

const statusLabel = {
    PENDING: 'Menunggu',
    CONFIRMED: 'Dikonfirmasi',
    CANCELLED: 'Dibatalkan',
    WAITING_VERIFICATION: 'Menunggu Verifikasi',
    PAID: 'Lunas',
    REJECTED: 'Ditolak',
    UNPAID: 'Belum Bayar',
};

export default function BookingIndex({ bookings }) {
    const daftarBooking = bookings?.data || bookings || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Pemesanan Saya</h2>
                        <p className="mt-1 text-xs text-slate-400">
                            Pantau status booking, unggah bukti pembayaran, dan akses e-ticket Anda.
                        </p>
                    </div>
                    <Link
                        href={route('home')}
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-rose-600/30 transition hover:from-rose-500 hover:to-rose-400"
                    >
                        Pesan Tiket Baru
                    </Link>
                </div>
            }
        >
            <Head title="Pemesanan Saya" />

            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {daftarBooking.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center">
                        <h3 className="text-lg font-black text-white">Belum ada pemesanan</h3>
                        <p className="mt-2 text-sm text-slate-400">
                            Anda belum membuat booking tiket. Pilih film dan jadwal yang tersedia untuk memulai.
                        </p>
                        <Link
                            href={route('home')}
                            className="mt-5 inline-flex rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white"
                        >
                            Jelajahi Film
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {daftarBooking.map((booking) => {
                            const showtime = booking.showtime || {};
                            const movie = showtime.movie || {};
                            const studio = showtime.studio || {};
                            const seats = booking.booking_seats || [];
                            const payment = booking.payment || {};
                            const status = booking.status || 'PENDING';

                            return (
                                <div
                                    key={booking.id}
                                    className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl"
                                >
                                    <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                                                    {booking.booking_code}
                                                </span>
                                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[status] || statusStyle.PENDING}`}>
                                                    {statusLabel[status] || status}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-white">{movie.title || 'Judul Film'}</h3>
                                            <p className="text-xs text-slate-400">
                                                {showtime.show_date || '-'} • {showtime.start_time || '-'} • {studio.name || 'Studio'}
                                            </p>
                                        </div>

                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total</p>
                                            <p className="text-2xl font-black text-white">{formatCurrency(booking.total_price)}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-800 px-5 py-4">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Kursi</p>
                                                <p className="mt-1 text-sm font-semibold text-slate-200">
                                                    {(seats.length > 0 ? seats.map((seat) => seat.seat?.seat_label || 'Kursi').join(', ') : 'Belum dipilih')}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link
                                                    href={route('bookings.show', booking.id)}
                                                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-rose-500 hover:text-white"
                                                >
                                                    Detail
                                                </Link>
                                                {(payment?.status === 'UNPAID' || payment?.status === 'REJECTED') && (
                                                    <Link
                                                        href={route('bookings.show', booking.id)}
                                                        className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-black text-white transition hover:bg-rose-500"
                                                    >
                                                        Upload Bukti
                                                    </Link>
                                                )}
                                                {status === 'CONFIRMED' && (
                                                    <Link
                                                        href={route('tickets.show', booking.id)}
                                                        className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white transition hover:bg-emerald-500"
                                                    >
                                                        Lihat E-Ticket
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
