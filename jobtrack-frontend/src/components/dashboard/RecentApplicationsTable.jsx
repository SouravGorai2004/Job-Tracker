import { Link } from 'react-router-dom'
import { STATUS_CONFIG, PORTAL_LABELS } from '../../utils/displayConfig'

export default function RecentApplicationsTable({ applications }) {
    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold">Recent Applications</h2>
                <Link to="/applications" className="text-sm font-medium text-brand-600 dark:text-accent-400 hover:underline">
                    View all
                </Link>
            </div>

            {applications.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">
                    No applications yet. Add your first one to get started.
                </p>
            ) : (
                <div className="space-y-1">
                    {applications.map((app) => (
                        <Link
                            key={app.id}
                            to={`/applications/${app.id}`}
                            className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{app.company}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                    {app.jobTitle} · {PORTAL_LABELS[app.portal]}
                                </p>
                            </div>
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ml-3 ${STATUS_CONFIG[app.status].color}`}>
                {STATUS_CONFIG[app.status].label}
              </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}