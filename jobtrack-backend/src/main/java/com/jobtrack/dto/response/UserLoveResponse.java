package com.jobtrack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class UserLoveResponse {
    private Long id;
    private String userName;
    private String userEmail;
    private String message;
    private LocalDateTime createdAt;
}