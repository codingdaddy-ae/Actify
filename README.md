# Actify - Volunteer Management Platform

A comprehensive volunteer management system with points, badges, and rewards.

## Project Structure

```
actify/
├── backend/                 # Spring Boot Java backend
│   ├── src/main/java/      # Java source code
│   └── database/           # PostgreSQL init scripts
├── vanilla/                # Production frontend (HTML/CSS/JS)
│   ├── *.html             # All page templates
│   ├── css/               # Modular stylesheets
│   ├── app.js             # Core JavaScript
│   └── components.js      # Reusable components
├── nextjs-version/        # Next.js/React alternative (dev)
└── styles/                # Shared style assets
```

## Technology Stack

### Frontend (Production)
- **Vanilla HTML/CSS/JavaScript** - No build process required
- **Lucide Icons** - Icon library via CDN
- **Leaflet.js** - Interactive maps

### Frontend (Alternative)
- **Next.js 16.0.0** - React framework with Turbopack
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library

### Backend
- **Spring Boot** - Java REST API
- **PostgreSQL** - Database
- **JWT** - Authentication

## Getting Started

### Vanilla Version (Recommended)

1. **Start the backend:**
```bash
cd backend
mvn spring-boot:run
```

2. **Open the frontend:**
Simply open `vanilla/index.html` in your browser, or use a local server:
```bash
cd vanilla
python -m http.server 8000
# or
npx serve
```

3. **Demo Login:**
- Email: `demo@actify.app`
- Password: `demo123`

### Next.js Version

1. **Install dependencies:**
```bash
cd nextjs-version
pnpm install --legacy-peer-deps
```

2. **Run development server:**
```bash
pnpm dev
```

3. **Open browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Features

- 🎯 **Event Management** - Browse and register for volunteer opportunities
- 🏆 **Points System** - Earn points for participation
- 🎖️ **Badges** - Unlock achievements and milestones
- 🎁 **Rewards** - Redeem points for rewards
- 📊 **Leaderboard** - Compare your impact with others
- 📍 **Map Integration** - Find events near you
- 👤 **Profile** - Track your volunteer journey

## API Endpoints

Backend runs on `http://localhost:8080/api`

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /events` - List all events
- `POST /events/{id}/register` - Register for event
- `GET /user/dashboard` - User statistics
- `GET /leaderboard` - Top volunteers

## Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/actify
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### Frontend Configuration
Edit `vanilla/app.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## License

MIT License - feel free to use for your projects!
