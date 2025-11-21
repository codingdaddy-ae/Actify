// API Base URL - Update this to your backend URL
const API_BASE_URL = 'http://localhost:8081/api';

// ===== Authentication Functions =====
async function loginUser(email, password) {
    try {
        console.log('Attempting login to:', `${API_BASE_URL}/auth/login`);
        console.log('Email:', email);
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.success) {
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            window.location.href = 'dashboard.html';
        } else {
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login. Make sure the backend is running on port 8081.');
    }
}

async function registerUser(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                userType: formData.userType
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            alert('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration.');
    }
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
    return token;
}

// ===== API Helper Functions =====
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        logout();
        throw new Error('Unauthorized');
    }

    return response;
}

// ===== Dashboard Functions =====
async function loadDashboardData() {
    try {
        checkAuth();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Update user name
        const userNameEl = document.getElementById('userName');
        if (userNameEl) {
            userNameEl.textContent = user.name || 'User';
        }

        // Fetch user profile data
        const profileResponse = await fetchWithAuth(`${API_BASE_URL}/users/profile`);
        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            updateDashboardUI(profileData);
        } else {
            // Use mock data if API fails
            updateDashboardUI({
                volunteerPoints: 3450,
                eventsCompleted: 18,
                hoursVolunteered: 72,
                badges: ["First Steps", "Community Hero", "Green Guardian"]
            });
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        // Use mock data
        updateDashboardUI({
            volunteerPoints: 3450,
            eventsCompleted: 18,
            hoursVolunteered: 72,
            badges: ["First Steps", "Community Hero", "Green Guardian"]
        });
    }
}

function updateDashboardUI(data) {
    // Update points
    const pointsEl = document.getElementById('userPoints');
    if (pointsEl) {
        pointsEl.textContent = data.volunteerPoints?.toLocaleString() || '0';
    }

    // Update events completed
    const eventsEl = document.getElementById('eventsCompleted');
    if (eventsEl) {
        eventsEl.textContent = data.eventsCompleted || '0';
    }

    // Update hours volunteered
    const hoursEl = document.getElementById('hoursVolunteered');
    if (hoursEl) {
        hoursEl.textContent = data.hoursVolunteered || '0';
    }

    // Update badges if present
    if (data.badges && data.badges.length > 0) {
        const badgesContainer = document.getElementById('badgesContainer');
        if (badgesContainer) {
            const badgeEmojis = { 
                "First Steps": "🏆",
                "Community Hero": "🦸",
                "Green Guardian": "🌱",
                "Helper": "🤝",
                "Champion": "🏅"
            };
            
            badgesContainer.innerHTML = data.badges.map(badge => `
                <div class="badge-item">
                    <div class="badge-icon">${badgeEmojis[badge] || '⭐'}</div>
                    <p class="badge-name">${badge}</p>
                </div>
            `).join('');
        }
    }
}

// ===== Events Functions =====
async function loadEvents() {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/events`);
        if (response.ok) {
            const events = await response.json();
            return events;
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
    return [];
}

async function registerForEvent(eventId) {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/events/${eventId}/register`, {
            method: 'POST'
        });

        if (response.ok) {
            alert('Successfully registered for event!');
            return true;
        } else {
            alert('Failed to register for event.');
            return false;
        }
    } catch (error) {
        console.error('Error registering for event:', error);
        alert('An error occurred while registering.');
        return false;
    }
}

// ===== Leaderboard Functions =====
async function loadLeaderboard() {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/leaderboard`);
        if (response.ok) {
            const leaderboard = await response.json();
            return leaderboard;
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
    return [];
}

// ===== Utility Functions =====
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function updateUserCoins() {
    const user = getCurrentUser();
    if (user && user.volunteerPoints) {
        const coinElements = document.querySelectorAll('.coin-value');
        coinElements.forEach(el => {
            el.textContent = user.volunteerPoints.toLocaleString();
        });
    }
}

// Initialize user coins on page load
document.addEventListener('DOMContentLoaded', () => {
    updateUserCoins();
});
