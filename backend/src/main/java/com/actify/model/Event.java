package com.actify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String cause;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private Double latitude;
    
    @Column(nullable = false)
    private Double longitude;
    
    @Column(nullable = false)
    private String date;
    
    @Column(nullable = false)
    private Integer pointsReward;
    
    @Column(nullable = false)
    private String status = "active";
    
    @Column(nullable = false)
    private Long organizationId;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCause() { return cause; }
    public void setCause(String cause) { this.cause = cause; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public Integer getPointsReward() { return pointsReward; }
    public void setPointsReward(Integer points) { this.pointsReward = points; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getOrganizationId() { return organizationId; }
    public void setOrganizationId(Long id) { this.organizationId = id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
