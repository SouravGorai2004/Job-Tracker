package com.jobtrack.dto.response;

import com.jobtrack.entity.ApplicationStatus;
import com.jobtrack.entity.EmploymentType;
import com.jobtrack.entity.Portal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private String company;
    private String jobTitle;
    private String jobUrl;
    private Portal portal;
    private String location;
    private EmploymentType employmentType;
    private String salaryStipend;
    private String jobDescription;
    private String externalJobId;
    private ApplicationStatus status;
    private String resumeLabel;
    private String notes;
    private String recruiterName;
    private String recruiterContact;
    private LocalDate appliedDate;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}