// ========== DASHBOARD STATE ==========
let revenueChart = null;
let bookingChart = null;
let currentBookingFilter = 'all';

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardData();
        setupDashboardListeners();
        loadDocuments();
    }
});

function setupDashboardListeners() {
    // Profile form
    document.getElementById('profileForm')?.addEventListener('submit', updateProfile);
    document.getElementById('passwordForm')?.addEventListener('submit', changePassword);
    
    // Document uploads
    document.getElementById('licenseUpload')?.addEventListener('change', (e) => uploadDocument('license', e));
    document.getElementById('cnicUpload')?.addEventListener('change', (e) => uploadDocument('cnic', e));
}

function loadDashboardData() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    if (!user) return;
    
    // Update user info if elements exist
    const dashboardUserName = document.getElementById('dashboardUserName');
    if (dashboardUserName) dashboardUserName.innerText = user.name;
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) welcomeName.innerText = user.name.split(' ')[0];
    const profileName = document.getElementById('profileName');
    if (profileName) profileName.value = user.name;
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) profileEmail.value = user.email;
    const profilePhone = document.getElementById('profilePhone');
    if (profilePhone) profilePhone.value = user.phone || '';
    const profileAddress = document.getElementById('profileAddress');
    if (profileAddress) profileAddress.value = user.address || '';
    
    // Load rentals
    const rentals = JSON.parse(localStorage.getItem('rentalx_rentals') || '[]');
    const userRentals = rentals.filter(r => r.userId === user.email);
    
    // Update stats
    const totalRentals = userRentals.length;
    const activeRentals = userRentals.filter(r => r.status === 'confirmed' || r.status === 'active').length;
    const totalSpent = userRentals.reduce((sum, r) => sum + r.total, 0);
    
    const totalRentalsEl = document.getElementById('totalRentals');
    if (totalRentalsEl) totalRentalsEl.innerText = totalRentals;
    const activeRentalsEl = document.getElementById('activeRentals');
    if (activeRentalsEl) activeRentalsEl.innerText = activeRentals;
    const totalSpentEl = document.getElementById('totalSpent');
    if (totalSpentEl) totalSpentEl.innerHTML = formatPrice(totalSpent);
    const sidebarRentals = document.getElementById('sidebarRentals');
    if (sidebarRentals) sidebarRentals.innerText = totalRentals;
    
    // Load loyalty points
    const loyaltyPoints = JSON.parse(localStorage.getItem(`rentalx_loyalty_${user.email}`) || '0');
    const loyaltyPointsEl = document.getElementById('loyaltyPoints');
    if (loyaltyPointsEl) loyaltyPointsEl.innerText = loyaltyPoints;
    const loyaltyPointsDisplayEl = document.getElementById('loyaltyPointsDisplay');
    if (loyaltyPointsDisplayEl) loyaltyPointsDisplayEl.innerText = loyaltyPoints;
    
    // Update user tier
    updateUserTier(loyaltyPoints);
    
    // Load referrals
    loadReferrals();
    
    // Display bookings
    displayBookings(userRentals);
    
    // Load payments
    loadPayments();
    
    // Load activity feed
    loadActivityFeed();
    
    // Load driver info
    loadDriverInfo();
    
    // Load tickets
    loadTickets();
    
    // Initialize charts
    initCharts(userRentals);
    
    // Track active vehicle
    trackActiveVehicle(userRentals);
    
    // Load referral code
    loadReferralCode();
}

function updateUserTier(points) {
    let tier = 'Bronze';
    let nextPoints = 1000;
    let color = '#cd7f32';
    
    if (points >= 5000) {
        tier = 'Platinum';
        nextPoints = 0;
        color = '#e5e4e2';
    } else if (points >= 2000) {
        tier = 'Gold';
        nextPoints = 5000 - points;
        color = '#ffd700';
    } else if (points >= 1000) {
        tier = 'Silver';
        nextPoints = 2000 - points;
        color = '#c0c0c0';
    } else {
        nextPoints = 1000 - points;
    }
    
    const tierText = nextPoints > 0 ? `${tier} Member (${nextPoints} to next)` : `${tier} Elite Member`;
    const userTierEl = document.getElementById('userTier');
    if (userTierEl) {
        userTierEl.innerHTML = `<span style="color: ${color}">${tierText}</span>`;
    }
}

function displayBookings(rentals) {
    let filteredRentals = rentals;
    if (currentBookingFilter !== 'all') {
        filteredRentals = rentals.filter(r => r.status === currentBookingFilter);
    }
    
    const tbody = document.getElementById('rentalsList');
    if (filteredRentals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No bookings found</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredRentals.map(rental => `
        <tr>
            <td>${rental.carName}</td>
            <td>${new Date(rental.pickupDate).toLocaleDateString()}</td>
            <td>${new Date(rental.returnDate).toLocaleDateString()}</td>
            <td>${rental.days}</td>
            <td>${formatPrice(rental.total)}</td>
            <td>${window.notificationSystem ? window.notificationSystem.displayLateFeeInfo(rental) : (rental.lateFeeApplied ? `<span style="color: var(--danger); font-weight: bold;">+Rs. ${rental.lateFeeApplied}</span>` : '-')}</td>
            <td><span class="status-badge ${rental.status}">${rental.status}</span></td>
            <td>
                ${rental.status === 'confirmed' ? 
                    `<button onclick="cancelRental(${rental.id})" class="btn btn-danger btn-sm">Cancel</button>` : 
                    rental.status === 'completed' ?
                    `<button onclick="leaveReview(${rental.id})" class="btn btn-primary btn-sm">Review</button>` :
                    '-'
                }
            </td>
        </tr>
    `).join('');
}

function filterBookings(filter) {
    currentBookingFilter = filter;
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const rentals = JSON.parse(localStorage.getItem('rentalx_rentals') || '[]');
    const userRentals = rentals.filter(r => r.userId === user.email);
    displayBookings(userRentals);
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
}

function cancelRental(rentalId) {
    if (confirm('Are you sure you want to cancel this booking? Cancellation fee may apply.')) {
        let rentals = JSON.parse(localStorage.getItem('rentalx_rentals') || '[]');
        const index = rentals.findIndex(r => r.id === rentalId);
        if (index !== -1) {
            rentals[index].status = 'cancelled';
            localStorage.setItem('rentalx_rentals', JSON.stringify(rentals));
            showToast('Booking cancelled successfully', 'warning');
            loadDashboardData();
            addActivity(`Cancelled booking for ${rentals[index].carName}`, 'close-circle-line');
        }
    }
}

function leaveReview(rentalId) {
    const rating = prompt('Rate your experience (1-5 stars):', '5');
    if (rating && rating >= 1 && rating <= 5) {
        const review = prompt('Write your review:', 'Great experience with RentalX!');
        if (review) {
            let reviews = JSON.parse(localStorage.getItem('rentalx_reviews') || '[]');
            reviews.push({
                id: Date.now(),
                rentalId: rentalId,
                userId: JSON.parse(localStorage.getItem('rentalx_currentUser')).email,
                rating: parseInt(rating),
                review: review,
                date: new Date().toISOString()
            });
            localStorage.setItem('rentalx_reviews', JSON.stringify(reviews));
            showToast('Thank you for your review! +50 loyalty points', 'success');
            
            // Add loyalty points for review
            const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
            let points = JSON.parse(localStorage.getItem(`rentalx_loyalty_${user.email}`) || '0');
            points += 50;
            localStorage.setItem(`rentalx_loyalty_${user.email}`, points);
            loadDashboardData();
            addActivity(`Left a ${rating}-star review`, 'star-line');
        }
    }
}

function loadPayments() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const payments = JSON.parse(localStorage.getItem('rentalx_payments') || '[]');
    const userPayments = payments.filter(p => p.userId === user.email);
    
    const tbody = document.getElementById('paymentsList');
    if (!tbody) return;
    if (userPayments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No payment history</td></tr>';
        return;
    }
    
    tbody.innerHTML = userPayments.map(payment => `
        <tr>
            <td>${payment.transactionId}</td>
            <td>${formatPrice(payment.amount)}</td>
            <td><i class="ri-${payment.method === 'card' ? 'bank-card' : payment.method === 'jazzcash' ? 'smartphone' : payment.method === 'easypaisa' ? 'wallet-line' : 'cash'}-line"></i> ${payment.method}</td>
            <td>${new Date(payment.date).toLocaleDateString()}</td>
            <td><span class="status-badge ${payment.status}">${payment.status}</span></td>
            <td><button onclick="downloadReceipt(${payment.id})" class="btn btn-secondary btn-sm">Receipt</button></td>
        </tr>
    `).join('');
}

function loadActivityFeed() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const activities = JSON.parse(localStorage.getItem(`rentalx_activities_${user.email}`) || '[]');
    
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    if (activities.length === 0) {
        activityList.innerHTML = '<p class="text-gray">No recent activity</p>';
        return;
    }
    
    activityList.innerHTML = activities.slice(0, 15).map(activity => `
        <div class="activity-item">
            <i class="ri-${activity.icon}"></i>
            <div>
                <p>${activity.message}</p>
                <small>${new Date(activity.timestamp).toLocaleString()}</small>
            </div>
        </div>
    `).join('');
}

function initCharts(rentals) {
    const monthlyData = getMonthlyData(rentals);
    
    const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
    if (revenueCtx) {
        if (revenueChart) revenueChart.destroy();
        revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'Revenue (PKR)',
                    data: monthlyData.revenue,
                    borderColor: '#fe5b3e',
                    backgroundColor: 'rgba(254, 91, 62, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#fff' } }
                },
                scales: {
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
            }
        });
    }
    
    const bookingCtx = document.getElementById('bookingChart')?.getContext('2d');
    if (bookingCtx) {
        if (bookingChart) bookingChart.destroy();
        bookingChart = new Chart(bookingCtx, {
            type: 'bar',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'Bookings',
                    data: monthlyData.bookings,
                    backgroundColor: '#fe5b3e',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { labels: { color: '#fff' } }
                },
                scales: {
                    y: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                    x: { ticks: { color: '#fff' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
            }
        });
    }
}

function getMonthlyData(rentals) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenue = new Array(12).fill(0);
    const bookings = new Array(12).fill(0);
    
    rentals.forEach(rental => {
        const month = new Date(rental.bookingDate || rental.date).getMonth();
        revenue[month] += rental.total;
        bookings[month]++;
    });
    
    return { labels: months, revenue, bookings };
}

function trackActiveVehicle(rentals) {
    const activeRental = rentals.find(r => r.status === 'confirmed' && new Date(r.returnDate) > new Date());
    const container = document.getElementById('activeVehicleTracking');
    if (!container) return;
    
    if (!activeRental) {
        container.innerHTML = '<p class="text-gray">No active rentals</p>';
        return;
    }
    
    // Simulate live location
    const locations = ['Defence Phase 5', 'Clifton Block 8', 'Gulshan-e-Iqbal', 'DHA Phase 8', 'Malir Cantt'];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    container.innerHTML = `
        <div class="vehicle-track">
            <div class="vehicle-info">
                <strong>${activeRental.carName}</strong>
                <p>Pickup: ${new Date(activeRental.pickupDate).toLocaleDateString()}</p>
                <p>Return by: ${new Date(activeRental.returnDate).toLocaleDateString()}</p>
            </div>
            <div class="vehicle-location">
                <i class="ri-map-pin-line"></i>
                <span>📍 Current Location: ${randomLocation}</span>
                <br>
                <i class="ri-user-line"></i>
                <span>Driver: ${activeRental.withDriver ? 'Assigned - Ahmed (⭐4.8)' : 'Self-drive'}</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="trackLiveLocation()" style="margin-top: 1rem;">
                <i class="ri-navigation-line"></i> Track Live
            </button>
        </div>
    `;
}

function trackLiveLocation() {
    showToast('Live tracking started! You will receive updates every 5 minutes.', 'info');
    addActivity('Started live vehicle tracking', 'navigation-line');
}

function loadDriverInfo() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const driver = JSON.parse(localStorage.getItem(`rentalx_driver_${user.email}`));
    
    const container = document.getElementById('driverStatus');
    if (!container) return;
    if (driver && driver.status === 'assigned') {
        container.innerHTML = `
            <div class="driver-card">
                <div class="driver-info">
                    <i class="ri-user-line"></i>
                    <div>
                        <h4>${driver.name}</h4>
                        <p><i class="ri-phone-line"></i> ${driver.phone}</p>
                        <p><i class="ri-star-fill" style="color: #f59e0b;"></i> Rating: ${driver.rating}★ (${driver.reviews || 124} reviews)</p>
                        <p><i class="ri-car-line"></i> Vehicle: ${driver.car}</p>
                    </div>
                </div>
                <button class="btn btn-danger" onclick="cancelDriver()">Cancel Driver</button>
                <button class="btn btn-secondary" onclick="contactDriver('${driver.phone}')">Contact Driver</button>
            </div>
        `;
    } else {
        container.innerHTML = `
            <p>No driver assigned to your current rental</p>
            <button class="btn btn-primary" onclick="requestDriver()">Request Driver</button>
        `;
    }
}

function requestDriver() {
    const drivers = [
        { id: 1, name: 'Ahmed Khan', phone: '+92 300 1234567', rating: 4.8, car: 'Toyota Corolla', reviews: 234 },
        { id: 2, name: 'Bilal Ahmed', phone: '+92 301 2345678', rating: 4.9, car: 'Honda Civic', reviews: 189 },
        { id: 3, name: 'Danish Ali', phone: '+92 302 3456789', rating: 4.7, car: 'Suzuki Swift', reviews: 156 }
    ];
    
    // Simulate driver assignment
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    
    localStorage.setItem(`rentalx_driver_${user.email}`, JSON.stringify({
        ...driver,
        status: 'assigned',
        assignedAt: new Date().toISOString()
    }));
    
    showToast(`Driver ${driver.name} assigned to you! They will contact you shortly.`, 'success');
    loadDriverInfo();
    addActivity(`Driver ${driver.name} assigned for your trip`, 'taxi-line');
}

function cancelDriver() {
    if (confirm('Are you sure you want to cancel the driver?')) {
        const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
        localStorage.removeItem(`rentalx_driver_${user.email}`);
        showToast('Driver cancelled successfully', 'success');
        loadDriverInfo();
        addActivity('Driver cancelled', 'close-circle-line');
    }
}

function contactDriver(phone) {
    showToast(`Calling driver at ${phone}...`, 'info');
    // In production: window.location.href = `tel:${phone}`;
}

function loadTickets() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const tickets = JSON.parse(localStorage.getItem(`rentalx_tickets_${user.email}`) || '[]');
    
    const container = document.getElementById('ticketsList');
    if (!container) return;
    if (tickets.length === 0) {
        container.innerHTML = '<p class="text-gray">No support tickets</p>';
        return;
    }
    
    container.innerHTML = tickets.map(ticket => `
        <div class="ticket-card ${ticket.priority}">
            <div class="ticket-header">
                <h4>${ticket.subject}</h4>
                <span class="priority-badge ${ticket.priority}">${ticket.priority}</span>
            </div>
            <p>${ticket.description}</p>
            <div class="ticket-footer">
                <span>Status: <span class="status-badge ${ticket.status}">${ticket.status}</span></span>
                <small>${new Date(ticket.date).toLocaleString()}</small>
            </div>
            ${ticket.response ? `<div class="ticket-response"><strong>Support:</strong> ${ticket.response}</div>` : ''}
        </div>
    `).join('');
}

function openTicketModal() {
    document.getElementById('ticketModal').classList.add('active');
}

function closeTicketModal() {
    document.getElementById('ticketModal').classList.remove('active');
}

document.getElementById('ticketForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const tickets = JSON.parse(localStorage.getItem(`rentalx_tickets_${user.email}`) || '[]');
    
    const newTicket = {
        id: Date.now(),
        subject: document.getElementById('ticketSubject').value,
        priority: document.getElementById('ticketPriority').value,
        description: document.getElementById('ticketDescription').value,
        status: 'open',
        date: new Date().toISOString(),
        response: null
    };
    
    tickets.unshift(newTicket);
    localStorage.setItem(`rentalx_tickets_${user.email}`, JSON.stringify(tickets));
    
    closeTicketModal();
    document.getElementById('ticketForm').reset();
    loadTickets();
    showToast('Ticket submitted successfully! Our team will respond within 24 hours.', 'success');
    addActivity(`Support ticket raised: ${newTicket.subject}`, 'customer-service-line');
});

function loadReferrals() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const referrals = JSON.parse(localStorage.getItem(`rentalx_referrals_${user.email}`) || '[]');
    
    const totalReferralsEl = document.getElementById('totalReferrals');
    if (totalReferralsEl) totalReferralsEl.innerText = referrals.length;
    const pointsEarned = referrals.length * 500;
    const referralPointsEl = document.getElementById('referralPoints');
    if (referralPointsEl) referralPointsEl.innerText = pointsEarned;
}

function loadReferralCode() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    let code = localStorage.getItem(`rentalx_referral_code_${user.email}`);
    
    if (!code) {
        code = user.name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 10000);
        localStorage.setItem(`rentalx_referral_code_${user.email}`, code);
    }
    
    const referralCodeEl = document.getElementById('referralCode');
    if (referralCodeEl) referralCodeEl.innerText = code;
}

function copyReferralCode() {
    const code = document.getElementById('referralCode').innerText;
    navigator.clipboard.writeText(code);
    showToast('Referral code copied! Share with friends to earn 500 points each.', 'success');
}

function uploadDocument(type, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const docs = JSON.parse(localStorage.getItem(`rentalx_docs_${user.email}`) || '{}');
        docs[type] = {
            data: e.target.result,
            name: file.name,
            uploadDate: new Date().toISOString(),
            verified: false
        };
        localStorage.setItem(`rentalx_docs_${user.email}`, JSON.stringify(docs));
        
        const statusSpan = document.getElementById(`${type}Status`);
        statusSpan.innerHTML = '<i class="ri-time-line"></i> Pending Verification';
        statusSpan.className = 'status-badge pending';
        
        showToast(`${type === 'license' ? 'License' : 'CNIC'} uploaded successfully! Verification in progress.`, 'success');
        addActivity(`${type === 'license' ? 'Driving license' : 'CNIC'} uploaded for verification`, 'file-copy-line');
    };
    
    reader.readAsDataURL(file);
}

function loadDocuments() {
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const docs = JSON.parse(localStorage.getItem(`rentalx_docs_${user.email}`) || '{}');
    
    if (docs.license) {
        const statusSpan = document.getElementById('licenseStatus');
        if (docs.license.verified) {
            statusSpan.innerHTML = '<i class="ri-checkbox-circle-line"></i> Verified';
            statusSpan.className = 'status-badge verified';
        } else {
            statusSpan.innerHTML = '<i class="ri-time-line"></i> Pending';
            statusSpan.className = 'status-badge pending';
        }
    }
    
    if (docs.cnic) {
        const statusSpan = document.getElementById('cnicStatus');
        if (docs.cnic.verified) {
            statusSpan.innerHTML = '<i class="ri-checkbox-circle-line"></i> Verified';
            statusSpan.className = 'status-badge verified';
        } else {
            statusSpan.innerHTML = '<i class="ri-time-line"></i> Pending';
            statusSpan.className = 'status-badge pending';
        }
    }
}

function updateProfile(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const users = JSON.parse(localStorage.getItem('rentalx_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            name: document.getElementById('profileName').value,
            phone: document.getElementById('profilePhone').value,
            address: document.getElementById('profileAddress').value
        };
        
        localStorage.setItem('rentalx_users', JSON.stringify(users));
        localStorage.setItem('rentalx_currentUser', JSON.stringify(users[userIndex]));
        
        showToast('Profile updated successfully!', 'success');
        addActivity('Profile information updated', 'user-settings-line');
        loadDashboardData();
    }
}

function changePassword(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('rentalx_currentUser'));
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (user.password !== currentPassword) {
        showToast('Current password is incorrect', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('rentalx_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('rentalx_users', JSON.stringify(users));
        
        const currentUser = { ...user, password: newPassword };
        localStorage.setItem('rentalx_currentUser', JSON.stringify(currentUser));
        
        showToast('Password changed successfully!', 'success');
        addActivity('Password changed', 'lock-line');
        
        document.getElementById('passwordForm').reset();
    }
}

function downloadReceipt(paymentId) {
    const payments = JSON.parse(localStorage.getItem('rentalx_payments') || '[]');
    const payment = payments.find(p => p.id === paymentId);
    
    if (payment) {
        const receiptHTML = `
            <div class="invoice">
                <div class="invoice-header">
                    <h2>RentalX</h2>
                    <p>Payment Receipt</p>
                </div>
                <div class="invoice-details">
                    <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
                    <p><strong>Amount:</strong> ${formatPrice(payment.amount)}</p>
                    <p><strong>Method:</strong> ${payment.method}</p>
                    <p><strong>Date:</strong> ${new Date(payment.date).toLocaleString()}</p>
                    <p><strong>Status:</strong> ${payment.status}</p>
                </div>
                <div class="invoice-total">
                    <p>Thank you for choosing RentalX!</p>
                </div>
            </div>
        `;
        
        const win = window.open('', '_blank');
        win.document.write(`
            <html>
                <head>
                    <title>Payment Receipt</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 2rem; }
                        .invoice { max-width: 600px; margin: 0 auto; }
                        .invoice-header { text-align: center; border-bottom: 2px solid #333; }
                        .invoice-details { margin: 1rem 0; }
                        .invoice-total { border-top: 2px solid #333; margin-top: 1rem; padding-top: 1rem; text-align: center; }
                    </style>
                </head>
                <body>${receiptHTML}</body>
            </html>
        `);
        win.print();
    }
}

function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${section}Section`).classList.add('active');
    
    // Update active menu button
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}