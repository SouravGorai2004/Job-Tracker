package com.jobtrack.service;

import com.jobtrack.dto.request.ApplicationRequest;
import com.jobtrack.dto.request.StatusUpdateRequest;
import com.jobtrack.dto.response.ApplicationResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.ApplicationStatus;
import com.jobtrack.entity.EventSource;
import com.jobtrack.entity.EventType;
import com.jobtrack.exception.InvalidStatusTransitionException;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.mapper.ApplicationMapper;
import com.jobtrack.repository.ApplicationRepository;
import com.jobtrack.repository.UserRepository;
import com.jobtrack.util.StatusTransitionRules;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.jobtrack.dto.response.PageResponse;
import com.jobtrack.specification.ApplicationSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ApplicationEventService applicationEventService; // NEW

    @Transactional
    public ApplicationResponse create(ApplicationRequest request, Long userId) {
        Application application = ApplicationMapper.toEntity(request);
        application.setUser(userRepository.getReferenceById(userId));

        Application saved = applicationRepository.save(application);

        // Auto-log the initial timeline event based on starting status.
        // SAVED gets no event -- it's just a bookmark, nothing has happened yet.
        EventType initialEventType = statusToEventType(saved.getStatus());
        if (initialEventType != null) {
            LocalDateTime occurredAt = saved.getAppliedDate() != null
                    ? saved.getAppliedDate().atStartOfDay()
                    : LocalDateTime.now();
            applicationEventService.logEvent(saved, initialEventType, EventSource.SYSTEM,
                    "Application created with status " + saved.getStatus(), occurredAt);
        }

        return ApplicationMapper.toResponse(saved);
    }

    public PageResponse<ApplicationResponse> search(
            Long userId,
            String searchText,
            ApplicationStatus status,
            com.jobtrack.entity.Portal portal,
            String location,
            com.jobtrack.entity.EmploymentType employmentType,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable) {

        Specification<Application> spec = ApplicationSpecifications.belongsToUser(userId);

        if (searchText != null && !searchText.isBlank()) {
            spec = spec.and(ApplicationSpecifications.searchText(searchText));
        }
        if (status != null) {
            spec = spec.and(ApplicationSpecifications.hasStatus(status));
        }
        if (portal != null) {
            spec = spec.and(ApplicationSpecifications.hasPortal(portal));
        }
        if (location != null && !location.isBlank()) {
            spec = spec.and(ApplicationSpecifications.hasLocation(location));
        }
        if (employmentType != null) {
            spec = spec.and(ApplicationSpecifications.hasEmploymentType(employmentType));
        }
        if (fromDate != null) {
            spec = spec.and(ApplicationSpecifications.appliedFrom(fromDate));
        }
        if (toDate != null) {
            spec = spec.and(ApplicationSpecifications.appliedTo(toDate));
        }

        Page<Application> page = applicationRepository.findAll(spec, pageable);
        Page<ApplicationResponse> responsePage = page.map(ApplicationMapper::toResponse);
        return PageResponse.from(responsePage);
    }

    public ApplicationResponse getById(Long id, Long userId) {
        Application application = findOwned(id, userId);
        return ApplicationMapper.toResponse(application);
    }

    // NEW -- exposes the entity (not just the DTO) for other services, after
    // the same user_id-scoped ownership check as everywhere else in this class.
    public Application getOwnedEntity(Long id, Long userId) {
        return findOwned(id, userId);
    }

    public List<ApplicationResponse> getAllForUser(Long userId) {
        return applicationRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ApplicationMapper::toResponse)
                .toList();
    }

    @Transactional
    public ApplicationResponse update(Long id, ApplicationRequest request, Long userId) {
        // This edits general fields ONLY. It intentionally does not run
        // transition validation -- use updateStatus() below for status changes.
        Application application = findOwned(id, userId);
        ApplicationMapper.applyRequestToEntity(request, application);
        Application saved = applicationRepository.save(application);
        return ApplicationMapper.toResponse(saved);
    }

    @Transactional
    public ApplicationResponse updateStatus(Long id, StatusUpdateRequest request, Long userId) {
        Application application = findOwned(id, userId);
        ApplicationStatus currentStatus = application.getStatus();
        ApplicationStatus newStatus = request.getStatus();

        if (!StatusTransitionRules.isAllowed(currentStatus, newStatus)) {
            throw new InvalidStatusTransitionException(
                    "Cannot move application from " + currentStatus + " to " + newStatus);
        }

        application.setStatus(newStatus);
        Application saved = applicationRepository.save(application);

        EventType eventType = statusToEventType(newStatus);
        String description = (request.getNote() != null && !request.getNote().isBlank())
                ? request.getNote()
                : "Status manually updated to " + newStatus;

        if (eventType != null) {
            applicationEventService.logEvent(saved, eventType, EventSource.MANUAL, description);
        }

        return ApplicationMapper.toResponse(saved);
    }

    @Transactional
    public void delete(Long id, Long userId) {
        findOwned(id, userId);
        applicationRepository.deleteByIdAndUserId(id, userId);
    }

    private Application findOwned(Long id, Long userId) {
        return applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }

    // Single mapping point: status -> the event logged when that status is reached.
    private EventType statusToEventType(ApplicationStatus status) {
        return switch (status) {
            case SAVED -> null;
            case APPLIED -> EventType.APPLICATION_SUBMITTED;
            case ASSESSMENT -> EventType.ASSESSMENT_INVITE;
            case INTERVIEW -> EventType.INTERVIEW_INVITE;
            case OFFER -> EventType.OFFER_RECEIVED;
            case ACCEPTED -> EventType.OFFER_ACCEPTED;
            case REJECTED -> EventType.REJECTED;
            case WITHDRAWN -> EventType.WITHDRAWN;
        };
    }
}