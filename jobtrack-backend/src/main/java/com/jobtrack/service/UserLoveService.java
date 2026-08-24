package com.jobtrack.service;

import com.jobtrack.dto.response.UserLoveResponse;
import com.jobtrack.entity.User;
import com.jobtrack.entity.UserLove;
import com.jobtrack.repository.UserLoveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserLoveService {

    private final UserLoveRepository userLoveRepository;

    public UserLoveResponse create(User user) {
        UserLove love = new UserLove();
        love.setUser(user);
        love.setMessage(user.getFullName() + " sent you love ❤️");
        UserLove saved = userLoveRepository.save(love);
        return toResponse(saved);
    }

    public List<UserLoveResponse> getAll() {
        return userLoveRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public long getCount() {
        return userLoveRepository.count();
    }

    private UserLoveResponse toResponse(UserLove love) {
        return UserLoveResponse.builder()
                .id(love.getId())
                .userName(love.getUser().getFullName())
                .userEmail(love.getUser().getEmail())
                .message(love.getMessage())
                .createdAt(love.getCreatedAt())
                .build();
    }
}