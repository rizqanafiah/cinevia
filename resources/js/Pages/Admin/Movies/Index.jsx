import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function MovieIndex({ movies = [] }) {
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        genre: '',
        duration_minutes: '',
        synopsis: '',
        age_rating: 'SU',
        poster: null,
    });

    const { flash = {} } = usePage().props;
    const [editingMovie, setEditingMovie] = useState(null);
    const [deleteMovieId, setDeleteMovieId] = useState(null);
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
            title: 'Konfirmasi simpan film',
            message: 'Apakah Anda yakin ingin menambahkan film ini?',
            action: () => {
                post(route('admin.movies.store'), {
                    forceFormData: true,
                    onSuccess: () => reset(),
                    onError: () => setToast('Gagal menambahkan film. Periksa kembali form Anda.'),
                });
            },
        });
    };

    const submitUpdate = (e) => {
        e.preventDefault();

        setConfirmDialog({
            title: 'Konfirmasi perubahan film',
            message: 'Apakah Anda yakin ingin menyimpan perubahan pada film ini?',
            action: () => {
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('title', editingMovie.title || '');
                formData.append('genre', editingMovie.genre || '');
                formData.append('duration_minutes', editingMovie.duration_minutes ?? '');
                formData.append('synopsis', editingMovie.synopsis || '');
                formData.append('age_rating', editingMovie.age_rating || 'SU');

                router.post(route('admin.movies.update', editingMovie.id), formData, {
                    onSuccess: () => setEditingMovie(null),
                    onError: () => setToast('Gagal memperbarui film. Coba lagi nanti.'),
                });
            },
        });
    };

    const deleteMovie = () => {
        if (!deleteMovieId) return;

        setConfirmDialog({
            title: 'Konfirmasi hapus film',
            message: 'Apakah Anda yakin ingin menghapus film ini? Tindakan ini tidak dapat dibatalkan.',
            action: () => {
                destroy(route('admin.movies.destroy', deleteMovieId), {
                    onSuccess: () => setDeleteMovieId(null),
                    onError: () => setToast('Gagal menghapus film. Silakan coba lagi.'),
                });
            },
        });
    };

    const daftarFilm = movies?.data || movies || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Kelola Film</h2>
                        <p className="mt-1 text-xs text-slate-400">Tambah dan kelola daftar film yang akan ditayangkan.</p>
                    </div>
                </div>
            }
        >
            <Head title="Kelola Film" />

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
                    <h3 className="text-lg font-black text-white">Tambah Film Baru</h3>

                    <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2" encType="multipart/form-data">
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Judul Film</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-rose-500"
                            />
                            {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Genre</label>
                            <input
                                type="text"
                                value={data.genre}
                                onChange={(e) => setData('genre', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-rose-500"
                            />
                            {errors.genre && <p className="mt-1 text-xs text-rose-400">{errors.genre}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Durasi (menit)</label>
                            <input
                                type="number"
                                min="1"
                                value={data.duration_minutes}
                                onChange={(e) => setData('duration_minutes', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-rose-500"
                            />
                            {errors.duration_minutes && <p className="mt-1 text-xs text-rose-400">{errors.duration_minutes}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Usia</label>
                            <select
                                value={data.age_rating}
                                onChange={(e) => setData('age_rating', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-rose-500"
                            >
                                <option value="SU">SU</option>
                                <option value="R13">R13</option>
                                <option value="D17">D17</option>
                                <option value="D21">D21</option>
                            </select>
                            {errors.age_rating && <p className="mt-1 text-xs text-rose-400">{errors.age_rating}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Poster Film</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('poster', e.target.files[0] || null)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-rose-600 file:px-3 file:py-2 file:text-xs file:font-black file:text-white"
                            />
                            {errors.poster && <p className="mt-1 text-xs text-rose-400">{errors.poster}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Sinopsis</label>
                            <textarea
                                rows="4"
                                value={data.synopsis}
                                onChange={(e) => setData('synopsis', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-rose-500"
                            />
                            {errors.synopsis && <p className="mt-1 text-xs text-rose-400">{errors.synopsis}</p>}
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Film'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                    <h3 className="text-lg font-black text-white">Daftar Film</h3>

                    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {daftarFilm.length === 0 ? (
                            <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                                Belum ada film yang ditambahkan.
                            </div>
                        ) : (
                            daftarFilm.map((movie) => (
                                <div key={movie.id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60">
                                    <img
                                        src={movie.poster_path || 'https://placehold.co/600x900/0f172a/f8fafc?text=Cinevia'}
                                        alt={movie.title}
                                        className="h-56 w-full object-cover"
                                    />
                                    <div className="space-y-3 p-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="text-base font-black text-white">{movie.title}</h4>
                                            <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-300">
                                                {movie.age_rating}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400">{movie.genre} • {movie.duration_minutes} menit</p>
                                        <p className="line-clamp-3 text-xs text-slate-300">{movie.synopsis || 'Belum ada sinopsis.'}</p>

                                        <div className="mt-3 flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setEditingMovie(movie)}
                                                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200"
                                            >
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteMovieId(movie.id)}
                                                className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-300"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Modal show={Boolean(editingMovie)} onClose={() => setEditingMovie(null)} maxWidth="2xl">
                {editingMovie && (
                    <form onSubmit={submitUpdate} className="bg-slate-900 p-6 text-white">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-black text-white">Edit Film</h3>
                            <button type="button" onClick={() => setEditingMovie(null)} className="text-sm text-slate-400">✕</button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Judul Film</label>
                                <input
                                    type="text"
                                    value={editingMovie.title || ''}
                                    onChange={(e) => setEditingMovie({ ...editingMovie, title: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Genre</label>
                                <input
                                    type="text"
                                    value={editingMovie.genre || ''}
                                    onChange={(e) => setEditingMovie({ ...editingMovie, genre: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Durasi</label>
                                <input
                                    type="number"
                                    value={editingMovie.duration_minutes || ''}
                                    onChange={(e) => setEditingMovie({ ...editingMovie, duration_minutes: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Usia</label>
                                <select
                                    value={editingMovie.age_rating || 'SU'}
                                    onChange={(e) => setEditingMovie({ ...editingMovie, age_rating: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                >
                                    <option value="SU">SU</option>
                                    <option value="R13">R13</option>
                                    <option value="D17">D17</option>
                                    <option value="D21">D21</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Sinopsis</label>
                                <textarea
                                    rows="4"
                                    value={editingMovie.synopsis || ''}
                                    onChange={(e) => setEditingMovie({ ...editingMovie, synopsis: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setEditingMovie(null)} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            <Modal show={Boolean(deleteMovieId)} onClose={() => setDeleteMovieId(null)} maxWidth="sm">
                <div className="bg-slate-900 p-6 text-white">
                    <h3 className="text-lg font-black text-white">Hapus Film</h3>
                    <p className="mt-2 text-sm text-slate-300">Apakah Anda yakin ingin menghapus film ini? Tindakan ini tidak bisa dibatalkan.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setDeleteMovieId(null)} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                            Batal
                        </button>
                        <button type="button" onClick={deleteMovie} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal show={Boolean(confirmDialog)} onClose={() => setConfirmDialog(null)} maxWidth="sm">
                <div className="bg-slate-900 p-6 text-white">
                    <h3 className="text-lg font-black text-white">{confirmDialog?.title || 'Konfirmasi'}</h3>
                    <p className="mt-2 text-sm text-slate-300">{confirmDialog?.message || 'Apakah Anda yakin?'}</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setConfirmDialog(null)} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                            Batal
                        </button>
                        <button type="button" onClick={() => {
                            confirmDialog?.action?.();
                            setConfirmDialog(null);
                        }} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                            OK
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
