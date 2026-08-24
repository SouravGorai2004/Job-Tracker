import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Mail, Lock, User, LoaderCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
    const { register, loading, error } = useAuth()
    const [form, setForm] = useState({ fullName: '', email: '', password: '' })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleSubmit = async (e) => {
        e.preventDefault()
        try { await register(form) } catch { /* error shown via context state */ }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark bg-grid-pattern bg-[size:32px_32px] px-4">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center shadow-glow mb-3">
                        <Rocket className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="font-display text-2xl font-semibold">Create your account</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Start tracking your applications automatically</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
                    {error && (
                        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="label-text">Full name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="text" name="fullName" required value={form.fullName} onChange={handleChange}
                                   className="input-field pl-10" placeholder="Jane Doe" />
                        </div>
                    </div>
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
                            <input type="password" name="password" required minLength={8} value={form.password} onChange={handleChange}
                                   className="input-field pl-10" placeholder="At least 8 characters" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Create account'}
                    </button>
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-600 dark:text-accent-400 font-medium hover:underline">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}