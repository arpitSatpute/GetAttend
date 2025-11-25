package com.group12.geoAttend.repository;

import com.group12.geoAttend.entity.GeoFence;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GeofenceRepository extends MongoRepository<GeoFence, String> {
    List<GeoFence> findByActiveTrue();
}
