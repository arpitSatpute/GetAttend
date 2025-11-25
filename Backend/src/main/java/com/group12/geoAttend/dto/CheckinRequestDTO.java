package com.group12.geoAttend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.Instant;

@Data
public class CheckinRequestDTO {
    @NotNull
    private Double lat;
    @NotNull
    private Double lon;
    private Double accuracy; // meters
    @NotNull
    private Instant deviceTime; // ISO instant from frontend
    @NotNull
    private String deviceId;
    private String method; // optional: CLIENT_CHECK / SERVER_CHECK
    private String rawPayload; // optional full JSON payload sent by app
}
