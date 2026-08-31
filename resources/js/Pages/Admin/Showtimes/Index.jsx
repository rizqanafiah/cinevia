import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ShowtimeIndex({ showtimes = [], movies = [], studios = [] }) {
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        movie_id: '',
        studio_id: '',
        show_date: '',
        start_time: '',
        ticket_price: '',
    });

    const { flash = {} } = usePage().props;
    const [editingShowtime, setEditingShowtime] = useState(null);
    const [deleteShowtimeId, setDeleteShowtimeId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);
    const [toast, setToast] = useState(null);
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        const message = flash?.sukses || flash?.error || null;

        if (!message) {
            return undefined;
        }

        const isError = Boolean(flash?.error);
        setToastType(isError ? 'error' : 'success');
        setToast(typeof message === 'string' ? message : Object.values(message)[0]);

        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();

        setConfirmDialog({
            title: 'Konfirmasi tambah jadwal',
            message: 'Apakah Anda yakin ingin menambahkan jadwal tayang ini?',
            action: () => {
                post(route('admin.showtimes.store'), {
                    onSuccess: () => reset(),
                    onError: () => setToast('Gagal menambahkan jadwal tayang. Periksa data Anda.'),
                });
            },
        });
    };

    const submitUpdate = (e) => {
        e.preventDefault();

        setConfirmDialog({
            title: 'Konfirmasi perubahan jadwal',
            message: 'Apakah Anda yakin ingin menyimpan perubahan jadwal ini?',
            action: () => {
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('movie_id', editingShowtime.movie_id ?? '');
                formData.append('studio_id', editingShowtime.studio_id ?? '');
                formData.append('show_date', editingShowtime.show_date ?? '');
                formData.append('start_time', editingShowtime.start_time ?? '');
                formData.append('ticket_price', editingShowtime.ticket_price ?? '');

                router.post(route('admin.showtimes.update', editingShowtime.id), formData, {
                    onSuccess: () => setEditingShowtime(null),
                    onError: () => setToast('Gagal memperbarui jadwal tayang. Coba lagi nanti.'),
                });
            },
        });
    };

    const deleteShowtime = () => {
        if (!deleteShowtimeId) return;

        setConfirmDialog({
            title: 'Konfirmasi hapus jadwal',
            message: 'Apakah Anda yakin ingin menghapus jadwal tayang ini?',
            action: () => {
                destroy(route('admin.showtimes.destroy', deleteShowtimeId), {
                    onSuccess: () => setDeleteShowtimeId(null),
                    onError: () => setToast('Gagal menghapus jadwal tayang. Silakan coba lagi.'),
                });
            },
        });
    };

    const daftarJadwal = showtimes?.data || showtimes || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Jadwal Tayang</h2>
                        <p className="mt-1 text-xs text-slate-400">Atur jadwal film, studio, dan harga tiket untuk penayangan berikutnya.</p>
                    </div>
                </div>
            }
        >
            <Head title="Jadwal Tayang" />

            {toast && (
                <div className={`fixed right-4 top-4 z-50 flex w-[min(360px,calc(100vw-2rem))] items-start gap-3 rounded-2xl border p-3 shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out ${toastType === 'error' ? 'border-rose-500/30 bg-rose-500/10 text-rose-200' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'}`}>
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl ${toastType === 'error' ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                        {toastType === 'error' ? '!' : '✓'}
                    </div>
                    <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80">{toastType === 'error' ? 'Gagal' : 'Berhasil'}</p>
                        <p className="mt-1 text-sm font-semibold leading-relaxed">{toast}</p>
                    </div>
                    <button type="button" onClick={() => setToast(null)} className="text-xs font-black text-current opacity-70 hover:opacity-100">✕</button>
                </div>
            )}

            <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                    <h3 className="text-lg font-black text-white">Tambah Jadwal Baru</h3>

                    <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Film</label>
                            <select
                                value={data.movie_id}
                                onChange={(e) => setData('movie_id', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            >
                                <option value="">Pilih film</option>
                                {(movies?.data || movies || []).map((movie) => (
                                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                                ))}
                            </select>
                            {errors.movie_id && <p className="mt-1 text-xs text-rose-400">{errors.movie_id}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Studio</label>
                            <select
                                value={data.studio_id}
                                onChange={(e) => setData('studio_id', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            >
                                <option value="">Pilih studio</option>
                                {(studios?.data || studios || []).map((studio) => (
                                    <option key={studio.id} value={studio.id}>{studio.name}</option>
                                ))}
                            </select>
                            {errors.studio_id && <p className="mt-1 text-xs text-rose-400">{errors.studio_id}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Tanggal Tayang</label>
                            <input
                                type="date"
                                value={data.show_date}
                                onChange={(e) => setData('show_date', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            />
                            {errors.show_date && <p className="mt-1 text-xs text-rose-400">{errors.show_date}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Jam Mulai</label>
                            <input
                                type="time"
                                value={data.start_time}
                                onChange={(e) => setData('start_time', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            />
                            {errors.start_time && <p className="mt-1 text-xs text-rose-400">{errors.start_time}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Harga Tiket</label>
                            <input
                                type="number"
                                min="1"
                                value={data.ticket_price}
                                onChange={(e) => setData('ticket_price', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            />
                            {errors.ticket_price && <p className="mt-1 text-xs text-rose-400">{errors.ticket_price}</p>}
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Jadwal'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                    <h3 className="text-lg font-black text-white">Daftar Jadwal</h3>

                    <div className="mt-5 grid gap-4">
                        {daftarJadwal.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                                Belum ada jadwal tayang.
                            </div>
                        ) : (
                            daftarJadwal.map((showtime) => (
                                <div key={showtime.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h4 className="text-base font-black text-white">{showtime.movie?.title || 'Film'}</h4>
                                            <p className="text-xs text-slate-400">
                                                {showtime.studio?.name || 'Studio'} • {showtime.show_date || '-'} • {showtime.start_time || '-'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Harga</p>
                                            <p className="text-lg font-black text-rose-400">Rp {Number(showtime.ticket_price || 0).toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingShowtime(showtime)}
                                            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200"
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteShowtimeId(showtime.id)}
                                            className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-300"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Modal show={Boolean(editingShowtime)} onClose={() => setEditingShowtime(null)} maxWidth="2xl">
                {editingShowtime && (
                    <form onSubmit={submitUpdate} className="bg-slate-900 p-6 text-white">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-black text-white">Edit Jadwal Tayang</h3>
                            <button type="button" onClick={() => setEditingShowtime(null)} className="text-sm text-slate-400">✕</button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Film</label>
                                <select
                                    value={editingShowtime.movie_id || ''}
                                    onChange={(e) => setEditingShowtime({ ...editingShowtime, movie_id: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                >
                                    {(movies?.data || movies || []).map((movie) => (
                                        <option key={movie.id} value={movie.id}>{movie.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Studio</label>
                                <select
                                    value={editingShowtime.studio_id || ''}
                                    onChange={(e) => setEditingShowtime({ ...editingShowtime, studio_id: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                >
                                    {(studios?.data || studios || []).map((studio) => (
                                        <option key={studio.id} value={studio.id}>{studio.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Tanggal Tayang</label>
                                <input
                                    type="date"
                                    value={editingShowtime.show_date || ''}
                                    onChange={(e) => setEditingShowtime({ ...editingShowtime, show_date: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Jam Mulai</label>
                                <input
                                    type="time"
                                    value={editingShowtime.start_time || ''}
                                    onChange={(e) => setEditingShowtime({ ...editingShowtime, start_time: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Harga Tiket</label>
                                <input
                                    type="number"
                                    value={editingShowtime.ticket_price || ''}
                                    onChange={(e) => setEditingShowtime({ ...editingShowtime, ticket_price: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setEditingShowtime(null)} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            <Modal show={Boolean(deleteShowtimeId)} onClose={() => setDeleteShowtimeId(null)} maxWidth="sm">
                <div className="bg-slate-900 p-6 text-white">
                    <h3 className="text-lg font-black text-white">Hapus Jadwal Tayang</h3>
                    <p className="mt-2 text-sm text-slate-300">Apakah Anda yakin ingin menghapus jadwal ini? Penghapusan ini akan menghilangkan rencana tayang yang sudah dibuat.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setDeleteShowtimeId(null)} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                            Batal
                        </button>
                        <button type="button" onClick={deleteShowtime} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
