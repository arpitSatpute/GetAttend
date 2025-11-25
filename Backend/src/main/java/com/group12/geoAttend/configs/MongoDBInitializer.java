package com.group12.geoAttend.configs;

import com.group12.geoAttend.entity.GeoFence;
import com.group12.geoAttend.entity.User;
import com.group12.geoAttend.entity.enums.Role;
import com.group12.geoAttend.repository.GeofenceRepository;
import com.group12.geoAttend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.Set;

/**
 * Initialize MongoDB with sample data on first run
 */
@Component
@RequiredArgsConstructor
public class MongoDBInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final GeofenceRepository geofenceRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create admin user if not exists
        if (userRepository.findByEmail("admin@geoattend.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@geoattend.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRoles(Set.of(Role.ADMIN));
            userRepository.save(admin);
            System.out.println("✅ Admin user created: admin@geoattend.com / Admin@123");
        }

        // Create test user if not exists
        if (userRepository.findByEmail("user@geoattend.com").isEmpty()) {
            User user = new User();
            user.setName("Test User");
            user.setEmail("user@geoattend.com");
            user.setPassword(passwordEncoder.encode("User@123"));
            user.setRoles(Set.of(Role.User));
            userRepository.save(user);
            System.out.println("✅ Test user created: user@geoattend.com / User@123");
        }

        // Create sample geofences if not exists
        if (geofenceRepository.count() == 0) {
            // Main Office Geofence
            GeoFence mainOffice = GeoFence.builder()
                    .name("Main Office")
                    .centerLat(21.355897)
                    .centerLon(78.980604)
                    .radiusMeters(500)
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(18, 0))
                    .allowedDays(Set.of(
                            DayOfWeek.MONDAY,
                            DayOfWeek.TUESDAY,
                            DayOfWeek.WEDNESDAY,
                            DayOfWeek.THURSDAY,
                            DayOfWeek.FRIDAY
                    ))
                    .active(true)
                    .priority(1)
                    .build();
            geofenceRepository.save(mainOffice);

            // Branch Office West
            GeoFence branchWest = GeoFence.builder()
                    .name("Branch Office - West")
                    .centerLat(21.315897)
                    .centerLon(78.940604)
                    .radiusMeters(400)
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(18, 0))
                    .allowedDays(Set.of(
                            DayOfWeek.MONDAY,
                            DayOfWeek.TUESDAY,
                            DayOfWeek.WEDNESDAY,
                            DayOfWeek.THURSDAY,
                            DayOfWeek.FRIDAY
                    ))
                    .active(true)
                    .priority(2)
                    .build();
            geofenceRepository.save(branchWest);

            // Branch Office East
            GeoFence branchEast = GeoFence.builder()
                    .name("Branch Office - East")
                    .centerLat(21.375897)
                    .centerLon(79.020604)
                    .radiusMeters(350)
                    .startTime(LocalTime.of(9, 0))
                    .endTime(LocalTime.of(18, 0))
                    .allowedDays(Set.of(
                            DayOfWeek.MONDAY,
                            DayOfWeek.TUESDAY,
                            DayOfWeek.WEDNESDAY,
                            DayOfWeek.THURSDAY,
                            DayOfWeek.FRIDAY
                    ))
                    .active(true)
                    .priority(3)
                    .build();
            geofenceRepository.save(branchEast);

            System.out.println("✅ Sample geofences created");
        }
    }
}