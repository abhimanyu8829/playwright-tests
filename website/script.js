// Initialize users data
let users = [];
let analytics = {
    totalUsers: 0,
    activeSessions: 0,
    pageviews: 0,
    conversionRate: 0
};

// Load initial data
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    updateAnalytics();
    setupEventListeners();
});

function setupEventListeners() {
    // Start button
    document.getElementById('startBtn').addEventListener('click', function() {
        alert('Welcome! You can explore the dashboard features.');
    });

    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', searchUsers);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchUsers();
        }
    });

    // Refresh analytics
    document.getElementById('refreshBtn').addEventListener('click', function() {
        updateAnalytics();
        alert('Analytics refreshed!');
    });

    // Settings form
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });
}

function loadUsers() {
    // Generate mock users
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'Tom', 'Emily', 'David', 'Lisa', 'James', 'Anna'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    
    users = [];
    for (let i = 1; i <= 12; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        users.push({
            id: i,
            name: firstName + ' ' + lastName,
            email: `user${i}@example.com`,
            status: Math.random() > 0.3 ? 'Active' : 'Inactive',
            joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString()
        });
    }
    
    displayUsers(users);
}

function displayUsers(userList) {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    userList.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <h4>${user.name}</h4>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Status:</strong> <span style="color: ${user.status === 'Active' ? 'green' : 'red'}">${user.status}</span></p>
            <p><strong>Joined:</strong> ${user.joinDate}</p>
        `;
        usersList.appendChild(userCard);
    });
}

function searchUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm === '') {
        displayUsers(users);
        return;
    }
    
    const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) || 
        user.email.toLowerCase().includes(searchTerm)
    );
    displayUsers(filtered);
}

function updateAnalytics() {
    analytics.totalUsers = Math.floor(Math.random() * 5000) + 1000;
    analytics.activeSessions = Math.floor(Math.random() * 500) + 50;
    analytics.pageviews = Math.floor(Math.random() * 50000) + 10000;
    analytics.conversionRate = (Math.random() * 10 + 2).toFixed(2);
    
    document.getElementById('totalUsers').textContent = analytics.totalUsers.toLocaleString();
    document.getElementById('activeSessions').textContent = analytics.activeSessions;
    document.getElementById('pageviews').textContent = analytics.pageviews.toLocaleString();
    document.getElementById('conversionRate').textContent = analytics.conversionRate + '%';
}

function saveSettings() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const notifications = document.getElementById('notifications').checked;
    
    if (username && email && password) {
        const settings = {
            username: username,
            email: email,
            notifications: notifications,
            savedAt: new Date().toISOString()
        };
        
        // Store in localStorage
        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        // Show success message
        const successMsg = document.getElementById('successMsg');
        successMsg.style.display = 'block';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
    }
}