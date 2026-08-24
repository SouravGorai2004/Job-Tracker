package com.jobtrack.controller;

import com.jobtrack.dto.response.AnalyticsResponse;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public AnalyticsResponse getAnalytics(@AuthenticationPrincipal UserPrincipal principal) {
        return analyticsService.getAnalytics(principal.getUser().getId());
    }
}