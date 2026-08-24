import { Link } from 'react-router-dom'
import { MapPin, ExternalLink } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { PORTAL_LABELS } from '../../utils/displayConfig'
import { formatDate } from '../../utils/format'

export default function ApplicationRow({ app }) {
    return (
        <Link
            to={`/applications/${app.id}`}
            className="flex items-center justify-between gap-4 rounded-xl px-4 py-3.5 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5 last:border-0"
        >
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{app.company}</p>
                    {app.jobUrl && <ExternalLink className="h-3 w-3 text-slate-400 shrink-0" />}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{app.jobTitle}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                    <span>{PORTAL_LABELS[app.portal]}</span>
                    {app.location && (
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{app.location}</span>
                    )}
                    <span>{formatDate(app.appliedDate)}</span>
                </div>
            </div>
            <StatusBadge status={app.status} />
        </Link>
    )
}