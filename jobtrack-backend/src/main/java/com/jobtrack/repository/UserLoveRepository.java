package com.jobtrack.repository;

import com.jobtrack.entity.UserLove;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserLoveRepository extends JpaRepository<UserLove, Long> {

    @Query("SELECT l FROM UserLove l JOIN FETCH l.user ORDER BY l.createdAt DESC")
    List<UserLove> findAllByOrderByCreatedAtDesc();
}