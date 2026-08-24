import { useState, useEffect } from 'react'
import { X, LoaderCircle } from 'lucide-react'
import { applicationApi } from '../../api/applicationApi'
import { PORTAL_LABELS, EMPLOYMENT_TYPE_LABELS, STATUS_CONFIG } from '../../utils/displayConfig'

const EMPTY_FORM = {
    company: '', jobTitle: '', jobUrl: '', portal: 'LINKEDIN', location: '',
    employmentType: '', salaryStipend: '', jobDescription: '', status: 'APPLIED',
    resumeLabel: '', notes: '', recruiterName: '', recruiterContact: '',
    appliedDate: '', followUpDate: '',
}

// mode: 'create' (default) or 'edit'. In edit mode pass applicationId + initialData.
// onCreated fires on ANY successful save (create or update) -- kept this prop name
// (not renamed to onSuccess) so the Batch 3 ApplicationsPage usage keeps working
// unchanged, per Section 32 consistency.
export default function AddApplicationModal({ mode = 'create', applicationId = null, initialData = null, onClose, onCreated }) {
    const [form, setForm] = useState(EMPTY_FORM)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setForm({
                company: initialData.company || '',
                jobTitle: initialData.jobTitle || '',
                jobUrl: initialData.jobUrl || '',
                portal: initialData.portal || 'LINKEDIN',
                location: initialData.location || '',
                employmentType: initialData.employmentType || '',
                salaryStipend: initialData.salaryStipend || '',
                jobDescription: initialData.jobDescription || '',
                status: initialData.status || 'APPLIED',
                resumeLabel: initialData.resumeLabel || '',
                notes: initialData.notes || '',
                recruiterName: initialData.recruiterName || '',
                recruiterContact: initialData.recruiterContact || '',
                appliedDate: initialData.appliedDate || '',
                followUpDate: initialData.followUpDate || '',
            })
        }
    }, [mode, initialData])

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''))
            const { data } = mode === 'edit'
                ? await applicationApi.update(applicationId, payload)
                : await applicationApi.create(payload)
            onCreated(data)
        } catch (err) {
            setError(err.response?.data?.message || 'Could not save application. Check the required fields.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-surface-dark">
                <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-xl">
                    <h2 className="font-display text-lg font-semibold">{mode === 'edit' ? 'Edit Application' : 'Add Application'}</h2>
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label-text">Company *</label>
                            <input name="company" required value={form.company} onChange={handleChange} className="input-field" placeholder="Google" />
                        </div>
                        <div>
                            <label className="label-text">Job Title *</label>
                            <input name="jobTitle" required value={form.jobTitle} onChange={handleChange} className="input-field" placeholder="Software Engineer Intern" />
                        </div>
                    </div>

                    <div>
                        <label className="label-text">Job URL</label>
                        <input name="jobUrl" type="url" value={form.jobUrl} onChange={handleChange} className="input-field" placeholder="https://..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label-text">Portal *</label>
                            <select name="portal" required value={form.portal} onChange={handleChange} className="input-field">
                                {Object.entries(PORTAL_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label-text">Location</label>
                            <input name="location" value={form.location} onChange={handleChange} className="input-field" placeholder="Bangalore" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label-text">Employment Type</label>
                            <select name="employmentType" value={form.employmentType} onChange={handleChange} className="input-field">
                                <option value="">Select type</option>
                                {Object.entries(EMPLOYMENT_TYPE_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label-text">Salary / Stipend</label>
                            <input name="salaryStipend" value={form.salaryStipend} onChange={handleChange} className="input-field" placeholder="₹50,000/month" />
                        </div>
                    </div>

                    {mode !== 'edit' && (
                        <div>
                            <label className="label-text">Initial Status</label>
                            <select name="status" value={form.status} onChange={handleChange} className="input-field">
                                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                    <option key={key} value={key}>{cfg.label}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label-text">Applied Date</label>
                            <input name="appliedDate" type="date" value={form.appliedDate} onChange={handleChange} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Follow-up Date</label>
                            <input name="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} className="input-field" />
                        </div>
                    </div>

                    <div>
                        <label className="label-text">Resume Used</label>
                        <input name="resumeLabel" value={form.resumeLabel} onChange={handleChange} className="input-field" placeholder="Resume_v3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label-text">Recruiter Name</label>
                            <input name="recruiterName" value={form.recruiterName} onChange={handleChange} className="input-field" />
                        </div>
                        <div>
                            <label className="label-text">Recruiter Contact</label>
                            <input name="recruiterContact" value={form.recruiterContact} onChange={handleChange} className="input-field" />
                        </div>
                    </div>

                    <div>
                        <label className="label-text">Notes</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input-field resize-none" />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-primary flex-1">
                            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : mode === 'edit' ? 'Save Changes' : 'Add Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}