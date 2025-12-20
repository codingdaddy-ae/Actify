package com.actify.repository;

import com.actify.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByEventId(Long eventId);
    List<EventRegistration> findByUserId(Long userId);
    Optional<EventRegistration> findByUserIdAndEventId(Long userId, Long eventId);
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    long countByEventId(Long eventId);
    long countByEventIdAndStatus(Long eventId, String status);
    
    // New methods for attendance tracking
    List<EventRegistration> findByEventIdAndAttendanceStatus(Long eventId, String attendanceStatus);
    List<EventRegistration> findByAttendanceStatusAndPointsAwardedGreaterThan(String attendanceStatus, Integer points);
    List<EventRegistration> findByAdminReviewedFalseAndPointsAwardedGreaterThan(Integer points);
    
    @Query("SELECT er FROM EventRegistration er WHERE er.pointsAwarded > 0 ORDER BY er.pointsAwardedAt DESC")
    List<EventRegistration> findAllPointDistributions();
    
    @Query("SELECT er FROM EventRegistration er WHERE er.awardedByOrgId = :orgId AND er.pointsAwarded > 0 ORDER BY er.pointsAwardedAt DESC")
    List<EventRegistration> findPointDistributionsByOrg(@Param("orgId") Long orgId);
    
    @Query("SELECT SUM(er.pointsAwarded) FROM EventRegistration er WHERE er.userId = :userId")
    Long getTotalPointsForUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.userId = :userId AND er.attendanceStatus = 'attended'")
    Long countAttendedEventsByUser(@Param("userId") Long userId);
}
