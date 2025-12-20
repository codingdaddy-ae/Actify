// ===== Component Functions =====

// Cause-based default images using Unsplash
const CAUSE_IMAGES = {
    environment: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=200&fit=crop',
    education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop',
    health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop',
    charity: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=200&fit=crop',
    community: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=200&fit=crop',
    animals: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=200&fit=crop',
    elderly: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&h=200&fit=crop',
    youth: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=200&fit=crop',
    'disaster-relief': 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=200&fit=crop',
    other: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=200&fit=crop'
};

// Get image URL based on cause
function getEventImage(event) {
    // Prefer imageUrl if it exists and is valid
    if (event.imageUrl && event.imageUrl !== '' && event.imageUrl !== '/placeholder.svg' && event.imageUrl !== 'null') {
        return event.imageUrl;
    }
    // Fallback to image field
    if (event.image && event.image !== '/placeholder.svg' && event.image !== '' && event.image !== 'null') {
        return event.image;
    }
    // Default to cause-based image
    const cause = (event.cause || 'other').toLowerCase().replace(' ', '-');
    return CAUSE_IMAGES[cause] || CAUSE_IMAGES.other;
}

// Get registration attempts for an event
function getEventAttempts(eventId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userKey = user.email || user.id || 'guest';
    const attemptsKey = `eventAttempts_${userKey}`;
    const attempts = JSON.parse(localStorage.getItem(attemptsKey) || '{}');
    return attempts[eventId] || 0;
}

// Increment registration attempts for an event
function incrementEventAttempts(eventId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userKey = user.email || user.id || 'guest';
    const attemptsKey = `eventAttempts_${userKey}`;
    const attempts = JSON.parse(localStorage.getItem(attemptsKey) || '{}');
    attempts[eventId] = (attempts[eventId] || 0) + 1;
    localStorage.setItem(attemptsKey, JSON.stringify(attempts));
    return attempts[eventId];
}

// Check if user has exceeded registration limit
function hasExceededLimit(eventId) {
    return getEventAttempts(eventId) >= 3;
}

// Create Event Card Component with expandable details
function createEventCard(event, userRegistrations = []) {
    const imageUrl = getEventImage(event);
    const cardId = `event-card-${event.id}`;
    const isRegistered = userRegistrations.includes(event.id) || userRegistrations.includes(String(event.id));
    const attempts = getEventAttempts(event.id);
    // Locked only if exceeded limit AND not registered (final state after last unregister)
    const isLocked = hasExceededLimit(event.id) && !isRegistered;
    const remainingAttempts = Math.max(0, 3 - attempts);
    return `
        <div class="event-card" id="${cardId}">
            <div class="event-image">
                <img src="${imageUrl}" alt="${event.title}" onerror="this.src='${CAUSE_IMAGES.other}'" loading="lazy" />
            </div>
            <div class="event-content">
                <div class="event-header">
                    <div>
                        <h3 class="event-title">${event.title}</h3>
                        <p class="event-organizer">${event.organizer}</p>
                    </div>
                    <span class="event-cause">${event.cause}</span>
                </div>
                
                <p class="event-description">${event.description}</p>
                
                <div class="event-meta">
                    <div class="event-meta-item">
                        <i data-lucide="calendar" class="icon-sm"></i>
                        ${formatDate(event.date)} at ${event.time}
                    </div>
                    <div class="event-meta-item">
                        <i data-lucide="map-pin" class="icon-sm"></i>
                        ${event.location}
                    </div>
                    <div class="event-meta-item">
                        <i data-lucide="users" class="icon-sm"></i>
                        ${event.spots} spots available (${event.volunteers} registered)
                    </div>
                </div>
                
                <!-- Expandable Details Section -->
                <div class="event-details-expanded" id="details-${event.id}" style="display: none;">
                    <div class="expanded-divider"></div>
                    <div class="expanded-content">
                        <div class="expanded-row">
                            <i data-lucide="clock" class="icon-sm"></i>
                            <span><strong>Duration:</strong> ${event.duration || '2-3'} hours</span>
                        </div>
                        <div class="expanded-row">
                            <i data-lucide="info" class="icon-sm"></i>
                            <span><strong>About:</strong> ${event.fullDescription || event.description}</span>
                        </div>
                        ${event.requirements ? `
                        <div class="expanded-row">
                            <i data-lucide="clipboard-list" class="icon-sm"></i>
                            <span><strong>Requirements:</strong> ${event.requirements}</span>
                        </div>
                        ` : ''}
                        <div class="expanded-row">
                            <i data-lucide="map" class="icon-sm"></i>
                            <span><strong>Address:</strong> ${event.fullAddress || event.location}</span>
                        </div>
                    </div>
                </div>
                
                <div class="event-footer">
                    <div class="event-coins">
                        <i data-lucide="zap" class="icon-sm"></i>
                        <span class="coins-amount">${event.coinsReward}</span>
                        <span class="coins-text">coins</span>
                    </div>
                    <div class="event-actions">
                        <button 
                            class="btn btn-ghost btn-sm" 
                            onclick="toggleEventDetails(${event.id})"
                            data-details-btn="${event.id}"
                        >
                            <i data-lucide="chevron-down" class="icon-sm"></i>
                            Details
                        </button>
                        <button 
                            class="btn ${isLocked ? 'btn-disabled' : (isRegistered ? 'btn-primary' : 'btn-outline')} btn-sm" 
                            onclick="${isLocked ? '' : (isRegistered ? `handleUnregistration(${event.id})` : `handleEventRegistration(${event.id})`)}"
                            data-event-id="${event.id}"
                            data-attempts="${attempts}"
                            ${isLocked ? 'disabled title="You have used all your changes for this event"' : ''}
                            style="${isLocked ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
                        >
                            ${isLocked ? '🔒 Locked' : (isRegistered ? '✓ Registered' : 'Register')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Toggle event details expansion
function toggleEventDetails(eventId) {
    const detailsDiv = document.getElementById(`details-${eventId}`);
    const btn = document.querySelector(`button[data-details-btn="${eventId}"]`);
    const card = document.getElementById(`event-card-${eventId}`);
    
    if (!detailsDiv || !btn) return;
    
    const isExpanded = detailsDiv.style.display !== 'none';
    
    if (isExpanded) {
        detailsDiv.style.display = 'none';
        btn.innerHTML = '<i data-lucide="chevron-down" class="icon-sm"></i> Details';
        card.classList.remove('expanded');
    } else {
        detailsDiv.style.display = 'block';
        btn.innerHTML = '<i data-lucide="chevron-up" class="icon-sm"></i> Hide';
        card.classList.add('expanded');
    }
    
    lucide.createIcons();
}

// Handle event registration
async function handleEventRegistration(eventId) {
    const button = document.querySelector(`button[data-event-id="${eventId}"]`);
    if (!button) return;
    
    // Check if already registered (by checking button state)
    if (button.textContent.includes('✓ Registered')) {
        // Clicking on registered button should trigger unregister flow
        handleUnregistration(eventId);
        return;
    }
    
    // Check if limit exceeded (only for re-registration, not first time)
    const currentAttempts = getEventAttempts(eventId);
    if (currentAttempts > 0 && hasExceededLimit(eventId)) {
        showToast('You have reached the maximum changes for this event.', 'error');
        return;
    }

    const originalText = button.textContent;
    button.textContent = 'Registering...';
    button.disabled = true;

    // Call API to register
    const result = await registerForEvent(eventId);

    if (result.success || result.message?.includes('already')) {
        // Only increment attempts if this is a RE-registration (not first time)
        const isFirstRegistration = currentAttempts === 0;
        let attempts = currentAttempts;
        let remaining = 3;
        
        if (!isFirstRegistration) {
            // This is a re-registration after unregister, count it
            attempts = incrementEventAttempts(eventId);
            remaining = Math.max(0, 3 - attempts);
        }
        
        button.textContent = '✓ Registered';
        button.classList.remove('btn-outline');
        button.classList.add('btn-primary');
        button.disabled = false; // Allow clicking to unregister
        button.setAttribute('data-attempts', attempts);
        button.onclick = () => handleUnregistration(eventId);
        
        // Save registration to localStorage for persistence
        saveUserRegistration(eventId);
        
        // Show remaining attempts info
        if (isFirstRegistration) {
            showToast('Registered successfully! You have 3 changes available if needed.', 'success');
        } else if (remaining > 0) {
            showToast(`Registered! You have ${remaining} change${remaining !== 1 ? 's' : ''} remaining.`, 'success');
        } else {
            showToast('Registered! This was your final change - no more changes allowed.', 'warning');
        }
    } else {
        button.textContent = originalText;
        button.disabled = false;
        showToast(result.message || 'Failed to register. Please try again.', 'error');
    }
}

// Handle unregistration with confirmation
function handleUnregistration(eventId) {
    const attempts = getEventAttempts(eventId);
    const remaining = Math.max(0, 3 - attempts - 1); // -1 for this action (will become after unregister)
    
    // Show unregister modal
    showUnregisterModal(eventId, remaining);
}

// Show unregister confirmation modal
function showUnregisterModal(eventId, remainingAfter) {
    // Remove existing modal if any
    const existingModal = document.getElementById('unregisterModal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'unregisterModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i data-lucide="alert-triangle" style="width:48px;height:48px;color:#f59e0b;"></i>
                <h2>Unregister from Event?</h2>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to unregister from this event?</p>
                <p class="modal-warning">⚠️ You will have <strong>${remainingAfter}</strong> change${remainingAfter !== 1 ? 's' : ''} remaining after this.</p>
                ${remainingAfter === 0 ? '<p class="modal-danger">⛔ This will be your final change. You won\'t be able to register again!</p>' : ''}
            </div>
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="closeUnregisterModal()">Cancel</button>
                <button class="btn btn-danger" onclick="showTypeConfirmModal(${eventId})">Yes, Unregister</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    lucide.createIcons();
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeUnregisterModal();
    });
}

// Close unregister modal
function closeUnregisterModal() {
    const modal = document.getElementById('unregisterModal');
    if (modal) modal.remove();
}

// Show type confirmation modal
function showTypeConfirmModal(eventId) {
    closeUnregisterModal();
    
    const modal = document.createElement('div');
    modal.id = 'typeConfirmModal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i data-lucide="keyboard" style="width:48px;height:48px;color:#3b82f6;"></i>
                <h2>Confirm Unregistration</h2>
            </div>
            <div class="modal-body">
                <p>Type <strong>"unregister"</strong> to confirm:</p>
                <input type="text" id="unregisterInput" class="modal-input" placeholder="Type 'unregister' here" autocomplete="off">
                <p class="modal-hint" id="inputHint"></p>
            </div>
            <div class="modal-actions">
                <button class="btn btn-outline" onclick="closeTypeConfirmModal()">Cancel</button>
                <button class="btn btn-danger" id="confirmUnregisterBtn" onclick="confirmUnregistration(${eventId})" disabled>Confirm</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    lucide.createIcons();
    
    // Setup input validation
    const input = document.getElementById('unregisterInput');
    const confirmBtn = document.getElementById('confirmUnregisterBtn');
    const hint = document.getElementById('inputHint');
    
    input.addEventListener('input', () => {
        const value = input.value.toLowerCase().trim();
        if (value === 'unregister') {
            confirmBtn.disabled = false;
            hint.textContent = '✓ Ready to confirm';
            hint.style.color = '#10b981';
        } else if (value.length > 0) {
            confirmBtn.disabled = true;
            hint.textContent = 'Please type "unregister" exactly';
            hint.style.color = '#f59e0b';
        } else {
            confirmBtn.disabled = true;
            hint.textContent = '';
        }
    });
    
    // Focus input
    setTimeout(() => input.focus(), 100);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeTypeConfirmModal();
    });
}

// Close type confirm modal
function closeTypeConfirmModal() {
    const modal = document.getElementById('typeConfirmModal');
    if (modal) modal.remove();
}

// Confirm unregistration
async function confirmUnregistration(eventId) {
    const input = document.getElementById('unregisterInput');
    if (input.value.toLowerCase().trim() !== 'unregister') {
        return;
    }
    
    closeTypeConfirmModal();
    
    const button = document.querySelector(`button[data-event-id="${eventId}"]`);
    if (button) {
        button.textContent = 'Unregistering...';
        button.disabled = true;
    }
    
    // Call the unregister API
    const result = await unregisterFromEvent(eventId);
    
    // Update local state regardless of API result
    removeUserRegistration(eventId);
    
    // Increment attempts (unregister always counts as a change)
    const attempts = incrementEventAttempts(eventId);
    const remaining = Math.max(0, 3 - attempts);
    const isLocked = remaining === 0;
    
    if (button) {
        if (isLocked) {
            // Final unregister - lock the event permanently
            button.textContent = '🔒 Locked';
            button.classList.remove('btn-primary', 'btn-outline');
            button.classList.add('btn-disabled');
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
            button.onclick = null;
            button.title = 'You have used all your changes for this event';
            showToast('Unregistered. This event is now locked - no more changes allowed.', 'warning');
        } else {
            button.textContent = 'Register';
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline');
            button.disabled = false;
            button.setAttribute('data-attempts', attempts);
            button.onclick = () => handleEventRegistration(eventId);
            showToast(`Unregistered! You have ${remaining} change${remaining !== 1 ? 's' : ''} remaining.`, 'success');
        }
    }
}

// Remove user registration from localStorage
function removeUserRegistration(eventId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userKey = user.email || user.id || 'guest';
    const storageKey = `userRegistrations_${userKey}`;
    
    let registrations = JSON.parse(localStorage.getItem(storageKey) || '[]');
    registrations = registrations.filter(id => id != eventId && String(id) !== String(eventId));
    localStorage.setItem(storageKey, JSON.stringify(registrations));
}

// Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;cursor:pointer;font-size:18px;">&times;</button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) toast.remove();
    }, 5000);
}

// Save user registration to localStorage
function saveUserRegistration(eventId) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userKey = user.email || user.id || 'guest';
    const storageKey = `userRegistrations_${userKey}`;
    
    const registrations = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!registrations.includes(eventId) && !registrations.includes(String(eventId))) {
        registrations.push(eventId);
        localStorage.setItem(storageKey, JSON.stringify(registrations));
    }
}

// Get user registrations from localStorage and API
async function getUserRegistrations() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userKey = user.email || user.id || 'guest';
    const storageKey = `userRegistrations_${userKey}`;
    
    // Get local registrations first
    let registrations = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Try to fetch from API as well
    try {
        const token = localStorage.getItem('token');
        
        if (token) {
            const response = await fetch(`${API_BASE_URL}/events/user/registered`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.ok) {
                const apiRegistrations = await response.json();
                // Merge API registrations with local
                apiRegistrations.forEach(reg => {
                    const eventId = reg.eventId || reg.event_id || reg.id;
                    if (eventId && !registrations.includes(eventId) && !registrations.includes(String(eventId))) {
                        registrations.push(eventId);
                    }
                });
                // Save merged list
                localStorage.setItem(storageKey, JSON.stringify(registrations));
            }
        }
    } catch (error) {
        console.error('Error fetching user registrations:', error);
    }
    
    return registrations;
}

// Create Badge Component
function createBadge(badgeName) {
    const badgeEmojis = {
        "First Steps": "🏆",
        "Community Hero": "🦸",
        "Green Guardian": "🌱",
        "Helper": "🤝",
        "Champion": "🏅",
        "Earth Saver": "🌍",
        "Teacher": "📚",
        "Donor": "❤️"
    };

    return `
        <div class="badge-item">
            <div class="badge-icon">${badgeEmojis[badgeName] || '⭐'}</div>
            <p class="badge-name">${badgeName}</p>
        </div>
    `;
}

// Create Coin Display Component
function createCoinDisplay(coins) {
    return `
        <div class="coin-display-card">
            <div class="card-header">
                <div class="card-icon primary-icon">
                    <i data-lucide="trophy" class="icon-filled"></i>
                </div>
                <h3 class="card-title-lg">Volunteer Points</h3>
            </div>
            <div class="coin-value-lg">${coins.toLocaleString()}</div>
            <p class="card-subtitle">Keep volunteering to earn more</p>
        </div>
    `;
}

// Create Upcoming Event Item
function createUpcomingEventItem(event) {
    return `
        <div class="event-list-item">
            <div class="event-info">
                <h4 class="event-name">${event.title}</h4>
                <p class="event-details">
                    <i data-lucide="calendar" class="icon-sm"></i>
                    ${formatDate(event.date)} • ${event.time}
                </p>
                <p class="event-details">
                    <i data-lucide="map-pin" class="icon-sm"></i>
                    ${event.location}
                </p>
            </div>
            <div class="event-reward">
                <i data-lucide="zap" class="icon-sm"></i>
                <span>${event.coinsReward} coins</span>
            </div>
        </div>
    `;
}

// Create Navigation Component
function createNavigation(currentPage = '') {
    const user = getCurrentUser();
    const userName = user?.name || 'User';
    const userCoins = user?.volunteerPoints || 0;
    const userInitial = userName.charAt(0).toUpperCase();

    return `
        <nav class="nav-logged-in">
            <div class="nav-container">
                <a href="dashboard.html" class="nav-brand">
                    <div class="brand-icon-small">
                        <i data-lucide="heart" class="icon-filled"></i>
                    </div>
                    <span class="brand-name">Actify</span>
                </a>

                <div class="nav-links-main">
                    <a href="dashboard.html" class="nav-link ${currentPage === 'dashboard' ? 'active' : ''}">
                        <i data-lucide="heart"></i>
                        Dashboard
                    </a>
                    <a href="events.html" class="nav-link ${currentPage === 'events' ? 'active' : ''}">
                        <i data-lucide="map-pin"></i>
                        Events
                    </a>
                    <a href="rewards.html" class="nav-link ${currentPage === 'rewards' ? 'active' : ''}">
                        <i data-lucide="gift"></i>
                        Rewards
                    </a>
                    <a href="leaderboard.html" class="nav-link ${currentPage === 'leaderboard' ? 'active' : ''}">
                        <i data-lucide="trophy"></i>
                        Leaderboard
                    </a>
                </div>

                <div class="nav-user">
                    <div class="user-coins">
                        <span class="coin-value">${userCoins.toLocaleString()}</span>
                        <span class="coin-label">coins</span>
                    </div>
                    <div class="user-avatar" onclick="logout()">${userInitial}</div>
                </div>
            </div>

            <!-- Mobile Navigation -->
            <div class="nav-mobile">
                <a href="dashboard.html" class="nav-mobile-item ${currentPage === 'dashboard' ? 'active' : ''}">
                    <i data-lucide="heart"></i>
                    <span>Dashboard</span>
                </a>
                <a href="events.html" class="nav-mobile-item ${currentPage === 'events' ? 'active' : ''}">
                    <i data-lucide="map-pin"></i>
                    <span>Events</span>
                </a>
                <a href="rewards.html" class="nav-mobile-item ${currentPage === 'rewards' ? 'active' : ''}">
                    <i data-lucide="gift"></i>
                    <span>Rewards</span>
                </a>
                <a href="leaderboard.html" class="nav-mobile-item ${currentPage === 'leaderboard' ? 'active' : ''}">
                    <i data-lucide="trophy"></i>
                    <span>Leaderboard</span>
                </a>
            </div>
        </nav>
    `;
}

// Create Leaderboard Row
function createLeaderboardRow(user, currentUserId = null) {
    const isCurrentUser = user.id === currentUserId || user.isCurrentUser;

    return `
        <div class="leaderboard-row ${isCurrentUser ? 'current-user' : ''}">
            <div class="lb-col-rank">
                <span class="rank-badge ${user.rank <= 3 ? 'rank-top' : ''}">#${user.rank}</span>
            </div>
            <div class="lb-col-name">
                <div class="user-info">
                    <div class="user-avatar-sm">${user.name.charAt(0)}</div>
                    <span>${user.name}</span>
                    ${isCurrentUser ? '<span class="you-badge">You</span>' : ''}
                </div>
            </div>
            <div class="lb-col-points">
                <span class="points-value">${user.points.toLocaleString()}</span>
            </div>
            <div class="lb-col-events">${user.events}</div>
        </div>
    `;
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Show loading spinner
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="text-center" style="padding: 2rem;">Loading...</div>';
    }
}

// Show error message
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="text-center" style="padding: 2rem; color: var(--text-muted);">${message}</div>`;
    }
}

// Debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions to global scope
if (typeof window !== 'undefined') {
    window.createEventCard = createEventCard;
    window.handleEventRegistration = handleEventRegistration;
    window.createBadge = createBadge;
    window.createCoinDisplay = createCoinDisplay;
    window.createUpcomingEventItem = createUpcomingEventItem;
    window.createNavigation = createNavigation;
    window.createLeaderboardRow = createLeaderboardRow;
    window.showLoading = showLoading;
    window.showError = showError;
    window.debounce = debounce;
}
