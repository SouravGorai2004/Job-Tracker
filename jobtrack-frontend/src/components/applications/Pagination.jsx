import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between px-1 pt-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
                Page {page + 1} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 0}
                    className="btn-secondary px-3 py-1.5 disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages - 1}
                    className="btn-secondary px-3 py-1.5 disabled:opacity-40"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}