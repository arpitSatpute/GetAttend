package com.group12.geoAttend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document (collection = "attendance")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendence {
    @Id
    private String id;

    @DBRef
    private User user; // assumes your existing User entity is a @Document or mapped appropriately

    @DBRef
    private GeoFence geofence; // nullable if outside

    private double lat;
    private double lon;
    private Double accuracyMeters;

    private Instant deviceTimestamp;
    private Instant serverReceivedAt;

    private String method; // CLIENT_CHECK / SERVER_CHECK

    private String status; // ACCEPTED, PENDING, REJECTED, FLAGGED, OUTSIDE

    private String reason;

    private String rawPayload; // optional JSON string
    private String rawPayloadHash; // optional SHA-256 hex
}