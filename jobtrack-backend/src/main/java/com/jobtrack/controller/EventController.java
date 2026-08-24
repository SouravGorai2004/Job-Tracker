package com.jobtrack.controller;

import com.jobtrack.dto.response.RecentActivityResponse;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.ApplicationEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final ApplicationEventService applicationEventService;

    @GetMapping("/recent")
    public List<RecentActivityResponse> getRecentActivity(
            @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal UserPrincipal principal) {
        return applicationEventService.getRecentActivity(principal.getUser().getId(), limit);
    }
}