package com.jobtrack.dto.request;

import com.jobtrack.entity.EventType;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EventRequest {

    @NotNull(message = "Event type is required")
    private EventType eventType;

    private String description;

    @NotNull(message = "Date is required")
    private LocalDate occurredDate;
}