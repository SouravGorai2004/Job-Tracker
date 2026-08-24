export default function RateCard({ icon: Icon, label, value, accent = 'brand' }) {
    const accents = {
        brand: 'from-brand-500 to-accent-400',
        emerald: 'from-emerald-500 to-teal-400',
        amber: 'from-amber-500 to-orange-400',
    }
    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${accents[accent]} flex items-center justify-center shrink-0`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </div>
            <p className="text-3xl font-display font-semibold">{value}%</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${accents[accent]}`} style={{ width: `${Math.min(value, 100)}%` }} />
            </div>
        </div>
    )
}