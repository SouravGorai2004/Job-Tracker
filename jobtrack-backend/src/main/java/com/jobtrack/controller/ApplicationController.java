package com.jobtrack.controller;

import com.jobtrack.dto.request.ApplicationRequest;
import com.jobtrack.dto.request.StatusUpdateRequest;
import com.jobtrack.dto.response.ApplicationResponse;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.jobtrack.dto.response.PageResponse;
import com.jobtrack.entity.ApplicationStatus;
import com.jobtrack.entity.EmploymentType;
import com.jobtrack.entity.Portal;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationResponse> create(
            @Valid @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        ApplicationResponse response = applicationService.create(request, principal.getUser().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public List<ApplicationResponse> getAll(@AuthenticationPrincipal UserPrincipal principal) {
        return applicationService.getAllForUser(principal.getUser().getId());
    }

    @GetMapping("/{id}")
    public ApplicationResponse getById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return applicationService.getById(id, principal.getUser().getId());
    }

    @PutMapping("/{id}")
    public ApplicationResponse update(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return applicationService.update(id, request, principal.getUser().getId());
    }

    // NEW -- separate from PUT so status changes always go through StatusTransitionRules.
    @PatchMapping("/{id}/status")
    public ApplicationResponse updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return applicationService.updateStatus(id, request, principal.getUser().getId());
    }
    // The existing @GetMapping (no path) list-all endpoint above is left as-is
    // for callers who just want everything, unpaginated (e.g. simple scripts).
    // This is the endpoint the React dashboard will actually use.
    @GetMapping("/search")
    public PageResponse<ApplicationResponse> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) Portal portal,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal principal) {

        return applicationService.search(
                principal.getUser().getId(), search, status, portal, location,
                employmentType, fromDate, toDate, pageable);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        applicationService.delete(id, principal.getUser().getId());
        return ResponseEntity.noContent().build();
    }
}