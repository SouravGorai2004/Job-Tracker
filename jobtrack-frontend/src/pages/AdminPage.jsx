import { useEffect, useState } from 'react'
import { Users, Briefcase, MessageSquare, Heart, LoaderCircle } from 'lucide-react'
import { adminApi } from '../api/adminApi'
import { feedbackApi } from '../api/feedbackApi'
import { loveApi } from '../api/loveApi'

const StatCard = ({ icon: Icon, label, value }) => (
    <div className="glass-card p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
                <p className="text-3xl font-display font-semibold mt-2">{value}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center">
                <Icon className="h-6 w-6 text-white" />
            </div>
        </div>
    </div>
)

export default function AdminPage() {
    const [stats, setStats] = useState(null)
    const [feedback, setFeedback] = useState([])
    const [love, setLove] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const [statsRes, feedbackRes, loveRes] = await Promise.all([
                    adminApi.getStats(),
                    feedbackApi.getAll(),
                    loveApi.getAll(),
                ])
                setStats(statsRes.data)
                setFeedback(feedbackRes.data || [])
                setLove(loveRes.data || [])
            } catch (err) {
                console.error('Admin load error:', err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) {
        return <div className="flex items-center justify-center h-96"><LoaderCircle className="h-6 w-6 animate-spin text-brand-500" /></div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">System overview and management</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} />
                <StatCard icon={Briefcase} label="Total Applications" value={stats?.totalApplications || 0} />
                <StatCard icon={MessageSquare} label="Feedback Messages" value={stats?.totalFeedback || 0} />
                <StatCard icon={Heart} label="❤️ Love Received" value={stats?.totalLove || 0} />
            </div>

            <div className="flex gap-2 mb-4">
                {['overview', 'feedback', 'love'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab
                                ? 'bg-brand-600 text-white'
                                : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="glass-card p-6">
                {activeTab === 'overview' && (
                    <div>
                        <h2 className="font-display text-lg font-semibold mb-4">Welcome to Admin Panel</h2>
                        <div className="space-y-3">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Total Users: <span className="font-semibold">{stats?.totalUsers || 0}</span>
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Total Applications: <span className="font-semibold">{stats?.totalApplications || 0}</span>
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Total Feedback Messages: <span className="font-semibold">{stats?.totalFeedback || 0}</span>
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Total Love Received: <span className="font-semibold">{stats?.totalLove || 0} ❤️</span>
                            </p>
                        </div>
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div>
                        <h2 className="font-display text-lg font-semibold mb-4">User Feedback</h2>
                        {feedback.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">No feedback yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {feedback.map((item) => (
                                    <div key={item.id} className="border-b border-slate-200 dark:border-white/10 pb-3 last:border-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-sm">{item.userName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.userEmail}</p>
                                            </div>
                                            <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'love' && (
                    <div>
                        <h2 className="font-display text-lg font-semibold mb-4">❤️ Love Messages</h2>
                        {love.length === 0 ? (
                            <p className="text-sm text-slate-500 dark:text-slate-400">No love messages yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {love.map((item) => (
                                    <div key={item.id} className="border-b border-slate-200 dark:border-white/10 pb-3 last:border-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-sm text-red-600 dark:text-red-400">{item.userName}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.userEmail}</p>
                                            </div>
                                            <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">❤️ {item.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}