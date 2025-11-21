# 🚀 Quick Start Guide - Actify

## Prerequisites

- ✅ PostgreSQL 17 installed
- ✅ pgAdmin 4 installed
- ✅ Java JDK 17+ installed
- ✅ Maven installed
- ✅ Web browser

---

## Step 1: Start PostgreSQL Database

### On Windows:

**Check if PostgreSQL is running:**
```powershell
# Open Services (Win + R, type: services.msc)
# Look for "postgresql-x64-17" service
# If not running, start it

# Or use command line:
Get-Service -Name postgresql*
```

**Start PostgreSQL service:**
```powershell
# Run as Administrator
Start-Service postgresql-x64-17

# Or restart if already running
Restart-Service postgresql-x64-17
```

**Verify PostgreSQL is running:**
```powershell
# Try connecting
psql -U postgres -c "SELECT version();"
```

---

## Step 2: Create Database

### Option A: Using Command Line (Recommended)

```powershell
# Navigate to database folder
cd D:\Downloads\Actify\database

# Run the complete setup script
psql -U postgres -f init.sql

# You'll be prompted for the postgres password
```

### Option B: Using pgAdmin 4

1. **Open pgAdmin 4**
2. **Connect to PostgreSQL 17 server**
   - Right-click "PostgreSQL 17"
   - Enter your password
3. **Create Database:**
   - Right-click "Databases" → Create → Database
   - Name: `actify_db`
   - Click "Save"
4. **Run SQL Scripts:**
   - Right-click `actify_db` → Query Tool
   - Open and execute these files in order:
     - `02_create_tables.sql` (creates tables)
     - `03_seed_data.sql` (adds demo data)

### Option C: Run Individual Scripts

```powershell
# Create database
psql -U postgres -f 01_create_database.sql

# Create tables (connected to actify_db)
psql -U postgres -d actify_db -f 02_create_tables.sql

# Insert seed data
psql -U postgres -d actify_db -f 03_seed_data.sql
```

---

## Step 3: Configure Backend

1. **Update database password:**
   
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/actify_db
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_POSTGRES_PASSWORD
   ```

2. **Verify configuration:**
   ```powershell
   cd backend
   cat src/main/resources/application.properties
   ```

---

## Step 4: Start Backend Server

```powershell
# Navigate to backend folder
cd D:\Downloads\Actify\backend

# Start Spring Boot server
mvn spring-boot:run
```

**Expected output:**
```
...
Started ActifyApplication in X.XXX seconds
Tomcat started on port(s): 8080 (http)
```

**Test the backend:**
```powershell
# In a new terminal
curl http://localhost:8080/api/health
# or open in browser: http://localhost:8080/api/events
```

---

## Step 5: Start Frontend

### Option A: Simple (Just Open File)

```powershell
# Navigate to frontend folder
cd D:\Downloads\Actify\frontend

# Open index.html in your default browser
start index.html
```

### Option B: Using Local Server (Better for API calls)

**Using Python:**
```powershell
cd D:\Downloads\Actify\frontend
python -m http.server 8000

# Open browser to: http://localhost:8000
```

**Using npx (if you have Node.js):**
```powershell
cd D:\Downloads\Actify\frontend
npx serve

# Open browser to the URL shown (usually http://localhost:3000)
```

---

## Step 6: Login and Test

1. **Open frontend in browser:**
   - File: `D:\Downloads\Actify\frontend\index.html`
   - Or: `http://localhost:8000` (if using local server)

2. **Click "Sign In"**

3. **Use demo credentials:**
   - **Email:** `demo@actify.app`
   - **Password:** `demo123`

4. **Explore the app!**
   - Dashboard - See your stats
   - Events - Browse volunteer opportunities
   - Badges - View achievements
   - Rewards - Redeem points
   - Leaderboard - Compare with others
   - Profile - Your volunteer journey

---

## 🔧 Troubleshooting

### PostgreSQL won't start?

```powershell
# Check if port 5432 is in use
netstat -ano | findstr :5432

# Check PostgreSQL logs
# Usually in: C:\Program Files\PostgreSQL\17\data\log\
```

### Backend can't connect to database?

1. **Check PostgreSQL is running:**
   ```powershell
   psql -U postgres -c "SELECT 1;"
   ```

2. **Verify database exists:**
   ```powershell
   psql -U postgres -c "\l" | findstr actify_db
   ```

3. **Check credentials in `application.properties`**

4. **Test connection manually:**
   ```powershell
   psql -U postgres -d actify_db
   ```

### Backend port 8080 already in use?

```powershell
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in application.properties:
# server.port=8081
```

### Frontend can't connect to backend?

1. **Check backend is running:** Open http://localhost:8080/api/events
2. **Check API URL in `frontend/app.js`:**
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```
3. **Clear browser cache:** Ctrl + Shift + Delete
4. **Check browser console for errors:** F12 → Console tab

---

## 📝 Default Accounts

| Email | Password | Points | Events |
|-------|----------|--------|--------|
| demo@actify.app | demo123 | 3200 | 52 |
| alex.johnson@actify.app | demo123 | 1450 | 28 |
| sarah.chen@actify.app | demo123 | 2450 | 45 |

---

## 🎯 Quick Commands Reference

### Check Services Status:
```powershell
# PostgreSQL
Get-Service postgresql*

# Backend (in another terminal)
curl http://localhost:8080/api/events
```

### Stop Services:
```powershell
# Stop PostgreSQL
Stop-Service postgresql-x64-17

# Stop backend: Ctrl + C in the terminal running mvn
```

### Reset Database:
```powershell
cd database
psql -U postgres -f reset_database.sql
```

### View Logs:
```powershell
# Backend logs: shown in terminal where mvn runs
# PostgreSQL logs: C:\Program Files\PostgreSQL\17\data\log\
```

---

## ✅ Success Checklist

- [ ] PostgreSQL service running
- [ ] Database `actify_db` created
- [ ] Tables created (8 tables total)
- [ ] Seed data inserted (5 users, 12 events)
- [ ] Backend running on port 8080
- [ ] Frontend accessible in browser
- [ ] Demo login works
- [ ] Can browse events
- [ ] Can see dashboard stats

---

## 🆘 Need Help?

1. Check terminal/console for error messages
2. Review `database/README.md` for detailed DB setup
3. Check PostgreSQL logs: `C:\Program Files\PostgreSQL\17\data\log\`
4. Verify all prerequisites are installed
5. Make sure no other apps are using ports 5432 or 8080

**Common Issue:** If backend can't find PostgreSQL driver, run:
```powershell
cd backend
mvn clean install
mvn spring-boot:run
```
