export default function DetailField({ label, value }) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-sm font-medium mt-1">{value || '—'}</p>
        </div>
    )
}