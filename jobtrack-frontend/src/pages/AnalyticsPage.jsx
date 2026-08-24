import { useEffect, useState } from 'react'
import { TrendingUp, Users, Award, LoaderCircle } from 'lucide-react'
import { analyticsApi } from '../api/analyticsApi'
import RateCard from '../components/analytics/RateCard'
import OverTimeChart from '../components/analytics/OverTimeChart'
import StatusBreakdownChart from '../components/analytics/StatusBreakdownChart'
import PortalBreakdownChart from '../components/analytics/PortalBreakdownChart'

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function load() {
            setLoading(true)
            setError(null)
            try {
                const { data } = await analyticsApi.get()
                setAnalytics(data)
            } catch (err) {
                setError('Could not load analytics. Is the backend running on port 8081?')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) {
        return <div className="flex items-center justify-center h-64"><LoaderCircle className="h-6 w-6 animate-spin text-brand-500" /></div>
    }

    if (error || !analytics) {
        return <div className="glass-card p-6 text-sm text-red-500 dark:text-red-400">{error}</div>
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-semibold">Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Insights across all {analytics.totalApplications} of your applications.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <RateCard icon={TrendingUp} label="Response Rate" value={analytics.responseRate} accent="brand" />
                <RateCard icon={Users} label="Interview Conversion" value={analytics.interviewConversionRate} accent="amber" />
                <RateCard icon={Award} label="Offer Conversion" value={analytics.offerConversionRate} accent="emerald" />
            </div>

            <div className="glass-card p-6">
                <h2 className="font-display text-lg font-semibold mb-1">Applications Over Time</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Based on applied date, grouped by month.</p>
                <OverTimeChart data={analytics.applicationsOverTime} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                    <h2 className="font-display text-lg font-semibold mb-4">Applications by Status</h2>
                    <StatusBreakdownChart byStatus={analytics.applicationsByStatus} />
                </div>
                <div className="glass-card p-6">
                    <h2 className="font-display text-lg font-semibold mb-4">Applications by Portal</h2>
                    <PortalBreakdownChart byPortal={analytics.applicationsByPortal} />
                </div>
            </div>
        </div>
    )
}