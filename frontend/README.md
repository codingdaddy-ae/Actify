# VolunteerHub - Vanilla HTML/CSS/JS Version

This is the vanilla HTML, CSS, and JavaScript version of the VolunteerHub application, converted from Next.js/React while maintaining all the same UI and functionality.

## 📁 Project Structure

```
vanilla/
├── index.html           # Landing page
├── dashboard.html       # User dashboard
├── login.html          # Login page
├── register.html       # Registration page
├── events.html         # Events listing with map view
├── leaderboard.html    # Leaderboard
├── styles.css          # Complete styling (Tailwind-like)
├── app.js             # Core JavaScript (API, auth, utilities)
└── components.js      # Reusable component functions
```

## 🚀 Getting Started

### 1. Backend Setup (Java Spring Boot)

The backend is already set up in the `backend/` folder. To run it:

```bash
cd backend
mvn spring-boot:run
```

The backend will run on `http://localhost:8080`

### 2. Frontend Setup (Vanilla HTML/CSS/JS)

Simply open the HTML files in a web browser or use a local server:

**Option A: Using Python**
```bash
cd vanilla
python -m http.server 3000
```

**Option B: Using Node.js http-server**
```bash
npm install -g http-server
cd vanilla
http-server -p 3000
```

**Option C: Using VS Code Live Server**
- Install the "Live Server" extension
- Right-click on `index.html`
- Select "Open with Live Server"

Then navigate to `http://localhost:3000`

## 🎯 Features

### ✅ All Features Implemented

1. **Landing Page (`index.html`)**
   - Hero section with call-to-action
   - Feature cards
   - Statistics section
   - How it works section
   - Testimonials
   - Footer

2. **Authentication**
   - Login page with API integration
   - Registration page with form validation
   - JWT token storage in localStorage
   - Protected routes

3. **Dashboard (`dashboard.html`)**
   - User stats (Volunteer Points, Events Completed, Hours)
   - Badge showcase
   - Upcoming events list
   - Quick action buttons

4. **Events Page (`events.html`)**
   - Grid view of all events
   - Map view with markers (Leaflet.js)
   - Filter by cause (Environment, Education, Charity, Health)
   - Event registration functionality
   - Event cards with all details

5. **Leaderboard (`leaderboard.html`)**
   - Top volunteers ranking
   - Current user highlighting
   - Points and events count

## 🔌 Backend API Integration

The app connects to your Spring Boot backend at `http://localhost:8080/api`

### API Endpoints Used:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/users/profile` - Get user profile data
- `GET /api/events` - Get all events
- `POST /api/events/{id}/register` - Register for an event
- `GET /api/leaderboard` - Get leaderboard data

### Updating API URL

Edit `vanilla/app.js` and change the `API_BASE_URL` constant:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 🎨 Styling

The CSS file (`styles.css`) is a complete recreation of the Tailwind CSS styling from the Next.js version:

- CSS Variables for theming
- Emerald green color scheme
- Responsive design (mobile-first)
- Smooth transitions and hover effects
- Card components, buttons, forms
- Grid layouts

## 📱 Responsive Design

All pages are fully responsive:
- Mobile navigation menu
- Responsive grids
- Touch-friendly buttons
- Optimized layouts for tablets and phones

## 🔐 Authentication Flow

1. User registers or logs in
2. JWT token is stored in `localStorage`
3. Token is sent with each API request in the `Authorization` header
4. If token expires (401 response), user is redirected to login

## 🗺️ Map Integration

The events page uses **Leaflet.js** for interactive maps:
- OpenStreetMap tiles
- Event markers with popups
- Coordinates from event data
- Click markers to see event details

## 🎯 Icons

Using **Lucide Icons** via CDN:
```html
<script src="https://unpkg.com/lucide@latest"></script>
```

Icons are initialized with:
```javascript
lucide.createIcons();
```

## 🛠️ Customization

### Changing Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --emerald-600: #059669;  /* Primary color */
    --accent: #fbbf24;       /* Accent color (gold) */
}
```

### Adding New Pages

1. Create new HTML file
2. Include CSS and JS:
```html
<link rel="stylesheet" href="styles.css">
<script src="app.js"></script>
<script src="components.js"></script>
<script src="https://unpkg.com/lucide@latest"></script>
```
3. Initialize icons: `lucide.createIcons();`

## 📊 State Management

- User data stored in `localStorage`
- Token-based authentication
- Real-time data fetching from backend
- Fallback to mock data if API is unavailable

## 🐛 Debugging

1. **Check Console**: Open browser DevTools (F12) → Console tab
2. **Network Tab**: Monitor API calls in DevTools → Network tab
3. **Check Backend**: Ensure Spring Boot is running on port 8080
4. **CORS Issues**: Backend should allow requests from your frontend origin

## 🔄 Differences from Next.js Version

### What's the Same:
- ✅ Exact same UI/UX
- ✅ All features and functionality
- ✅ Backend API integration
- ✅ Authentication flow
- ✅ Responsive design

### What's Different:
- ❌ No server-side rendering (SSR)
- ❌ No React components
- ❌ No build process required
- ❌ Vanilla JavaScript instead of TypeScript
- ✅ Simpler deployment (just serve static files)
- ✅ No dependencies to install
- ✅ Faster initial page loads

## 📦 Deployment

### Deploy Frontend (Static Files):
- **Netlify**: Drag and drop the `vanilla/` folder
- **Vercel**: Deploy as static site
- **GitHub Pages**: Push to gh-pages branch
- **Any web server**: Apache, Nginx, etc.

### Deploy Backend:
- Package Spring Boot as JAR: `mvn clean package`
- Deploy to Heroku, AWS, or any Java hosting

## 🤝 Contributing

Feel free to modify and extend this vanilla version:
- Add more pages
- Enhance API integration
- Improve UI components
- Add new features

## 📝 Notes

- The app uses **localStorage** for client-side state
- Icons load from CDN (Lucide)
- Map uses Leaflet.js CDN
- No build tools required
- Works in all modern browsers

## 🆘 Troubleshooting

**Problem**: Icons not showing  
**Solution**: Check internet connection (Lucide CDN) or download icons locally

**Problem**: API calls failing  
**Solution**: Verify backend is running and CORS is configured

**Problem**: Login not working  
**Solution**: Check browser console for errors, verify API endpoint

**Problem**: Map not loading  
**Solution**: Check Leaflet.js CDN is accessible

---

**Enjoy your vanilla JavaScript version of VolunteerHub! 🎉**
