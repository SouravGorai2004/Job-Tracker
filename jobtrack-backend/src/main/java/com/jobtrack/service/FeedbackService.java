package com.jobtrack.service;

import com.jobtrack.dto.request.FeedbackRequest;
import com.jobtrack.dto.response.FeedbackResponse;
import com.jobtrack.entity.Feedback;
import com.jobtrack.entity.User;
import com.jobtrack.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackResponse create(FeedbackRequest request, User user) {
        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setMessage(request.getMessage());
        Feedback saved = feedbackRepository.save(feedback);
        return toResponse(saved);
    }

    public List<FeedbackResponse> getAll() {
        return feedbackRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    private FeedbackResponse toResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .userName(feedback.getUser().getFullName())
                .userEmail(feedback.getUser().getEmail())
                .message(feedback.getMessage())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}