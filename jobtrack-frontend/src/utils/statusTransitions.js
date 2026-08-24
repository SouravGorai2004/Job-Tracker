// Mirrors backend StatusTransitionRules.java (Decision Log Entry 9) for UX only.
export const ALLOWED_TRANSITIONS = {
    SAVED: ['APPLIED', 'WITHDRAWN'],
    APPLIED: ['ASSESSMENT', 'INTERVIEW', 'REJECTED', 'WITHDRAWN'],
    ASSESSMENT: ['INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'],
    INTERVIEW: ['OFFER', 'REJECTED', 'WITHDRAWN'],
    OFFER: ['ACCEPTED', 'REJECTED', 'WITHDRAWN'],
    ACCEPTED: [],
    REJECTED: [],
    WITHDRAWN: [],
}

export function getAllowedNextStatuses(current) {
    return ALLOWED_TRANSITIONS[current] || []
}