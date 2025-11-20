CREATE DATABASE actify_db;

\c actify_db;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    interests TEXT,
    volunteer_points INTEGER DEFAULT 0,
    events_completed INTEGER DEFAULT 0,
    volunteer_hours INTEGER DEFAULT 0,
    user_type VARCHAR(50) DEFAULT 'volunteer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cause VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    date VARCHAR(50) NOT NULL,
    points_reward INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    organization_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    event_id INTEGER NOT NULL REFERENCES events(id),
    status VARCHAR(50) DEFAULT 'registered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    badge_type VARCHAR(100) NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (first_name, last_name, email, password, phone, country, city, neighborhood, interests, volunteer_points, events_completed, volunteer_hours, user_type)
VALUES 
('Mike', 'Rodriguez', 'demo@actify.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/lLm', '+1 (555) 111-2222', 'USA', 'New York', 'Manhattan', 'environment,education,health', 3200, 52, 260, 'volunteer'),
('Alex', 'Johnson', 'alex.johnson@actify.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/lLm', '+1 (555) 123-4567', 'USA', 'San Francisco', 'Mission District', 'environment,education,health', 1450, 28, 140, 'volunteer'),
('Sarah', 'Chen', 'sarah.chen@actify.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/lLm', '+1 (555) 333-4444', 'USA', 'Los Angeles', 'Downtown', 'elderly,animals,community', 2450, 45, 225, 'volunteer'),
('Emma', 'Wilson', 'emma.wilson@actify.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/lLm', '+1 (555) 555-6666', 'USA', 'Chicago', 'Loop', 'environment,health', 2100, 38, 190, 'volunteer');

INSERT INTO events (name, description, cause, location, latitude, longitude, date, points_reward, status, organization_id)
VALUES 
('Park Cleanup Drive', 'Help us clean up the local park and make it beautiful again', 'environment', 'Central Park, NYC', 40.785091, -73.968285, 'Jan 15, 2025', 50, 'active', 1),
('Community Teaching Workshop', 'Teach local youth valuable skills in tech and entrepreneurship', 'education', 'Community Center, NYC', 40.758896, -73.985130, 'Jan 22, 2025', 75, 'active', 2),
('Tree Planting Initiative', 'Plant trees in the urban forest to combat climate change', 'environment', 'Prospect Park, NYC', 40.661256, -73.969880, 'Jan 29, 2025', 60, 'pending', 1),
('Senior Center Support', 'Spend time with seniors, help with activities and companionship', 'elderly', 'Senior Center, Manhattan', 40.750000, -73.970000, 'Feb 5, 2025', 45, 'pending', 3),
('Beach Cleanup & Restoration', 'Clean up the beach and restore the natural habitat', 'environment', 'Rockaway Beach, NYC', 40.575533, -73.821181, 'Feb 12, 2025', 70, 'completed', 1);
