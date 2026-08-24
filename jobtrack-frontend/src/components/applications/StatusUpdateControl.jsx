import { useState } from 'react'
import { ArrowRight, LoaderCircle } from 'lucide-react'
import { getAllowedNextStatuses } from '../../utils/statusTransitions'
import { STATUS_CONFIG } from '../../utils/displayConfig'
import { applicationApi } from '../../api/applicationApi'

export default function StatusUpdateControl({ applicationId, currentStatus, onUpdated }) {
    const nextOptions = getAllowedNextStatuses(currentStatus)
    const [selected, setSelected] = useState('')
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    if (nextOptions.length === 0) {
        return (
            <div className="glass-card p-5">
                <h3 className="font-display text-sm font-semibold mb-2">Status</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    This application is in a final state ({STATUS_CONFIG[currentStatus].label}). No further status changes are possible.
                </p>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selected) return
        setLoading(true)
        setError(null)
        try {
            const { data } = await applicationApi.updateStatus(applicationId, {
                status: selected,
                note: note || undefined,
            })
            onUpdated(data)
            setSelected('')
            setNote('')
        } catch (err) {
            setError(err.response?.data?.message || 'Could not update status.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="glass-card p-5">
            <h3 className="font-display text-sm font-semibold mb-3">Update Status</h3>
            {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2 text-xs text-red-600 dark:text-red-400 mb-3">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-wrap gap-2">
                    {nextOptions.map((status) => (
                        <button
                            type="button"
                            key={status}
                            onClick={() => setSelected(status)}
                            className={`text-xs font-medium px-3 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
                                selected === status
                                    ? 'bg-brand-600 text-white border-brand-600'
                                    : 'border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                        >
                            <ArrowRight className="h-3 w-3" /> {STATUS_CONFIG[status].label}
                        </button>
                    ))}
                </div>
                {selected && (
                    <>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note for this update..."
                rows={2}
                className="input-field resize-none text-sm"
            />
                        <button type="submit" disabled={loading} className="btn-primary w-full">
                            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : `Move to ${STATUS_CONFIG[selected].label}`}
                        </button>
                    </>
                )}
            </form>
        </div>
    )
}