package com.group12.geoAttend.services;



import com.group12.geoAttend.entity.User;
import com.group12.geoAttend.entity.enums.Role;
import com.group12.geoAttend.exceptions.ResourceNotFoundException;
import com.group12.geoAttend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username).orElse(null);
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    public User loadUserByRole(Role role) {
        return userRepository.findByRoles(role);
    }
}
