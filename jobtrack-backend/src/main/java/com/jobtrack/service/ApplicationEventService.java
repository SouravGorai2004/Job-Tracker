package com.jobtrack.service;

import com.jobtrack.dto.request.EventRequest;
import com.jobtrack.dto.response.ApplicationEventResponse;
import com.jobtrack.dto.response.RecentActivityResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.ApplicationEvent;
import com.jobtrack.entity.EventSource;
import com.jobtrack.entity.EventType;
import com.jobtrack.exception.EventNotEditableException;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.mapper.ApplicationEventMapper;
import com.jobtrack.repository.ApplicationEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationEventService {

    private final ApplicationEventRepository applicationEventRepository;

    public void logEvent(Application application, EventType eventType, EventSource source, String description) {
        logEvent(application, eventType, source, description, LocalDateTime.now());
    }

    public void logEvent(Application application, EventType eventType, EventSource source,
                         String description, LocalDateTime occurredAt) {
        ApplicationEvent event = new ApplicationEvent();
        event.setApplication(application);
        event.setEventType(eventType);
        event.setSource(source);
        event.setDescription(description);
        event.setOccurredAt(occurredAt);
        applicationEventRepository.save(event);
    }

    public List<ApplicationEventResponse> getTimeline(Long applicationId) {
        return applicationEventRepository.findAllByApplicationIdOrderByOccurredAtAsc(applicationId).stream()
                .map(ApplicationEventMapper::toResponse)
                .toList();
    }

    public List<RecentActivityResponse> getRecentActivity(Long userId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return applicationEventRepository.findRecentByUserId(userId, pageable).stream()
                .map(ApplicationEventMapper::toRecentActivityResponse)
                .toList();
    }

    // NEW -- manual timeline entries. Always source=MANUAL, regardless of what
    // eventType is picked, since the user is the one asserting this happened.
    @Transactional
    public ApplicationEventResponse createManualEvent(Application application, EventRequest request) {
        ApplicationEvent event = new ApplicationEvent();
        event.setApplication(application);
        event.setEventType(request.getEventType());
        event.setDescription(request.getDescription());
        event.setSource(EventSource.MANUAL);
        event.setOccurredAt(request.getOccurredDate().atStartOfDay());
        ApplicationEvent saved = applicationEventRepository.save(event);
        return ApplicationEventMapper.toResponse(saved);
    }

    // NEW
    @Transactional
    public ApplicationEventResponse updateEvent(Long applicationId, Long eventId, EventRequest request) {
        ApplicationEvent event = findManualEvent(applicationId, eventId);
        event.setEventType(request.getEventType());
        event.setDescription(request.getDescription());
        event.setOccurredAt(request.getOccurredDate().atStartOfDay());
        ApplicationEvent saved = applicationEventRepository.save(event);
        return ApplicationEventMapper.toResponse(saved);
    }

    // NEW
    @Transactional
    public void deleteEvent(Long applicationId, Long eventId) {
        ApplicationEvent event = findManualEvent(applicationId, eventId);
        applicationEventRepository.delete(event);
    }

    private ApplicationEvent findManualEvent(Long applicationId, Long eventId) {
        ApplicationEvent event = applicationEventRepository.findByIdAndApplicationId(eventId, applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Timeline event not found"));
        if (event.getSource() != EventSource.MANUAL) {
            throw new EventNotEditableException(
                    "Only manually-added timeline events can be edited or deleted");
        }
        return event;
    }
}