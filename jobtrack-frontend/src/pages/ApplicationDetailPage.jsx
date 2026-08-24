import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Pencil, Trash2, LoaderCircle, Mail } from 'lucide-react'
import { applicationApi } from '../api/applicationApi'
import StatusBadge from '../components/applications/StatusBadge'
import DetailField from '../components/applications/DetailField'
import Timeline from '../components/applications/Timeline'
import StatusUpdateControl from '../components/applications/StatusUpdateControl'
import AddApplicationModal from '../components/applications/AddApplicationModal'
import AddEditEventModal from '../components/applications/AddEditEventModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { PORTAL_LABELS, EMPLOYMENT_TYPE_LABELS } from '../utils/displayConfig'
import { formatDate } from '../utils/format'

export default function ApplicationDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [application, setApplication] = useState(null)
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // Timeline event state
    const [eventModalOpen, setEventModalOpen] = useState(false)
    const [eventModalMode, setEventModalMode] = useState('create')
    const [eventBeingEdited, setEventBeingEdited] = useState(null)
    const [eventSaving, setEventSaving] = useState(false)
    const [eventError, setEventError] = useState(null)

    const [deleteEventTarget, setDeleteEventTarget] = useState(null)
    const [deletingEvent, setDeletingEvent] = useState(false)
    const [deleteEventError, setDeleteEventError] = useState(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const [appRes, eventsRes] = await Promise.all([
                applicationApi.getById(id),
                applicationApi.getTimeline(id),
            ])
            setApplication(appRes.data)
            setEvents(eventsRes.data)
        } catch (err) {
            setError('Application not found, or you do not have access to it.')
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => { load() }, [load])

    const handleStatusUpdated = (updatedApp) => {
        setApplication(updatedApp)
        load()
    }

    const handleEditSaved = (updatedApp) => {
        setApplication(updatedApp)
        setEditOpen(false)
    }

    const handleDelete = async () => {
        setDeleting(true)
        try {
            await applicationApi.delete(id)
            navigate('/applications')
        } catch (err) {
            setDeleting(false)
            setDeleteOpen(false)
            setError('Could not delete application.')
        }
    }

    // -- Timeline event handlers --
    const openAddEvent = () => {
        setEventModalMode('create')
        setEventBeingEdited(null)
        setEventError(null)
        setEventModalOpen(true)
    }

    const openEditEvent = (event) => {
        setEventModalMode('edit')
        setEventBeingEdited(event)
        setEventError(null)
        setEventModalOpen(true)
    }

    const handleEventSubmit = async (form) => {
        setEventSaving(true)
        setEventError(null)
        try {
            if (eventModalMode === 'edit') {
                await applicationApi.updateEvent(id, eventBeingEdited.id, form)
            } else {
                await applicationApi.addEvent(id, form)
            }
            setEventModalOpen(false)
            load()
        } catch (err) {
            setEventError(err.response?.data?.message || 'Could not save timeline event.')
        } finally {
            setEventSaving(false)
        }
    }

    const handleEventDelete = async () => {
        setDeletingEvent(true)
        setDeleteEventError(null)
        try {
            await applicationApi.deleteEvent(id, deleteEventTarget.id)
            setDeleteEventTarget(null)
            load()
        } catch (err) {
            // Keeps the confirm dialog open with the error inline, rather than
            // swapping the whole page to an error state -- that's the right move
            // for a failed data load, but wrong for a failed delete of one item.
            setDeleteEventError(err.response?.data?.message || 'Could not delete this event.')
        } finally {
            setDeletingEvent(false)
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center h-64"><LoaderCircle className="h-6 w-6 animate-spin text-brand-500" /></div>
    }

    if (error || !application) {
        return (
            <div className="glass-card p-6 text-center">
                <p className="text-sm text-red-500 dark:text-red-400 mb-4">{error}</p>
                <Link to="/applications" className="btn-secondary inline-flex">Back to Applications</Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <button onClick={() => navigate('/applications')} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <ArrowLeft className="h-4 w-4" /> Back to Applications
            </button>

            <div className="glass-card p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="font-display text-2xl font-semibold">{application.jobTitle}</h1>
                            <StatusBadge status={application.status} />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            {application.company} · {PORTAL_LABELS[application.portal]}
                        </p>
                        {application.jobUrl && (
                            <a href={application.jobUrl} target="_blank" rel="noreferrer"
                               className="inline-flex items-center gap-1 text-xs text-brand-600 dark:text-accent-400 hover:underline mt-2">
                                View original posting <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setEditOpen(true)} className="btn-secondary">
                            <Pencil className="h-4 w-4" /> Edit
                        </button>
                        <button onClick={() => setDeleteOpen(true)}
                                className="btn-secondary text-red-500 dark:text-red-400 border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" /> Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                    <DetailField label="Location" value={application.location} />
                    <DetailField label="Employment Type" value={EMPLOYMENT_TYPE_LABELS[application.employmentType]} />
                    <DetailField label="Salary / Stipend" value={application.salaryStipend} />
                    <DetailField label="Resume Used" value={application.resumeLabel} />
                    <DetailField label="Applied Date" value={formatDate(application.appliedDate)} />
                    <DetailField label="Follow-up Date" value={formatDate(application.followUpDate)} />
                    <DetailField label="Recruiter" value={application.recruiterName} />
                    <DetailField label="Recruiter Contact" value={application.recruiterContact} />
                </div>

                {application.jobDescription && (
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Job Description</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{application.jobDescription}</p>
                    </div>
                )}

                {application.notes && (
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/10">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Notes</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{application.notes}</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6">
                    <Timeline
                        events={events}
                        onAdd={openAddEvent}
                        onEdit={openEditEvent}
                        onDelete={(event) => { setDeleteEventTarget(event); setDeleteEventError(null) }}
                    />
                </div>

                <div className="space-y-6">
                    <StatusUpdateControl
                        applicationId={application.id}
                        currentStatus={application.status}
                        onUpdated={handleStatusUpdated}
                    />

                    <div className="glass-card p-5">
                        <h3 className="font-display text-sm font-semibold mb-2 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" /> Emails
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Connect Gmail to automatically link related emails to this application. Coming in a later batch.
                        </p>
                    </div>
                </div>
            </div>

            {editOpen && (
                <AddApplicationModal
                    mode="edit"
                    applicationId={application.id}
                    initialData={application}
                    onClose={() => setEditOpen(false)}
                    onCreated={handleEditSaved}
                />
            )}

            {deleteOpen && (
                <ConfirmDialog
                    title="Delete this application?"
                    message={`This will permanently delete your application to ${application.company} and its entire timeline. This cannot be undone.`}
                    confirmLabel="Delete"
                    danger
                    loading={deleting}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteOpen(false)}
                />
            )}

            {eventModalOpen && (
                <AddEditEventModal
                    mode={eventModalMode}
                    initialData={eventBeingEdited}
                    loading={eventSaving}
                    error={eventError}
                    onClose={() => setEventModalOpen(false)}
                    onSubmit={handleEventSubmit}
                />
            )}

            {deleteEventTarget && (
                <ConfirmDialog
                    title="Delete this timeline event?"
                    message="This will permanently remove this entry from the timeline. This cannot be undone."
                    confirmLabel="Delete"
                    danger
                    loading={deletingEvent}
                    error={deleteEventError}
                    onConfirm={handleEventDelete}
                    onCancel={() => { setDeleteEventTarget(null); setDeleteEventError(null) }}
                />
            )}
        </div>
    )
}