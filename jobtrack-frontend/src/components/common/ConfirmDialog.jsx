import { LoaderCircle } from 'lucide-react'

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', danger = false, loading = false, error = null, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass-card w-full max-w-sm bg-white dark:bg-surface-dark p-6">
                <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{message}</p>
                {error && (
                    <div className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-3 py-2 text-xs text-red-600 dark:text-red-400 mb-4">
                        {error}
                    </div>
                )}
                <div className="flex gap-3">
                    <button onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50 ${
                            danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'
                        }`}
                    >
                        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}