import { useEffect, useState } from 'react'
import { Briefcase, Zap, Users, Award, LoaderCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { analyticsApi } from '../api/analyticsApi'
import { applicationApi } from '../api/applicationApi'
import { eventApi } from '../api/eventApi'
import StatCard from '../components/dashboard/StatCard'
import PipelineView from '../components/dashboard/PipelineView'
import RecentApplicationsTable from '../components/dashboard/RecentApplicationsTable'
import RecentActivityFeed from '../components/dashboard/RecentActivityFeed'

export default function DashboardPage() {
    const { user } = useAuth()
    const [analytics, setAnalytics] = useState(null)
    const [recentApps, setRecentApps] = useState([])
    const [recentActivity, setRecentActivity] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadDashboard() {
            setLoading(true)
            setError(null)
            try {
                const [analyticsRes, appsRes, activityRes] = await Promise.all([
                    analyticsApi.get(),
                    applicationApi.getAll(),
                    eventApi.getRecent(6),
                ])
                setAnalytics(analyticsRes.data)
                setRecentApps(appsRes.data.slice(0, 5))
                setRecentActivity(activityRes.data)
            } catch (err) {
                setError('Could not load dashboard data. Is the backend running on port 8081?')
            } finally {
                setLoading(false)
            }
        }
        loadDashboard()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoaderCircle className="h-6 w-6 animate-spin text-brand-500" />
            </div>
        )
    }

    if (error) {
        return <div className="glass-card p-6 text-sm text-red-500 dark:text-red-400">{error}</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-semibold">Welcome back, {user?.fullName?.split(' ')[0]}</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening with your applications.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Briefcase} label="Total Applications" value={analytics.totalApplications} accent="brand" />
                <StatCard icon={Zap} label="Active Applications" value={analytics.activeApplications} accent="amber" />
                <StatCard icon={Users} label="Interviews Reached" value={analytics.interviewsReached} accent="purple" />
                <StatCard icon={Award} label="Offers Received" value={analytics.offersReached} accent="emerald" sub={`${analytics.acceptedOffers} accepted`} />
            </div>

            <PipelineView byStatus={analytics.applicationsByStatus} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentApplicationsTable applications={recentApps} />
                <RecentActivityFeed events={recentActivity} />
            </div>
        </div>
    )
}