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

    // No demo mode - always use real API
    if (!token) {
        throw new Error('No authentication token');
    }

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

        // Fetch fresh user profile data from backend
        const profileResponse = await fetchWithAuth(`${API_BASE_URL}/users/profile`);
        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const fullNameParts = [profileData.firstName, profileData.lastName].filter(Boolean);
            const fullName = fullNameParts.length
                ? fullNameParts.join(' ')
                : (profileData.name || profileData.email || 'Impact Volunteer');

            // Update localStorage with fresh data
            const updatedUser = {
                id: profileData.id,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                name: fullName,
                email: profileData.email,
                volunteerPoints: profileData.volunteerPoints,
                eventsCompleted: profileData.eventsCompleted,
                volunteerHours: profileData.volunteerHours,
                phone: profileData.phone,
                country: profileData.country,
                city: profileData.city,
                neighborhood: profileData.neighborhood,
                interests: profileData.interests
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Update dynamic greeting with first name only
            const userNameEl = document.getElementById('userName');
            if (userNameEl) {
                userNameEl.textContent = profileData.firstName || 'User';
            }

            updateDashboardUI(profileData);
        } else {
            // Fallback to localStorage data if API fails
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userNameEl = document.getElementById('userName');
            if (userNameEl) {
                const firstName = user.firstName || user.name?.split(' ')[0] || user.email?.split('@')[0] || 'User';
                userNameEl.textContent = firstName;
            }

            // Use mock data if API fails
            updateDashboardUI({
                volunteerPoints: user.volunteerPoints || 2850,
                eventsCompleted: user.eventsCompleted || 12,
                volunteerHours: user.volunteerHours || 48,
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
    const coinElements = document.querySelectorAll('.coin-value');
    // Show 0 if user has no coin data
    const coins = (user && user.volunteerPoints) ? user.volunteerPoints : 0;
    coinElements.forEach(el => {
        el.textContent = coins.toLocaleString();
    });
}

function updateUserAvatar() {
    const user = getCurrentUser();
    const avatarElements = document.querySelectorAll('.user-avatar');
    if (user && user.name) {
        avatarElements.forEach(el => {
            el.textContent = user.name.charAt(0).toUpperCase();
        });
    }
}

// ===== Profile Page Functions =====
async function loadProfileData() {
    try {
        checkAuth();

        // Fetch fresh user profile data from backend (same as dashboard)
        const profileResponse = await fetchWithAuth(`${API_BASE_URL}/users/profile`);
        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const fullNameParts = [profileData.firstName, profileData.lastName].filter(Boolean);
            const fullName = fullNameParts.length
                ? fullNameParts.join(' ')
                : (profileData.name || profileData.email || 'Impact Volunteer');

            // Update localStorage with fresh data
            const updatedUser = {
                id: profileData.id,
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                name: fullName,
                email: profileData.email,
                volunteerPoints: profileData.volunteerPoints,
                eventsCompleted: profileData.eventsCompleted,
                volunteerHours: profileData.volunteerHours,
                phone: profileData.phone,
                country: profileData.country,
                city: profileData.city,
                neighborhood: profileData.neighborhood,
                interests: profileData.interests
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            updateProfileUI(profileData);
            updateUserCoins();
            updateUserAvatar();
        } else {
            // API failed - redirect to login
            console.error('Failed to load profile data from API');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        // Use mock data
        updateProfileUI({
            firstName: 'Alex',
            lastName: 'Thompson',
            email: 'alex@example.com',
            volunteerPoints: 2850,
            eventsCompleted: 12,
            volunteerHours: 48,
            createdAt: '2024-03-15T00:00:00Z',
            badges: 4,
            interests: 'Community Service, Environment, Education'
        });
    }
}

function updateProfileLegacyUI(data) {
    // Update stats
    const elements = {
        totalPoints: document.getElementById('totalPoints'),
        eventsCompleted: document.getElementById('eventsCompleted'),
        eventsAttended: document.getElementById('eventsAttended'),
        hoursVolunteered: document.getElementById('hoursVolunteered'),
        hoursContributed: document.getElementById('hoursContributed'),
        badgesEarned: document.getElementById('badgesEarned')
    };

    if (elements.totalPoints) elements.totalPoints.textContent = data.volunteerPoints?.toLocaleString() || '0';
    if (elements.eventsCompleted) elements.eventsCompleted.textContent = data.eventsCompleted || '0';
    if (elements.eventsAttended) elements.eventsAttended.textContent = data.eventsCompleted || '0';
    if (elements.hoursVolunteered) elements.hoursVolunteered.textContent = data.hoursVolunteered || '0';
    if (elements.hoursContributed) elements.hoursContributed.textContent = data.hoursVolunteered || '0';
    if (elements.badgesEarned) elements.badgesEarned.textContent = data.badges || '0';

    // Update progress bars
    const eventProgress = Math.min((data.eventsCompleted || 0) / 10 * 100, 100);
    const timeProgress = Math.min((data.hoursVolunteered || 0) / 50 * 100, 100);
    const badgeProgress = Math.min((data.badges || 0) / 15 * 100, 100);

    const eventProgressBar = document.getElementById('eventProgressBar');
    const timeProgressBar = document.getElementById('timeProgressBar');
    const badgeProgressBar = document.getElementById('badgeProgressBar');
    const eventProgressText = document.getElementById('eventProgress');
    const timeProgressText = document.getElementById('timeProgress');
    const badgeProgressText = document.getElementById('badgeProgress');

    if (eventProgressBar) eventProgressBar.style.width = eventProgress + '%';
    if (timeProgressBar) timeProgressBar.style.width = timeProgress + '%';
    if (badgeProgressBar) badgeProgressBar.style.width = badgeProgress + '%';
    if (eventProgressText) eventProgressText.textContent = `${data.eventsCompleted || 0}/10 events`;
    if (timeProgressText) timeProgressText.textContent = `${data.hoursVolunteered || 0}/50 hours`;
    if (badgeProgressText) badgeProgressText.textContent = `${data.badges || 0}/15 badges`;
}

// Initialize user data on page load
document.addEventListener('DOMContentLoaded', () => {
    updateUserCoins();
    updateUserAvatar();
});

function updateProfileUI(rawData) {
    if (!rawData) return;

    updateProfileLegacyUI(rawData);

    const points = Number(rawData.volunteerPoints ?? rawData.points ?? 0);
    const events = Number(rawData.eventsCompleted ?? rawData.events ?? 0);
    const hours = Number(rawData.volunteerHours ?? rawData.hoursVolunteered ?? 0);
    const fallbackBadgeCount = Number(rawData.badges ?? rawData.badgesEarned ?? 0);

    const fullNameFromPayload = (rawData.name || '').trim();
    const combinedName = [rawData.firstName, rawData.lastName].filter(Boolean).join(' ').trim();
    const fullName = combinedName || fullNameFromPayload || rawData.email || 'Impact Volunteer';
    const firstName = rawData.firstName || fullName.split(' ')[0] || 'Volunteer';
    const email = rawData.email || '';
    const joinDateLabel = rawData.createdAt ? `Member since ${formatDate(rawData.createdAt)}` : '';
    const avatarInitial = getAvatarInitial(firstName, rawData.lastName, fullName);

    const insights = deriveProfileInsights({
        ...rawData,
        volunteerPoints: points,
        eventsCompleted: events,
        volunteerHours: hours,
        fallbackBadgeCount
    });

    setTextContent('profileWelcome', `Welcome back, ${firstName}!`);
    setTextContent('profileNameNew', fullName);
    setTextContent('profileEmailNew', email);
    setTextContent('profileJoinDate', joinDateLabel);

    setTextContent('pointsDisplay', points.toLocaleString());
    setTextContent('eventsDisplay', events);
    setTextContent('hoursDisplay', hours);
    setTextContent('badgesDisplay', insights.earnedBadgeCount);

    setDataField('coins', points.toLocaleString());
    setDataField('events', events);
    setDataField('hours', hours);
    setDataField('badges', insights.earnedBadgeCount);

    setTextContent('coinValue', points.toLocaleString());
    setTextContent('badgeCountLabel', `${insights.earnedBadgeCount} / ${insights.badges.length} badges`);

    renderBadges(insights.badges);
    renderAchievements(insights.achievements);
    renderCauses(insights.causes);

    const avatarEls = document.querySelectorAll('#profileAvatarNew, #navAvatar');
    avatarEls.forEach(el => {
        if (el) el.textContent = avatarInitial;
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function deriveProfileInsights(data) {
    const points = Number(data.volunteerPoints ?? 0);
    const events = Number(data.eventsCompleted ?? 0);
    const hours = Number(data.volunteerHours ?? 0);
    const referenceDate = data.updatedAt || data.createdAt || new Date().toISOString();

    const badges = [
        {
            id: 'first-steps',
            name: 'First Steps',
            icon: '🌱',
            description: 'Completed your first event',
            earned: events >= 1,
        },
        {
            id: 'community-hero',
            name: 'Community Hero',
            icon: '🦸',
            description: 'Completed 10 community events',
            earned: events >= 10,
        },
        {
            id: 'green-guardian',
            name: 'Green Guardian',
            icon: '🌿',
            description: 'Contributed 25 volunteer hours',
            earned: hours >= 25,
        },
        {
            id: 'consistent-contributor',
            name: 'Consistent Contributor',
            icon: '⭐',
            description: 'Earned 2,500 Impact Coins',
            earned: points >= 2500,
        },
    ].map(badge => ({
        ...badge,
        status: badge.earned ? 'Unlocked' : 'Locked',
        dateLabel: badge.earned ? formatDate(referenceDate) : 'Keep going',
    }));

    const achievements = [
        {
            title: 'Bronze Tier',
            description: 'Earn 1,000 Impact Coins',
            target: 1000,
            current: points,
        },
        {
            title: 'Silver Tier',
            description: 'Earn 2,500 Impact Coins',
            target: 2500,
            current: points,
        },
        {
            title: 'Gold Tier',
            description: 'Earn 5,000 Impact Coins',
            target: 5000,
            current: points,
        },
        {
            title: 'Impact Master',
            description: 'Complete 50 volunteer events',
            target: 50,
            current: events,
        },
    ].map(achievement => {
        const progress = Math.min(100, Math.round((achievement.current / achievement.target) * 100));
        return {
            ...achievement,
            progress,
            progressLabel: `${Math.min(achievement.current, achievement.target).toLocaleString()} / ${achievement.target.toLocaleString()}`,
        };
    });

    let causes = [];
    if (typeof data.interests === 'string' && data.interests.trim().length) {
        causes = data.interests.split(',').map(item => item.trim()).filter(Boolean);
    } else if (Array.isArray(data.causesSupported)) {
        causes = data.causesSupported;
    }
    if (!causes.length) {
        causes = ['Community Service', 'Environment', 'Education'];
    }

    const derivedBadgeCount = badges.filter(badge => badge.earned).length;
    const fallbackCount = Number(data.fallbackBadgeCount || 0);
    const earnedBadgeCount = Math.max(derivedBadgeCount, fallbackCount);

    return { badges, achievements, causes, earnedBadgeCount };
}

function renderBadges(badges = []) {
    const container = document.getElementById('badgeGrid');
    if (!container) return;

    if (!badges.length) {
        container.innerHTML = '<p class="empty-state">No badges yet. Join an event to earn your first one!</p>';
        return;
    }

    container.innerHTML = badges.map(badge => `
        <div class="badge-card ${badge.earned ? '' : 'badge-card-locked'}" onclick="const emoji = this.querySelector('.badge-emoji'); emoji.classList.remove('animate-burst'); void emoji.offsetWidth; emoji.classList.add('animate-burst');">
            <div class="badge-emoji">${badge.icon}</div>
            <div class="badge-copy">
                <h3>${badge.name}</h3>
                <p>${badge.description}</p>
                <span>${badge.earned ? `Unlocked • ${badge.dateLabel}` : 'Locked'}</span>
            </div>
        </div>
    `).join('');
}

function renderAchievements(achievements = []) {
    const container = document.getElementById('achievementList');
    if (!container) return;

    if (!achievements.length) {
        container.innerHTML = '<p class="empty-state">Track progress once goals are available.</p>';
        return;
    }

    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-card">
            <div class="achievement-header">
                <div>
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                </div>
                <span>${achievement.progress}%</span>
            </div>
            <div class="progress-bar-new">
                <div class="progress-fill-new" style="width: ${achievement.progress}%"></div>
            </div>
            <p class="achievement-target">${achievement.progressLabel}</p>
        </div>
    `).join('');
}

function renderCauses(causes = []) {
    const container = document.getElementById('causesChips');
    if (!container) return;

    if (!causes.length) {
        container.innerHTML = '<p class="empty-state">Tell us what causes you care about to personalize your feed.</p>';
        return;
    }

    container.innerHTML = causes.map(cause => `
        <div class="cause-chip">
            <i data-lucide="sparkles"></i>
            ${cause}
        </div>
    `).join('');
}

function setTextContent(id, value) {
    const el = document.getElementById(id);
    if (el !== null && el !== undefined && value !== undefined && value !== null) {
        el.textContent = value;
    }
}

function setDataField(field, value) {
    const targets = document.querySelectorAll(`[data-field="${field}"]`);
    targets.forEach(el => {
        if (value !== undefined && value !== null) {
            el.textContent = value;
        }
    });
}

function getAvatarInitial(firstName, lastName, fallback) {
    const preferred = firstName || fallback || 'U';
    return preferred.charAt(0).toUpperCase();
}
