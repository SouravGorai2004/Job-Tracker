import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import {
    LayoutDashboard,
    Briefcase,
    BarChart3,
    LogOut,
    Sun,
    Moon,
    Shield,
    ChevronDown,
} from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import Footer from './Footer'

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/applications', label: 'Applications', icon: Briefcase },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
]

export default function AppLayout() {
    const { theme, toggleTheme } = useTheme()
    const { user, logout } = useAuth()

    const isAdmin = user?.role === 'ADMIN'

    const [userMenuOpen, setUserMenuOpen] = useState(false)

    // Reference used to detect clicks outside the user dropdown
    const userMenuRef = useRef(null)

    // Close the user dropdown when clicking outside
    // or pressing the Escape key.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setUserMenuOpen(false)
            }
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setUserMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [])

    return (
        <div className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark transition-colors duration-300">

            {/* =====================================================
          HEADER
      ====================================================== */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/90 dark:bg-surface-dark/90 backdrop-blur-xl">

                <div className="max-w-7xl mx-auto px-4 sm:px-6">

                    {/* =================================================
              COMPACT HEADER ROW
          ================================================== */}
                    <div className="h-[68px] flex items-center justify-between gap-4">

                        {/* =================================================
                LEFT - BRAND
            ================================================== */}
                        <div className="flex items-center gap-3 shrink-0">

                            {/* Logo Container */}
                            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] shadow-sm dark:shadow-glow overflow-hidden">

                                {/* Subtle logo background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-accent-500/10" />

                                <img
                                    src="/assets/logo.png"
                                    alt="JobTrack"
                                    className="relative h-7 w-auto object-contain"
                                />

                            </div>

                            {/* Application Name */}
                            <div className="hidden sm:block">

                                <p className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                                    JobTrack
                                </p>

                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                                    Career made simple
                                </p>

                            </div>

                        </div>

                        {/* =================================================
                CENTER - NAVIGATION
            ================================================== */}
                        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06]">

                            {navItems.map(({ to, label, icon: Icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={({ isActive }) =>
                                        `relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-white dark:bg-white/[0.08] text-brand-600 dark:text-accent-400 shadow-sm border border-slate-200/70 dark:border-white/[0.08]'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-white/[0.04]'
                                        }`
                                    }
                                >
                                    <Icon className="h-4 w-4" />

                                    <span>
                    {label}
                  </span>
                                </NavLink>
                            ))}

                        </nav>

                        {/* =================================================
                RIGHT - THEME + USER
            ================================================== */}
                        <div className="flex items-center gap-2 shrink-0">

                            {/* =================================================
                  THEME TOGGLE
              ================================================== */}
                            <button
                                onClick={toggleTheme}
                                className="group h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.03] text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-accent-400 hover:border-brand-500/30 dark:hover:border-accent-400/20 hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-all duration-200"
                                title={
                                    theme === 'dark'
                                        ? 'Switch to light mode'
                                        : 'Switch to dark mode'
                                }
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="h-[17px] w-[17px] transition-transform duration-300 group-hover:rotate-45" />
                                ) : (
                                    <Moon className="h-[17px] w-[17px] transition-transform duration-300 group-hover:-rotate-12" />
                                )}
                            </button>

                            {/* =================================================
                  USER MENU
              ================================================== */}
                            <div
                                ref={userMenuRef}
                                className="relative"
                            >

                                {/* User Button */}
                                <button
                                    onClick={() => setUserMenuOpen((prev) => !prev)}
                                    className="group flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all duration-200"
                                    title="User menu"
                                    aria-label="Open user menu"
                                    aria-expanded={userMenuOpen}
                                >

                                    {/* Avatar */}
                                    <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:shadow-brand-500/30 transition-shadow">
                                        {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>

                                    {/* User Information */}
                                    <div className="hidden sm:block text-left max-w-[150px]">

                                        {/* User Name + Online Status */}
                                        <div className="flex items-center gap-1.5">

                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate leading-tight">
                                                {user?.fullName || 'User'}
                                            </p>

                                            {/* Blinking Online Indicator */}
                                            <span
                                                className="relative flex h-2 w-2 shrink-0"
                                                title="Online"
                                            >
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />

                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/60" />
                      </span>

                                        </div>

                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                            Stay productive
                                        </p>

                                    </div>

                                    {/* Dropdown Arrow */}
                                    <ChevronDown
                                        className={`hidden sm:block h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                            userMenuOpen ? 'rotate-180' : ''
                                        }`}
                                    />

                                </button>

                                {/* =================================================
                    USER DROPDOWN
                ================================================== */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2.5 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden z-50">

                                        {/* User Information */}
                                        <div className="p-4 border-b border-slate-200 dark:border-white/10">

                                            <div className="flex items-center gap-3">

                                                {/* Avatar */}
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center text-white font-bold shrink-0">
                                                    {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>

                                                <div className="min-w-0">

                                                    <div className="flex items-center gap-1.5">

                                                        <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                                            {user?.fullName}
                                                        </p>

                                                        {/* Online Indicator */}
                                                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />

                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </span>

                                                    </div>

                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                        {user?.email}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        {/* Dropdown Actions */}
                                        <div className="p-2">

                                            {/* Admin Panel */}
                                            {isAdmin && (
                                                <>
                                                    <NavLink
                                                        to="/admin"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className={({ isActive }) =>
                                                            `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                                                isActive
                                                                    ? 'bg-brand-600 text-white'
                                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                                                            }`
                                                        }
                                                    >
                                                        <Shield className="h-4 w-4" />

                                                        <span>
                              Admin Panel
                            </span>
                                                    </NavLink>

                                                    <div className="my-1.5 border-t border-slate-200 dark:border-white/10" />
                                                </>
                                            )}

                                            {/* Logout */}
                                            <button
                                                onClick={() => {
                                                    setUserMenuOpen(false)
                                                    logout()
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />

                                                <span>
                          Log out
                        </span>
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* =================================================
              MOBILE NAVIGATION
          ================================================== */}
                    <div className="md:hidden pb-2.5 overflow-x-auto scrollbar-hide">

                        <nav className="flex items-center gap-1 min-w-max p-1 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/[0.06]">

                            {navItems.map(({ to, label, icon: Icon }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'bg-white dark:bg-white/[0.08] text-brand-600 dark:text-accent-400 shadow-sm border border-slate-200/70 dark:border-white/[0.08]'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/[0.04]'
                                        }`
                                    }
                                >
                                    <Icon className="h-4 w-4" />

                                    <span>
                    {label}
                  </span>
                                </NavLink>
                            ))}

                        </nav>

                    </div>

                </div>

            </header>

            {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
            <main className="flex-1 overflow-y-auto">

                <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>

            </main>

            {/* =====================================================
          FOOTER
      ====================================================== */}
            <Footer />

        </div>
    )
}