package com.jobtrack.dto.request;

import com.jobtrack.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private String note; // optional, shown in the timeline entry if provided
}