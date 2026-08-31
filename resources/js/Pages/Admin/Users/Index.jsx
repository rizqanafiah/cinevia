import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Modal from '@/Components/Modal';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function UserIndex({ users = [], roles = [] }) {
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'customer',
    });

    const { flash = {} } = usePage().props;
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null);
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
            title: 'Konfirmasi tambah user',
            message: 'Apakah Anda yakin ingin menambahkan user baru?',
            action: () => {
                post(route('admin.users.store'), {
                    onSuccess: () => reset(),
                    onError: () => setToast('Gagal menambahkan pengguna. Periksa form Anda.'),
                });
            },
        });
    };

    const submitUpdate = (e) => {
        e.preventDefault();

        setConfirmDialog({
            title: 'Konfirmasi perubahan user',
            message: 'Apakah Anda yakin ingin menyimpan perubahan user ini?',
            action: () => {
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('name', editingUser.name || '');
                formData.append('email', editingUser.email || '');
                formData.append('password', editingUser.password || '');
                formData.append('role', editingUser.role || 'customer');

                router.post(route('admin.users.update', editingUser.id), formData, {
                    onSuccess: () => setEditingUser(null),
                    onError: () => setToast('Gagal memperbarui pengguna. Coba lagi nanti.'),
                });
            },
        });
    };

    const deleteUser = () => {
        if (!deleteUserId) return;

        setConfirmDialog({
            title: 'Konfirmasi hapus user',
            message: 'Apakah Anda yakin ingin menghapus user ini?',
            action: () => {
                destroy(route('admin.users.destroy', deleteUserId), {
                    onSuccess: () => setDeleteUserId(null),
                    onError: () => setToast('Gagal menghapus pengguna. Silakan coba lagi.'),
                });
            },
        });
    };

    const daftarUser = users?.data || users || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">Kelola User</h2>
                        <p className="mt-1 text-xs text-slate-400">Tambah, ubah, dan hapus akun pengguna berdasarkan role.</p>
                    </div>
                </div>
            }
        >
            <Head title="Kelola User" />

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
                    <h3 className="text-lg font-black text-white">Tambah User Baru</h3>

                    <form onSubmit={submit} className="mt-5 grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Nama</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            />
                            {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            />
                            {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            />
                            {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Role</label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-rose-500"
                            >
                                {Array.isArray(roles) ? (
                                    roles.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))
                                ) : (
                                    <>
                                        <option value="customer">customer</option>
                                        <option value="staff">staff</option>
                                        <option value="admin">admin</option>
                                    </>
                                )}
                            </select>
                            {errors.role && <p className="mt-1 text-xs text-rose-400">{errors.role}</p>}
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan User'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                    <h3 className="text-lg font-black text-white">Daftar User</h3>

                    <div className="mt-5 space-y-4">
                        {daftarUser.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center text-sm text-slate-400">
                                Belum ada user yang terdaftar.
                            </div>
                        ) : (
                            daftarUser.map((user) => {
                                const userRole = Array.isArray(user.roles) ? user.roles[0] : 'customer';
                                const roleConfig = {
                                    admin: {
                                        badge: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
                                        panel: 'border-violet-500/20 bg-violet-500/5',
                                    },
                                    staff: {
                                        badge: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
                                        panel: 'border-amber-500/20 bg-amber-500/5',
                                    },
                                    customer: {
                                        badge: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
                                        panel: 'border-rose-500/20 bg-rose-500/5',
                                    },
                                };
                                const selectedRole = roleConfig[userRole] || roleConfig.customer;
                                const roleLabel = userRole === 'admin' ? 'Administrator' : userRole === 'staff' ? 'Staff Operasional' : 'Pelanggan';

                                return (
                                    <div key={user.id} className={`rounded-2xl border ${selectedRole.panel} bg-slate-950/60 p-4`}>
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-base font-black text-white">{user.name}</h4>
                                                    <span className={`w-fit rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] ${selectedRole.badge}`}>
                                                        {userRole}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedUser({ ...user, role: userRole, password: '' })}
                                                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
                                                >
                                                    Detail
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingUser({ ...user, role: userRole, password: '' })}
                                                    className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteUserId(user.id)}
                                                    className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-300 transition hover:bg-rose-500/20"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {selectedUser && (() => {
                    const detailRoleLabel = selectedUser.role === 'admin' ? 'Administrator' : selectedUser.role === 'staff' ? 'Staff Operasional' : 'Pelanggan';

                    return (
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                        <div className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                                <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Detail User</p>
                                        <h3 className="mt-2 text-xl font-black text-white">{selectedUser.name}</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUser(null)}
                                        className="rounded-xl border border-slate-700 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200"
                                    >
                                        Tutup
                                    </button>
                                </div>

                                <div className="mt-5 space-y-4">
                                    <div>
                                        <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Nama Lengkap</label>
                                        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-sm font-medium text-white">
                                            {selectedUser.name}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Email</label>
                                        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2.5 text-sm font-medium text-white break-all">
                                            {selectedUser.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                                <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">Role</p>
                                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${
                                        selectedUser.role === 'admin'
                                            ? 'border-violet-500/30 bg-violet-500/10 text-violet-300'
                                            : selectedUser.role === 'staff'
                                                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                                                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                                    }`}>
                                        {selectedUser.role}
                                    </span>
                                </div>

                                <div className="mt-5 space-y-3">
                                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Akses</p>
                                        <p className="mt-2 text-sm font-bold text-white">{detailRoleLabel}</p>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status Akun</p>
                                        <p className="mt-2 text-sm font-bold text-emerald-400">Aktif &amp; Terverifikasi</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser({ ...selectedUser, password: '' })}
                                        className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-200 transition hover:border-slate-500 hover:bg-slate-700"
                                    >
                                        Update
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDeleteUserId(selectedUser.id);
                                            setSelectedUser(null);
                                        }}
                                        className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-300 transition hover:bg-rose-500/20"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    );
                })()}
            </div>

            <Modal show={Boolean(editingUser)} onClose={() => setEditingUser(null)} maxWidth="lg">
                {editingUser && (
                    <form onSubmit={submitUpdate} className="bg-slate-900 p-6 text-white">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-black text-white">Edit User</h3>
                            <button type="button" onClick={() => setEditingUser(null)} className="text-sm text-slate-400">✕</button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Nama</label>
                                <input
                                    type="text"
                                    value={editingUser.name || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Role</label>
                                <select
                                    value={editingUser.role || 'customer'}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                >
                                    <option value="customer">customer</option>
                                    <option value="staff">staff</option>
                                    <option value="admin">admin</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="mb-1 block text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Password Baru (opsional)</label>
                                <input
                                    type="password"
                                    value={editingUser.password || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                                    placeholder="Kosongkan jika tidak ingin mengubah password"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setEditingUser(null)} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                                Batal
                            </button>
                            <button type="submit" disabled={processing} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            <Modal show={Boolean(deleteUserId)} onClose={() => setDeleteUserId(null)} maxWidth="sm">
                <div className="bg-slate-900 p-6 text-white">
                    <h3 className="text-lg font-black text-white">Hapus User</h3>
                    <p className="mt-2 text-sm text-slate-300">Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak bisa dibatalkan.</p>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setDeleteUserId(null)} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                            Batal
                        </button>
                        <button type="button" onClick={deleteUser} className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
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
