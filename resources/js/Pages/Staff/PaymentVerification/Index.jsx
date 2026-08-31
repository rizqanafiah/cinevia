import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0);

const statusStyle = {
    WAITING_VERIFICATION: 'bg-sky-500/10 text-sky-300 border border-sky-500/30',
    PAID: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    REJECTED: 'bg-rose-500/10 text-rose-300 border border-rose-500/30',
};

export default function PaymentVerificationIndex({ payments, filters }) {
    const daftarPembayaran = payments?.data || payments || [];
    const activeFilter = filters?.status || 'WAITING_VERIFICATION';
    const { flash = {} } = usePage().props;
    const [toast, setToast] = useState(null);
    const [submittingId, setSubmittingId] = useState(null);

    useEffect(() => {
        const message = flash?.sukses || flash?.error || null;

        if (!message) {
            return undefined;
        }

        const text = typeof message === 'string' ? message : Object.values(message)[0];
        setToast(text);

        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [flash]);

    const submitAction = (paymentId, aksi) => {
        setSubmittingId(paymentId);

        router.post(
            route('staff.payments.verify', paymentId),
            { aksi },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({
                        only: ['payments', 'filters'],
                        preserveScroll: true,
                    });
                },
                onFinish: () => setSubmittingId(null),
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Verifikasi Pembayaran</h2>
                        <p className="mt-1 text-xs text-slate-400">
                            Verifikasi bukti transfer pelanggan dan kelola status pembayaran sebelum tiket diterbitkan.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Verifikasi Pembayaran" />

            {toast && (
                <div className="fixed right-4 top-4 z-50 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 shadow-lg backdrop-blur-sm">
                    <p className="text-sm font-bold text-emerald-300">{toast}</p>
                </div>
            )}

            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mb-5 flex flex-wrap gap-2">
                    {['WAITING_VERIFICATION', 'PAID', 'REJECTED'].map((status) => (
                        <a
                            key={status}
                            href={route('staff.payments.index', { status })}
                            className={`rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] transition ${
                                activeFilter === status
                                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                            }`}
                        >
                            {status === 'WAITING_VERIFICATION' ? 'Menunggu Verifikasi' : status === 'PAID' ? 'Lunas' : 'Ditolak'}
                        </a>
                    ))}
                </div>

                {daftarPembayaran.length === 0 ? (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center">
                        <h3 className="text-lg font-black text-white">Tidak ada antrean pembayaran</h3>
                        <p className="mt-2 text-sm text-slate-400">Belum ada bukti transfer masuk yang menunggu verifikasi.</p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {daftarPembayaran.map((payment) => {
                            const booking = payment.booking || {};
                            const user = booking.user || {};
                            const movie = booking.showtime?.movie || {};
                            const studio = booking.showtime?.studio || {};
                            const status = payment.status || 'WAITING_VERIFICATION';

                            return (
                                <div key={payment.id} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                                                    {booking.booking_code || 'B-000'}
                                                </span>
                                                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[status] || statusStyle.WAITING_VERIFICATION}`}>
                                                    {status === 'WAITING_VERIFICATION' ? 'Menunggu Verifikasi' : status === 'PAID' ? 'Lunas' : 'Ditolak'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-white">{movie.title || 'Judul Film'}</h3>
                                            <p className="text-xs text-slate-400">
                                                {user.name || 'Customer'} • {studio.name || 'Studio'} • {booking.showtime?.show_date || '-'} • {booking.showtime?.start_time || '-'}
                                            </p>
                                        </div>

                                        <div className="text-left lg:text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Jumlah</p>
                                            <p className="text-2xl font-black text-white">{formatCurrency(payment.amount)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-4 border-t border-slate-800 pt-4 lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {payment.proof_path ? (
                                                <a
                                                    href={route('payments.bukti', payment.id)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:border-rose-500 hover:text-white"
                                                >
                                                    Lihat Bukti
                                                </a>
                                            ) : (
                                                <span className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-400">
                                                    Belum Ada Bukti
                                                </span>
                                            )}
                                        </div>

                                        {status === 'WAITING_VERIFICATION' && (
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => submitAction(payment.id, 'tolak')}
                                                    disabled={submittingId === payment.id}
                                                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-black text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Tolak
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => submitAction(payment.id, 'verifikasi')}
                                                    disabled={submittingId === payment.id}
                                                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Verifikasi
                                                </button>
                                            </div>
                                        )}
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
