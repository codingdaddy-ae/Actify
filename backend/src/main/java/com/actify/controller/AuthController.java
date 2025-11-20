package com.actify.controller;

import com.actify.model.User;
import com.actify.repository.UserRepository;
import com.actify.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> request) {
        try {
            User user = new User();
            user.setFirstName((String) request.get("firstName"));
            user.setLastName((String) request.get("lastName"));
            user.setEmail((String) request.get("email"));
            user.setPhone((String) request.get("phone"));
            user.setCountry((String) request.get("country"));
            user.setCity((String) request.get("city"));
            user.setNeighborhood((String) request.get("neighborhood"));
            user.setInterests(String.join(",", (java.util.List<String>) request.get("interests")));
            user.setPassword(passwordEncoder.encode((String) request.get("password")));
            user.setUserType("volunteer");
            
            userRepository.save(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if(!userOpt.isPresent() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return ResponseEntity.badRequest().body(response);
        }
        
        User user = userOpt.get();
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}
