import { Search, X } from 'lucide-react'
import { STATUS_CONFIG, PORTAL_LABELS, EMPLOYMENT_TYPE_LABELS } from '../../utils/displayConfig'

export default function ApplicationFilters({ filters, onChange, onReset }) {
    const handleField = (field) => (e) => onChange({ ...filters, [field]: e.target.value })

    const hasActiveFilters = filters.status || filters.portal || filters.employmentType || filters.location || filters.search

    return (
        <div className="glass-card p-4 space-y-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by company, title, or description..."
                    value={filters.search}
                    onChange={handleField('search')}
                    className="input-field pl-10"
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <select value={filters.status} onChange={handleField('status')} className="input-field">
                    <option value="">All Statuses</option>
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <option key={key} value={key}>{cfg.label}</option>
                    ))}
                </select>

                <select value={filters.portal} onChange={handleField('portal')} className="input-field">
                    <option value="">All Portals</option>
                    {Object.entries(PORTAL_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>

                <select value={filters.employmentType} onChange={handleField('employmentType')} className="input-field">
                    <option value="">All Types</option>
                    {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleField('location')}
                    className="input-field"
                />
            </div>

            {hasActiveFilters && (
                <button onClick={onReset} className="text-xs font-medium text-brand-600 dark:text-accent-400 hover:underline inline-flex items-center gap-1">
                    <X className="h-3.5 w-3.5" /> Clear filters
                </button>
            )}
        </div>
    )
}