import { useEffect, useState, useCallback } from 'react'
import { Plus, LoaderCircle } from 'lucide-react'
import { applicationApi } from '../api/applicationApi'
import ApplicationFilters from '../components/applications/ApplicationFilters'
import ApplicationRow from '../components/applications/ApplicationRow'
import Pagination from '../components/applications/Pagination'
import AddApplicationModal from '../components/applications/AddApplicationModal'

const EMPTY_FILTERS = { search: '', status: '', portal: '', employmentType: '', location: '' }

export default function ApplicationsPage() {
    const [filters, setFilters] = useState(EMPTY_FILTERS)
    const [page, setPage] = useState(0)
    const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const loadApplications = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const params = { page, size: 10, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '')) }
            const { data } = await applicationApi.search(params)
            setData(data)
        } catch (err) {
            setError('Could not load applications.')
        } finally {
            setLoading(false)
        }
    }, [filters, page])

    useEffect(() => { loadApplications() }, [loadApplications])

    // Debounced-by-effect isn't needed here since search triggers a full param
    // change through the same loadApplications callback -- filters always reset to page 0.
    const handleFiltersChange = (newFilters) => { setFilters(newFilters); setPage(0) }
    const handleReset = () => { setFilters(EMPTY_FILTERS); setPage(0) }

    const handleCreated = () => { setModalOpen(false); loadApplications() }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display text-2xl font-semibold">Applications</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{data.totalElements} total applications</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="btn-primary">
                    <Plus className="h-4 w-4" /> Add Application
                </button>
            </div>

            <ApplicationFilters filters={filters} onChange={handleFiltersChange} onReset={handleReset} />

            <div className="glass-card p-2">
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <LoaderCircle className="h-6 w-6 animate-spin text-brand-500" />
                    </div>
                ) : error ? (
                    <p className="text-sm text-red-500 dark:text-red-400 text-center py-12">{error}</p>
                ) : data.content.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-12">
                        No applications match your filters.
                    </p>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {data.content.map((app) => <ApplicationRow key={app.id} app={app} />)}
                    </div>
                )}
                <div className="px-3">
                    <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
                </div>
            </div>

            {modalOpen && <AddApplicationModal onClose={() => setModalOpen(false)} onCreated={handleCreated} />}
        </div>
    )
}