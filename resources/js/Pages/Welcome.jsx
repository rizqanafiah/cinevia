import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Welcome({ auth, movies, studios, laravelVersion, phpVersion }) {
    const daftarFilm = movies?.data || movies || [];
    const daftarStudio = studios || [];

    // State tanggal terpilih (Default hari ini)
    const hariIni = new Date().toISOString().split('T')[0];
    const [tanggalTerpilih, setTanggalTerpilih] = useState(hariIni);
    const [genreTerpilih, setGenreTerpilih] = useState('Semua');
    const [kataKunci, setKataKunci] = useState('');
    const [previewFilm, setPreviewFilm] = useState(daftarFilm[0] || null);

    // Generate 7 hari ke depan untuk tab navigasi tanggal
    const daftarTanggal = useMemo(() => {
        const list = [];
        const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const iso = d.toISOString().split('T')[0];
            list.push({
                iso,
                hari: i === 0 ? 'Hari Ini' : i === 1 ? 'Besok' : namaHari[d.getDay()],
                tanggal: `${d.getDate()} ${namaBulan[d.getMonth()]}`,
            });
        }
        return list;
    }, []);

    // Ekstrak semua genre unik
    const daftarGenreUnik = useMemo(() => {
        const setG = new Set();
        daftarFilm.forEach((f) => {
            if (f.genre) {
                f.genre.split('/').forEach((g) => setG.add(g.trim()));
            }
        });
        return ['Semua', ...Array.from(setG)];
    }, [daftarFilm]);

    // Filter film berdasarkan pencarian dan genre
    const filmTersaring = useMemo(() => {
        return daftarFilm.filter((film) => {
            const cocokNama = film.title.toLowerCase().includes(kataKunci.toLowerCase()) ||
                              (film.synopsis && film.synopsis.toLowerCase().includes(kataKunci.toLowerCase()));
            const cocokGenre = genreTerpilih === 'Semua' || (film.genre && film.genre.includes(genreTerpilih));
            return cocokNama && cocokGenre;
        });
    }, [daftarFilm, kataKunci, genreTerpilih]);

    const studioKeunggulan = [
        {
            nama: 'IMAX Laser 4K',
            tagline: 'Visual Raksasa Spektakuler',
            deskripsi: 'Layar melengkung raksasa dengan proyeksi dual laser 4K murni dan sistem audio 12-channel yang menggetarkan.',
            icon: (
                <svg className="w-7 h-7 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" />
                    <line x1="7" y1="2" x2="7" y2="22" />
                    <line x1="17" y1="2" x2="17" y2="22" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <line x1="2" y1="7" x2="7" y2="7" />
                    <line x1="2" y1="17" x2="7" y2="17" />
                    <line x1="17" y1="17" x2="22" y2="17" />
                    <line x1="17" y1="7" x2="22" y2="7" />
                </svg>
            ),
            warna: 'from-blue-600/20 to-cyan-500/10 border-cyan-500/30 text-cyan-400',
        },
        {
            nama: 'Dolby Atmos 3D',
            tagline: 'Suara Spasial 360 Derajat',
            deskripsi: 'Nikmati audio surround multidimensi yang bergerak bebas di sekeliling Anda hingga ke atas kepala dengan kejernihan maksimal.',
            icon: (
                <svg className="w-7 h-7 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
            ),
            warna: 'from-amber-600/20 to-yellow-500/10 border-amber-500/30 text-amber-400',
        },
        {
            nama: 'Premiere Lounge VIP',
            tagline: 'Kenyamanan Mewah Eksklusif',
            deskripsi: 'Kursi motorized leather recliner kelas satu, selimut premium, tombol pelayan pribadi, dan antrean eksklusif.',
            icon: (
                <svg className="w-7 h-7 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14v2H5z" />
                </svg>
            ),
            warna: 'from-rose-600/20 to-purple-500/10 border-rose-500/30 text-rose-400',
        },
    ];

    const langkahPemesanan = [
        {
            no: '01',
            judul: 'Pilih Film & Jadwal',
            ket: 'Jelajahi film box office terkini, pilih studio dan waktu tayang yang pas dengan agenda Anda.',
            icon: (
                <svg className="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    <path d="M13 5v2" />
                    <path d="M13 17v2" />
                    <path d="M13 11v2" />
                </svg>
            ),
        },
        {
            no: '02',
            judul: 'Pilih Kursi Favorit',
            ket: 'Lihat denah studio interaktif dan tentukan posisi tempat duduk terbaik untuk pengalaman menonton maksimal.',
            icon: (
                <svg className="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                    <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
                    <path d="M5 18v2" />
                    <path d="M19 18v2" />
                </svg>
            ),
        },
        {
            no: '03',
            judul: 'Bayar & Upload Bukti',
            ket: 'Transfer ke rekening resmi bioskop dan unggah foto bukti transfer dalam 30 menit secara aman.',
            icon: (
                <svg className="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
            ),
        },
        {
            no: '04',
            judul: 'Dapatkan E-Ticket QR',
            ket: 'Petugas memverifikasi pembayaran dan e-ticket resmi dengan QR Code langsung siap diunduh.',
            icon: (
                <svg className="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
            ),
        },
    ];

    return (
        <>
            <Head title="Cinevia — Pengalaman Menonton Bioskop Kelas Dunia" />

            <div className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col justify-between selection:bg-rose-500 selection:text-white font-sans">
                {/* ─── NAVBAR ─────────────────────────────────────────────── */}
                <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                        {/* Brand Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <ApplicationLogo />
                        </Link>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
                            <a href="#sedang-tayang" className="hover:text-rose-400 transition">Sedang Tayang</a>
                            <a href="#jadwal" className="hover:text-rose-400 transition">Jadwal & Tiket</a>
                            <a href="#pengalaman-studio" className="hover:text-rose-400 transition">Studio Eksklusif</a>
                            <a href="#cara-booking" className="hover:text-rose-400 transition">Panduan Booking</a>
                        </nav>

                        {/* Auth Buttons */}
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <div className="flex items-center gap-3">
                                    <span className="hidden sm:inline text-xs text-slate-400 font-medium">
                                        Halo, <strong className="text-white font-semibold">{auth.user.name}</strong>
                                    </span>
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-rose-400 active:scale-95 transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl transition"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-95 rounded-xl shadow-lg shadow-rose-600/30 transition"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* ─── HERO SPOTLIGHT SECTION ─────────────────────────────── */}
                <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                    {/* Glowing Backdrops */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-rose-600/20 via-rose-900/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                        {previewFilm && (
                            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl shadow-rose-950/30 grid grid-cols-1 lg:grid-cols-12 items-center">
                                {/* Film Backdrop Poster */}
                                <div className="lg:col-span-5 relative h-80 lg:h-[480px] overflow-hidden group">
                                    <img
                                        src={previewFilm.poster_path || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80'}
                                        alt={previewFilm.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 filter brightness-90 contrast-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900"></div>

                                    {/* Age Rating Badge */}
                                    <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <span className="px-3 py-1 text-xs font-black rounded-lg bg-rose-600 text-white shadow-lg shadow-rose-600/40">
                                            {previewFilm.age_rating || 'SU'}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700">
                                            <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            <span>{previewFilm.duration_minutes} Menit</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Film Details */}
                                <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-1 text-[11px] font-black uppercase tracking-widest bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full">
                                            Spotlight Film Hari Ini
                                        </span>
                                        <span className="text-xs font-semibold text-slate-400">
                                            Genre: <strong className="text-slate-200">{previewFilm.genre}</strong>
                                        </span>
                                    </div>

                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                                        {previewFilm.title}
                                    </h1>

                                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-3">
                                        {previewFilm.synopsis || 'Pengalaman sinematik visual terbaik menanti Anda di studio bioskop Cinevia.'}
                                    </p>

                                    {/* Studio Tags Available */}
                                    <div className="pt-2 flex flex-wrap gap-2 items-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Format Studio:</span>
                                        {daftarStudio.map((st) => (
                                            <span key={st.id} className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                                                {st.name}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTAs */}
                                    <div className="pt-4 flex flex-wrap items-center gap-4">
                                        <a
                                            href="#jadwal"
                                            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-95 text-white font-black text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2 transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                            </svg>
                                            Pesan Tiket Sekarang
                                        </a>
                                        <a
                                            href="#sedang-tayang"
                                            className="px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-sm border border-slate-700 transition"
                                        >
                                            Jelajahi Film Lainnya
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* ─── DATE SELECTOR BAR & QUICK SEARCH ───────────────────── */}
                <section id="jadwal" className="py-6 bg-slate-900 border-y border-slate-800 sticky top-20 z-40 backdrop-blur-md bg-slate-900/95">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                            {/* Date Pills */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
                                {daftarTanggal.map((item) => {
                                    const aktif = item.iso === tanggalTerpilih;
                                    return (
                                        <button
                                            key={item.iso}
                                            onClick={() => setTanggalTerpilih(item.iso)}
                                            className={`px-4 py-2 rounded-xl text-left transition shrink-0 border ${
                                                aktif
                                                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30'
                                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="text-[10px] font-bold uppercase tracking-wider">{item.hari}</div>
                                            <div className="text-xs font-black">{item.tanggal}</div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Search & Genre Filters */}
                            <div className="flex items-center gap-3">
                                {/* Search input */}
                                <div className="relative flex-1 sm:w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={kataKunci}
                                        onChange={(e) => setKataKunci(e.target.value)}
                                        placeholder="Cari judul film..."
                                        className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                                    />
                                </div>

                                {/* Genre Selector */}
                                <select
                                    value={genreTerpilih}
                                    onChange={(e) => setGenreTerpilih(e.target.value)}
                                    className="py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                                >
                                    {daftarGenreUnik.map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── NOW SHOWING CATALOG SECTION ────────────────────────── */}
                <section id="sedang-tayang" className="py-16 bg-slate-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-2">
                            <div>
                                <span className="text-rose-500 text-xs font-black tracking-widest uppercase">
                                    Box Office & Jadwal Tayang
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                                    Film Sedang Tayang di Cinevia
                                </h2>
                            </div>
                            <p className="text-xs text-slate-400">
                                Menampilkan {filmTersaring.length} film tersedia
                            </p>
                        </div>

                        {filmTersaring.length === 0 ? (
                            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
                                <div className="flex justify-center mb-3">
                                    <svg className="w-10 h-10 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="2" y="2" width="20" height="20" rx="2.18" />
                                        <line x1="7" y1="2" x2="7" y2="22" />
                                        <line x1="17" y1="2" x2="17" y2="22" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-white">Tidak ada film ditemukan</h3>
                                <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci atau genre filter yang berbeda.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filmTersaring.map((film) => (
                                    <div
                                        key={film.id}
                                        className="group bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-3xl overflow-hidden shadow-xl shadow-slate-950/50 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div>
                                            {/* Poster Image */}
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={film.poster_path || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80'}
                                                    alt={film.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                                                {/* Age Rating Pill */}
                                                <div className="absolute top-3 left-3">
                                                    <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-rose-600 text-white shadow-md">
                                                        {film.age_rating || 'SU'}
                                                    </span>
                                                </div>

                                                {/* Duration */}
                                                <div className="absolute top-3 right-3">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700">
                                                        <svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                        <span>{film.duration_minutes}m</span>
                                                    </span>
                                                </div>

                                                {/* Quick Spotlight Switch */}
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewFilm(film)}
                                                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-rose-600 text-[11px] font-bold text-white border border-slate-700 transition flex items-center gap-1 opacity-0 group-hover:opacity-100"
                                                >
                                                    <span>Spotlight</span>
                                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Film Meta Content */}
                                            <div className="p-6">
                                                <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1">
                                                    {film.genre}
                                                </div>
                                                <h3 className="text-lg font-black text-white group-hover:text-rose-400 transition mb-2">
                                                    {film.title}
                                                </h3>
                                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                                                    {film.synopsis || 'Nikmati sensasi menonton film bioskop terbaik dengan kualitas audio visual terdepan.'}
                                                </p>

                                                {/* Available Showtimes on Selected Date */}
                                                <div className="pt-3 border-t border-slate-800/80">
                                                    <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center justify-between">
                                                        <span>Jadwal Tayang:</span>
                                                        <span className="text-[10px] text-rose-400">Pilih Jam & Kursi</span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {film.showtimes && film.showtimes.length > 0 ? (
                                                            film.showtimes
                                                                .filter((s) => s.show_date === tanggalTerpilih || !s.show_date)
                                                                .map((st) => (
                                                                    <Link
                                                                        key={st.id}
                                                                        href={route('showtimes.seats', st.id)}
                                                                        className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-rose-500 hover:bg-rose-600 text-slate-200 hover:text-white transition group/btn flex flex-col items-center"
                                                                    >
                                                                        <span className="text-xs font-black font-mono">
                                                                            {st.start_time || '15:00'}
                                                                        </span>
                                                                        <span className="text-[9px] text-slate-400 group-hover/btn:text-rose-100">
                                                                            {st.studio?.name ? st.studio.name.split(' ')[0] : 'Studio'}
                                                                        </span>
                                                                    </Link>
                                                                ))
                                                        ) : (
                                                            <div className="text-xs text-slate-500 py-1">
                                                                Jadwal tayang akan segera dibuka.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 pt-0">
                                            <Link
                                                href={route('movies.show', film.id)}
                                                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                                            >
                                                <span>Lihat Detail & Jadwal Lengkap</span>
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ─── PENGALAMAN STUDIO SECTION ──────────────────────────── */}
                <section id="pengalaman-studio" className="py-20 bg-slate-900 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <span className="text-rose-500 text-xs font-black tracking-widest uppercase">
                                Format & Teknologi Studio
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                                Pengalaman Sinematik Tingkat Lanjut
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                                Setiap ruang bioskop di Cinevia dirancang dengan standar akustik dan visual tertinggi di industri perfilman internasional.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {studioKeunggulan.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`rounded-3xl p-8 bg-gradient-to-b ${item.warna} border shadow-xl backdrop-blur-sm flex flex-col justify-between`}
                                >
                                    <div>
                                        <div className="mb-4">{item.icon}</div>
                                        <h3 className="text-xl font-black text-white mb-1">
                                            {item.nama}
                                        </h3>
                                        <div className="text-xs font-bold text-rose-400 mb-3 uppercase tracking-wider">
                                            {item.tagline}
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {item.deskripsi}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
                                        <span>Kapasitas Studio</span>
                                        <span className="text-white font-black">30 - 50 Kursi</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── 4 LANGKAH RESERVASI SECTION ────────────────────────── */}
                <section id="cara-booking" className="py-20 bg-slate-950 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <span className="text-rose-500 text-xs font-black tracking-widest uppercase">
                                Alur Pemesanan
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                                4 Langkah Mudah Booking Tiket
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-2">
                                Tanpa antre di loket bioskop, pesan kursi favorit Anda langsung dari genggaman.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {langkahPemesanan.map((item, idx) => (
                                <div key={idx} className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                                {item.icon}
                                            </div>
                                            <span className="text-3xl font-black font-mono text-rose-500/30">
                                                {item.no}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-black text-white mb-2">
                                            {item.judul}
                                        </h3>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            {item.ket}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ─── CTA BANNER SECTION ─────────────────────────────────── */}
                <section className="py-16 bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-t border-slate-800 relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div>
                            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-full">
                                Siap Menonton?
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
                                Amankan Kursi Terbaik Anda Hari Ini
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                                Dapatkan tiket resmi film box office dengan verifikasi cepat dan e-ticket QR Code instan.
                            </p>
                        </div>
                        <a
                            href="#sedang-tayang"
                            className="px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-95 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-600/40 transition shrink-0"
                        >
                            Pilih Film & Jadwal
                        </a>
                    </div>
                </section>

                {/* ─── FOOTER ─────────────────────────────────────────────── */}
                <footer className="bg-slate-950 text-slate-500 text-xs py-12 border-t border-slate-800/80">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800/80">
                            <div className="md:col-span-5 space-y-3">
                                <ApplicationLogo />
                                <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                                    Platform pemesanan tiket bioskop modern berbasis Laravel 13, Inertia, dan React.js. Menyajikan kemudahan reservasi, pemilihan kursi studio, dan e-ticket resmi.
                                </p>
                            </div>

                            <div className="md:col-span-3 space-y-2">
                                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Navigasi</h4>
                                <ul className="space-y-2">
                                    <li><a href="#sedang-tayang" className="hover:text-rose-400 transition">Film Sedang Tayang</a></li>
                                    <li><a href="#jadwal" className="hover:text-rose-400 transition">Jadwal Bioskop</a></li>
                                    <li><a href="#pengalaman-studio" className="hover:text-rose-400 transition">Studio & Fasilitas</a></li>
                                    <li><a href="#cara-booking" className="hover:text-rose-400 transition">Panduan Pemesanan</a></li>
                                </ul>
                            </div>

                            <div className="md:col-span-4 space-y-2">
                                <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">Informasi Sistem</h4>
                                <p className="text-slate-400">
                                    Laravel v{laravelVersion} · PHP v{phpVersion}
                                </p>
                                <p className="text-slate-500 text-[11px] leading-relaxed">
                                    Sistem dilengkapi RBAC 3-Role (Customer, Staff, Admin), Auto-Cancel Booking 30 Menit, dan QR Code E-Ticket DomPDF.
                                </p>
                            </div>
                        </div>

                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
                            <div>
                                &copy; {new Date().getFullYear()} Cinevia Cinema. Hak Cipta Dilindungi Undang-Undang.
                            </div>
                            <div className="flex gap-6 text-[11px]">
                                <span>Bioskop Digital Indonesia</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
