import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0);

export default function SalesReportIndex({ report }) {
    const bookings = report?.bookings || [];
    const startDate = report?.start_date || '';
    const endDate = report?.end_date || '';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Laporan Penjualan</h2>
                        <p className="mt-1 text-xs text-slate-400">
                            Ringkasan transaksi tiket yang sudah diverifikasi dan berhasil dibayar.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={route('staff.reports.download', { start_date: startDate, end_date: endDate })}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black text-white transition hover:bg-emerald-500"
                        >
                            Unduh PDF
                        </a>
                    </div>
                </div>
            }
        >
            <Head title="Laporan Penjualan" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
                    <form method="get" action={route('staff.reports.index')} className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                Tanggal Mulai
                            </label>
                            <input
                                type="date"
                                name="start_date"
                                defaultValue={startDate}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                Tanggal Akhir
                            </label>
                            <input
                                type="date"
                                name="end_date"
                                defaultValue={endDate}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-0 placeholder:text-slate-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-rose-500"
                            >
                                Tampilkan Laporan
                            </button>
                        </div>
                    </form>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Transaksi</p>
                        <p className="mt-3 text-3xl font-black text-white">{report?.total_transactions ?? 0}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Pendapatan</p>
                        <p className="mt-3 text-3xl font-black text-emerald-400">{formatCurrency(report?.total_revenue ?? 0)}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Rata-rata Per Transaksi</p>
                        <p className="mt-3 text-3xl font-black text-amber-400">{formatCurrency(report?.average_ticket ?? 0)}</p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-slate-200">
                            <thead className="bg-slate-950/80">
                                <tr>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Kode</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Pelanggan</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Film</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Studio</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Tanggal</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Diverifikasi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-4 py-12 text-center text-sm text-slate-400">
                                            Tidak ada data penjualan pada rentang tanggal yang dipilih.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.id || booking.booking_code} className="border-t border-slate-800">
                                            <td className="px-4 py-3 font-bold text-white">{booking.booking_code}</td>
                                            <td className="px-4 py-3">{booking.customer_name}</td>
                                            <td className="px-4 py-3">{booking.movie_title}</td>
                                            <td className="px-4 py-3">{booking.studio_name}</td>
                                            <td className="px-4 py-3">{booking.show_date}</td>
                                            <td className="px-4 py-3 font-bold text-emerald-400">{formatCurrency(booking.total_price)}</td>
                                            <td className="px-4 py-3">{booking.verified_at}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
