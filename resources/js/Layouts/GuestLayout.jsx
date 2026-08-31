import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-rose-500 selection:text-white relative overflow-hidden">
            {/* Ambient Cinema Lighting Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-rose-600/20 via-rose-900/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/3 left-0 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Top Brand Logo */}
            <div className="flex flex-col items-center mb-8 text-center relative z-10">
                <Link href="/" className="group inline-flex items-center gap-3 hover:scale-105 transition-all duration-300">
                    <ApplicationLogo className="scale-110" />
                </Link>
            </div>

            {/* Auth Card Container */}
            <div className="w-full sm:max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl shadow-rose-950/40 p-6 sm:p-8 relative z-10">
                {title && (
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-black text-white tracking-tight">{title}</h1>
                        {subtitle && <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{subtitle}</p>}
                    </div>
                )}
                {children}
            </div>

            {/* Back to Home Link */}
            <div className="mt-8 text-center relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-rose-400 transition group"
                >
                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Katalog Film
                </Link>
            </div>
        </div>
    );
}
