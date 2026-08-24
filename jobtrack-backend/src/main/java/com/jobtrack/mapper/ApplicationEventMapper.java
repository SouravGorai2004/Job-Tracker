package com.jobtrack.mapper;

import com.jobtrack.dto.response.ApplicationEventResponse;
import com.jobtrack.dto.response.RecentActivityResponse;
import com.jobtrack.entity.ApplicationEvent;

public class ApplicationEventMapper {

    public static ApplicationEventResponse toResponse(ApplicationEvent event) {
        return ApplicationEventResponse.builder()
                .id(event.getId())
                .eventType(event.getEventType())
                .description(event.getDescription())
                .source(event.getSource())
                .occurredAt(event.getOccurredAt())
                .build();
    }

    public static RecentActivityResponse toRecentActivityResponse(ApplicationEvent event) {
        return RecentActivityResponse.builder()
                .id(event.getId())
                .applicationId(event.getApplication().getId())
                .company(event.getApplication().getCompany())
                .jobTitle(event.getApplication().getJobTitle())
                .eventType(event.getEventType())
                .description(event.getDescription())
                .source(event.getSource())
                .occurredAt(event.getOccurredAt())
                .build();
    }
}