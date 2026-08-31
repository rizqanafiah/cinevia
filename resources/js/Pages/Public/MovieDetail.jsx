import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function MovieDetail({ movie, selectedDate }) {
    const data = movie?.data || movie || {};
    const showtimes = data.showtimes || [];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-white">{data.title}</h2>
                        <p className="mt-1 text-xs text-slate-400">Tanggal: {selectedDate}</p>
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
            <Head title={data.title} />

            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
                    <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                        <div className="bg-slate-950/60 p-5">
                            <img
                                src={data.poster_path || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80'}
                                alt={data.title}
                                className="h-full min-h-[300px] w-full rounded-2xl object-cover"
                            />
                        </div>

                        <div className="p-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 text-[10px] font-black uppercase text-rose-300">
                                    {data.age_rating || 'SU'}
                                </span>
                                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-300">
                                    {data.genre || 'Drama'}
                                </span>
                                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-slate-300">
                                    {data.duration_minutes || 0} Menit
                                </span>
                            </div>

                            <h3 className="mt-5 text-2xl font-black text-white">Sinopsis</h3>
                            <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                {data.synopsis || 'Film dengan pengalaman menonton yang seru dan memukau.'}
                            </p>

                            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Jadwal Tayang</p>
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {showtimes.length > 0 ? (
                                        showtimes.map((st) => (
                                            <Link
                                                key={st.id}
                                                href={route('showtimes.seats', st.id)}
                                                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-black text-slate-200 transition hover:border-rose-500 hover:text-white"
                                            >
                                                {st.start_time} - {st.studio?.name || 'Studio'}
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-400">Belum ada jadwal untuk tanggal ini.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
