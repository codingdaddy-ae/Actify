# Actify - Java Spring Boot Backend

## Prerequisites
- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher

## Setup Instructions

### 1. Database Setup
\`\`\`bash
psql -U postgres -f database/init.sql
\`\`\`

### 2. Configure application.properties
Edit `src/main/resources/application.properties`:
- Update `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password` with your PostgreSQL credentials

### 3. Build the Project
\`\`\`bash
mvn clean install
\`\`\`

### 4. Run the Application
\`\`\`bash
mvn spring-boot:run
\`\`\`

The server will start on `http://localhost:8080`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users/profile` - Get user profile (requires JWT token)

### Events
- GET `/api/events` - Get all events
- POST `/api/events` - Create new event
- GET `/api/events/{id}` - Get event details
- POST `/api/events/{id}/register` - Register for event

### Leaderboard
- GET `/api/leaderboard` - Get leaderboard rankings

## Default Demo Credentials
- Email: demo@actify.com
- Password: password123 (hashed)

## Demo Data
The database is initialized with sample users, events, and organizations.
