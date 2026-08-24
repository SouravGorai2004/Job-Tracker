import { Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react'
import { EVENT_TYPE_LABELS, EVENT_TYPE_ICONS } from '../../utils/displayConfig'
import { formatDate } from '../../utils/format'

const SOURCE_LABELS = { MANUAL: 'Manual entry', EMAIL: 'From email', SYSTEM: 'System' }

export default function Timeline({ events, onAdd, onEdit, onDelete }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-lg font-semibold">Timeline</h2>
                <button onClick={onAdd} className="btn-secondary text-xs px-3 py-1.5">
                    <Plus className="h-3.5 w-3.5" /> Add Event
                </button>
            </div>

            {events.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">No timeline events yet.</p>
            ) : (
                <div className="relative pl-6">
                    <div className="absolute left-[9px] top-2 bottom-2 w-px bg-slate-200 dark:bg-white/10" />
                    <div className="space-y-6">
                        {events.map((event) => {
                            const Icon = EVENT_TYPE_ICONS[event.eventType] || CheckCircle2
                            const isEditable = event.source === 'MANUAL'
                            return (
                                <div key={event.id} className="relative group">
                                    <div className="absolute -left-6 top-0.5 h-[18px] w-[18px] rounded-full bg-gradient-to-br from-brand-500 to-accent-400 flex items-center justify-center ring-4 ring-white dark:ring-surface-dark">
                                        <Icon className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium">{EVENT_TYPE_LABELS[event.eventType] || event.eventType}</p>
                                            {event.description && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{event.description}</p>
                                            )}
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                                {formatDate(event.occurredAt)} · {SOURCE_LABELS[event.source]}
                                            </p>
                                        </div>
                                        {isEditable && (
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                <button onClick={() => onEdit(event)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">
                                                    <Pencil className="h-3.5 w-3.5 text-slate-400" />
                                                </button>
                                                <button onClick={() => onDelete(event)} className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                                                    <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}