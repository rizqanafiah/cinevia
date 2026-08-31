import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0);

export default function TicketShow({ booking }) {
    const data = booking?.data || booking || {};
    const showtime = data.showtime || {};
    const movie = showtime.movie || {};
    const studio = showtime.studio || {};
    const seats = data.booking_seats || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">E-Ticket</h2>
                        <p className="mt-1 text-xs text-slate-400">Kode booking: {data.booking_code}</p>
                    </div>
                    <Link
                        href={route('bookings.index')}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:border-slate-600 hover:text-white"
                    >
                        Kembali ke Pemesanan
                    </Link>
                </div>
            }
        >
            <Head title="E-Ticket" />

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 shadow-2xl">
                    <div className="border-b border-slate-800 px-6 py-5">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-300">Cinevia Ticket</p>
                                <h3 className="mt-2 text-2xl font-black text-white">{movie.title}</h3>
                            </div>
                            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center">
                                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Status</div>
                                <div className="text-xs font-black text-emerald-200">Terverifikasi</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Tanggal & Jam</p>
                                <p className="mt-2 text-lg font-black text-white">{showtime.show_date} • {showtime.start_time}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Studio</p>
                                <p className="mt-2 text-lg font-black text-white">{studio.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Kursi</p>
                                <p className="mt-2 text-lg font-black text-white">
                                    {seats.map((seat) => seat.seat?.seat_label || 'Kursi').join(', ')}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total</p>
                                <p className="text-xl font-black text-white">{formatCurrency(data.total_price)}</p>
                            </div>

                            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/80 text-center">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">QR</div>
                                    <div className="mt-2 text-xs font-black text-emerald-300">{data.booking_code}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 px-6 py-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-400">Tunjukkan e-ticket ini saat masuk studio.</p>
                        <a
                            href={route('tickets.download', data.id)}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-500"
                        >
                            Unduh PDF
                        </a>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
