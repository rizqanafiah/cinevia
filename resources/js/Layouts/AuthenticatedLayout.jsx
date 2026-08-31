import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

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
    const roleBadge = isAdmin ? 'Admin' : isStaff ? 'Staff' : 'Customer';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white font-sans">
            {/* Top Navigation */}
            <nav className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="shrink-0 flex items-center">
                                <ApplicationLogo />
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden space-x-2 sm:flex items-center">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                        route().current('dashboard')
                                            ? 'bg-rose-600/10 text-rose-400 border border-rose-500/30'
                                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                    }`}
                                >
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    href={route('home')}
                                    active={route().current('home')}
                                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                                >
                                    Katalog Film
                                </NavLink>

                                {isCustomer && (
                                    <NavLink
                                        href={route('bookings.index')}
                                        active={route().current('bookings.*')}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                            route().current('bookings.*')
                                                ? 'bg-rose-600/10 text-rose-400 border border-rose-500/30'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                        }`}
                                    >
                                        Tiket Saya
                                    </NavLink>
                                )}

                                {(isStaff || isAdmin) && (
                                    <>
                                        <NavLink
                                            href={route('staff.payments.index')}
                                            active={route().current('staff.payments.*')}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                                route().current('staff.payments.*')
                                                    ? 'bg-amber-600/10 text-amber-400 border border-amber-500/30'
                                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                            }`}
                                        >
                                            Verifikasi Pembayaran
                                        </NavLink>
                                        <NavLink
                                            href={route('staff.reports.index')}
                                            active={route().current('staff.reports.*')}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                                route().current('staff.reports.*')
                                                    ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/30'
                                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                            }`}
                                        >
                                            Laporan Penjualan
                                        </NavLink>
                                    </>
                                )}

                                {isAdmin && (
                                    <>
                                        <NavLink
                                            href={route('admin.users.index')}
                                            active={route().current('admin.users.*')}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                                route().current('admin.users.*')
                                                    ? 'bg-violet-600/10 text-violet-400 border border-violet-500/30'
                                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                            }`}
                                        >
                                            Kelola User
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.movies.index')}
                                            active={route().current('admin.movies.*')}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                                route().current('admin.movies.*')
                                                    ? 'bg-rose-600/10 text-rose-400 border border-rose-500/30'
                                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                            }`}
                                        >
                                            Kelola Film
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.studios.index')}
                                            active={route().current('admin.studios.*')}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                                route().current('admin.studios.*')
                                                    ? 'bg-rose-600/10 text-rose-400 border border-rose-500/30'
                                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                            }`}
                                        >
                                            Studio
                                        </NavLink>
                                        <NavLink
                                            href={route('admin.showtimes.index')}
                                            active={route().current('admin.showtimes.*')}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                                                route().current('admin.showtimes.*')
                                                    ? 'bg-rose-600/10 text-rose-400 border border-rose-500/30'
                                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                            }`}
                                        >
                                            Jadwal Tayang
                                        </NavLink>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* User Menu Dropdown */}
                        <div className="hidden sm:flex sm:items-center">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 border border-slate-700/60 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                                        >
                                            <span>{user.name}</span>
                                            <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-md bg-rose-600 text-white">
                                                {roleBadge}
                                            </span>
                                            <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses="py-1 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl">
                                        <div className="px-4 py-2 border-b border-slate-800">
                                            <p className="text-xs font-bold text-white">{user.name}</p>
                                            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                                        </div>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="text-xs text-slate-300 hover:bg-slate-800 hover:text-rose-400"
                                        >
                                            Pengaturan Profil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300"
                                        >
                                            Keluar Akun
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-2'}>
                    <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                        Dashboard
                    </ResponsiveNavLink>
                    <ResponsiveNavLink href={route('home')}>
                        Katalog Film
                    </ResponsiveNavLink>
                    {isCustomer && (
                        <ResponsiveNavLink href={route('bookings.index')} active={route().current('bookings.*')}>
                            Tiket Saya
                        </ResponsiveNavLink>
                    )}
                    {(isStaff || isAdmin) && (
                        <>
                            <ResponsiveNavLink href={route('staff.payments.index')} active={route().current('staff.payments.*')}>
                                Verifikasi Pembayaran
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('staff.reports.index')} active={route().current('staff.reports.*')}>
                                Laporan Penjualan
                            </ResponsiveNavLink>
                        </>
                    )}
                    {isAdmin && (
                        <>
                            <ResponsiveNavLink href={route('admin.users.index')} active={route().current('admin.users.*')}>
                                Kelola User
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('admin.movies.index')} active={route().current('admin.movies.*')}>
                                Kelola Film
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('admin.studios.index')} active={route().current('admin.studios.*')}>
                                Kelola Studio
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('admin.showtimes.index')} active={route().current('admin.showtimes.*')}>
                                Jadwal Tayang
                            </ResponsiveNavLink>
                        </>
                    )}

                    <div className="border-t border-slate-800 pt-3 mt-3">
                        <div className="text-xs font-bold text-white">{user.name}</div>
                        <div className="text-[11px] text-slate-400 mb-2">{user.email}</div>
                        <ResponsiveNavLink href={route('profile.edit')}>
                            Pengaturan Profil
                        </ResponsiveNavLink>
                        <ResponsiveNavLink method="post" href={route('logout')} as="button">
                            Keluar Akun
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-slate-800/60 bg-slate-900/40">
                    <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="py-8">{children}</main>
        </div>
    );
}
