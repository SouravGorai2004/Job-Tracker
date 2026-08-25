package com.jobtrack.repository;

import com.jobtrack.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // JOIN FETCH loads the user in the same query, avoiding
    // LazyInitializationException once open-in-view is disabled.
    @Query("SELECT f FROM Feedback f JOIN FETCH f.user ORDER BY f.createdAt DESC")
    List<Feedback> findAllByOrderByCreatedAtDesc();
}