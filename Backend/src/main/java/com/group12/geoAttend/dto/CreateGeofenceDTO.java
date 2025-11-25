package com.group12.geoAttend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

@Data
public class CreateGeofenceDTO {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Latitude is required")
    private Double centerLat;

    @NotNull(message = "Longitude is required")
    private Double centerLon;

    @NotNull(message = "Radius is required")
    private Integer radiusMeters;

    private LocalTime startTime = LocalTime.of(9, 0); // Default 9 AM
    private LocalTime endTime = LocalTime.of(18, 0);  // Default 6 PM

    private Set<DayOfWeek> allowedDays = Set.of(
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY
    );
}