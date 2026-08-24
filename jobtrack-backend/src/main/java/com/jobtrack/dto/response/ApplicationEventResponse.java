package com.jobtrack.dto.response;

import com.jobtrack.entity.EventSource;
import com.jobtrack.entity.EventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ApplicationEventResponse {
    private Long id;
    private EventType eventType;
    private String description;
    private EventSource source;
    private LocalDateTime occurredAt;
}