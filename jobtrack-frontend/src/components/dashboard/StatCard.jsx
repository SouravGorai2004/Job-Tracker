export default function StatCard({ icon: Icon, label, value, accent = 'brand', sub }) {
    const accents = {
        brand: 'from-brand-500 to-accent-400',
        emerald: 'from-emerald-500 to-teal-400',
        amber: 'from-amber-500 to-orange-400',
        purple: 'from-purple-500 to-fuchsia-400',
    }
    return (
        <div className="glass-card p-5 flex items-start justify-between hover:-translate-y-0.5 transition-transform duration-200">
            <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-display font-semibold">{value}</p>
                {sub && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>}
            </div>
            <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${accents[accent]} flex items-center justify-center shadow-glow shrink-0`}>
                <Icon className="h-5 w-5 text-white" />
            </div>
        </div>
    )
}