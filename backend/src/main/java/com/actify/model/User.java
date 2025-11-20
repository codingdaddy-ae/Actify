package com.actify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String phone;
    
    @Column(nullable = false)
    private String country;
    
    @Column(nullable = false)
    private String city;
    
    @Column(nullable = false)
    private String neighborhood;
    
    @Column(columnDefinition = "TEXT")
    private String interests;
    
    @Column(nullable = false)
    private Integer volunteerPoints = 0;
    
    @Column(nullable = false)
    private Integer eventsCompleted = 0;
    
    @Column(nullable = false)
    private Integer volunteerHours = 0;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private String userType = "volunteer";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getNeighborhood() { return neighborhood; }
    public void setNeighborhood(String neighborhood) { this.neighborhood = neighborhood; }
    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }
    public Integer getVolunteerPoints() { return volunteerPoints; }
    public void setVolunteerPoints(Integer points) { this.volunteerPoints = points; }
    public Integer getEventsCompleted() { return eventsCompleted; }
    public void setEventsCompleted(Integer count) { this.eventsCompleted = count; }
    public Integer getVolunteerHours() { return volunteerHours; }
    public void setVolunteerHours(Integer hours) { this.volunteerHours = hours; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
}
