package com.jobtrack.exception;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        ApiError apiError = new ApiError(LocalDateTime.now(), 400, "Bad Request",
                "Validation failed", fieldErrors);
        return ResponseEntity.badRequest().body(apiError);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiError> handleEmailExists(EmailAlreadyExistsException ex) {
        ApiError apiError = new ApiError(LocalDateTime.now(), 409, "Conflict",
                ex.getMessage(), null);
        return ResponseEntity.status(409).body(apiError);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiError> handleBadCredentials(BadCredentialsException ex) {
        ApiError apiError = new ApiError(LocalDateTime.now(), 401, "Unauthorized",
                "Invalid email or password", null);
        return ResponseEntity.status(401).body(apiError);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(AccessDeniedException ex) {
        ApiError apiError = new ApiError(LocalDateTime.now(), 403, "Forbidden",
                "You do not have permission to perform this action", null);
        return ResponseEntity.status(403).body(apiError);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        ApiError apiError = new ApiError(LocalDateTime.now(), 404, "Not Found",
                ex.getMessage(), null);
        return ResponseEntity.status(404).body(apiError);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(org.springframework.dao.DataIntegrityViolationException ex) {
        ApiError apiError = new ApiError(LocalDateTime.now(), 409, "Conflict",
                "This application already exists (duplicate job URL)", null);
        return ResponseEntity.status(409).body(apiError);
    }

    @ExceptionHandler(InvalidStatusTransitionException.class)
    public ResponseEntity<ApiError> handleInvalidTransition(InvalidStatusTransitionException ex) {
        ApiError apiError = new ApiError(LocalDateTime.now(), 400, "Bad Request",
                ex.getMessage(), null);
        return ResponseEntity.badRequest().body(apiError);
    }

    @ExceptionHandler(EventNotEditableException.class)
    public ResponseEntity<ApiError> handleEventNotEditable(EventNotEditableException ex) {
        ApiError apiError = new ApiError(LocalDateTime.now(), 403, "Forbidden",
                ex.getMessage(), null);
        return ResponseEntity.status(403).body(apiError);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex) {
        ApiError apiError = new ApiError(LocalDateTime.now(), 500, "Internal Server Error",
                ex.getMessage(), null);
        return ResponseEntity.status(500).body(apiError);
    }
}