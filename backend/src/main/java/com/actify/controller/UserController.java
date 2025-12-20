package com.actify.controller;

import com.actify.model.User;
import com.actify.repository.UserRepository;
import com.actify.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            Long userId = jwtTokenProvider.getUserIdFromToken(cleanToken);
            Optional<User> userOpt = userRepository.findById(userId);
            
            if(!userOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok(userOpt.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/profile/image")
    public ResponseEntity<?> updateProfileImage(
            @RequestHeader("Authorization") String token,
            @RequestBody java.util.Map<String, String> payload) {
        try {
            String cleanToken = token.replace("Bearer ", "");
            Long userId = jwtTokenProvider.getUserIdFromToken(cleanToken);
            Optional<User> userOpt = userRepository.findById(userId);
            
            if(!userOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            User user = userOpt.get();
            String profileImage = payload.get("profileImage");
            user.setProfileImage(profileImage);
            userRepository.save(user);
            
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile image: " + e.getMessage());
        }
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        try {
            // Fetch only top 20 users directly from database
            List<User> leaderboard = userRepository.findTop20ByOrderByVolunteerPointsDesc();
            
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching leaderboard: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if(!userOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(userOpt.get());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching users: " + e.getMessage());
        }
    }
}
