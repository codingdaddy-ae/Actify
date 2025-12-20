package com.actify.controller;

import com.actify.model.Admin;
import com.actify.model.Event;
import com.actify.model.EventRegistration;
import com.actify.model.User;
import com.actify.model.Organization;
import com.actify.repository.AdminRepository;
import com.actify.repository.EventRepository;
import com.actify.repository.EventRegistrationRepository;
import com.actify.repository.UserRepository;
import com.actify.repository.OrganizationRepository;
import com.actify.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    // Admin Login
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> loginRequest) {
        String identifier = loginRequest.get("username"); // Can be username or email
        String password = loginRequest.get("password");
        
        if (identifier == null || password == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Username and password are required");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Find admin by username or email
        Optional<Admin> adminOpt = adminRepository.findByUsernameOrEmail(identifier, identifier);
        
        if (adminOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(error);
        }
        
        Admin admin = adminOpt.get();
        
        // Check if admin is active
        if (!admin.getIsActive()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "This admin account has been deactivated");
            return ResponseEntity.status(401).body(error);
        }
        
        // Verify password
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(error);
        }
        
        // Update last login
        admin.setLastLogin(LocalDateTime.now());
        adminRepository.save(admin);
        
        // Generate JWT token
        String token = jwtTokenProvider.createToken(admin.getEmail(), "admin");
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("adminId", admin.getId());
        response.put("username", admin.getUsername());
        response.put("email", admin.getEmail());
        response.put("fullName", admin.getFullName());
        response.put("role", admin.getRole());
        
        return ResponseEntity.ok(response);
    }
    
    // Verify admin token
    @GetMapping("/verify")
    public ResponseEntity<?> verifyAdmin(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of("valid", false, "message", "No token provided"));
            }
            
            String token = authHeader.substring(7);
            if (jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.getEmailFromToken(token);
                Optional<Admin> admin = adminRepository.findByEmail(email);
                
                if (admin.isPresent() && admin.get().getIsActive()) {
                    return ResponseEntity.ok(Map.of(
                        "valid", true,
                        "adminId", admin.get().getId(),
                        "username", admin.get().getUsername(),
                        "role", admin.get().getRole()
                    ));
                }
            }
            return ResponseEntity.status(401).body(Map.of("valid", false, "message", "Invalid token"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("valid", false, "message", "Token validation failed"));
        }
    }
    
    // Create initial admin (only works if no admins exist - for initial setup)
    @PostMapping("/setup")
    public ResponseEntity<?> setupAdmin(@RequestBody Map<String, String> setupRequest) {
        // Check if any admin already exists
        if (adminRepository.count() > 0) {
            // If admins exist, require super_admin token to create new admin
            String authHeader = setupRequest.get("authToken");
            if (authHeader == null) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Admin system already initialized. Contact super admin to add new admins.");
                return ResponseEntity.status(403).body(error);
            }
        }
        
        String username = setupRequest.get("username");
        String email = setupRequest.get("email");
        String password = setupRequest.get("password");
        String fullName = setupRequest.get("fullName");
        String secretKey = setupRequest.get("secretKey");
        
        // Validate secret key for initial setup (change this in production!)
        String ADMIN_SECRET_KEY = "ACTIFY_ADMIN_2024_SECRET";
        if (!ADMIN_SECRET_KEY.equals(secretKey)) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid setup key");
            return ResponseEntity.status(403).body(error);
        }
        
        if (username == null || email == null || password == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Username, email, and password are required");
            return ResponseEntity.badRequest().body(error);
        }
        
        // Check if username or email already exists
        if (adminRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Username already exists"));
        }
        if (adminRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email already exists"));
        }
        
        // Create new admin
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setFullName(fullName != null ? fullName : username);
        admin.setRole(adminRepository.count() == 0 ? "super_admin" : "admin");
        admin.setIsActive(true);
        
        adminRepository.save(admin);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Admin created successfully");
        response.put("adminId", admin.getId());
        response.put("username", admin.getUsername());
        response.put("role", admin.getRole());
        
        return ResponseEntity.ok(response);
    }
    
    // Get all pending events
    @GetMapping("/events/pending")
    public ResponseEntity<?> getPendingEvents() {
        List<Event> events = eventRepository.findByStatus("pending");
        return ResponseEntity.ok(events);
    }
    
    // Approve an event
    @PutMapping("/events/{id}/approve")
    public ResponseEntity<?> approveEvent(@PathVariable Long id) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        
        if (eventOpt.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Event not found");
            return ResponseEntity.notFound().build();
        }
        
        Event event = eventOpt.get();
        event.setStatus("active");
        eventRepository.save(event);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Event approved successfully");
        response.put("event", event);
        
        return ResponseEntity.ok(response);
    }
    
    // Reject an event
    @PutMapping("/events/{id}/reject")
    public ResponseEntity<?> rejectEvent(@PathVariable Long id) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Event event = eventOpt.get();
        event.setStatus("rejected");
        eventRepository.save(event);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Event rejected");
        response.put("event", event);
        
        return ResponseEntity.ok(response);
    }
    
    // Update event status
    @PutMapping("/events/{id}/status")
    public ResponseEntity<?> updateEventStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Event> eventOpt = eventRepository.findById(id);
        
        if (eventOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Status is required");
            return ResponseEntity.badRequest().body(error);
        }
        
        Event event = eventOpt.get();
        event.setStatus(newStatus);
        eventRepository.save(event);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Event status updated to " + newStatus);
        response.put("event", event);
        
        return ResponseEntity.ok(response);
    }
    
    // Get admin stats
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        List<Event> allEvents = eventRepository.findAll();
        
        long pendingCount = allEvents.stream().filter(e -> "pending".equals(e.getStatus())).count();
        long activeCount = allEvents.stream().filter(e -> "active".equals(e.getStatus())).count();
        long rejectedCount = allEvents.stream().filter(e -> "rejected".equals(e.getStatus())).count();
        long completedCount = allEvents.stream().filter(e -> "completed".equals(e.getStatus())).count();
        
        // Get point distribution stats
        List<EventRegistration> allDistributions = eventRegistrationRepository.findAllPointDistributions();
        int totalPointsDistributed = allDistributions.stream()
            .mapToInt(r -> r.getPointsAwarded() != null ? r.getPointsAwarded() : 0).sum();
        long unreviewedDistributions = allDistributions.stream()
            .filter(r -> !Boolean.TRUE.equals(r.getAdminReviewed())).count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEvents", allEvents.size());
        stats.put("pendingEvents", pendingCount);
        stats.put("activeEvents", activeCount);
        stats.put("rejectedEvents", rejectedCount);
        stats.put("completedEvents", completedCount);
        stats.put("totalPointsDistributed", totalPointsDistributed);
        stats.put("totalDistributions", allDistributions.size());
        stats.put("unreviewedDistributions", unreviewedDistributions);
        
        return ResponseEntity.ok(stats);
    }
    
    // ===== Points Distribution Audit Endpoints =====
    
    // Get all point distributions for admin review
    @GetMapping("/points/distributions")
    public ResponseEntity<?> getAllPointDistributions(
            @RequestParam(required = false) String filter,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin token
            if (!verifyAdminToken(authHeader)) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }
            
            List<EventRegistration> distributions = eventRegistrationRepository.findAllPointDistributions();
            List<Map<String, Object>> distributionList = new ArrayList<>();
            
            for (EventRegistration reg : distributions) {
                // Apply filter if provided
                if ("unreviewed".equals(filter) && Boolean.TRUE.equals(reg.getAdminReviewed())) {
                    continue;
                }
                if ("reviewed".equals(filter) && !Boolean.TRUE.equals(reg.getAdminReviewed())) {
                    continue;
                }
                
                Optional<User> userOpt = userRepository.findById(reg.getUserId());
                Optional<Event> eventOpt = eventRepository.findById(reg.getEventId());
                
                if (userOpt.isPresent() && eventOpt.isPresent()) {
                    User user = userOpt.get();
                    Event event = eventOpt.get();
                    
                    String orgName = "Unknown";
                    if (reg.getAwardedByOrgId() != null) {
                        Optional<Organization> orgOpt = organizationRepository.findById(reg.getAwardedByOrgId());
                        if (orgOpt.isPresent()) {
                            orgName = orgOpt.get().getName();
                        }
                    }
                    
                    Map<String, Object> item = new HashMap<>();
                    item.put("registrationId", reg.getId());
                    item.put("volunteerId", user.getId());
                    item.put("volunteerName", user.getFirstName() + " " + user.getLastName());
                    item.put("volunteerEmail", user.getEmail());
                    item.put("eventId", event.getId());
                    item.put("eventTitle", event.getTitle());
                    item.put("eventDate", event.getDate());
                    item.put("organizationId", reg.getAwardedByOrgId());
                    item.put("organizationName", orgName);
                    item.put("attendanceStatus", reg.getAttendanceStatus());
                    item.put("pointsAwarded", reg.getPointsAwarded());
                    item.put("expectedPoints", event.getPointsReward());
                    item.put("pointsAwardedAt", reg.getPointsAwardedAt());
                    item.put("adminReviewed", reg.getAdminReviewed());
                    item.put("adminReviewedAt", reg.getAdminReviewedAt());
                    item.put("adminNotes", reg.getAdminNotes());
                    distributionList.add(item);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("distributions", distributionList);
            response.put("total", distributionList.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Mark distribution as reviewed by admin
    @PutMapping("/points/distributions/{registrationId}/review")
    public ResponseEntity<?> reviewPointDistribution(
            @PathVariable Long registrationId,
            @RequestBody Map<String, Object> request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            // Verify admin token
            if (!verifyAdminToken(authHeader)) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }
            
            Optional<EventRegistration> regOpt = eventRegistrationRepository.findById(registrationId);
            if (!regOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            EventRegistration reg = regOpt.get();
            String action = (String) request.get("action"); // approve, adjust, revoke
            String notes = (String) request.get("notes");
            
            reg.setAdminReviewed(true);
            reg.setAdminReviewedAt(LocalDateTime.now());
            reg.setAdminNotes(notes);
            
            if ("adjust".equals(action)) {
                // Adjust points
                Integer newPoints = Integer.valueOf(request.get("newPoints").toString());
                Integer oldPoints = reg.getPointsAwarded();
                int pointsDiff = newPoints - oldPoints;
                
                // Update user's points
                Optional<User> userOpt = userRepository.findById(reg.getUserId());
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    user.setVolunteerPoints(user.getVolunteerPoints() + pointsDiff);
                    userRepository.save(user);
                }
                
                reg.setPointsAwarded(newPoints);
            } else if ("revoke".equals(action)) {
                // Revoke points
                Integer oldPoints = reg.getPointsAwarded();
                
                // Deduct from user
                Optional<User> userOpt = userRepository.findById(reg.getUserId());
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    user.setVolunteerPoints(Math.max(0, user.getVolunteerPoints() - oldPoints));
                    if ("attended".equals(reg.getAttendanceStatus())) {
                        user.setEventsCompleted(Math.max(0, user.getEventsCompleted() - 1));
                    }
                    userRepository.save(user);
                }
                
                reg.setPointsAwarded(0);
                reg.setAttendanceStatus("revoked");
            }
            // "approve" action just marks as reviewed without changes
            
            eventRegistrationRepository.save(reg);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Point distribution " + action + "d successfully");
            response.put("registrationId", registrationId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Get points summary by organization
    @GetMapping("/points/by-organization")
    public ResponseEntity<?> getPointsByOrganization(@RequestHeader("Authorization") String authHeader) {
        try {
            if (!verifyAdminToken(authHeader)) {
                return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
            }
            
            List<Organization> orgs = organizationRepository.findAll();
            List<Map<String, Object>> orgStats = new ArrayList<>();
            
            for (Organization org : orgs) {
                List<EventRegistration> distributions = eventRegistrationRepository.findPointDistributionsByOrg(org.getId());
                
                int totalPoints = distributions.stream()
                    .mapToInt(r -> r.getPointsAwarded() != null ? r.getPointsAwarded() : 0).sum();
                long unreviewed = distributions.stream()
                    .filter(r -> !Boolean.TRUE.equals(r.getAdminReviewed())).count();
                
                Map<String, Object> stat = new HashMap<>();
                stat.put("orgId", org.getId());
                stat.put("orgName", org.getName());
                stat.put("totalDistributions", distributions.size());
                stat.put("totalPointsAwarded", totalPoints);
                stat.put("unreviewedCount", unreviewed);
                stat.put("verified", org.getVerified());
                orgStats.add(stat);
            }
            
            return ResponseEntity.ok(Map.of("organizations", orgStats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    // Helper method to verify admin token
    private boolean verifyAdminToken(String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return false;
            }
            String token = authHeader.substring(7);
            if (jwtTokenProvider.validateToken(token)) {
                String email = jwtTokenProvider.getEmailFromToken(token);
                Optional<Admin> admin = adminRepository.findByEmail(email);
                return admin.isPresent() && admin.get().getIsActive();
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
