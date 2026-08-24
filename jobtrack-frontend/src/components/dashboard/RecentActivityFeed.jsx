import { Activity } from 'lucide-react'
import { EVENT_TYPE_LABELS } from '../../utils/displayConfig'
import { timeAgo } from '../../utils/format'

export default function RecentActivityFeed({ events }) {
    return (
        <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Recent Activity</h2>

            {events.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">No activity yet.</p>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event.id} className="flex gap-3">
                            <div className="h-8 w-8 rounded-lg bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                <Activity className="h-4 w-4 text-brand-600 dark:text-accent-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium">{event.company}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {EVENT_TYPE_LABELS[event.eventType] || event.eventType}
                                </p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{timeAgo(event.occurredAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}