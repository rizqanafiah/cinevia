import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0);

const paymentStatusStyle = {
    UNPAID: 'bg-slate-500/10 text-slate-300 border border-slate-500/30',
    WAITING_VERIFICATION: 'bg-sky-500/10 text-sky-300 border border-sky-500/30',
    PAID: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    REJECTED: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
};

const paymentStatusLabel = {
    UNPAID: 'Belum Bayar',
    WAITING_VERIFICATION: 'Menunggu Verifikasi',
    PAID: 'Lunas',
    REJECTED: 'Ditolak',
};

export default function BookingShow({ booking }) {
    const data = booking?.data || booking || {};
    const showtime = data.showtime || {};
    const movie = showtime.movie || {};
    const studio = showtime.studio || {};
    const payment = data.payment || {};
    const seats = data.booking_seats || [];

    const { data: formData, setData, post, processing, errors } = useForm({
        bukti_pembayaran: null,
    });

    const submitUpload = (e) => {
        e.preventDefault();
        post(route('payments.upload', data.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Detail Booking</h2>
                        <p className="mt-1 text-xs text-slate-400">#{data.booking_code}</p>
                    </div>
                    <Link
                        href={route('bookings.index')}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:border-slate-600 hover:text-white"
                    >
                        Kembali ke Daftar
                    </Link>
                </div>
            }
        >
            <Head title={`Booking ${data.booking_code}`} />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Film</p>
                                <h3 className="mt-1 text-2xl font-black text-white">{movie.title}</h3>
                            </div>
                            <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-[10px] font-black uppercase text-rose-300">
                                {data.status || 'PENDING'}
                            </span>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Tanggal</p>
                                <p className="mt-2 text-base font-black text-white">{showtime.show_date || '-'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Jam</p>
                                <p className="mt-2 text-base font-black text-white">{showtime.start_time || '-'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Studio</p>
                                <p className="mt-2 text-base font-black text-white">{studio.name || '-'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Total</p>
                                <p className="mt-2 text-base font-black text-white">{formatCurrency(data.total_price)}</p>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Kursi Terpilih</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {seats.length > 0 ? (
                                    seats.map((seat) => (
                                        <span
                                            key={seat.id}
                                            className="rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-200"
                                        >
                                            {seat.seat?.seat_label || 'Kursi'}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-400">Belum ada kursi yang dipilih.</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Status Pembayaran</p>
                            <div className="mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className={paymentStatusStyle[payment.status] || paymentStatusStyle.UNPAID}>
                                    {paymentStatusLabel[payment.status] || 'Belum Bayar'}
                                </span>
                            </div>
                            <p className="mt-4 text-sm text-slate-300">
                                Silakan transfer sesuai total booking lalu unggah bukti pembayaran agar staff dapat memverifikasi.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Upload Bukti Pembayaran</h4>

                            <form onSubmit={submitUpload} className="mt-4 space-y-4">
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => setData('bukti_pembayaran', e.target.files[0])}
                                    className="block w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-rose-600 file:px-3 file:py-2 file:text-xs file:font-black file:text-white"
                                />

                                {errors.bukti_pembayaran && (
                                    <p className="text-xs text-rose-300">{errors.bukti_pembayaran}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing || !formData.bukti_pembayaran}
                                    className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-3 text-xs font-black text-white transition hover:from-rose-500 hover:to-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Mengunggah...' : 'Upload Bukti'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
