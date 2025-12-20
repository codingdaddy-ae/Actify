-- ============================================
-- Migration: Add Point Distribution System Columns
-- Actify Database
-- ============================================

-- Add new columns to event_registrations table for attendance tracking and points distribution
ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS attendance_status VARCHAR(50) DEFAULT 'pending' 
    CHECK (attendance_status IN ('pending', 'attended', 'partial', 'no_show', 'revoked'));

ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS points_awarded INTEGER DEFAULT 0;

ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS points_awarded_at TIMESTAMP;

ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS awarded_by_org_id INTEGER REFERENCES organizations(id);

ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS admin_reviewed BOOLEAN DEFAULT FALSE;

ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS admin_reviewed_at TIMESTAMP;

ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_attendance_status ON event_registrations(attendance_status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_points_awarded ON event_registrations(points_awarded);
CREATE INDEX IF NOT EXISTS idx_event_registrations_admin_reviewed ON event_registrations(admin_reviewed);
CREATE INDEX IF NOT EXISTS idx_event_registrations_awarded_by_org ON event_registrations(awarded_by_org_id);

-- Update existing registrations to have proper default values
UPDATE event_registrations 
SET attendance_status = 'pending', 
    points_awarded = 0, 
    admin_reviewed = FALSE 
WHERE attendance_status IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN event_registrations.attendance_status IS 'Attendance status: pending, attended, partial, no_show, revoked';
COMMENT ON COLUMN event_registrations.points_awarded IS 'Number of volunteer points awarded for this registration';
COMMENT ON COLUMN event_registrations.points_awarded_at IS 'Timestamp when points were awarded';
COMMENT ON COLUMN event_registrations.awarded_by_org_id IS 'Organization that awarded the points';
COMMENT ON COLUMN event_registrations.admin_reviewed IS 'Whether an admin has reviewed this point distribution';
COMMENT ON COLUMN event_registrations.admin_reviewed_at IS 'Timestamp when admin reviewed';
COMMENT ON COLUMN event_registrations.admin_notes IS 'Admin notes about the point distribution';

-- Verify migration
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'event_registrations' 
ORDER BY ordinal_position;
