package com.jobtrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {

    @NotBlank(message = "Feedback message is required")
    private String message;
}