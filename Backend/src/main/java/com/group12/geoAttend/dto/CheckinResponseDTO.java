package com.group12.geoAttend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CheckinResponseDTO {
    private String status;
    private String attendanceId;
    private String message;
}
