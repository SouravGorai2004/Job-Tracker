import { ArrowRight } from 'lucide-react'

const STAGES = [
    { key: 'APPLIED', label: 'Applied' },
    { key: 'ASSESSMENT', label: 'Assessment' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'OFFER', label: 'Offer' },
    { key: 'ACCEPTED', label: 'Accepted' },
]

export default function PipelineView({ byStatus }) {
    return (
        <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold mb-5">Application Pipeline</h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {STAGES.map((stage, i) => (
                    <div key={stage.key} className="flex items-center gap-2 shrink-0">
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-5 py-4 min-w-[110px]">
              <span className="text-2xl font-display font-semibold text-brand-600 dark:text-accent-400">
                {byStatus?.[stage.key] ?? 0}
              </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stage.label}</span>
                        </div>
                        {i < STAGES.length - 1 && <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-600 shrink-0" />}
                    </div>
                ))}
            </div>
        </div>
    )
}