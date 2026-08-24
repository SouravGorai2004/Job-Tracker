package com.jobtrack.specification;

import com.jobtrack.entity.Application;
import com.jobtrack.entity.ApplicationStatus;
import com.jobtrack.entity.EmploymentType;
import com.jobtrack.entity.Portal;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

/**
 * Each method returns a small, independent filter. The service combines only
 * the ones the caller actually provided using .and() -- this is what lets us
 * support 6 optional filters without writing 2^6 query variations.
 */
public class ApplicationSpecifications {

    public static Specification<Application> belongsToUser(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Application> searchText(String text) {
        String pattern = "%" + text.toLowerCase() + "%";
        return (root, query, cb) -> cb.or(
                cb.like(cb.lower(root.get("company")), pattern),
                cb.like(cb.lower(root.get("jobTitle")), pattern),
                cb.like(cb.lower(cb.coalesce(root.get("jobDescription"), "")), pattern)
        );
    }

    public static Specification<Application> hasStatus(ApplicationStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Application> hasPortal(Portal portal) {
        return (root, query, cb) -> cb.equal(root.get("portal"), portal);
    }

    public static Specification<Application> hasLocation(String location) {
        String pattern = "%" + location.toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get("location")), pattern);
    }

    public static Specification<Application> hasEmploymentType(EmploymentType type) {
        return (root, query, cb) -> cb.equal(root.get("employmentType"), type);
    }

    public static Specification<Application> appliedFrom(LocalDate from) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("appliedDate"), from);
    }

    public static Specification<Application> appliedTo(LocalDate to) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("appliedDate"), to);
    }
}