package com.jobtrack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MonthlyCountResponse {
    private String month; // "YYYY-MM"
    private long count;
}