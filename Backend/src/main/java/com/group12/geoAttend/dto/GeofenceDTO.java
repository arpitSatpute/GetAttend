package com.group12.geoAttend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeofenceDTO {
    private String id;
    private String name;
    private double centerLat;
    private double centerLon;
    private int radiusMeters;
    private LocalTime startTime;
    private LocalTime endTime;
    private Set<DayOfWeek> allowedDays;
    private boolean active;
    private int priority;
}