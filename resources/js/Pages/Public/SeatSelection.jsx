import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value || 0);

export default function SeatSelection({ showtime, seats }) {
    const data = showtime?.data || showtime || {};
    const movie = data.movie || {};
    const studio = data.studio || {};
    const seatList = seats || [];
    const [selectedSeats, setSelectedSeats] = useState([]);

    const { data: formData, setData, post, processing, errors } = useForm({
        showtime_id: data.id,
        seat_ids: [],
    });

    const groupedByRow = useMemo(() => {
        const map = {};
        seatList.forEach((seat) => {
            const label = seat.seat_label || '';
            const row = label.replace(/[0-9]/g, '') || 'A';
            if (!map[row]) map[row] = [];
            map[row].push(seat);
        });

        return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
    }, [seatList]);

    const toggleSeat = (seat) => {
        if (!seat.tersedia) return;

        const exists = selectedSeats.some((item) => item.id === seat.id);
        const next = exists
            ? selectedSeats.filter((item) => item.id !== seat.id)
            : [...selectedSeats, seat];

        setSelectedSeats(next);
        setData('seat_ids', next.map((item) => item.id));
    };

    const total = selectedSeats.reduce((sum, seat) => sum + Number(data.ticket_price || 0), 0);

    const submitBooking = (e) => {
        e.preventDefault();
        post(route('bookings.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedSeats([]);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Pilih Kursi</h2>
                        <p className="mt-1 text-xs text-slate-400">
                            {movie.title} • {studio.name} • {data.show_date} • {data.start_time}
                        </p>
                    </div>
                    <Link
                        href={route('home')}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:border-slate-600 hover:text-white"
                    >
                        Kembali ke Katalog
                    </Link>
                </div>
            }
        >
            <Head title="Pilih Kursi" />

            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
                        <div className="mx-auto mb-6 w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                            <div className="mx-auto h-3 w-2/3 rounded-full bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700" />
                            <p className="mt-2 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                                Layar Bioskop
                            </p>
                        </div>

                        <div className="space-y-4">
                            {groupedByRow.map(([row, seatsRow]) => (
                                <div key={row} className="flex items-center gap-3">
                                    <div className="w-8 text-center text-xs font-black text-slate-400">{row}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {seatsRow.map((seat) => {
                                            const selected = selectedSeats.some((item) => item.id === seat.id);
                                            const disabled = !seat.tersedia;

                                            return (
                                                <button
                                                    key={seat.id}
                                                    type="button"
                                                    onClick={() => toggleSeat(seat)}
                                                    disabled={disabled}
                                                    className={`h-10 w-10 rounded-xl border text-[10px] font-black transition ${
                                                        disabled
                                                            ? 'cursor-not-allowed border-slate-700 bg-slate-800 text-slate-600 opacity-50'
                                                            : selected
                                                                ? 'border-rose-500 bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                                                                : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-rose-500 hover:text-white'
                                                    }`}
                                                >
                                                    {seat.seat_label || 'A1'}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-md border border-slate-700 bg-slate-950" /> Tersedia</span>
                            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-md border border-rose-500 bg-rose-600" /> Dipilih</span>
                            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-md border border-slate-700 bg-slate-800 opacity-50" /> Terisi</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Ringkasan</p>
                            <div className="mt-4 space-y-3 text-sm text-slate-300">
                                <div className="flex items-center justify-between"><span>Film</span><span className="font-bold text-white">{movie.title}</span></div>
                                <div className="flex items-center justify-between"><span>Studio</span><span className="font-bold text-white">{studio.name}</span></div>
                                <div className="flex items-center justify-between"><span>Jam</span><span className="font-bold text-white">{data.start_time}</span></div>
                                <div className="flex items-center justify-between"><span>Harga</span><span className="font-bold text-white">{formatCurrency(data.ticket_price)}</span></div>
                            </div>

                            <div className="mt-5 border-t border-slate-800 pt-4">
                                <div className="flex items-center justify-between text-sm font-bold text-slate-300">
                                    <span>Kursi dipilih</span>
                                    <span className="text-white">{selectedSeats.length}</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {selectedSeats.length > 0 ? (
                                        selectedSeats.map((seat) => (
                                            <span key={seat.id} className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-rose-300">
                                                {seat.seat_label}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400">Belum ada kursi dipilih.</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 border-t border-slate-800 pt-4">
                                <div className="flex items-center justify-between text-sm font-bold text-slate-300">
                                    <span>Total</span>
                                    <span className="text-xl font-black text-white">{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={submitBooking} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                            {errors.seat_ids && <p className="mb-3 text-xs text-rose-300">{errors.seat_ids}</p>}
                            <button
                                type="submit"
                                disabled={processing || selectedSeats.length === 0}
                                className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:from-rose-500 hover:to-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
