import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const user = usePage().props.auth.user;
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const rolePriority = ['admin', 'staff', 'customer'];
    const primaryRole = [...roles].sort((a, b) => {
        const aIndex = rolePriority.indexOf(String(a).toLowerCase());
        const bIndex = rolePriority.indexOf(String(b).toLowerCase());
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
    })[0] || 'customer';
    const isAdmin = primaryRole === 'admin';
    const isStaff = primaryRole === 'staff';
    const isCustomer = primaryRole === 'customer';
    const roleLabel = isAdmin ? 'Admin' : isStaff ? 'Staff' : 'Customer';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h2 className="text-xl font-black leading-tight text-white flex items-center gap-2.5">
                            <span>{isStaff ? 'Dashboard Staff' : isAdmin ? 'Dashboard Admin' : 'Dashboard Pelanggan'}</span>
                            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30">
                                {roleLabel}
                            </span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            {isStaff
                                ? 'Kelola pemesanan, verifikasi pembayaran, dan operasional bioskop Cinevia.'
                                : isAdmin
                                ? 'Selamat datang kembali di panel administrasi Cinevia.'
                                : 'Selamat datang kembali di panel reservasi bioskop Cinevia.'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={isStaff ? route('staff.payments.index') : route('home')}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-95 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="2" width="20" height="20" rx="2.18" />
                                <line x1="7" y1="2" x2="7" y2="22" />
                                <line x1="17" y1="2" x2="17" y2="22" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                            </svg>
                            <span>{isStaff ? 'Verifikasi Pembayaran' : 'Pesan Tiket Film'}</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard — Cinevia" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Welcome Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white">
                                Halo, <span className="text-rose-400">{user.name}</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                                {isAdmin
                                    ? 'Anda memiliki akses penuh untuk mengelola master data film, studio, kursi, jadwal tayang, dan verifikasi tiket.'
                                    : isStaff
                                    ? 'Pantau transaksi, verifikasi pembayaran pelanggan, dan kelola operasional bioskop dengan mudah.'
                                    : 'Cari jadwal film bioskop terbaru, pilih kursi, dan pesan tiket dengan mudah.'}
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[120px]">
                                <div className="text-[10px] uppercase font-bold text-slate-400">
                                    {isAdmin ? 'Akun Admin' : isStaff ? 'Akun Staff' : 'Akun Pelanggan'}
                                </div>
                                <div className="text-xs font-black text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    <span>Aktif Terverifikasi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Stat 1: Total Pemesanan */}
                    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                {isCustomer ? 'Total Tiket Saya' : isStaff ? 'Total Pemesanan' : 'Total Transaksi User'}
                            </p>
                            <p className="text-2xl font-black text-white mt-1">
                                {stats?.totalBooking ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                                <path d="M13 5v2" />
                                <path d="M13 17v2" />
                                <path d="M13 11v2" />
                            </svg>
                        </div>
                    </div>

                    {/* Stat 2: Pemesanan Aktif */}
                    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                {isStaff ? 'Pemesanan Aktif' : 'Pemesanan Aktif'}
                            </p>
                            <p className="text-2xl font-black text-white mt-1">
                                {stats?.bookingAktif ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                    </div>

                    {/* Stat 3: Film Tayang */}
                    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                {isStaff ? 'Film Tayang' : 'Film Tayang'}
                            </p>
                            <p className="text-2xl font-black text-white mt-1">
                                {stats?.totalFilm ?? 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="2" width="20" height="20" rx="2.18" />
                                <line x1="7" y1="2" x2="7" y2="22" />
                                <line x1="17" y1="2" x2="17" y2="22" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                            </svg>
                        </div>
                    </div>

                    {/* Stat 4: Menunggu Verifikasi / Studio */}
                    {(isStaff || isAdmin) ? (
                        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    {isStaff ? 'Menunggu Verifikasi' : 'Menunggu Verifikasi'}
                                </p>
                                <p className="text-2xl font-black text-amber-400 mt-1">
                                    {stats?.pembayaranPending ?? 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex items-center justify-between">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    Studio Bioskop
                                </p>
                                <p className="text-2xl font-black text-white mt-1">
                                    {stats?.totalStudio ?? 3}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                                    <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions Navigation Section */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                        Menu & Pintasan Cepat
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {/* Action 1: Katalog Film */}
                        <Link
                            href={route('home')}
                            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition flex flex-col justify-between group shadow-lg"
                        >
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition duration-200">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="2" width="20" height="20" rx="2.18" />
                                        <line x1="7" y1="2" x2="7" y2="22" />
                                        <line x1="17" y1="2" x2="17" y2="22" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                    </svg>
                                </div>
                                <h5 className="text-base font-black text-white group-hover:text-rose-400 transition">
                                    Katalog Film & Jadwal
                                </h5>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {isStaff
                                        ? 'Cek jadwal tayang terbaru dan diskusikan status pemesanan dengan tim layanan.'
                                        : 'Lihat film yang sedang tayang, pilih jam tayang, dan pesan kursi studio favorit Anda.'}
                                </p>
                            </div>
                            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-rose-400">
                                <span>Buka Katalog</span>
                                <span>&rarr;</span>
                            </div>
                        </Link>

                        {/* Action 2: Customer ticket history / Staff verification */}
                        {isCustomer ? (
                            <Link
                                href={route('bookings.index')}
                                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col justify-between group shadow-lg"
                            >
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-200">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                                            <path d="M13 5v2" />
                                            <path d="M13 17v2" />
                                        </svg>
                                    </div>
                                    <h5 className="text-base font-black text-white group-hover:text-emerald-400 transition">
                                        Tiket Saya
                                    </h5>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Cek status pemesanan, unggah bukti pembayaran, dan akses tiket PDF Anda dengan cepat.
                                    </p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
                                    <span>Lihat Tiket Saya</span>
                                    <span>&rarr;</span>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                href={route('staff.payments.index')}
                                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 transition flex flex-col justify-between group shadow-lg"
                            >
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition duration-200">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="5" width="20" height="14" rx="2" />
                                            <line x1="2" y1="10" x2="22" y2="10" />
                                        </svg>
                                    </div>
                                    <h5 className="text-base font-black text-white group-hover:text-amber-400 transition">
                                        Verifikasi Pembayaran
                                    </h5>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Periksa bukti pembayaran pelanggan dan konfirmasi transaksi untuk menerbitkan e-ticket.
                                    </p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-amber-400">
                                    <span>Buka Verifikasi</span>
                                    <span>&rarr;</span>
                                </div>
                            </Link>
                        )}

                        {(isStaff || isAdmin) && (
                            <Link
                                href={route('staff.reports.index')}
                                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition flex flex-col justify-between group shadow-lg"
                            >
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-200">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M6 20V10" />
                                            <path d="M12 20V4" />
                                            <path d="M18 20v-8" />
                                        </svg>
                                    </div>
                                    <h5 className="text-base font-black text-white group-hover:text-emerald-400 transition">
                                        Laporan Penjualan
                                    </h5>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Ringkas transaksi terverifikasi, total pendapatan, dan ekspor laporan ke format PDF.
                                    </p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
                                    <span>Lihat Laporan</span>
                                    <span>&rarr;</span>
                                </div>
                            </Link>
                        )}

                        {/* Action 3: Profile / Admin Master */}
                        {isAdmin ? (
                            <Link
                                href={route('admin.movies.index')}
                                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900 transition flex flex-col justify-between group shadow-lg"
                            >
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition duration-200">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 20h9" />
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                    </div>
                                    <h5 className="text-base font-black text-white group-hover:text-purple-400 transition">
                                        Kelola Master Film
                                    </h5>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Tambah film baru, atur poster, genre, jadwal tayang, dan kapasitas studio.
                                    </p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400">
                                    <span>Kelola Film</span>
                                    <span>&rarr;</span>
                                </div>
                            </Link>
                        ) : (
                            <Link
                                href={route('profile.edit')}
                                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition flex flex-col justify-between group shadow-lg"
                            >
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition duration-200">
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                    <h5 className="text-base font-black text-white group-hover:text-cyan-400 transition">
                                        {isStaff ? 'Profil Petugas' : 'Profil Saya'}
                                    </h5>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        {isStaff
                                            ? 'Periksa data akun Anda dan jaga akses verifikasi pembayaran tetap aman dan akurat.'
                                            : 'Perbarui data akun Anda agar checkout, reservasi, dan tiket tetap terhubung dengan profil yang valid.'}
                                    </p>
                                </div>
                                <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-400">
                                    <span>{isStaff ? 'Lihat Profil' : 'Kelola Profil'}</span>
                                    <span>&rarr;</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
