package com.jobtrack.controller;

import com.jobtrack.dto.request.FeedbackRequest;
import com.jobtrack.dto.response.FeedbackResponse;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<FeedbackResponse> create(
            @Valid @RequestBody FeedbackRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        FeedbackResponse response = feedbackService.create(request, principal.getUser());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackResponse>> getAll() {
        List<FeedbackResponse> feedbacks = feedbackService.getAll();
        return ResponseEntity.ok(feedbacks);
    }
}