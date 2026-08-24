package com.jobtrack.mapper;

import com.jobtrack.dto.request.ApplicationRequest;
import com.jobtrack.dto.response.ApplicationResponse;
import com.jobtrack.entity.Application;
import com.jobtrack.entity.ApplicationStatus;

import java.time.LocalDate;

public class ApplicationMapper {

    // Plain static mapper -- no MapStruct/ModelMapper. Few enough fields that
    // manual mapping stays readable, and it's easier to debug as a beginner.

    public static Application toEntity(ApplicationRequest request) {
        Application application = new Application();
        applyRequestToEntity(request, application);
        return application;
    }

    public static void applyRequestToEntity(ApplicationRequest request, Application application) {
        application.setCompany(request.getCompany());
        application.setJobTitle(request.getJobTitle());
        application.setJobUrl(request.getJobUrl());
        application.setPortal(request.getPortal());
        application.setLocation(request.getLocation());
        application.setEmploymentType(request.getEmploymentType());
        application.setSalaryStipend(request.getSalaryStipend());
        application.setJobDescription(request.getJobDescription());
        application.setExternalJobId(request.getExternalJobId());
        application.setResumeLabel(request.getResumeLabel());
        application.setNotes(request.getNotes());
        application.setRecruiterName(request.getRecruiterName());
        application.setRecruiterContact(request.getRecruiterContact());
        application.setFollowUpDate(request.getFollowUpDate());

        ApplicationStatus status = request.getStatus() != null ? request.getStatus() : ApplicationStatus.APPLIED;
        application.setStatus(status);

        LocalDate appliedDate = request.getAppliedDate() != null ? request.getAppliedDate() : LocalDate.now();
        application.setAppliedDate(appliedDate);
    }

    public static ApplicationResponse toResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .company(application.getCompany())
                .jobTitle(application.getJobTitle())
                .jobUrl(application.getJobUrl())
                .portal(application.getPortal())
                .location(application.getLocation())
                .employmentType(application.getEmploymentType())
                .salaryStipend(application.getSalaryStipend())
                .jobDescription(application.getJobDescription())
                .externalJobId(application.getExternalJobId())
                .status(application.getStatus())
                .resumeLabel(application.getResumeLabel())
                .notes(application.getNotes())
                .recruiterName(application.getRecruiterName())
                .recruiterContact(application.getRecruiterContact())
                .appliedDate(application.getAppliedDate())
                .followUpDate(application.getFollowUpDate())
                .createdAt(application.getCreatedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}