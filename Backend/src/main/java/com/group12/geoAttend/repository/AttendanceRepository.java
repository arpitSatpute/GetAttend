package com.group12.geoAttend.repository;

import com.group12.geoAttend.entity.Attendence;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AttendanceRepository extends MongoRepository<Attendence, String> {
    List<Attendence> findByUser_IdOrderByServerReceivedAtDesc(String userId);
}
