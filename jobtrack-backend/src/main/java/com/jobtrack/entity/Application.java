package com.jobtrack.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "applications",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "job_url"}),
        indexes = {
                @Index(name = "idx_application_user", columnList = "user_id"),
                @Index(name = "idx_application_user_status", columnList = "user_id, status")
        }
)
@Getter
@Setter
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String company;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "job_url")
    private String jobUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Portal portal;

    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type")
    private EmploymentType employmentType;

    @Column(name = "salary_stipend")
    private String salaryStipend;

    @Column(name = "job_description", columnDefinition = "TEXT")
    private String jobDescription;

    @Column(name = "external_job_id")
    private String externalJobId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.SAVED;

    @Column(name = "resume_label")
    private String resumeLabel;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "recruiter_name")
    private String recruiterName;

    @Column(name = "recruiter_contact")
    private String recruiterContact;

    @Column(name = "applied_date")
    private LocalDate appliedDate;

    @Column(name = "follow_up_date")
    private LocalDate followUpDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // NEW -- cascade delete ensures when an application is deleted,
    // all its events are deleted too, avoiding foreign key constraint errors
    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ApplicationEvent> events;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}