import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Mail, Lock, LoaderCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const { login, loading, error } = useAuth()
    const [form, setForm] = useState({ email: '', password: '' })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleSubmit = async (e) => {
        e.preventDefault()
        try { await login(form) } catch { /* error shown via context state */ }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark bg-grid-pattern bg-[size:32px_32px] px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-glow mb-3">
                        <Rocket className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your JobTrack account</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                    {error && (
                        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="label-text">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="email" name="email" required value={form.email} onChange={handleChange}
                                   className="input-field pl-10" placeholder="you@example.com" />
                        </div>
                    </div>
                    <div>
                        <label className="label-text">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="password" name="password" required value={form.password} onChange={handleChange}
                                   className="input-field pl-10" placeholder="••••••••" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Sign in'}
                    </button>
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-600 dark:text-accent-400 font-medium hover:underline">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}