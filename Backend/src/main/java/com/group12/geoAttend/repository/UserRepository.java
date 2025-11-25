package com.group12.geoAttend.repository;


import com.group12.geoAttend.entity.User;
import com.group12.geoAttend.entity.enums.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);

    User findByRoles(Role role);
    Optional<User> findByUsername(String username);

}
