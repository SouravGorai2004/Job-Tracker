package com.jobtrack.controller;

import com.jobtrack.dto.response.UserLoveResponse;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.UserLoveService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/love")
@RequiredArgsConstructor
public class UserLoveController {

    private final UserLoveService userLoveService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> sendLove(
            @AuthenticationPrincipal UserPrincipal principal) {
        UserLoveResponse response = userLoveService.create(principal.getUser());
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Love sent successfully");
        result.put("data", response);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserLoveResponse>> getAll() {
        List<UserLoveResponse> loves = userLoveService.getAll();
        return ResponseEntity.ok(loves);
    }
}