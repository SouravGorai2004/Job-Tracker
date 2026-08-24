package com.jobtrack.controller;

import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.repository.FeedbackRepository;
import com.jobtrack.repository.UserRepository;
import com.jobtrack.service.UserLoveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminStatsController {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final FeedbackRepository feedbackRepository;
    private final UserLoveService userLoveService;

    @GetMapping
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("totalFeedback", feedbackRepository.count());
        stats.put("totalLove", userLoveService.getCount());
        return ResponseEntity.ok(stats);
    }
}