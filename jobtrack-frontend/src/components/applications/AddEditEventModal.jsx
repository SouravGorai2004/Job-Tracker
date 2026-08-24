import { useState, useEffect } from 'react'
import { X, LoaderCircle } from 'lucide-react'
import { EVENT_TYPE_LABELS } from '../../utils/displayConfig'

const EMPTY_FORM = { eventType: 'NOTE_ADDED', description: '', occurredDate: '' }

export default function AddEditEventModal({ mode = 'create', initialData = null, loading, error, onClose, onSubmit }) {
    const [form, setForm] = useState(EMPTY_FORM)

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setForm({
                eventType: initialData.eventType,
                description: initialData.description || '',
                occurredDate: initialData.occurredAt ? initialData.occurredAt.slice(0, 10) : '',
            })
        } else {
            setForm({ ...EMPTY_FORM, occurredDate: new Date().toISOString().slice(0, 10) })
        }
    }, [mode, initialData])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const handleSubmit = (e) => { e.preventDefault(); onSubmit(form) }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md bg-white dark:bg-surface-dark">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10">
                    <h2 className="font-display text-lg font-semibold">{mode === 'edit' ? 'Edit Timeline Event' : 'Add Timeline Event'}</h2>
                    <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="label-text">Event Type *</label>
                        <select name="eventType" required value={form.eventType} onChange={handleChange} className="input-field">
                            {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label-text">Date *</label>
                        <input name="occurredDate" type="date" required value={form.occurredDate} onChange={handleChange} className="input-field" />
                    </div>
                    <div>
                        <label className="label-text">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Optional details..." />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        This adds a note to the timeline only — it does not change the application's current status.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1">
                            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : mode === 'edit' ? 'Save Changes' : 'Add Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}