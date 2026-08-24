package com.jobtrack.util;

import com.jobtrack.entity.ApplicationStatus;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * The single source of truth for valid status transitions (Decision Log Entry 9).
 * Both the manual status-update endpoint (Batch 4) and automatic status
 * detection (Batch 11) must go through this class so the two can never disagree.
 */
public class StatusTransitionRules {

    private static final Map<ApplicationStatus, Set<ApplicationStatus>> ALLOWED_TRANSITIONS =
            new EnumMap<>(ApplicationStatus.class);

    static {
        ALLOWED_TRANSITIONS.put(ApplicationStatus.SAVED,
                EnumSet.of(ApplicationStatus.APPLIED, ApplicationStatus.WITHDRAWN));

        ALLOWED_TRANSITIONS.put(ApplicationStatus.APPLIED,
                EnumSet.of(ApplicationStatus.ASSESSMENT, ApplicationStatus.INTERVIEW,
                        ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN));

        ALLOWED_TRANSITIONS.put(ApplicationStatus.ASSESSMENT,
                EnumSet.of(ApplicationStatus.INTERVIEW, ApplicationStatus.OFFER,
                        ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN));

        ALLOWED_TRANSITIONS.put(ApplicationStatus.INTERVIEW,
                EnumSet.of(ApplicationStatus.OFFER, ApplicationStatus.REJECTED,
                        ApplicationStatus.WITHDRAWN));

        ALLOWED_TRANSITIONS.put(ApplicationStatus.OFFER,
                EnumSet.of(ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED,
                        ApplicationStatus.WITHDRAWN));

        ALLOWED_TRANSITIONS.put(ApplicationStatus.ACCEPTED, EnumSet.noneOf(ApplicationStatus.class));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.REJECTED, EnumSet.noneOf(ApplicationStatus.class));
        ALLOWED_TRANSITIONS.put(ApplicationStatus.WITHDRAWN, EnumSet.noneOf(ApplicationStatus.class));
    }

    public static boolean isAllowed(ApplicationStatus from, ApplicationStatus to) {
        if (from == to) return false; // no-op transitions rejected, not silently accepted
        return ALLOWED_TRANSITIONS.getOrDefault(from, Set.of()).contains(to);
    }

    public static Set<ApplicationStatus> getAllowedNextStatuses(ApplicationStatus from) {
        return ALLOWED_TRANSITIONS.getOrDefault(from, Set.of());
    }
}