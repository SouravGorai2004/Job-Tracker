import {
    Send, Mail, ClipboardList, CheckSquare, Users, UserCheck,
    Award, PartyPopper, XCircle, LogOut, StickyNote, RefreshCw,
} from 'lucide-react'

export const STATUS_CONFIG = {
    SAVED:      { label: 'Saved',      color: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300 border-slate-200 dark:border-slate-500/20' },
    APPLIED:    { label: 'Applied',    color: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' },
    ASSESSMENT: { label: 'Assessment', color: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' },
    INTERVIEW:  { label: 'Interview',  color: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border-purple-200 dark:border-purple-500/20' },
    OFFER:      { label: 'Offer',      color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20' },
    ACCEPTED:   { label: 'Accepted',   color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' },
    REJECTED:   { label: 'Rejected',   color: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20' },
    WITHDRAWN:  { label: 'Withdrawn',  color: 'bg-slate-100 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20' },
}

export const PORTAL_LABELS = {
    LINKEDIN: 'LinkedIn',
    NAUKRI: 'Naukri',
    INTERNSHALA: 'Internshala',
    UNSTOP: 'Unstop',
    COMPANY_WEBSITE: 'Company Website',
    OTHER: 'Other',
}

export const EMPLOYMENT_TYPE_LABELS = {
    FULL_TIME: 'Full-time',
    INTERNSHIP: 'Internship',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
}

export const EVENT_TYPE_LABELS = {
    APPLICATION_SUBMITTED: 'Application submitted',
    CONFIRMATION_RECEIVED: 'Confirmation received',
    ASSESSMENT_INVITE: 'Assessment invitation received',
    ASSESSMENT_COMPLETED: 'Assessment completed',
    INTERVIEW_INVITE: 'Interview invitation received',
    INTERVIEW_COMPLETED: 'Interview completed',
    OFFER_RECEIVED: 'Offer received',
    OFFER_ACCEPTED: 'Offer accepted',
    REJECTED: 'Application rejected',
    WITHDRAWN: 'Application withdrawn',
    NOTE_ADDED: 'Note added',
    STATUS_CHANGED_MANUALLY: 'Status updated',
}

// NEW -- one icon per event type, for the timeline
export const EVENT_TYPE_ICONS = {
    APPLICATION_SUBMITTED: Send,
    CONFIRMATION_RECEIVED: Mail,
    ASSESSMENT_INVITE: ClipboardList,
    ASSESSMENT_COMPLETED: CheckSquare,
    INTERVIEW_INVITE: Users,
    INTERVIEW_COMPLETED: UserCheck,
    OFFER_RECEIVED: Award,
    OFFER_ACCEPTED: PartyPopper,
    REJECTED: XCircle,
    WITHDRAWN: LogOut,
    NOTE_ADDED: StickyNote,
    STATUS_CHANGED_MANUALLY: RefreshCw,
}

export const STATUS_CHART_COLORS = {
    SAVED: '#64748b', APPLIED: '#3b82f6', ASSESSMENT: '#f59e0b', INTERVIEW: '#a855f7',
    OFFER: '#06b6d4', ACCEPTED: '#10b981', REJECTED: '#ef4444', WITHDRAWN: '#94a3b8',
}

export const PORTAL_CHART_COLORS = {
    LINKEDIN: '#6366f1', NAUKRI: '#06b6d4', INTERNSHALA: '#f59e0b',
    UNSTOP: '#a855f7', COMPANY_WEBSITE: '#10b981', OTHER: '#94a3b8',
}