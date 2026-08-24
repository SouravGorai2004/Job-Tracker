package com.jobtrack.repository;

import com.jobtrack.entity.ApplicationEvent;
import com.jobtrack.entity.EventType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ApplicationEventRepository extends JpaRepository<ApplicationEvent, Long> {

    List<ApplicationEvent> findAllByApplicationIdOrderByOccurredAtAsc(Long applicationId);

    Optional<ApplicationEvent> findByIdAndApplicationId(Long id, Long applicationId); // NEW

    @Query("SELECT COUNT(DISTINCT ae.application.id) FROM ApplicationEvent ae " +
            "WHERE ae.application.user.id = :userId AND ae.eventType = :eventType")
    long countDistinctApplicationsByUserIdAndEventType(@Param("userId") Long userId,
                                                       @Param("eventType") EventType eventType);

    @Query("SELECT ae FROM ApplicationEvent ae JOIN FETCH ae.application a " +
            "WHERE a.user.id = :userId ORDER BY ae.occurredAt DESC")
    List<ApplicationEvent> findRecentByUserId(@Param("userId") Long userId, Pageable pageable);
}