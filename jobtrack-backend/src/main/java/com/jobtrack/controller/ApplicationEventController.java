package com.jobtrack.controller;

import com.jobtrack.dto.request.EventRequest;
import com.jobtrack.dto.response.ApplicationEventResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.ApplicationEventService;
import com.jobtrack.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications/{applicationId}/events")
@RequiredArgsConstructor
public class ApplicationEventController {

    private final ApplicationEventService applicationEventService;
    private final ApplicationService applicationService;

    @GetMapping
    public List<ApplicationEventResponse> getTimeline(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal UserPrincipal principal) {
        applicationService.getById(applicationId, principal.getUser().getId());
        return applicationEventService.getTimeline(applicationId);
    }

    // NEW
    @PostMapping
    public ResponseEntity<ApplicationEventResponse> addEvent(
            @PathVariable Long applicationId,
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Application application = applicationService.getOwnedEntity(applicationId, principal.getUser().getId());
        ApplicationEventResponse response = applicationEventService.createManualEvent(application, request);
        return ResponseEntity.status(201).body(response);
    }

    // NEW
    @PutMapping("/{eventId}")
    public ApplicationEventResponse updateEvent(
            @PathVariable Long applicationId,
            @PathVariable Long eventId,
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        applicationService.getById(applicationId, principal.getUser().getId()); // ownership check
        return applicationEventService.updateEvent(applicationId, eventId, request);
    }

    // NEW
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable Long applicationId,
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserPrincipal principal) {
        applicationService.getById(applicationId, principal.getUser().getId());
        applicationEventService.deleteEvent(applicationId, eventId);
        return ResponseEntity.noContent().build();
    }
}