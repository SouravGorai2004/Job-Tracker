package com.jobtrack.service;

import com.jobtrack.dto.response.AnalyticsResponse;
import com.jobtrack.dto.response.MonthlyCountResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.ApplicationStatus;
import com.jobtrack.entity.EventType;
import com.jobtrack.entity.Portal;
import com.jobtrack.repository.ApplicationEventRepository;
import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.repository.FeedbackRepository;
import com.jobtrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationEventRepository applicationEventRepository;
    private final UserRepository userRepository;
    private final FeedbackRepository feedbackRepository;

    private static final Set<ApplicationStatus> TERMINAL_STATUSES =
            EnumSet.of(ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED, ApplicationStatus.WITHDRAWN);

    private static final Set<ApplicationStatus> RESPONDED_STATUSES =
            EnumSet.of(ApplicationStatus.ASSESSMENT, ApplicationStatus.INTERVIEW,
                    ApplicationStatus.OFFER, ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED);


    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalFeedback() {
        return feedbackRepository.count(); // You'll need to add this repository reference
    }

    // Note: for UserLove count, the service already exists in UserLoveService
    public AnalyticsResponse getAnalytics(Long userId) {
        List<Application> applications = applicationRepository.findAllByUserIdOrderByCreatedAtDesc(userId);

        long total = applications.size();
        long active = applications.stream()
                .filter(a -> !TERMINAL_STATUSES.contains(a.getStatus()))
                .count();
        long rejected = applications.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count();
        long withdrawn = applications.stream().filter(a -> a.getStatus() == ApplicationStatus.WITHDRAWN).count();
        long accepted = applications.stream().filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED).count();

        long submitted = applications.stream().filter(a -> a.getStatus() != ApplicationStatus.SAVED).count();
        long responded = applications.stream()
                .filter(a -> RESPONDED_STATUSES.contains(a.getStatus()))
                .count();

        long reachedInterview = applicationEventRepository
                .countDistinctApplicationsByUserIdAndEventType(userId, EventType.INTERVIEW_INVITE);
        long reachedOffer = applicationEventRepository
                .countDistinctApplicationsByUserIdAndEventType(userId, EventType.OFFER_RECEIVED);

        double responseRate = rate(responded, submitted);
        double interviewConversionRate = rate(reachedInterview, submitted);
        double offerConversionRate = rate(reachedOffer, reachedInterview);

        Map<Portal, Long> byPortal = applications.stream()
                .collect(Collectors.groupingBy(Application::getPortal, Collectors.counting()));

        Map<ApplicationStatus, Long> byStatus = applications.stream()
                .collect(Collectors.groupingBy(Application::getStatus, Collectors.counting()));

        List<MonthlyCountResponse> overTime = buildMonthlyBreakdown(applications);

        return AnalyticsResponse.builder()
                .totalApplications(total)
                .activeApplications(active)
                .rejectedApplications(rejected)
                .withdrawnApplications(withdrawn)
                .interviewsReached(reachedInterview)
                .offersReached(reachedOffer)
                .acceptedOffers(accepted)
                .responseRate(responseRate)
                .interviewConversionRate(interviewConversionRate)
                .offerConversionRate(offerConversionRate)
                .applicationsByPortal(byPortal)
                .applicationsByStatus(byStatus)
                .applicationsOverTime(overTime)
                .build();
    }

    private double rate(long numerator, long denominator) {
        if (denominator == 0) return 0.0;
        return Math.round((numerator * 1000.0) / denominator) / 10.0; // one decimal place
    }

    private List<MonthlyCountResponse> buildMonthlyBreakdown(List<Application> applications) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        Map<String, Long> grouped = applications.stream()
                .filter(a -> a.getAppliedDate() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getAppliedDate().format(formatter),
                        Collectors.counting()));

        return grouped.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new MonthlyCountResponse(e.getKey(), e.getValue()))
                .toList();
    }


}