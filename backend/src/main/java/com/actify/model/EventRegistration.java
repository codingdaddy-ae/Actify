package com.actify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_registrations")
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "event_id", nullable = false)
    private Long eventId;
    
    @Column(nullable = false)
    private String status = "registered";
    
    @Column(name = "registration_date")
    private LocalDateTime registrationDate = LocalDateTime.now();
    
    @Column(name = "attendance_confirmed")
    private Boolean attendanceConfirmed = false;
    
    // New fields for point distribution system
    @Column(name = "attendance_status")
    private String attendanceStatus = "pending"; // pending, attended, partial, no_show
    
    @Column(name = "points_awarded")
    private Integer pointsAwarded = 0;
    
    @Column(name = "points_awarded_at")
    private LocalDateTime pointsAwardedAt;
    
    @Column(name = "awarded_by_org_id")
    private Long awardedByOrgId;
    
    @Column(name = "admin_reviewed")
    private Boolean adminReviewed = false;
    
    @Column(name = "admin_reviewed_at")
    private LocalDateTime adminReviewedAt;
    
    @Column(name = "admin_notes")
    private String adminNotes;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    private Integer rating;
    
    // Transient fields for joined data
    @Transient
    private String userName;
    
    @Transient
    private String userEmail;
    
    @Transient
    private String eventTitle;
    
    @Transient
    private String eventDate;
    
    @Transient
    private Integer eventPoints;
    
    @Transient
    private String organizerName;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
    
    public Boolean getAttendanceConfirmed() { return attendanceConfirmed; }
    public void setAttendanceConfirmed(Boolean attendanceConfirmed) { this.attendanceConfirmed = attendanceConfirmed; }
    
    public String getAttendanceStatus() { return attendanceStatus; }
    public void setAttendanceStatus(String attendanceStatus) { this.attendanceStatus = attendanceStatus; }
    
    public Integer getPointsAwarded() { return pointsAwarded; }
    public void setPointsAwarded(Integer pointsAwarded) { this.pointsAwarded = pointsAwarded; }
    
    public LocalDateTime getPointsAwardedAt() { return pointsAwardedAt; }
    public void setPointsAwardedAt(LocalDateTime pointsAwardedAt) { this.pointsAwardedAt = pointsAwardedAt; }
    
    public Long getAwardedByOrgId() { return awardedByOrgId; }
    public void setAwardedByOrgId(Long awardedByOrgId) { this.awardedByOrgId = awardedByOrgId; }
    
    public Boolean getAdminReviewed() { return adminReviewed; }
    public void setAdminReviewed(Boolean adminReviewed) { this.adminReviewed = adminReviewed; }
    
    public LocalDateTime getAdminReviewedAt() { return adminReviewedAt; }
    public void setAdminReviewedAt(LocalDateTime adminReviewedAt) { this.adminReviewedAt = adminReviewedAt; }
    
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    
    public String getEventTitle() { return eventTitle; }
    public void setEventTitle(String eventTitle) { this.eventTitle = eventTitle; }
    
    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    
    public Integer getEventPoints() { return eventPoints; }
    public void setEventPoints(Integer eventPoints) { this.eventPoints = eventPoints; }
    
    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
}
