package com.jobtrack.repository;

import com.jobtrack.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // NEW

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long>,
        JpaSpecificationExecutor<Application> { // NEW interface added, everything else unchanged

    Optional<Application> findByIdAndUserId(Long id, Long userId);

    List<Application> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    void deleteByIdAndUserId(Long id, Long userId);
}