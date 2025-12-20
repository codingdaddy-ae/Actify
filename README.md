<p align="center">
  <img src="https://img.shields.io/badge/Actify-Volunteer%20Management%20Platform-10b981?style=for-the-badge" alt="Actify"/>
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway"/>
</p>

<h1 align="center">🌱 Actify</h1>

<p align="center">
  <img src="https://img.icons8.com/color/96/000000/leaf.png" width="80"/>
</p>

<p align="center">
  <b>Empowering communities through volunteer engagement with gamified experiences and meaningful rewards</b>
</p>

<p align="center">
  <a href="https://actify-production-a545.up.railway.app/"><img src="https://img.shields.io/badge/🚀%20Live%20Access-Click%20Here-success?style=for-the-badge" alt="Live Access"/></a>
</p>

---

> 💡 **Recommended Browser:** For the best experience, especially with **location capture and map features**, we recommend using **Microsoft Edge**. Edge provides superior geolocation accuracy and smoother map interactions.

## � How It Works

<p align="center">
  <img src="https://img.icons8.com/color/48/000000/info.png" width="40"/>
</p>

Actify is a **gamified volunteer management platform** designed to connect volunteers with meaningful opportunities while making the experience engaging and rewarding. Here's how the platform works:

### 🎮 For Volunteers

1. **Register & Create Profile** - Sign up with your details and set up your volunteer profile with interests and location
2. **Discover Events** - Browse volunteer opportunities on an interactive map or grid view, filtered by cause and location
3. **Register for Events** - Join events that match your interests (with 3 change opportunities if you need to adjust)
4. **Earn Points & Badges** - Complete events to earn volunteer points, unlock achievement badges, and climb the leaderboard
5. **Redeem Rewards** - Use your earned points in the rewards store for meaningful recognition

### 🏢 For Organizations

1. **Create Organization Account** - Register your nonprofit or community organization
2. **Post Events** - Create volunteer opportunities with details like location, time, duration, and volunteer requirements
3. **Manage Volunteers** - Track registrations and volunteer participation for your events
4. **Build Community** - Connect with passionate volunteers ready to make an impact

### ⚙️ Behind the Scenes

- **Real-time Location Tracking** - Uses browser geolocation to show nearby events on interactive Leaflet maps
- **JWT Authentication** - Secure login system with role-based access for volunteers, organizations, and admins
- **Gamification Engine** - Dynamic points calculation, badge unlocking system, and live leaderboard updates
- **Responsive Design** - Seamlessly works across desktop, tablet, and mobile devices

---

## �🚀 Features

- 🎯 **Event Management**: Browse and register for volunteer opportunities with interactive maps
- 🏆 **Gamified Points System**: Earn points for participation and track your volunteer impact
- 🎖️ **Achievement Badges**: Unlock milestones and showcase your volunteer journey
- 🎁 **Rewards Store**: Redeem points for meaningful rewards and recognition
- 📊 **Live Leaderboard**: Compare your impact with other volunteers in your community
- 📍 **Location-Based Events**: Find volunteer opportunities near you with Leaflet maps
- 👤 **Dynamic Profiles**: Personalized dashboard with real-time statistics and progress
- 🔔 **Smart Notifications**: Stay updated on events, achievements, and community news
- 📱 **Responsive Design**: Beautiful UI that works seamlessly on all devices
- 🔐 **Secure Authentication**: JWT-based login with role management

---

## 🏗️ Project Structure

```text
Actify/
├── backend/           # Spring Boot backend (Java, Maven, PostgreSQL)
│   ├── src/main/java/              # Application source code
│   └── pom.xml                     # Maven configuration
├── database/          # Database setup scripts
│   ├── init.sql                    # Complete database setup
│   └── *.sql                       # Table creation & sample data
├── frontend/          # Modern web interface (HTML, CSS, JS)
│   ├── *.html                      # Application pages
│   ├── css/                        # Stylesheets
│   └── *.js                        # JavaScript logic
└── README.md          # Project documentation
```

---

## 🌐 Live Demo

**🚀 Production Deployment:** [https://actify-production-a545.up.railway.app](https://actify-production-a545.up.railway.app)

> ⚠️ **Note:** The backend server is hosted on Railway free tier and may take 30-60 seconds to wake up on first request.

---

## ⚡ Quick Start

### 1. Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

- Configure your PostgreSQL DB in `src/main/resources/application.properties`
- API runs at `http://localhost:8081/api`

### 2. Frontend (Static)

Just open `frontend/index.html` in your browser, or use a static server:

```bash
cd frontend
python -m http.server 5500
```

---

## 📦 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|----------|
| 🌐 **Frontend** | HTML5, CSS3, JavaScript | Clean, responsive web interface |
| 🎨 **Icons** | Lucide Icons | Beautiful iconography |
| 🗺️ **Maps** | Leaflet.js | Interactive location mapping |
| 🚀 **Backend** | Spring Boot + Java | Robust REST API |
| 🗄️ **Database** | PostgreSQL | Reliable data storage |
| 🔐 **Security** | JWT Authentication | Secure user sessions |
| 📦 **Build** | Maven | Project management |

---

## 👥 Team

<p align="center">
  <img src="https://img.icons8.com/color/48/000000/group.png" width="60"/>
</p>

<p align="center">
  <b>🌟 Meet the creators behind Actify 🌟</b>
</p>

<table align="center">
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/🚀-Arghadeep%20Tambuli-10b981?style=for-the-badge&labelColor=064e3b" alt="Arghadeep Tambuli"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/💜-Abhilasha%20Shee-8b5cf6?style=for-the-badge&labelColor=5b21b6" alt="Abhilasha Shee"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/🌊-Meghna%20Mukhopadhyay-0ea5e9?style=for-the-badge&labelColor=0369a1" alt="Meghna Mukhopadhyay"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/🌸-Soumi%20Sahu-ec4899?style=for-the-badge&labelColor=9d174d" alt="Soumi Sahu"/>
    </td>
  </tr>
</table>

<p align="center">
  <i>✨ Building communities through technology ✨</i>
</p>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-💚%20for%20Volunteers-10b981?style=for-the-badge"/>
</p>

<p align="center">
  <sub>© 2025 Actify Team. All rights reserved.</sub>
</p>
