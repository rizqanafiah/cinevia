import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function StudioIndex({ studios = [] }) {
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        capacity: '',
    });

    const { flash = {} } = usePage().props;
    const [editingStudio, setEditingStudio] = useState(null);
    const [deleteStudioId, setDeleteStudioId] = useState(null);
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
            title: 'Konfirmasi tambah studio',
            message: 'Apakah Anda yakin ingin menambahkan studio baru?',
            action: () => {
                post(route('admin.studios.store'), {
                    onSuccess: () => reset(),
                    onError: () => setToast('Gagal menambahkan studio. Periksa data Anda.'),
                });
            },
        });
    };

    const submitUpdate = (e) => {
        e.preventDefault();

        setConfirmDialog({
            title: 'Konfirmasi perubahan studio',
            message: 'Apakah Anda yakin ingin menyimpan perubahan studio ini?',
            action: () => {
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('name', editingStudio.name || '');
                formData.append('capacity', editingStudio.capacity ?? '');

                router.post(route('admin.studios.update', editingStudio.id), formData, {
                    onSuccess: () => setEditingStudio(null),
                    onError: () => setToast('Gagal memperbarui studio. Coba lagi nanti.'),
                });
            },
        });
    };

    const deleteStudio = () => {
        if (!deleteStudioId) return;

        setConfirmDialog({
            title: 'Konfirmasi hapus studio',
            message: 'Apakah Anda yakin ingin menghapus studio ini?',
            action: () => {
                destroy(route('admin.studios.destroy', deleteStudioId), {
                    onSuccess: () => setDeleteStudioId(null),
                    onError: () => setToast('Gagal menghapus studio. Silakan coba lagi.'),
                });
            },
        });
    };

    const daftarStudio = studios?.data || studios || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Studio</h2>
                        <p className="mt-1 text-xs text-slate-400">Kelola studio dan kapasitas kursi bioskop.</p>
                    </div>
                </div>
            }
        >
            <Head title="Studio" />

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

            <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                    <h3 className="text-lg font-black text-white">Tambah Studio Baru</h3>

                    <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Nama Studio</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            />
                            {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Kapasitas</label>
                            <input
                                type="number"
                                min="1"
                                value={data.capacity}
                                onChange={(e) => setData('capacity', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            />
                            {errors.capacity && <p className="mt-1 text-xs text-rose-400">{errors.capacity}</p>}
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Studio'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                    <h3 className="text-lg font-black text-white">Daftar Studio</h3>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {daftarStudio.length === 0 ? (
                            <div className="md:col-span-2 rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                                Belum ada studio yang dibuat.
                            </div>
                        ) : (
                            daftarStudio.map((studio) => (
                                <div key={studio.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <h4 className="text-base font-black text-white">{studio.name}</h4>
                                        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                                            {studio.capacity} kursi
                                        </span>
                                    </div>

                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingStudio(studio)}
                                            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200"
                                        >
                                            Update
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteStudioId(studio.id)}
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

            <Modal show={Boolean(editingStudio)} onClose={() => setEditingStudio(null)} maxWidth="md">
                {editingStudio && (
                    <form onSubmit={submitUpdate} className="bg-slate-900 p-6 text-white">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-black text-white">Edit Studio</h3>
                            <button type="button" onClick={() => setEditingStudio(null)} className="text-sm text-slate-400">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Nama Studio</label>
                                <input
                                    type="text"
                                    value={editingStudio.name || ''}
                                    onChange={(e) => setEditingStudio({ ...editingStudio, name: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Kapasitas</label>
                                <input
                                    type="number"
                                    value={editingStudio.capacity || ''}
                                    onChange={(e) => setEditingStudio({ ...editingStudio, capacity: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setEditingStudio(null)} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            <Modal show={Boolean(deleteStudioId)} onClose={() => setDeleteStudioId(null)} maxWidth="sm">
                <div className="bg-slate-900 p-6 text-white">
                    <h3 className="text-lg font-black text-white">Hapus Studio</h3>
                    <p className="mt-2 text-sm text-slate-300">Apakah Anda yakin ingin menghapus studio ini? Semua kursi terkait akan ikut terhapus.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setDeleteStudioId(null)} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                            Batal
                        </button>
                        <button type="button" onClick={deleteStudio} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                            Hapus
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
