package com.jobtrack.dto.response;

import com.jobtrack.entity.ApplicationStatus;
import com.jobtrack.entity.Portal;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class AnalyticsResponse {
    private long totalApplications;
    private long activeApplications;
    private long rejectedApplications;
    private long withdrawnApplications;
    private long interviewsReached;
    private long offersReached;
    private long acceptedOffers;

    private double responseRate;
    private double interviewConversionRate;
    private double offerConversionRate;

    private Map<Portal, Long> applicationsByPortal;
    private Map<ApplicationStatus, Long> applicationsByStatus;
    private List<MonthlyCountResponse> applicationsOverTime;
}