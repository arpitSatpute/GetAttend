package com.group12.geoAttend.dto;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

@Data
public class UpdateGeofenceDTO {
    private String name;
    private Double centerLat;
    private Double centerLon;
    private Integer radiusMeters;
    private LocalTime startTime;
    private LocalTime endTime;
    private Set<DayOfWeek> allowedDays;
    private Boolean active;
}