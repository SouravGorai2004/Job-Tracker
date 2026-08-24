package com.jobtrack.dto.request;

import com.jobtrack.entity.ApplicationStatus;
import com.jobtrack.entity.EmploymentType;
import com.jobtrack.entity.Portal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ApplicationRequest {

    @NotBlank(message = "Company is required")
    private String company;

    @NotBlank(message = "Job title is required")
    private String jobTitle;

    private String jobUrl;

    @NotNull(message = "Portal is required")
    private Portal portal;

    private String location;
    private EmploymentType employmentType;
    private String salaryStipend;
    private String jobDescription;
    private String externalJobId;

    // Optional on create -- service defaults to APPLIED if null.
    // NOTE: from Batch 4 onward, status changes here will NOT go through
    // transition validation -- that's handled by a dedicated endpoint.
    private ApplicationStatus status;

    private String resumeLabel;
    private String notes;
    private String recruiterName;
    private String recruiterContact;
    private LocalDate appliedDate;
    private LocalDate followUpDate;
}