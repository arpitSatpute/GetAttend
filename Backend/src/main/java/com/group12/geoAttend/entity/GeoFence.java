package com.group12.geoAttend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

@Document(collection = "geofences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeoFence {
    @Id
    private String id;

    private String name;
    private double centerLat;
    private double centerLon;
    private int radiusMeters; // in meters

    private LocalTime startTime;
    private LocalTime endTime;

    private Set<DayOfWeek> allowedDays;

    private boolean active = true;
    private int priority = 0;
}
