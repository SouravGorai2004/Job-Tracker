package com.jobtrack.repository;

import com.jobtrack.entity.UserLove;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserLoveRepository extends JpaRepository<UserLove, Long> {
    List<UserLove> findAllByOrderByCreatedAtDesc();
}