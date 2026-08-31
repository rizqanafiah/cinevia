import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Validasi Password Real-Time Indicator
    const validasiPanjang = data.password.length >= 8;
    const validasiHurufKecil = /[a-z]/.test(data.password);
    const validasiHurufBesar = /[A-Z]/.test(data.password);
    const validasiAngkaAtauSimbol = /[0-9!@#$%^&*]/.test(data.password);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            title="Daftar Akun Baru"
            subtitle="Buat akun Cinevia untuk kemudahan booking tiket & memilih kursi bioskop impian"
        >
            <Head title="Daftar — Cinevia" />

            <form onSubmit={submit} className="space-y-4">
                {/* Nama Lengkap */}
                <div>
                    <label htmlFor="name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Nama Lengkap
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={data.name}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                            placeholder="Nama Lengkap Anda"
                            autoComplete="name"
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.name} className="mt-1.5" />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Alamat Email
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                            placeholder="nama@email.com"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                {/* Password Input with Visibility Toggle */}
                <div>
                    <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Kata Sandi
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="w-full pl-10 pr-11 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                            placeholder="Minimal 8 karakter"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none transition"
                            title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                            {showPassword ? (
                                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Password Strength Checklist Indicator */}
                    {data.password.length > 0 && (
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                Indikator Kekuatan Sandi:
                            </div>
                            <div className="grid grid-cols-2 gap-1.5 text-xs">
                                <div className={`flex items-center gap-1.5 transition ${validasiPanjang ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${validasiPanjang ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                                    <span>Min. 8 Karakter</span>
                                </div>
                                <div className={`flex items-center gap-1.5 transition ${validasiHurufKecil ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${validasiHurufKecil ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                                    <span>Huruf Kecil (a-z)</span>
                                </div>
                                <div className={`flex items-center gap-1.5 transition ${validasiHurufBesar ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${validasiHurufBesar ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                                    <span>Huruf Besar (A-Z)</span>
                                </div>
                                <div className={`flex items-center gap-1.5 transition ${validasiAngkaAtauSimbol ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${validasiAngkaAtauSimbol ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                                    <span>Angka/Simbol</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                {/* Konfirmasi Password */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                            <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full pl-10 pr-11 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:bg-slate-950 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                            placeholder="Ulangi kata sandi"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 focus:outline-none transition"
                            title={showConfirmPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                            {showConfirmPassword ? (
                                <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 px-4 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {processing ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                                <span>Mendaftarkan Akun...</span>
                            </>
                        ) : (
                            <span>Buat Akun Sekarang</span>
                        )}
                    </button>
                </div>

                {/* Switch to Login */}
                <div className="pt-4 border-t border-slate-800 text-center">
                    <p className="text-xs text-slate-400">
                        Sudah memiliki akun Cinevia?{' '}
                        <Link
                            href={route('login')}
                            className="font-bold text-rose-400 hover:text-rose-300 hover:underline transition"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
