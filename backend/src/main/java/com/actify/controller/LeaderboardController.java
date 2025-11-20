package com.actify.controller;

import com.actify.model.User;
import com.actify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping
    public ResponseEntity<?> getLeaderboard() {
        List<User> users = userRepository.findAll().stream()
            .sorted((a, b) -> b.getVolunteerPoints().compareTo(a.getVolunteerPoints()))
            .limit(20)
            .collect(Collectors.toList());
        
        java.util.List<java.util.Map<String, Object>> leaderboard = users.stream()
            .map(user -> {
                java.util.Map<String, Object> entry = new java.util.HashMap<>();
                entry.put("name", user.getFirstName() + " " + user.getLastName());
                entry.put("points", user.getVolunteerPoints());
                entry.put("events", user.getEventsCompleted());
                entry.put("hours", user.getVolunteerHours());
                entry.put("badges", 5);
                return entry;
            })
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(leaderboard);
    }
}
